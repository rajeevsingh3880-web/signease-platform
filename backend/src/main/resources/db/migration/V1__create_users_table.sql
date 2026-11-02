CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'ENTERPRISE_TRIAL',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'SIGNER',
    phone VARCHAR(30),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_org ON users(org_id);

-- Insert default organization
INSERT INTO organizations (id, name, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'Default Enterprise', 'PRO')
ON CONFLICT (id) DO NOTHING;

-- Insert default admin (password: admin123, BCrypt hashed)
INSERT INTO users (id, org_id, email, password, first_name, last_name, role, enabled)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'admin@esign.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Admin',
    'User',
    'ADMIN',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Insert demo sender (password: password123)
INSERT INTO users (id, org_id, email, password, first_name, last_name, role, enabled)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'demo@esign.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Rajesh',
    'Sharma',
    'SIGNER',
    true
)
ON CONFLICT (email) DO NOTHING;
