// Central API Client for SignEase Platform Backend
const API_HOST = (typeof window !== 'undefined' && window.location.hostname) ? window.location.hostname : 'localhost';
const DEFAULT_LOCAL_URL = `http://${API_HOST}:8080/api/v1`;
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : DEFAULT_LOCAL_URL;

export const api = {
    getToken() {
        return localStorage.getItem('esign_token');
    },

    setToken(token) {
        localStorage.setItem('esign_token', token);
    },

    clearToken() {
        localStorage.removeItem('esign_token');
        localStorage.removeItem('esign_user');
    },

    getUser() {
        const u = localStorage.getItem('esign_user');
        return u ? JSON.parse(u) : null;
    },

    setUser(user) {
        localStorage.setItem('esign_user', JSON.stringify(user));
    },

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const headers = options.headers || {};

        const token = this.getToken();
        if (token && !endpoint.startsWith('/auth/')) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        if (!(options.body instanceof FormData) && !headers['Content-Type']) {
            headers['Content-Type'] = 'application/json';
        }

        const config = {
            ...options,
            headers
        };

        const response = await fetch(url, config);

        if (response.status === 401 && !endpoint.startsWith('/auth/')) {
            this.clearToken();
            window.location.hash = '#/login';
            throw new Error('Session expired. Please log in again.');
        }

        if (response.headers.get('content-type')?.includes('application/pdf')) {
            return response.blob();
        }

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            const errorMsg = data.message || data.error || `Request failed with status ${response.status}`;
            throw new Error(errorMsg);
        }

        return data;
    },

    // Auth Endpoints
    login(email, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    sendRegistrationOtp(email) {
        return this.request('/auth/send-registration-otp', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    verifyRegistrationOtp(email, otpCode) {
        return this.request('/auth/verify-registration-otp', {
            method: 'POST',
            body: JSON.stringify({ email, otpCode })
        });
    },

    getMe() {
        return this.request('/auth/me');
    },

    // Dashboard
    getDashboardStats() {
        return this.request('/dashboard/stats');
    },

    // Documents
    getDocuments(status = 'ALL') {
        const query = status && status !== 'ALL' ? `?status=${status}` : '';
        return this.request(`/documents${query}`);
    },

    getDocument(id) {
        return this.request(`/documents/${id}`);
    },

    uploadDocument(formData) {
        return this.request('/documents', {
            method: 'POST',
            body: formData
        });
    },

    cancelDocument(id) {
        return this.request(`/documents/${id}/cancel`, {
            method: 'POST'
        });
    },

    downloadDocumentUrl(id, sealed = true) {
        const token = this.getToken();
        const tokenParam = token ? `&token=${encodeURIComponent(token)}` : '';
        return `${API_BASE_URL}/documents/${id}/download?sealed=${sealed}${tokenParam}`;
    },

    async downloadDocument(id, sealed = true, fallbackFilename = 'document.pdf') {
        const token = this.getToken();
        const url = `${API_BASE_URL}/documents/${id}/download?sealed=${sealed}`;
        const headers = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(url, { headers });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || err.error || `Download failed: HTTP ${res.status}`);
        }

        let filename = fallbackFilename;
        const disposition = res.headers.get('Content-Disposition');
        if (disposition) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '').trim();
            }
        }

        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    },

    // Signing
    createSigningRequest(data) {
        return this.request('/signing/requests', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    resendSigningInvite(inviteId) {
        return this.request(`/signing/invites/${inviteId}/resend`, {
            method: 'POST'
        });
    },

    getSigningContext(token) {
        return this.request(`/signing/context/${token}`);
    },

    requestOtp(token) {
        return this.request(`/signing/otp/${token}`, {
            method: 'POST'
        });
    },

    verifyOtp(token, otpCode) {
        return this.request(`/signing/verify-otp/${token}`, {
            method: 'POST',
            body: JSON.stringify({ otpCode })
        });
    },

    requestAadhaarOtp(token, aadhaarNumber) {
        return this.request(`/signing/aadhaar-otp/${token}`, {
            method: 'POST',
            body: JSON.stringify({ aadhaarNumber })
        });
    },

    verifyAadhaarOtp(token, aadhaarNumber, otpCode) {
        return this.request(`/signing/verify-aadhaar-otp/${token}`, {
            method: 'POST',
            body: JSON.stringify({ aadhaarNumber, otpCode })
        });
    },

    submitSignature(token, data) {
        return this.request(`/signing/submit/${token}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    declineSignature(token, reason) {
        return this.request(`/signing/decline/${token}`, {
            method: 'POST',
            body: JSON.stringify({ reason })
        });
    },

    getSigningPreviewUrl(token) {
        return `${API_BASE_URL}/signing/preview/${token}`;
    },

    // Verification
    verifyHash(hash) {
        return this.request(`/verify/${encodeURIComponent(hash)}`);
    },

    verifyFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        return this.request('/verify/upload', {
            method: 'POST',
            body: formData
        });
    },

    // Admin
    getAdminUsers() {
        return this.request('/admin/users');
    },

    toggleUserStatus(id) {
        return this.request(`/admin/users/${id}/toggle-status`, {
            method: 'POST'
        });
    },

    getAdminAuditLogs(page = 0, size = 30) {
        return this.request(`/admin/audit-logs?page=${page}&size=${size}`);
    },

    getAdminDocuments(page = 0, size = 20) {
        return this.request(`/admin/documents?page=${page}&size=${size}`);
    }
};

