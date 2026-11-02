import { api } from './api.js';

// Application State
const state = {
    user: api.getUser(),
    route: window.location.hash || '#/'
};

// Router
window.addEventListener('hashchange', () => {
    state.route = window.location.hash || '#/';
    render();
});

// Toast / Notification helper
function showToast(message, type = 'success') {
    const existing = document.getElementById('toast-alert');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'toast-alert';
    toast.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`;
    toast.style.zIndex = '9999';
    toast.style.minWidth = '320px';
    toast.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fa-solid fa-${type === 'success' ? 'circle-check' : (type === 'info' ? 'circle-info' : 'triangle-exclamation')} me-2 fs-5"></i>
            <div>${message}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// Global Download Action Helper
window.downloadDoc = async function(id, sealed = true, fallbackFilename = 'document.pdf') {
    try {
        showToast('Preparing download...', 'info');
        await api.downloadDocument(id, sealed, fallbackFilename);
        showToast('Document downloaded successfully!', 'success');
    } catch (err) {
        showToast('Download failed: ' + err.message, 'danger');
    }
};

// Global Copy Signer Link Helper
window.copySignerLink = function(token, event) {
    if (event) event.preventDefault();
    const link = `${window.location.origin}/#/sign/${token}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(() => {
            showToast('Direct signing link copied to clipboard!');
        }).catch(() => {
            prompt('Copy direct signing link:', link);
        });
    } else {
        prompt('Copy direct signing link:', link);
    }
};

// Global Resend Email Invite Helper
window.resendInvite = async function(inviteId, event) {
    if (event) {
        event.preventDefault();
        const btn = event.currentTarget;
        const oldHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';
        try {
            const res = await api.resendSigningInvite(inviteId);
            showToast(res.message || 'Signing invite has been resent successfully to Gmail!');
            btn.innerHTML = '<i class="fa-solid fa-check text-success me-1"></i> Dispatched!';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = oldHtml;
            }, 4000);
        } catch (err) {
            btn.disabled = false;
            btn.innerHTML = oldHtml;
            showToast(err.message, 'danger');
        }
    }
};

// Master Render Function
async function render() {
    const app = document.getElementById('app');
    const path = state.route.replace(/^#\/?/, '').split('?')[0];
    const params = new URLSearchParams(state.route.split('?')[1] || '');

    // Check if on public signing page
    if (path.startsWith('sign/')) {
        const token = path.replace('sign/', '');
        renderSignerPage(app, token);
        return;
    }

    // Header Navbar
    let html = `
        <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top py-2 shadow-sm">
            <div class="container-fluid px-lg-4">
                <a class="navbar-brand d-flex align-items-center" href="#/">
                    <i class="fa-solid fa-file-signature text-primary fs-4 me-2"></i>
                    <span class="fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                    <span class="badge bg-primary-subtle text-primary ms-2 rounded-pill small" style="font-size: 0.65rem;">INDIA eSIGN</span>
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navContent">
                    ${state.user ? `
                        <ul class="navbar-nav me-auto ms-3">
                            <li class="nav-item"><a class="nav-link ${path === 'dashboard' ? 'active text-primary fw-semibold' : ''}" href="#/dashboard"><i class="fa-solid fa-chart-pie me-1"></i> Dashboard</a></li>
                            <li class="nav-item"><a class="nav-link ${path === 'documents' ? 'active text-primary fw-semibold' : ''}" href="#/documents"><i class="fa-regular fa-folder me-1"></i> Documents</a></li>
                            <li class="nav-item"><a class="nav-link ${path === 'upload' ? 'active text-primary fw-semibold' : ''}" href="#/upload"><i class="fa-solid fa-cloud-arrow-up me-1"></i> Upload</a></li>
                            <li class="nav-item"><a class="nav-link ${path === 'send' ? 'active text-primary fw-semibold' : ''}" href="#/send"><i class="fa-solid fa-paper-plane me-1"></i> Send</a></li>
                            <li class="nav-item"><a class="nav-link text-success fw-medium ${path === 'verify' ? 'active' : ''}" href="#/verify"><i class="fa-solid fa-shield-halved me-1"></i> Verify PDF</a></li>
                            ${state.user.role === 'ADMIN' ? `<li class="nav-item"><a class="nav-link text-danger fw-medium ${path === 'admin' ? 'active' : ''}" href="#/admin"><i class="fa-solid fa-shield me-1"></i> Admin</a></li>` : ''}
                        </ul>
                        <div class="d-flex align-items-center gap-3 ms-auto">
                            <div class="text-end d-none d-sm-block">
                                <div class="fw-bold small">${state.user.fullName}</div>
                                <div class="text-muted" style="font-size: 0.72rem;">${state.user.organization || 'Enterprise'} (${state.user.role})</div>
                            </div>
                            <button id="logoutBtn" class="btn btn-sm btn-outline-danger" title="Sign Out"><i class="fa-solid fa-arrow-right-from-bracket"></i></button>
                        </div>
                    ` : `
                        <ul class="navbar-nav ms-auto align-items-center gap-2">
                            <li class="nav-item"><a class="nav-link text-success fw-medium" href="#/verify"><i class="fa-solid fa-shield-halved me-1"></i> Verify Document</a></li>
                            <li class="nav-item"><a class="btn btn-outline-primary btn-sm px-3" href="#/login">Sign In</a></li>
                            <li class="nav-item"><a class="btn btn-primary btn-sm px-3" href="#/register">Get Started</a></li>
                        </ul>
                    `}
                </div>
            </div>
        </nav>
        <main class="flex-grow-1" id="page-content"></main>
        <footer class="py-3 mt-auto bg-white border-top">
            <div class="container-fluid px-lg-4 d-flex flex-wrap justify-content-between align-items-center text-muted small">
                <div><strong>SignEase</strong> &copy; 2026. Electronic Execution under <strong>Section 10A, IT Act 2000</strong> &amp; Indian Contract Act, 1872.</div>
                <div class="d-flex align-items-center gap-3">
                    <span><i class="fa-solid fa-lock text-success me-1"></i> SHA-256 Tamper Evident</span>
                    <span><i class="fa-solid fa-server text-primary me-1"></i> Hosted in India</span>
                    <a href="#/verify" class="text-decoration-none text-primary fw-medium"><i class="fa-solid fa-magnifying-glass me-1"></i> Public Ledger Verification</a>
                </div>
            </div>
        </footer>
    `;

    app.innerHTML = html;

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            api.clearToken();
            state.user = null;
            showToast('Signed out successfully.');
            window.location.hash = '#/login';
        });
    }

    const content = document.getElementById('page-content');

    // Route Dispatcher
    if (!state.user && !['', '/', 'login', 'register', 'verify'].includes(path)) {
        showToast('Please sign in first to access this page.', 'warning');
        window.location.hash = '#/login';
        return;
    }

    if (path === '' || path === '/') {
        if (state.user) {
            window.location.hash = '#/dashboard';
        } else {
            renderLanding(content);
        }
    } else if (path === 'login') {
        renderLogin(content);
    } else if (path === 'register') {
        renderRegister(content);
    } else if (path === 'dashboard') {
        renderDashboard(content);
    } else if (path === 'documents') {
        renderDocuments(content, params.get('status') || 'ALL');
    } else if (path.startsWith('documents/')) {
        const id = path.replace('documents/', '');
        renderDocumentDetails(content, id);
    } else if (path === 'upload') {
        renderUpload(content);
    } else if (path === 'send') {
        renderSend(content, params.get('documentId'));
    } else if (path === 'verify') {
        renderVerify(content, params.get('hash'));
    } else if (path === 'admin') {
        renderAdmin(content);
    } else {
        content.innerHTML = `<div class="container py-5 text-center"><h4>Page not found</h4><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>`;
    }
}

// 1. Landing Page
function renderLanding(container) {
    container.innerHTML = `
        <section class="hero-section text-center">
            <div class="container px-4">
                <div class="badge bg-white text-primary fw-semibold px-3 py-2 rounded-pill mb-3 shadow-sm">
                    <i class="fa-solid fa-certificate text-warning me-1"></i> Section 10A IT Act 2000 Compliant Execution
                </div>
                <h1 class="display-4 fw-extrabold mb-3" style="font-weight: 800;">
                    Turn Signing Turnaround From <br><span class="text-warning">Days Into Minutes</span>
                </h1>
                <p class="lead mb-4 mx-auto text-light opacity-90" style="max-width: 680px; font-size: 1.15rem;">
                    Replace paper contracts with legally valid, trackable digital execution for Indian SMEs and lenders. 100% tamper-evident with SHA-256 cryptographic audit ledger.
                </p>
                <div class="d-flex justify-content-center gap-3 mb-5">
                    <a href="#/register" class="btn btn-warning text-dark fw-bold btn-lg px-4 shadow">
                        <i class="fa-solid fa-rocket me-2"></i> Start Free Trial
                    </a>
                    <a href="#/login" class="btn btn-outline-light btn-lg px-4">
                        <i class="fa-solid fa-right-to-bracket me-2"></i> Sender Dashboard
                    </a>
                </div>

                <div class="row g-3 justify-content-center pt-3 text-start" style="max-width: 850px; margin: 0 auto;">
                    <div class="col-md-4">
                        <div class="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-20">
                            <div class="fs-4 fw-bold text-warning">&lt; 30 Minutes</div>
                            <div class="small text-light opacity-80">Median send-to-sign turnaround time</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-20">
                            <div class="fs-4 fw-bold text-success">100% Defensible</div>
                            <div class="small text-light opacity-80">Chained hash audit trail under Evidence Act</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 bg-white bg-opacity-10 rounded-3 border border-white border-opacity-20">
                            <div class="fs-4 fw-bold text-info">Zero App Needed</div>
                            <div class="small text-light opacity-80">Signers open link &amp; OTP sign on any phone</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5">
            <div class="container px-4">
                <div class="text-center mb-5">
                    <h6 class="text-primary fw-bold text-uppercase">Enterprise-Grade Features</h6>
                    <h2 class="fw-bold">Everything Needed for Compliant Digital Execution</h2>
                </div>
                <div class="row g-4">
                    <div class="col-md-4">
                        <div class="card h-100 p-4 border-0 shadow-sm">
                            <i class="fa-solid fa-file-arrow-up text-primary fs-1 mb-3"></i>
                            <h5 class="fw-bold">1. Upload &amp; Route</h5>
                            <p class="text-muted small">Upload PDF contracts (up to 25 MB). Set sequential or parallel signing order.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card h-100 p-4 border-0 shadow-sm">
                            <i class="fa-solid fa-mobile-screen-button text-warning fs-1 mb-3"></i>
                            <h5 class="fw-bold">2. Mobile OTP &amp; Signature</h5>
                            <p class="text-muted small">Signers verify with 6-digit OTP and sign by drawing, typing, or uploading image.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card h-100 p-4 border-0 shadow-sm">
                            <i class="fa-solid fa-shield-halved text-success fs-1 mb-3"></i>
                            <h5 class="fw-bold">3. Sealed PDF &amp; Audit Trail</h5>
                            <p class="text-muted small">Appends Completion Certificate with SHA-256 fingerprint, IP addresses, and timestamps.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `;
}

// 2. Login Page
function renderLogin(container) {
    container.innerHTML = `
        <div class="d-flex align-items-center justify-content-center py-5">
            <div class="card border-0 shadow-sm p-4 p-md-5 bg-white" style="max-width: 440px; width: 100%; border-radius: 16px;">
                <div class="text-center mb-4">
                    <a href="#/" class="text-decoration-none d-inline-flex align-items-center mb-2">
                        <i class="fa-solid fa-file-signature text-primary fs-2 me-2"></i>
                        <span class="fs-3 fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                    </a>
                    <h5 class="fw-bold mb-1">Sign In</h5>
                    <p class="text-muted small">Access your electronic signature workspace</p>
                </div>

                <form id="loginForm">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Email Address</label>
                        <input type="email" id="loginEmail" class="form-control" placeholder="name@company.com" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Password</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mb-3">Sign In</button>
                </form>

                <div class="p-3 bg-light rounded-3 border mb-3">
                    <div class="small fw-bold text-muted mb-2 text-uppercase" style="font-size: 0.72rem;">Quick 1-Click Demo Logins</div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-outline-dark flex-fill" id="fillAdminBtn">
                            <i class="fa-solid fa-user-shield me-1"></i> Admin
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-primary flex-fill" id="fillSenderBtn">
                            <i class="fa-solid fa-user-pen me-1"></i> Sender
                        </button>
                    </div>
                </div>

                <div class="text-center text-muted small">
                    Don't have an account? <a href="#/register" class="fw-semibold text-primary text-decoration-none">Create free account</a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('fillAdminBtn').onclick = () => {
        document.getElementById('loginEmail').value = 'admin@esign.com';
        document.getElementById('loginPassword').value = 'admin123';
    };
    document.getElementById('fillSenderBtn').onclick = () => {
        document.getElementById('loginEmail').value = 'demo@esign.com';
        document.getElementById('loginPassword').value = 'password123';
    };

    document.getElementById('loginForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;

        try {
            const auth = await api.login(email, password);
            api.setToken(auth.token);
            api.setUser(auth);
            state.user = auth;
            showToast('Welcome back, ' + auth.fullName + '!');
            window.location.hash = '#/dashboard';
        } catch (err) {
            showToast(err.message, 'danger');
        }
    };
}

// 3. Register Page with Email OTP Verification
function renderRegister(container) {
    let otpDispatched = false;
    let isEmailVerified = false;
    api.clearToken();

    container.innerHTML = `
        <div class="d-flex align-items-center justify-content-center py-5">
            <div class="card border-0 shadow-sm p-4 p-md-5 bg-white" style="max-width: 520px; width: 100%; border-radius: 16px;">
                <div class="text-center mb-4">
                    <h5 class="fw-bold mb-1">Create Business Workspace</h5>
                    <p class="text-muted small">Verify your email to create a secure, authentic account</p>
                </div>

                <form id="regForm">
                    <div class="row g-2 mb-3">
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold">First Name *</label>
                            <input type="text" id="regFirst" class="form-control" placeholder="Rajesh" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold">Last Name *</label>
                            <input type="text" id="regLast" class="form-control" placeholder="Sharma" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Company / Organization *</label>
                        <input type="text" id="regOrg" class="form-control" placeholder="Acme Technologies Pvt Ltd" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Work Email Address *</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-regular fa-envelope"></i></span>
                            <input type="email" id="regEmail" class="form-control border-start-0" placeholder="rajesh@acme.com" required>
                            <button type="button" class="btn btn-primary fw-semibold px-3" id="sendEmailOtpBtn">
                                <i class="fa-solid fa-paper-plane me-1"></i> Get OTP
                            </button>
                        </div>
                        <div class="form-text small text-muted">A 6-digit verification code will be sent to this email inbox.</div>
                        <div id="regEmailAlert" class="small mt-1"></div>
                    </div>

                    <!-- Email OTP Verification Box -->
                    <div id="emailOtpSection" class="p-3 mb-3 bg-light rounded-3 border">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label small fw-bold text-primary mb-0">
                                <i class="fa-solid fa-shield-halved me-1"></i> Enter 6-Digit Email Verification Code *
                            </label>
                            <span id="regEmailVerifiedBadge" class="badge bg-success-subtle text-success d-none">
                                <i class="fa-solid fa-circle-check me-1"></i> Email Verified
                            </span>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-7">
                                <input type="text" id="regOtpCode" class="form-control font-monospace text-center fs-5 fw-bold" placeholder="------" maxlength="6" required>
                            </div>
                            <div class="col-5">
                                <button type="button" class="btn btn-outline-success w-100 fw-semibold" id="verifyEmailOtpBtn">
                                    <i class="fa-solid fa-check me-1"></i> Verify Code
                                </button>
                            </div>
                        </div>
                        <div id="regOtpAlert" class="small text-muted">Click <strong>Get OTP</strong> to dispatch the code to your email.</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Password *</label>
                        <input type="password" id="regPass" class="form-control" placeholder="••••••••" minlength="6" required>
                    </div>

                    <button type="submit" id="submitRegBtn" class="btn btn-primary w-100 py-2 fw-semibold mb-3">
                        <i class="fa-solid fa-user-plus me-1"></i> Create Free Account
                    </button>
                </form>

                <div class="text-center text-muted small">
                    Already registered? <a href="#/login" class="fw-semibold text-primary text-decoration-none">Sign in here</a>
                </div>
            </div>
        </div>
    `;

    const sendOtpAction = async () => {
        const email = document.getElementById('regEmail').value.trim();
        if (!email || !email.includes('@')) {
            alert('Please enter a valid work email address first.');
            return false;
        }

        const sendBtn = document.getElementById('sendEmailOtpBtn');
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';

        try {
            const res = await api.sendRegistrationOtp(email);
            otpDispatched = true;
            document.getElementById('regEmailAlert').innerHTML = `
                <span class="text-success fw-medium">
                    <i class="fa-solid fa-envelope-circle-check me-1"></i> ${res.message || 'Verification code sent to your email! Please check your inbox and spam folder.'}
                </span>
            `;
            showToast('Verification code dispatched to ' + email + '! Check your inbox.');

            let timeLeft = 60;
            sendBtn.innerHTML = `Resend (${timeLeft}s)`;
            const regTimer = setInterval(() => {
                timeLeft--;
                if (timeLeft <= 0) {
                    clearInterval(regTimer);
                    sendBtn.disabled = false;
                    sendBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP';
                } else {
                    sendBtn.innerHTML = `Resend (${timeLeft}s)`;
                }
            }, 1000);
            return true;
        } catch (err) {
            sendBtn.disabled = false;
            sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-1"></i> Get OTP';
            document.getElementById('regEmailAlert').innerHTML = `<span class="text-danger fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${err.message}</span>`;
            return false;
        }
    };

    document.getElementById('sendEmailOtpBtn').onclick = sendOtpAction;

    document.getElementById('verifyEmailOtpBtn').onclick = async () => {
        const email = document.getElementById('regEmail').value.trim();
        const otpCode = document.getElementById('regOtpCode').value.trim();
        if (otpCode.length !== 6) {
            alert('Please enter the 6-digit OTP code sent to your email.');
            return;
        }
        try {
            await api.verifyRegistrationOtp(email, otpCode);
            isEmailVerified = true;
            document.getElementById('emailOtpSection').className = 'p-3 mb-3 bg-success-subtle border border-success rounded-3';
            document.getElementById('regEmailVerifiedBadge').classList.remove('d-none');
            document.getElementById('regOtpAlert').innerHTML = '<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Email Verified Successfully!</span>';
            document.getElementById('sendEmailOtpBtn').style.display = 'none';
            document.getElementById('regEmail').readOnly = true;
            showToast('Email verified successfully!');
        } catch (err) {
            document.getElementById('regOtpAlert').innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${err.message}</span>`;
        }
    };

    document.getElementById('regForm').onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value.trim();
        const otpCode = document.getElementById('regOtpCode').value.trim();

        if (!otpCode || otpCode.length !== 6) {
            alert('Please click "Get OTP" and enter the 6-digit verification code sent to your email.');
            document.getElementById('regOtpCode').focus();
            return;
        }

        const submitBtn = document.getElementById('submitRegBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Creating Account...';

        try {
            const data = {
                firstName: document.getElementById('regFirst').value.trim(),
                lastName: document.getElementById('regLast').value.trim(),
                organizationName: document.getElementById('regOrg').value.trim(),
                email: email,
                password: document.getElementById('regPass').value,
                otpCode: otpCode
            };
            const auth = await api.register(data);
            api.setToken(auth.token);
            api.setUser(auth);
            state.user = auth;
            showToast('Account created and email verified successfully!');
            window.location.hash = '#/dashboard';
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-user-plus me-1"></i> Create Free Account';
            showToast(err.message, 'danger');
        }
    };
}

// 4. Dashboard View
async function renderDashboard(container) {
    container.innerHTML = `<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading dashboard...</div></div>`;

    try {
        const stats = await api.getDashboardStats();

        container.innerHTML = `
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <div>
                        <h4 class="fw-bold mb-1">Good day, ${state.user.fullName || 'User'}! 👋</h4>
                        <p class="text-muted small mb-0">Contract execution status overview across documents and signatories.</p>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="#/verify" class="btn btn-outline-success btn-sm px-3"><i class="fa-solid fa-shield-halved me-1"></i> Verify Ledger</a>
                        <a href="#/upload" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-cloud-arrow-up me-1"></i> Upload Document</a>
                    </div>
                </div>

                <!-- 4 KPI Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-6 col-lg-3">
                        <div class="card stat-card p-3 border-0 bg-white">
                            <div class="text-muted small fw-semibold text-uppercase">Total Documents</div>
                            <h3 class="fw-bold mb-1">${stats.totalDocuments}</h3>
                            <div class="text-muted small">Registered in ledger</div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3">
                        <div class="card stat-card p-3 border-0 bg-white">
                            <div class="text-muted small fw-semibold text-uppercase">Awaiting Signature</div>
                            <h3 class="fw-bold mb-1 text-warning">${stats.pendingSignatures}</h3>
                            <div class="text-muted small">Sent or in progress</div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3">
                        <div class="card stat-card p-3 border-0 bg-white">
                            <div class="text-muted small fw-semibold text-uppercase">Completed &amp; Sealed</div>
                            <h3 class="fw-bold mb-1 text-success">${stats.completedDocuments}</h3>
                            <div class="text-muted small">With SHA-256 certificate</div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3">
                        <div class="card stat-card p-3 border-0 bg-white">
                            <div class="text-muted small fw-semibold text-uppercase">Drafts</div>
                            <h3 class="fw-bold mb-1 text-muted">${stats.draftDocuments}</h3>
                            <div class="text-muted small">Ready for signers</div>
                        </div>
                    </div>
                </div>

                <div class="row g-4">
                    <div class="col-lg-8">
                        <div class="card border-0 bg-white h-100">
                            <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                <span class="fw-bold"><i class="fa-solid fa-folder-open text-primary me-2"></i> Recent Documents</span>
                                <a href="#/documents" class="small text-primary fw-semibold text-decoration-none">View All <i class="fa-solid fa-arrow-right ms-1"></i></a>
                            </div>
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light small text-muted text-uppercase">
                                        <tr>
                                            <th class="ps-3">Document</th>
                                            <th>Status</th>
                                            <th>Date</th>
                                            <th class="text-end pe-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${stats.recentDocuments && stats.recentDocuments.length > 0 ? stats.recentDocuments.map(d => `
                                            <tr>
                                                <td class="ps-3">
                                                    <div class="fw-bold text-truncate" style="max-width: 250px;">
                                                        <a href="#/documents/${d.id}" class="text-decoration-none text-dark">${d.title}</a>
                                                    </div>
                                                    <div class="small text-muted">${d.pages} pgs • ${d.fileName}</div>
                                                </td>
                                                <td><span class="badge rounded-pill px-2 py-1 badge-status-${d.status}">${d.status}</span></td>
                                                <td class="small text-muted">${new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                                <td class="text-end pe-3">
                                                    <a href="#/documents/${d.id}" class="btn btn-sm btn-outline-secondary"><i class="fa-solid fa-eye"></i></a>
                                                </td>
                                            </tr>
                                        `).join('') : `<tr><td colspan="4" class="text-center py-4 text-muted">No documents uploaded yet. <a href="#/upload">Upload your first PDF</a></td></tr>`}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card border-0 bg-white h-100">
                            <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                                <span class="fw-bold"><i class="fa-solid fa-link text-primary me-2"></i> Chained Audit Stream</span>
                                <span class="badge bg-success-subtle text-success small">Immutable</span>
                            </div>
                            <div class="card-body p-3" style="max-height: 440px; overflow-y: auto;">
                                ${stats.recentActivity && stats.recentActivity.length > 0 ? stats.recentActivity.map(a => `
                                    <div class="mb-3 pb-3 border-bottom">
                                        <div class="d-flex justify-content-between small">
                                            <span class="badge bg-light text-dark font-monospace">${a.action}</span>
                                            <span class="text-muted">${new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div class="small text-muted mt-1 text-break">${a.details}</div>
                                        <div class="small font-monospace text-muted mt-1" style="font-size: 0.68rem;">Hash: ${a.currentHash ? a.currentHash.substring(0, 16) + '...' : ''}</div>
                                    </div>
                                `).join('') : `<div class="text-muted text-center py-4 small">No activity logged yet.</div>`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        showToast(err.message, 'danger');
    }
}

// 5. Documents List
async function renderDocuments(container, filterStatus = 'ALL') {
    container.innerHTML = `<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>`;

    try {
        const docs = await api.getDocuments(filterStatus);

        container.innerHTML = `
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 class="fw-bold mb-1"><i class="fa-regular fa-folder-open text-primary me-2"></i> Documents Registry</h4>
                        <p class="text-muted small mb-0">View all uploaded agreements, tracking signatures, and sealed files.</p>
                    </div>
                    <a href="#/upload" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-cloud-arrow-up me-1"></i> Upload PDF</a>
                </div>

                <!-- Filter Pills -->
                <div class="card border-0 bg-white mb-4 p-3 shadow-sm">
                    <ul class="nav nav-pills gap-1">
                        ${['ALL', 'DRAFT', 'SENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map(s => `
                            <li class="nav-item">
                                <a class="nav-link py-1 px-3 small fw-semibold ${filterStatus === s ? 'active bg-primary' : 'text-muted'}" href="#/documents?status=${s}">${s}</a>
                            </li>
                        `).join('')}
                    </ul>
                </div>

                <div class="card border-0 bg-white shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">Document Title</th>
                                    <th>Status</th>
                                    <th>Pages / Size</th>
                                    <th>Date</th>
                                    <th>SHA-256 Fingerprint</th>
                                    <th class="text-end pe-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${docs.length > 0 ? docs.map(d => `
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold"><a href="#/documents/${d.id}" class="text-decoration-none text-dark">${d.title}</a></div>
                                            <div class="small text-muted">${d.fileName}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${d.status}">${d.status}</span></td>
                                        <td class="small text-muted">${d.pageCount} pgs • ${Math.round((d.fileSize || 0) / 1024)} KB</td>
                                        <td class="small text-muted">${new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td>
                                            ${d.finalHash ? `
                                                <span class="badge bg-success-subtle text-success font-monospace" title="${d.finalHash}">
                                                    <i class="fa-solid fa-shield-halved me-1"></i> ${d.finalHash.substring(0, 10)}...
                                                </span>
                                            ` : `<span class="small font-monospace text-muted">${d.originalHash ? d.originalHash.substring(0, 10) + '...' : '-'}</span>`}
                                        </td>
                                        <td class="text-end pe-3">
                                            <div class="btn-group btn-group-sm">
                                                <a href="#/documents/${d.id}" class="btn btn-outline-secondary">Inspect</a>
                                                ${d.status === 'DRAFT' ? `<a href="#/send?documentId=${d.id}" class="btn btn-outline-primary">Send</a>` : ''}
                                                <button type="button" onclick="window.downloadDoc('${d.id}', true, 'SEALED_${d.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf')" class="btn btn-outline-success" title="Download Document"><i class="fa-solid fa-download"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('') : `<tr><td colspan="6" class="text-center py-5 text-muted">No documents found matching this filter.</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        showToast(err.message, 'danger');
    }
}

// 6. Document Details View
async function renderDocumentDetails(container, id) {
    container.innerHTML = `<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>`;

    try {
        const doc = await api.getDocument(id);

        container.innerHTML = `
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge rounded-pill px-3 py-1 badge-status-${doc.status} fw-bold">${doc.status}</span>
                            ${doc.sequentialSigning ? `<span class="badge bg-secondary-subtle text-secondary small">Sequential Routing</span>` : ''}
                        </div>
                        <h3 class="fw-bold mb-1">${doc.title}</h3>
                        <div class="text-muted small">Uploaded by <strong>${doc.ownerName}</strong> on ${new Date(doc.createdAt).toLocaleString('en-IN')}</div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        ${doc.status === 'DRAFT' ? `<a href="#/send?documentId=${doc.id}" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-paper-plane me-1"></i> Send for Signature</a>` : ''}
                        ${doc.finalHash ? `<button type="button" onclick="window.downloadDoc('${doc.id}', true, 'SEALED_${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf')" class="btn btn-success btn-sm px-3"><i class="fa-solid fa-file-shield me-1"></i> Download Sealed PDF</button>` : ''}
                        <button type="button" onclick="window.downloadDoc('${doc.id}', false, 'ORIGINAL_${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf')" class="btn btn-outline-secondary btn-sm px-3"><i class="fa-solid fa-download me-1"></i> Original PDF</button>
                        ${doc.finalHash ? `<a href="#/verify?hash=${doc.finalHash}" class="btn btn-outline-primary btn-sm px-3"><i class="fa-solid fa-shield-halved me-1"></i> Verify on Ledger</a>` : ''}
                    </div>
                </div>

                <!-- Cryptographic Hashes Card -->
                <div class="card border-0 bg-white mb-4 p-3 shadow-sm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Original Pre-Execution SHA-256</div>
                            <div class="hash-box">${doc.originalHash || 'N/A'}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Final Sealed SHA-256 Fingerprint</div>
                            <div class="hash-box text-success fw-bold">${doc.finalHash || 'Pending completion of all signatories'}</div>
                        </div>
                    </div>
                </div>

                <!-- Signatories Table -->
                <div class="card border-0 bg-white mb-4 shadow-sm">
                    <div class="card-header bg-white py-3 fw-bold"><i class="fa-solid fa-users text-primary me-2"></i> Signatories Execution Progress</div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">Order</th>
                                    <th>Signer Name &amp; Email</th>
                                    <th>Status</th>
                                    <th>OTP Identity</th>
                                    <th>Signed At</th>
                                    <th class="text-end pe-3">Actions &amp; Signing Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${doc.signers && doc.signers.length > 0 ? doc.signers.map(s => `
                                    <tr>
                                        <td class="ps-3 fw-bold text-muted">#${s.signOrder}</td>
                                        <td>
                                            <div class="fw-bold">${s.name}</div>
                                            <div class="small text-muted">${s.email}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${s.status}">${s.status}</span></td>
                                        <td>${s.otpVerified ? '<span class="badge bg-success-subtle text-success"><i class="fa-solid fa-check me-1"></i> Verified</span>' : '<span class="badge bg-light text-muted">Pending</span>'}</td>
                                        <td class="small text-muted">${s.signedAt ? new Date(s.signedAt).toLocaleString('en-IN') : '-'}</td>
                                        <td class="text-end pe-3">
                                            ${s.status !== 'SIGNED' ? `
                                                <div class="btn-group btn-group-sm">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="window.copySignerLink('${s.signingToken}', event)" title="Copy direct signing link">
                                                        <i class="fa-regular fa-copy me-1"></i> Copy Link
                                                    </button>
                                                    <button type="button" class="btn btn-outline-primary" onclick="window.resendInvite('${s.id}', event)" title="Resend email invite via Gmail">
                                                        <i class="fa-solid fa-paper-plane me-1"></i> Resend Email
                                                    </button>
                                                    <a href="#/sign/${s.signingToken}" target="_blank" class="btn btn-primary" title="Open signing portal">
                                                        <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open
                                                    </a>
                                                </div>
                                            ` : `<span class="badge bg-success-subtle text-success fs-6"><i class="fa-solid fa-circle-check me-1"></i> Executed</span>`}
                                        </td>
                                    </tr>
                                `).join('') : `<tr><td colspan="6" class="text-center py-4 text-muted">No signers configured. Click "Send for Signature" to configure.</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Chained Audit Log Table (FR-09) -->
                <div class="card border-0 bg-white shadow-sm">
                    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <span class="fw-bold"><i class="fa-solid fa-link text-primary me-2"></i> Chained Immutable Audit Trail</span>
                        <span class="badge bg-success-subtle text-success small">FR-09 Compliant</span>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle mb-0 font-monospace" style="font-size: 0.8rem;">
                            <thead class="table-light text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">Timestamp (IST)</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                    <th>IP Address</th>
                                    <th>Previous Hash</th>
                                    <th class="pe-3">Current Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${doc.auditLogs && doc.auditLogs.length > 0 ? doc.auditLogs.map(a => `
                                    <tr>
                                        <td class="ps-3 text-nowrap text-muted">${new Date(a.timestamp).toLocaleString('en-IN')}</td>
                                        <td><span class="badge bg-light text-dark">${a.action}</span></td>
                                        <td class="text-break" style="font-family: sans-serif; max-width: 300px;">${a.details}</td>
                                        <td class="text-muted">${a.ipAddress}</td>
                                        <td class="text-muted">${a.prevHash ? a.prevHash.substring(0, 10) + '...' : '-'}</td>
                                        <td class="pe-3 text-success fw-bold">${a.currentHash ? a.currentHash.substring(0, 10) + '...' : '-'}</td>
                                    </tr>
                                `).join('') : `<tr><td colspan="6" class="text-center py-3 text-muted">No audit events recorded yet.</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        showToast(err.message, 'danger');
    }
}

// 7. Upload View
function renderUpload(container) {
    container.innerHTML = `
        <div class="container py-5" style="max-width: 720px;">
            <div class="card border-0 shadow-sm p-4 p-md-5 bg-white">
                <div class="mb-4">
                    <h4 class="fw-bold mb-1"><i class="fa-solid fa-cloud-arrow-up text-primary me-2"></i> Upload New Document</h4>
                    <p class="text-muted small">Upload an agreement PDF to place signatures and invite counter-parties.</p>
                </div>

                <form id="uploadForm">
                    <div class="mb-4">
                        <label class="form-label fw-semibold small">Document PDF File</label>
                        <div class="upload-dropzone" id="dropzoneBox" onclick="document.getElementById('fileInput').click()">
                            <i class="fa-solid fa-file-arrow-up text-primary fs-1 mb-2"></i>
                            <h6 class="fw-bold mb-1" id="dropLabel">Click to browse or drag &amp; drop PDF here</h6>
                            <p class="text-muted small mb-0">Supported: PDF up to 25 MB</p>
                            <p class="text-primary small mt-2 mb-0 fw-semibold"><i class="fa-solid fa-magic-wand-sparkles me-1"></i> Tip: Leave empty to auto-generate a sample agreement!</p>
                        </div>
                        <input type="file" id="fileInput" accept="application/pdf" class="d-none">
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold small">Document Title</label>
                        <input type="text" id="docTitle" class="form-control" placeholder="e.g. Master Services Agreement - 2026">
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold small">Description / Notes (Optional)</label>
                        <textarea id="docDesc" class="form-control" rows="2" placeholder="Brief notes for internal reference..."></textarea>
                    </div>

                    <div class="form-check mb-4">
                        <input class="form-check-input" type="checkbox" id="seqSigning">
                        <label class="form-check-label small fw-semibold" for="seqSigning">Sequential Signing Order</label>
                        <div class="form-text small">Signer 2 is invited only after Signer 1 completes their execution.</div>
                    </div>

                    <div class="d-flex justify-content-between pt-3 border-top">
                        <a href="#/documents" class="btn btn-outline-secondary">Cancel</a>
                        <button type="submit" class="btn btn-primary px-4 fw-semibold"><i class="fa-solid fa-arrow-right me-1"></i> Upload &amp; Next</button>
                    </div>
                </form>
            </div>
        </div>
    `;

    const fileInput = document.getElementById('fileInput');
    const dropzoneBox = document.getElementById('dropzoneBox');

    fileInput.onchange = () => {
        if (fileInput.files[0]) {
            document.getElementById('dropLabel').innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> Selected: ${fileInput.files[0].name} (${Math.round(fileInput.files[0].size / 1024)} KB)</span>`;
        }
    };

    if (dropzoneBox) {
        ['dragenter', 'dragover'].forEach(name => {
            dropzoneBox.addEventListener(name, (e) => {
                e.preventDefault();
                dropzoneBox.style.borderColor = '#4f46e5';
                dropzoneBox.style.background = '#f5f3ff';
            });
        });
        ['dragleave', 'drop'].forEach(name => {
            dropzoneBox.addEventListener(name, (e) => {
                e.preventDefault();
                dropzoneBox.style.borderColor = '#cbd5e1';
                dropzoneBox.style.background = '#ffffff';
            });
        });
        dropzoneBox.addEventListener('drop', (e) => {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                fileInput.files = e.dataTransfer.files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }

    document.getElementById('uploadForm').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        const title = document.getElementById('docTitle').value.trim() || 'Service Agreement';
        fd.append('title', title);
        fd.append('description', document.getElementById('docDesc').value.trim());
        fd.append('sequentialSigning', document.getElementById('seqSigning').checked);

        if (fileInput.files[0]) {
            fd.append('file', fileInput.files[0]);
        }

        try {
            const doc = await api.uploadDocument(fd);
            showToast('Document uploaded successfully!');
            window.location.hash = `#/send?documentId=${doc.id}`;
        } catch (err) {
            showToast(err.message, 'danger');
        }
    };
}

// 8. Send for Signature View
async function renderSend(container, docId) {
    container.innerHTML = `<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>`;

    try {
        const docs = await api.getDocuments('DRAFT');

        container.innerHTML = `
            <div class="container py-4" style="max-width: 820px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white">
                    <div class="mb-4">
                        <div class="badge bg-primary-subtle text-primary fw-semibold px-3 py-1 rounded-pill mb-2">Step 2: Signer Setup</div>
                        <h4 class="fw-bold mb-1"><i class="fa-solid fa-paper-plane text-primary me-2"></i> Configure &amp; Dispatch Invites</h4>
                        <p class="text-muted small">Add the counter-parties who need to execute this agreement. Each will receive an OTP-verified signing link.</p>
                    </div>

                    <form id="sendForm">
                        <div class="mb-3">
                            <label class="form-label fw-semibold small">Target Agreement</label>
                            <select id="targetDoc" class="form-select" required>
                                ${docs.map(d => `<option value="${d.id}" ${d.id === docId ? 'selected' : ''}>${d.title} (${d.fileName})</option>`).join('')}
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold small">Email Subject</label>
                            <input type="text" id="reqTitle" class="form-control" value="Please Review and Sign Agreement" required>
                        </div>

                        <div class="mb-4">
                            <label class="form-label fw-semibold small">Message to Signers (Optional)</label>
                            <textarea id="reqMsg" class="form-control" rows="2" placeholder="Please review and complete electronic execution at your earliest convenience."></textarea>
                        </div>

                        <!-- Dynamic Signers -->
                        <div class="mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label fw-bold mb-0">Signatories</label>
                                <button type="button" class="btn btn-outline-primary btn-sm" id="addSignerBtn">
                                    <i class="fa-solid fa-user-plus me-1"></i> Add Another Signer
                                </button>
                            </div>
                            <div id="signersList">
                                <div class="p-3 bg-light rounded-3 border mb-2 signer-row">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <span class="badge bg-primary fw-bold">Signer #1</span>
                                    </div>
                                    <div class="row g-2">
                                        <div class="col-md-4"><input type="text" class="form-control form-control-sm signer-name" placeholder="Full Name *" required></div>
                                        <div class="col-md-5"><input type="email" class="form-control form-control-sm signer-email" placeholder="Email Address *" required></div>
                                        <div class="col-md-3"><input type="tel" class="form-control form-control-sm signer-phone" placeholder="Mobile (+91)"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="row g-3 mb-4 p-3 bg-light rounded-3 border">
                            <div class="col-md-6">
                                <label class="form-label fw-semibold small">Due Date</label>
                                <input type="date" id="dueDate" class="form-control form-control-sm">
                            </div>
                            <div class="col-md-6 d-flex align-items-center pt-md-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="seqCheck" value="true">
                                    <label class="form-check-label small fw-semibold" for="seqCheck">Sequential Routing</label>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between pt-3 border-top">
                            <a href="#/documents" class="btn btn-outline-secondary">Cancel</a>
                            <button type="submit" class="btn btn-primary px-4 fw-semibold"><i class="fa-solid fa-paper-plane me-1"></i> Dispatch Signing Invites</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const dueDateInput = document.getElementById('dueDate');
        if (dueDateInput) {
            const today = new Date().toISOString().split('T')[0];
            const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
            dueDateInput.min = today;
            dueDateInput.value = nextWeek;
        }

        let count = 1;
        document.getElementById('addSignerBtn').onclick = () => {
            count++;
            const list = document.getElementById('signersList');
            const row = document.createElement('div');
            row.className = 'p-3 bg-light rounded-3 border mb-2 signer-row';
            row.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-secondary fw-bold">Signer #${count}</span>
                    <button type="button" class="btn btn-link text-danger p-0 small text-decoration-none" onclick="this.closest('.signer-row').remove()">
                        <i class="fa-solid fa-trash me-1"></i> Remove
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-4"><input type="text" class="form-control form-control-sm signer-name" placeholder="Full Name *" required></div>
                    <div class="col-md-5"><input type="email" class="form-control form-control-sm signer-email" placeholder="Email Address *" required></div>
                    <div class="col-md-3"><input type="tel" class="form-control form-control-sm signer-phone" placeholder="Mobile (+91)"></div>
                </div>
            `;
            list.appendChild(row);
        };

        document.getElementById('sendForm').onsubmit = async (e) => {
            e.preventDefault();
            const signers = [];
            const rows = document.querySelectorAll('.signer-row');
            rows.forEach((r, idx) => {
                signers.push({
                    name: r.querySelector('.signer-name').value.trim(),
                    email: r.querySelector('.signer-email').value.trim(),
                    phone: r.querySelector('.signer-phone').value.trim(),
                    order: idx + 1
                });
            });

            const data = {
                documentId: document.getElementById('targetDoc').value,
                title: document.getElementById('reqTitle').value.trim(),
                message: document.getElementById('reqMsg').value.trim(),
                dueDate: document.getElementById('dueDate').value || null,
                sequentialSigning: document.getElementById('seqCheck').checked,
                signers
            };

            try {
                const res = await api.createSigningRequest(data);
                let linksMsg = '';
                if (res.signers && res.signers.length > 0) {
                    linksMsg = res.signers.map(s => `\n• Signer: ${s.name} (${s.email})\n  Link: ${window.location.origin}/#/sign/${s.token}`).join('\n');
                }
                alert('✅ Agreement Dispatched Successfully!\n\nInvitation email has been sent via Gmail.' + (linksMsg ? '\n\nDirect Signing Link (Copy to share via WhatsApp/Chat):\n' + linksMsg : ''));
                showToast('Signing request dispatched successfully! Email invites sent via Gmail.');
                window.location.hash = `#/documents/${data.documentId}`;
            } catch (err) {
                showToast(err.message, 'danger');
            }
        };
    } catch (err) {
        showToast(err.message, 'danger');
    }
}

// 9. Signer Portal View (Public, mobile responsive, FR-06, FR-07, NFR-8)
async function renderSignerPage(container, token) {
    container.innerHTML = `<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading signing context...</div></div>`;

    try {
        const ctx = await api.getSigningContext(token);

        if (ctx.signerStatus === 'SIGNED') {
            container.innerHTML = `
                <div class="d-flex align-items-center justify-content-center py-5">
                    <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 540px; border-radius: 16px;">
                        <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
                        <h4 class="fw-bold mb-2">Already Executed</h4>
                        <p class="text-muted small mb-4">You have already completed electronic signing for this document on ${new Date(ctx.signedAt).toLocaleString('en-IN')}.</p>
                        <a href="#/verify?hash=${ctx.finalHash || ''}" class="btn btn-outline-primary btn-sm">Public Ledger Verification</a>
                    </div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="container py-4" style="max-width: 860px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-file-signature text-primary fs-3 me-2"></i>
                        <span class="fs-4 fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                        <span class="badge bg-primary-subtle text-primary ms-2 rounded-pill small">Public Signer Portal</span>
                    </div>
                    <div class="small text-muted">Requested by <strong>${ctx.senderName}</strong></div>
                </div>

                <div class="card border-0 shadow-sm bg-white p-4 p-md-5 mb-4">
                    <div class="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-warning-subtle text-warning fw-bold mb-1">Awaiting Your Signature</span>
                            <h4 class="fw-bold mb-1">${ctx.documentTitle}</h4>
                            <div class="text-muted small">Signer: <strong>${ctx.signerName}</strong> (${ctx.signerEmail})</div>
                        </div>
                        <a href="${api.getSigningPreviewUrl(token)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open Full PDF</a>
                    </div>

                    <!-- In-Browser Document Preview -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-regular fa-file-pdf text-danger me-1"></i> Document Review</label>
                        <div class="rounded-3 border overflow-hidden" style="height: 380px; background: #e2e8f0;">
                            <iframe src="${api.getSigningPreviewUrl(token)}" width="100%" height="100%" style="border: none;"></iframe>
                        </div>
                    </div>

                    <!-- STEP 1: OTP Identity Check (FR-07) -->
                    <div class="p-3 mb-4 rounded-3 border ${ctx.otpVerified ? 'bg-success-subtle border-success' : 'bg-light'}" id="otpContainer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold small text-uppercase"><i class="fa-solid fa-shield-halved text-primary me-1"></i> Step 1: Identity Verification (OTP)</span>
                                <div class="small text-muted" id="otpText">${ctx.otpVerified ? '<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP Passcode' : 'A 6-digit passcode will be dispatched to verify your identity.'}</div>
                            </div>
                            ${!ctx.otpVerified ? `<button type="button" class="btn btn-sm btn-primary" id="getOtpBtn"><i class="fa-solid fa-paper-plane me-1"></i> Send OTP Code</button>` : ''}
                        </div>

                        <div id="otpInputArea" class="mt-3 pt-3 border-top" style="display: none;">
                            <div class="row g-2 align-items-center">
                                <div class="col-sm-5"><input type="text" id="signerOtp" class="form-control text-center fw-bold fs-6 font-monospace" placeholder="6-digit code" maxlength="6"></div>
                                <div class="col-sm-4"><button type="button" class="btn btn-sm btn-success w-100 fw-semibold" id="verifyOtpBtn">Verify Code</button></div>
                            </div>
                            <div id="otpMsg" class="small mt-2"></div>
                        </div>
                    </div>

                    <!-- STEP 2: Signature Input (FR-06) -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-solid fa-pen-nib text-primary me-1"></i> Step 2: Adopt Signature</label>

                        <ul class="nav nav-tabs nav-fill mb-3" id="sigModeTab">
                            <li class="nav-item"><button class="nav-link active fw-semibold" data-mode="DRAWN" type="button"><i class="fa-solid fa-paintbrush me-1"></i> Draw</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold" data-mode="TYPED" type="button"><i class="fa-solid fa-keyboard me-1"></i> Type</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold" data-mode="UPLOADED" type="button"><i class="fa-solid fa-arrow-up-from-bracket me-1"></i> Upload</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold text-primary" data-mode="AADHAAR_ESIGN" type="button"><i class="fa-solid fa-id-card me-1"></i> Aadhaar e-Sign <span class="badge bg-warning text-dark small ms-1">UIDAI</span></button></li>
                        </ul>

                        <div id="paneDrawn">
                            <div class="sig-canvas-container mb-2">
                                <canvas id="signCanvas"></canvas>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-dark active" id="penBlack">Black</button>
                                    <button type="button" class="btn btn-outline-primary" id="penBlue">Blue</button>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="clearCanvasBtn"><i class="fa-solid fa-rotate-left me-1"></i> Clear</button>
                            </div>
                        </div>

                        <div id="paneTyped" style="display: none;">
                            <input type="text" id="typedInput" class="form-control mb-3" value="${ctx.signerName}" placeholder="Type legal name...">
                            <div class="row g-2">
                                <div class="col-6"><div class="typed-sig-preview selected" id="styleOpt1"><div class="font-great-vibes" id="typePrev1">${ctx.signerName}</div><div class="small text-muted mt-2">Style 1</div></div></div>
                                <div class="col-6"><div class="typed-sig-preview" id="styleOpt2"><div class="font-dancing-script" id="typePrev2">${ctx.signerName}</div><div class="small text-muted mt-2">Style 2</div></div></div>
                            </div>
                        </div>

                        <div id="paneUploaded" style="display: none;" class="p-4 border rounded-3 text-center bg-light">
                            <i class="fa-regular fa-image text-muted fs-1 mb-2"></i>
                            <p class="small text-muted mb-2">Upload a clean scanned photo or PNG of your handwritten signature</p>
                            <input type="file" id="sigUploadInput" accept="image/*" class="form-control form-control-sm w-auto mx-auto">
                            <div id="upPreviewBox" class="mt-3" style="display: none;"><img id="upPreviewImg" style="max-height: 80px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px;"></div>
                        </div>

                        <div id="paneAadhaar" style="display: none;" class="p-4 border rounded-3 bg-light">
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge bg-warning text-dark px-2 py-1 me-2 fw-bold">UIDAI e-KYC</span>
                                <h6 class="fw-bold mb-0 text-primary">Aadhaar e-Sign Verification (Section 3A, IT Act 2000)</h6>
                            </div>
                            <p class="small text-muted mb-3">Authenticate identity directly with your 12-digit Aadhaar number using a One-Time Passcode (OTP).</p>
                            <div id="spaAadhaarForm">
                                <div class="row g-2 mb-3">
                                    <div class="col-md-7">
                                        <label class="form-label small fw-semibold">12-Digit Aadhaar Number</label>
                                        <input type="text" id="spaAadhaarInput" class="form-control font-monospace" placeholder="e.g. 5489 1234 5678" maxlength="14">
                                    </div>
                                    <div class="col-md-5 d-flex align-items-end">
                                        <button type="button" class="btn btn-primary w-100 fw-semibold" id="spaSendAadhaarOtpBtn"><i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP</button>
                                    </div>
                                </div>
                                <div id="spaAadhaarOtpRow" style="display: none;" class="pt-3 border-top">
                                    <label class="form-label small fw-semibold">Enter 6-Digit UIDAI OTP Code</label>
                                    <div class="row g-2">
                                        <div class="col-md-7"><input type="text" id="spaAadhaarOtpCode" class="form-control font-monospace text-center fs-5 fw-bold" placeholder="------" maxlength="6"></div>
                                        <div class="col-md-5"><button type="button" class="btn btn-success w-100 fw-semibold" id="spaVerifyAadhaarOtpBtn"><i class="fa-solid fa-check-double me-1"></i> Verify Aadhaar</button></div>
                                    </div>
                                    <div id="spaAadhaarAlert" class="small mt-2"></div>
                                </div>
                            </div>
                            <div id="spaAadhaarSuccess" style="display: none;" class="p-3 bg-white border border-success rounded-3 text-center">
                                <i class="fa-solid fa-circle-check text-success fs-2 mb-2"></i>
                                <h6 class="fw-bold text-success mb-1">Aadhaar Identity Authenticated</h6>
                                <div class="small text-muted mb-3" id="spaAadhaarDetails"></div>
                                <img id="spaAadhaarStampImg" style="max-width: 100%; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                        </div>
                    </div>

                    <!-- STEP 3: Legal Consent Checkbox (IT Act 2000 Sec 10A) -->
                    <div class="p-3 mb-4 bg-light rounded-3 border">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="legalConsent" required>
                            <label class="form-check-label small" for="legalConsent">
                                <strong>Legal Declaration:</strong> I hereby declare that I am <strong>${ctx.signerName}</strong>, and I agree to be bound by the terms set forth herein. I acknowledge that my electronic signature constitutes a legally valid contract execution under <strong>Section 10A of the Information Technology Act, 2000</strong> and the Indian Contract Act, 1872.
                            </label>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <button type="button" class="btn btn-outline-danger btn-sm" id="declineBtn"><i class="fa-solid fa-xmark me-1"></i> Decline</button>
                        <button type="button" class="btn btn-success btn-lg px-4 fw-bold shadow" id="executeBtn"><i class="fa-solid fa-signature me-2"></i> Execute &amp; Seal Document</button>
                    </div>
                </div>
            </div>
        `;

        // Canvas Setup
        const canvas = document.getElementById('signCanvas');
        const ctx2d = canvas.getContext('2d');
        let currentMode = 'DRAWN';
        let penColor = '#0f172a';
        let isDrawing = false;
        let lastX = 0, lastY = 0;
        let hasDrawn = false;
        let uploadedDataUrl = '';
        let selectedStyle = 1;

        function resize() {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * 2;
            canvas.height = 180 * 2;
            ctx2d.scale(2, 2);
            ctx2d.strokeStyle = penColor;
            ctx2d.lineWidth = 2.5;
            ctx2d.lineCap = 'round';
            ctx2d.lineJoin = 'round';
        }
        resize();

        function getPos(e) {
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
            }
            return { x: e.clientX - rect.left, y: e.clientY - rect.top };
        }

        canvas.onmousedown = (e) => { isDrawing = true; hasDrawn = true; const p = getPos(e); lastX = p.x; lastY = p.y; };
        canvas.onmousemove = (e) => {
            if (!isDrawing) return;
            const p = getPos(e);
            ctx2d.strokeStyle = penColor;
            ctx2d.beginPath();
            ctx2d.moveTo(lastX, lastY);
            ctx2d.lineTo(p.x, p.y);
            ctx2d.stroke();
            lastX = p.x; lastY = p.y;
        };
        canvas.onmouseup = () => isDrawing = false;
        canvas.onmouseleave = () => isDrawing = false;

        canvas.ontouchstart = (e) => { isDrawing = true; hasDrawn = true; const p = getPos(e); lastX = p.x; lastY = p.y; };
        canvas.ontouchmove = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const p = getPos(e);
            ctx2d.strokeStyle = penColor;
            ctx2d.beginPath();
            ctx2d.moveTo(lastX, lastY);
            ctx2d.lineTo(p.x, p.y);
            ctx2d.stroke();
            lastX = p.x; lastY = p.y;
        };
        canvas.ontouchend = () => isDrawing = false;

        document.getElementById('clearCanvasBtn').onclick = () => {
            ctx2d.clearRect(0, 0, canvas.width, canvas.height);
            hasDrawn = false;
        };

        document.getElementById('penBlack').onclick = function() { penColor = '#0f172a'; this.classList.add('active'); document.getElementById('penBlue').classList.remove('active'); };
        document.getElementById('penBlue').onclick = function() { penColor = '#1e40af'; this.classList.add('active'); document.getElementById('penBlack').classList.remove('active'); };

        // Mode Switching
        document.querySelectorAll('#sigModeTab button').forEach(b => {
            b.onclick = () => {
                document.querySelectorAll('#sigModeTab button').forEach(x => x.classList.remove('active'));
                b.classList.add('active');
                currentMode = b.dataset.mode;
                document.getElementById('paneDrawn').style.display = currentMode === 'DRAWN' ? 'block' : 'none';
                document.getElementById('paneTyped').style.display = currentMode === 'TYPED' ? 'block' : 'none';
                document.getElementById('paneUploaded').style.display = currentMode === 'UPLOADED' ? 'block' : 'none';
                document.getElementById('paneAadhaar').style.display = currentMode === 'AADHAAR_ESIGN' ? 'block' : 'none';
            };
        });

        // Typed Mode
        const typedInput = document.getElementById('typedInput');
        typedInput.oninput = () => {
            document.getElementById('typePrev1').textContent = typedInput.value || 'Name';
            document.getElementById('typePrev2').textContent = typedInput.value || 'Name';
        };
        document.getElementById('styleOpt1').onclick = () => { selectedStyle = 1; document.getElementById('styleOpt1').classList.add('selected'); document.getElementById('styleOpt2').classList.remove('selected'); };
        document.getElementById('styleOpt2').onclick = () => { selectedStyle = 2; document.getElementById('styleOpt2').classList.add('selected'); document.getElementById('styleOpt1').classList.remove('selected'); };

        // Upload Mode
        document.getElementById('sigUploadInput').onchange = function() {
            if (this.files[0]) {
                const r = new FileReader();
                r.onload = (ev) => {
                    uploadedDataUrl = ev.target.result;
                    document.getElementById('upPreviewImg').src = uploadedDataUrl;
                    document.getElementById('upPreviewBox').style.display = 'block';
                };
                r.readAsDataURL(this.files[0]);
            }
        };

        // OTP Handler with Anti-Duplicate Cooldown Guard
        const getOtpBtn = document.getElementById('getOtpBtn');
        let otpCooldownTimer = null;
        if (getOtpBtn) {
            getOtpBtn.onclick = async () => {
                if (getOtpBtn.disabled) return;
                getOtpBtn.disabled = true;
                getOtpBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending OTP...';

                try {
                    const r = await api.requestOtp(token);
                    document.getElementById('otpInputArea').style.display = 'block';
                    document.getElementById('otpMsg').innerHTML = `<span class="text-success"><i class="fa-solid fa-envelope-circle-check me-1"></i> ${r.message || 'OTP sent to your email.'}<br><small class="text-muted"><i class="fa-solid fa-clock me-1"></i> Please check your inbox or spam folder. Valid for 10 minutes.</small></span>`;

                    let timeLeft = 60;
                    getOtpBtn.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Resend (${timeLeft}s)`;
                    if (otpCooldownTimer) clearInterval(otpCooldownTimer);
                    otpCooldownTimer = setInterval(() => {
                        timeLeft--;
                        if (timeLeft <= 0) {
                            clearInterval(otpCooldownTimer);
                            getOtpBtn.disabled = false;
                            getOtpBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP Code';
                        } else {
                            getOtpBtn.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Resend (${timeLeft}s)`;
                        }
                    }, 1000);
                } catch (err) {
                    getOtpBtn.disabled = false;
                    getOtpBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-1"></i> Send OTP Code';
                    showToast(err.message, 'danger');
                }
            };
        }

        document.getElementById('verifyOtpBtn').onclick = async () => {
            const code = document.getElementById('signerOtp').value.trim();
            if (!code) { alert('Enter 6-digit code'); return; }
            try {
                await api.verifyOtp(token, code);
                document.getElementById('otpContainer').className = 'p-3 mb-4 rounded-3 border bg-success-subtle border-success';
                document.getElementById('otpText').innerHTML = '<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP Code!';
                document.getElementById('otpInputArea').style.display = 'none';
            } catch (err) {
                document.getElementById('otpMsg').innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${err.message}</span>`;
            }
        };

        // Decline Handler
        document.getElementById('declineBtn').onclick = async () => {
            const reason = prompt('Please specify reason for declining:');
            if (reason) {
                await api.declineSignature(token, reason);
                showToast('Document declined.');
                window.location.reload();
            }
        };

        // Aadhaar e-Sign Handlers
        let isAadhaarVerified = false;
        let aadhaarStampDataUrl = '';

        const spaAadhaarInput = document.getElementById('spaAadhaarInput');
        if (spaAadhaarInput) {
            spaAadhaarInput.oninput = function() {
                let val = this.value.replace(/\D/g, '');
                if (val.length > 12) val = val.substring(0, 12);
                let formatted = '';
                for (let i = 0; i < val.length; i++) {
                    if (i > 0 && i % 4 === 0) formatted += ' ';
                    formatted += val[i];
                }
                this.value = formatted;
            };
        }

        const spaSendAadhaarOtpBtn = document.getElementById('spaSendAadhaarOtpBtn');
        let spaAadhaarCooldownTimer = null;
        if (spaSendAadhaarOtpBtn) {
            spaSendAadhaarOtpBtn.onclick = async () => {
                if (spaSendAadhaarOtpBtn.disabled) return;
                const raw = document.getElementById('spaAadhaarInput').value.replace(/\D/g, '');
                if (raw.length !== 12 || raw.startsWith('0') || raw.startsWith('1')) {
                    alert('Please enter a valid 12-digit Aadhaar number (cannot start with 0 or 1).');
                    return;
                }
                try {
                    spaSendAadhaarOtpBtn.disabled = true;
                    spaSendAadhaarOtpBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-1"></i> Requesting OTP...';
                    const res = await api.requestAadhaarOtp(token, raw);
                    document.getElementById('spaAadhaarOtpRow').style.display = 'block';
                    document.getElementById('spaAadhaarAlert').innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> ${res.message || 'Aadhaar OTP dispatched to linked mobile & email.'}</span>`;

                    let timeLeft = 60;
                    spaSendAadhaarOtpBtn.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Resend (${timeLeft}s)`;
                    if (spaAadhaarCooldownTimer) clearInterval(spaAadhaarCooldownTimer);
                    spaAadhaarCooldownTimer = setInterval(() => {
                        timeLeft--;
                        if (timeLeft <= 0) {
                            clearInterval(spaAadhaarCooldownTimer);
                            spaSendAadhaarOtpBtn.disabled = false;
                            spaSendAadhaarOtpBtn.innerHTML = '<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP';
                        } else {
                            spaSendAadhaarOtpBtn.innerHTML = `<i class="fa-solid fa-clock me-1"></i> Resend (${timeLeft}s)`;
                        }
                    }, 1000);
                } catch (err) {
                    spaSendAadhaarOtpBtn.disabled = false;
                    spaSendAadhaarOtpBtn.innerHTML = '<i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP';
                    document.getElementById('spaAadhaarAlert').innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${err.message}</span>`;
                }
            };
        }

        const spaVerifyAadhaarOtpBtn = document.getElementById('spaVerifyAadhaarOtpBtn');
        if (spaVerifyAadhaarOtpBtn) {
            spaVerifyAadhaarOtpBtn.onclick = async () => {
                const raw = document.getElementById('spaAadhaarInput').value.replace(/\D/g, '');
                const code = document.getElementById('spaAadhaarOtpCode').value.trim();
                if (code.length !== 6) {
                    alert('Please enter 6-digit Aadhaar OTP code.');
                    return;
                }
                try {
                    const res = await api.verifyAadhaarOtp(token, raw, code);
                    isAadhaarVerified = true;
                    aadhaarStampDataUrl = res.signatureData;
                    document.getElementById('spaAadhaarForm').style.display = 'none';
                    document.getElementById('spaAadhaarSuccess').style.display = 'block';
                    document.getElementById('spaAadhaarDetails').innerHTML = `<strong>UID:</strong> ${res.maskedAadhaar} &bull; <strong>Txn:</strong> ${res.txnId}`;
                    document.getElementById('spaAadhaarStampImg').src = res.signatureData;

                    document.getElementById('otpContainer').className = 'p-3 mb-4 rounded-3 border bg-success-subtle border-success';
                    document.getElementById('otpText').innerHTML = '<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via UIDAI Aadhaar e-KYC!';
                    document.getElementById('otpInputArea').style.display = 'none';

                    document.getElementById('legalConsent').checked = true;
                    showToast('Aadhaar identity verified successfully!');
                } catch (err) {
                    document.getElementById('spaAadhaarAlert').innerHTML = `<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${err.message}</span>`;
                }
            };
        }

        // Execute Signature Handler
        document.getElementById('executeBtn').onclick = async () => {
            if (!document.getElementById('legalConsent').checked) {
                alert('You must accept the legal consent agreement under IT Act 2000.');
                return;
            }

            let sigData = '';
            if (currentMode === 'DRAWN') {
                if (!hasDrawn) { alert('Please draw your signature.'); return; }
                sigData = canvas.toDataURL('image/png');
            } else if (currentMode === 'TYPED') {
                const name = typedInput.value.trim();
                if (!name) { alert('Enter your legal name.'); return; }
                const rc = document.createElement('canvas');
                rc.width = 400; rc.height = 100;
                const rCtx = rc.getContext('2d');
                rCtx.fillStyle = '#ffffff'; rCtx.fillRect(0, 0, 400, 100);
                rCtx.fillStyle = '#0f172a';
                rCtx.font = selectedStyle === 1 ? '48px "Great Vibes", cursive' : '44px "Dancing Script", cursive';
                rCtx.textAlign = 'center'; rCtx.textBaseline = 'middle';
                rCtx.fillText(name, 200, 50);
                sigData = rc.toDataURL('image/png');
            } else if (currentMode === 'UPLOADED') {
                if (!uploadedDataUrl) { alert('Please upload signature image.'); return; }
                sigData = uploadedDataUrl;
            } else if (currentMode === 'AADHAAR_ESIGN') {
                if (!isAadhaarVerified) {
                    alert('Please enter your 12-digit Aadhaar number and verify with OTP before executing.');
                    return;
                }
                sigData = aadhaarStampDataUrl;
            }

            try {
                await api.submitSignature(token, {
                    signatureData: sigData,
                    signatureType: currentMode,
                    typedName: typedInput.value.trim(),
                    consentAccepted: true
                });

                container.innerHTML = `
                    <div class="d-flex align-items-center justify-content-center py-5">
                        <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 580px; border-radius: 16px;">
                            <div class="rounded-circle bg-success-subtle text-success mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; font-size: 2rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h3 class="fw-bold mb-2">Signature Recorded &amp; Sealed!</h3>
                            <p class="text-muted mb-4">Thank you, <strong>${ctx.signerName}</strong>. Your electronic signature has been cryptographically sealed under Section 10A of the IT Act 2000.</p>
                            <div class="d-flex justify-content-center gap-2">
                                <a href="${api.getSigningPreviewUrl(token)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-file-pdf me-1"></i> View Executed PDF</a>
                                <a href="#/verify" class="btn btn-primary btn-sm"><i class="fa-solid fa-shield-halved me-1"></i> Public Ledger Verification</a>
                            </div>
                        </div>
                    </div>
                `;
            } catch (err) {
                showToast(err.message, 'danger');
            }
        };

    } catch (err) {
        container.innerHTML = `<div class="container py-5 text-center"><h4>Invalid or expired signing link</h4><p class="text-muted small">${err.message}</p><a href="#/" class="btn btn-primary">Go to Home</a></div>`;
    }
}

// 10. Public Verification View (FR-13)
async function renderVerify(container, initialHash = '') {
    container.innerHTML = `
        <div class="container py-5" style="max-width: 860px;">
            <div class="text-center mb-4">
                <div class="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill mb-2">
                    <i class="fa-solid fa-shield-halved me-1"></i> Independent Cryptographic Verification
                </div>
                <h3 class="fw-bold">Verify Document Authenticity</h3>
                <p class="text-muted small mx-auto" style="max-width: 620px;">
                    Confirm tamper-evident integrity, electronic execution validity, and complete audit chain under Section 10A of the Indian Information Technology Act, 2000.
                </p>
            </div>

            <div class="card border-0 shadow-sm bg-white p-4 mb-4">
                <form id="verifyForm">
                    <div class="input-group">
                        <input type="text" id="verifyHashInput" class="form-control" placeholder="Enter 64-character SHA-256 hash or Document ID..." value="${initialHash || ''}" required>
                        <button type="submit" class="btn btn-primary px-4 fw-semibold"><i class="fa-solid fa-magnifying-glass me-1"></i> Verify Hash</button>
                    </div>
                </form>
            </div>

            <div id="verifyResultArea"></div>
        </div>
    `;

    const area = document.getElementById('verifyResultArea');

    async function executeVerification(hash) {
        area.innerHTML = `<div class="p-4 text-center"><i class="fa-solid fa-spinner fa-spin fs-3 text-primary"></i></div>`;
        try {
            const res = await api.verifyHash(hash);
            area.innerHTML = `
                <div class="card border-0 shadow-sm p-4 mb-4 ${res.verified ? 'bg-success-subtle border border-success' : 'bg-danger-subtle border border-danger'}">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-${res.verified ? 'circle-check text-success' : 'circle-xmark text-danger'} fs-1 me-3"></i>
                        <div>
                            <h5 class="fw-bold mb-1 ${res.verified ? 'text-success' : 'text-danger'}">${res.verified ? 'CRYPTOGRAPHICALLY VERIFIED &amp; AUTHENTIC' : 'VERIFICATION FAILED'}</h5>
                            <p class="mb-0 small">${res.statusMessage}</p>
                        </div>
                    </div>
                </div>

                ${res.verified ? `
                    <div class="card border-0 shadow-sm bg-white p-4 mb-4">
                        <h5 class="fw-bold mb-1">${res.title}</h5>
                        <div class="text-muted small mb-3">Issued by <strong>${res.senderName}</strong> (${res.organizationName})</div>

                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <div class="small fw-bold text-muted text-uppercase mb-1">Final Sealed SHA-256 Hash</div>
                                <div class="hash-box text-success fw-bold">${res.finalHash || 'Pending'}</div>
                            </div>
                            <div class="col-md-6">
                                <div class="small fw-bold text-muted text-uppercase mb-1">Original Draft SHA-256 Hash</div>
                                <div class="hash-box text-muted">${res.originalHash || 'N/A'}</div>
                            </div>
                        </div>

                        <h6 class="fw-bold text-primary mb-2">Verified Signatories</h6>
                        <div class="table-responsive mb-4">
                            <table class="table table-sm table-hover align-middle">
                                <thead class="table-light small text-muted text-uppercase">
                                    <tr><th>Signer</th><th>OTP</th><th>Mode</th><th>Timestamp (IST)</th><th>IP</th></tr>
                                </thead>
                                <tbody>
                                    ${res.signers && res.signers.length > 0 ? res.signers.map(s => `
                                        <tr>
                                            <td><div class="fw-bold">${s.name}</div><div class="small text-muted">${s.email}</div></td>
                                            <td>${s.otpVerified ? '<span class="badge bg-success-subtle text-success">Passed</span>' : '<span class="badge bg-light text-muted">Pending</span>'}</td>
                                            <td><span class="badge bg-light text-dark">${s.signatureType}</span></td>
                                            <td class="small">${s.signedAt ? new Date(s.signedAt).toLocaleString('en-IN') : '-'}</td>
                                            <td class="font-monospace small text-muted">${s.ipAddress}</td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="5" class="text-center py-2 text-muted">No signatures executed yet.</td></tr>'}
                                </tbody>
                            </table>
                        </div>

                        <h6 class="fw-bold text-primary mb-2">Chained Audit Ledger</h6>
                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle font-monospace" style="font-size: 0.78rem;">
                                <thead class="table-light text-muted text-uppercase">
                                    <tr><th>Time</th><th>Action</th><th>Details</th><th>Block Hash</th></tr>
                                </thead>
                                <tbody>
                                    ${res.auditEvents && res.auditEvents.length > 0 ? res.auditEvents.map(e => `
                                        <tr>
                                            <td class="text-nowrap text-muted">${new Date(e.timestamp).toLocaleTimeString('en-IN')}</td>
                                            <td><span class="badge bg-light text-dark">${e.action}</span></td>
                                            <td style="font-family: sans-serif;">${e.details}</td>
                                            <td class="text-success fw-bold">${e.currentHash ? e.currentHash.substring(0, 10) + '...' : '-'}</td>
                                        </tr>
                                    `).join('') : '<tr><td colspan="4" class="text-center py-2 text-muted">No audit events recorded.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : ''}
            `;
        } catch (err) {
            area.innerHTML = `<div class="alert alert-danger">${err.message}</div>`;
        }
    }

    if (initialHash) {
        executeVerification(initialHash);
    }

    document.getElementById('verifyForm').onsubmit = (e) => {
        e.preventDefault();
        const hash = document.getElementById('verifyHashInput').value.trim();
        if (hash) executeVerification(hash);
    };
}

// 11. Admin Console View
async function renderAdmin(container) {
    if (state.user?.role !== 'ADMIN') {
        container.innerHTML = `
            <div class="container py-5 text-center" style="max-width: 540px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white text-center">
                    <i class="fa-solid fa-lock text-danger fs-1 mb-3"></i>
                    <h4 class="fw-bold mb-2">Administrator Access Required</h4>
                    <p class="text-muted small mb-4">
                        You are currently signed in as <strong>${state.user?.fullName || 'User'}</strong> (Role: ${state.user?.role || 'SIGNER'}).
                        Only accounts with the <strong>ADMIN</strong> role can access user administration and system audit ledgers.
                    </p>
                    <div class="d-flex justify-content-center gap-2">
                        <button id="switchAdminBtn" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-shield me-1"></i> Log in as Admin (admin@esign.com)</button>
                        <a href="#/dashboard" class="btn btn-outline-secondary btn-sm">Back to Dashboard</a>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('switchAdminBtn').onclick = async () => {
            try {
                const auth = await api.login('admin@esign.com', 'admin123');
                api.setToken(auth.token);
                api.setUser(auth);
                state.user = auth;
                showToast('Switched to Administrator session!');
                renderAdmin(container);
            } catch (err) {
                showToast(err.message, 'danger');
            }
        };
        return;
    }

    container.innerHTML = `<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>`;

    try {
        const users = await api.getAdminUsers();

        container.innerHTML = `
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 class="fw-bold mb-1"><i class="fa-solid fa-users-gear text-danger me-2"></i> User Administration</h4>
                        <p class="text-muted small mb-0">Manage users, organizations, access privileges, and activation states.</p>
                    </div>
                </div>

                <div class="card border-0 bg-white shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">User</th>
                                    <th>Organization</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th class="text-end pe-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold">${u.fullName}</div>
                                            <div class="small text-muted">${u.email}</div>
                                        </td>
                                        <td class="small">${u.organization}</td>
                                        <td><span class="badge ${u.role === 'ADMIN' ? 'bg-danger-subtle text-danger' : 'bg-primary-subtle text-primary'}">${u.role}</span></td>
                                        <td><span class="badge ${u.enabled ? 'bg-success-subtle text-success' : 'bg-secondary-subtle text-secondary'}">${u.enabled ? 'Active' : 'Disabled'}</span></td>
                                        <td class="small text-muted">${new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                        <td class="text-end pe-3">
                                            <button class="btn btn-sm btn-outline-secondary toggle-btn" data-id="${u.id}">${u.enabled ? 'Disable' : 'Enable'}</button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;

        document.querySelectorAll('.toggle-btn').forEach(b => {
            b.onclick = async () => {
                await api.toggleUserStatus(b.dataset.id);
                showToast('User status updated');
                renderAdmin(container);
            };
        });
    } catch (err) {
        showToast(err.message, 'danger');
    }
}

// Initial Boot
render();

