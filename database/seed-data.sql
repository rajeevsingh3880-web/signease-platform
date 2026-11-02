-- ====================================================================
-- E-SIGN PLATFORM — SEED DATA
-- Default Organizations and Pre-Configured Test Accounts
-- ====================================================================

-- 1. Default Organization
INSERT INTO organizations (id, name, plan)
VALUES ('00000000-0000-0000-0000-000000000001', 'SignEase Digital Solutions', 'ENTERPRISE')
ON CONFLICT (id) DO NOTHING;

-- 2. Default Administrator (password: admin123)
-- BCrypt: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
INSERT INTO users (id, org_id, email, password, first_name, last_name, role, phone, enabled)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'admin@esign.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'System',
    'Administrator',
    'ADMIN',
    '+91 98765 43210',
    true
)
ON CONFLICT (email) DO NOTHING;

-- 3. Default Demo Business Sender (password: password123)
-- BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (id, org_id, email, password, first_name, last_name, role, phone, enabled)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'demo@esign.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Rajesh',
    'Sharma',
    'SIGNER',
    '+91 98234 56789',
    true
)
ON CONFLICT (email) DO NOTHING;

