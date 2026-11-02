-- ====================================================================
-- E-SIGN PLATFORM — POSTGRESQL DATABASE SCHEMA
-- Compliant with Indian IT Act 2000 (Section 10A) & Evidence Act 1872
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'SIGNER', -- ADMIN, SIGNER, VIEWER
    phone VARCHAR(30),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);

-- 3. DOCUMENTS
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    sealed_file_path VARCHAR(500),
    file_size BIGINT,
    page_count INT DEFAULT 1,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT', -- DRAFT, SENT, IN_PROGRESS, COMPLETED, CANCELLED, DECLINED, EXPIRED
    original_hash VARCHAR(64), -- SHA-256 pre-execution hash
    final_hash VARCHAR(64),    -- SHA-256 sealed document hash
    sequential_signing BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expiry_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_final_hash ON documents(final_hash);
CREATE INDEX IF NOT EXISTS idx_documents_original_hash ON documents(original_hash);

-- 4. SIGNING REQUESTS
CREATE TABLE IF NOT EXISTS signing_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, EXPIRED, CANCELLED
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_signing_requests_document ON signing_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_signing_requests_requested_by ON signing_requests(requested_by);

-- 5. SIGNER INVITES
CREATE TABLE IF NOT EXISTS signer_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signing_request_id UUID NOT NULL REFERENCES signing_requests(id) ON DELETE CASCADE,
    signer_email VARCHAR(255) NOT NULL,
    signer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    sign_order INT DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING', -- PENDING, INVITED, OPENED, VERIFIED, SIGNED, DECLINED, EXPIRED
    signing_token UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
    token_expiry TIMESTAMP NOT NULL,
    otp_code VARCHAR(10),
    otp_expiry TIMESTAMP,
    otp_verified BOOLEAN NOT NULL DEFAULT FALSE,
    otp_attempts INT NOT NULL DEFAULT 0,
    signature_method VARCHAR(50) DEFAULT 'CONTRACT_LAW_ESIGN',
    decline_reason TEXT,
    opened_at TIMESTAMP,
    verified_at TIMESTAMP,
    signed_at TIMESTAMP,
    declined_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_signer_invites_request ON signer_invites(signing_request_id);
CREATE INDEX IF NOT EXISTS idx_signer_invites_token ON signer_invites(signing_token);
CREATE INDEX IF NOT EXISTS idx_signer_invites_email ON signer_invites(signer_email);

-- 6. DOCUMENT FIELDS
CREATE TABLE IF NOT EXISTS document_fields (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    signer_invite_id UUID REFERENCES signer_invites(id) ON DELETE SET NULL,
    page_number INT NOT NULL DEFAULT 1,
    field_type VARCHAR(30) NOT NULL, -- SIGNATURE, DATE, TEXT, CHECKBOX
    field_label VARCHAR(100),
    pos_x FLOAT NOT NULL DEFAULT 100,
    pos_y FLOAT NOT NULL DEFAULT 100,
    width FLOAT NOT NULL DEFAULT 150,
    height FLOAT NOT NULL DEFAULT 45,
    field_value TEXT,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_document_fields_doc ON document_fields(document_id);

-- 7. SIGNATURES
CREATE TABLE IF NOT EXISTS signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signer_invite_id UUID NOT NULL REFERENCES signer_invites(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    signature_data TEXT NOT NULL, -- Base64 data image or typed text
    signature_type VARCHAR(30) NOT NULL DEFAULT 'DRAWN', -- DRAWN, TYPED, UPLOADED, AADHAAR_ESIGN
    legal_basis VARCHAR(100) NOT NULL DEFAULT 'Information Technology Act 2000, Section 10A (Contract Law Electronic Signature)',
    ip_address VARCHAR(60),
    user_agent TEXT,
    signed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_signatures_signer ON signatures(signer_invite_id);
CREATE INDEX IF NOT EXISTS idx_signatures_doc ON signatures(document_id);

-- 8. IMMUTABLE CHAINED AUDIT LOG (FR-09)
-- Each record chains prev_hash to current_hash, ensuring any post-execution tampering is detectable
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    signer_id UUID REFERENCES signer_invites(id) ON DELETE SET NULL,
    performed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- document.created, document.configured, document.sent, signer.opened, signer.verified, signer.signed, document.completed, document.cancelled
    entity_type VARCHAR(100),
    entity_id VARCHAR(255),
    details TEXT,
    ip_address VARCHAR(60),
    user_agent TEXT,
    prev_hash VARCHAR(64),
    current_hash VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_document ON audit_logs(document_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);

-- 9. WEBHOOKS (FR-15)
CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    secret_key VARCHAR(100) NOT NULL,
    events VARCHAR(255) NOT NULL DEFAULT 'ALL',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

