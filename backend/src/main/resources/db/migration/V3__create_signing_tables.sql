CREATE TABLE IF NOT EXISTS signing_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    due_date TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signer_invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signing_request_id UUID NOT NULL REFERENCES signing_requests(id) ON DELETE CASCADE,
    signer_email VARCHAR(255) NOT NULL,
    signer_name VARCHAR(200) NOT NULL,
    phone VARCHAR(30),
    sign_order INT DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
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
    height FLOAT NOT NULL DEFAULT 50,
    field_value TEXT,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signer_invite_id UUID NOT NULL REFERENCES signer_invites(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    signature_data TEXT NOT NULL,
    signature_type VARCHAR(30) NOT NULL DEFAULT 'DRAWN',
    legal_basis VARCHAR(100) NOT NULL DEFAULT 'Information Technology Act 2000, Section 10A',
    ip_address VARCHAR(60),
    user_agent TEXT,
    signed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    target_url VARCHAR(500) NOT NULL,
    secret_key VARCHAR(100) NOT NULL,
    events VARCHAR(255) NOT NULL DEFAULT 'ALL',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_signing_requests_document ON signing_requests(document_id);
CREATE INDEX IF NOT EXISTS idx_signing_requests_requested_by ON signing_requests(requested_by);
CREATE INDEX IF NOT EXISTS idx_signer_invites_signing_request ON signer_invites(signing_request_id);
CREATE INDEX IF NOT EXISTS idx_signer_invites_token ON signer_invites(signing_token);
CREATE INDEX IF NOT EXISTS idx_document_fields_doc ON document_fields(document_id);
CREATE INDEX IF NOT EXISTS idx_signatures_signer_invite ON signatures(signer_invite_id);
