CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    sealed_file_path VARCHAR(500),
    file_size BIGINT,
    page_count INT DEFAULT 1,
    mime_type VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    original_hash VARCHAR(64),
    final_hash VARCHAR(64),
    sequential_signing BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_by UUID NOT NULL REFERENCES users(id),
    expiry_date TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_final_hash ON documents(final_hash);
CREATE INDEX IF NOT EXISTS idx_documents_org ON documents(org_id);
