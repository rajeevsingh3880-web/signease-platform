# SignEase — Multi-Tier E-Sign Platform

A full-stack, legally defensible electronic signature and contract platform built in accordance with the **India E-Sign Platform Requirements Document (IT Act 2000 Section 10A & Evidence Act 1872)**.

The project is cleanly separated into three independent folders:

```
d:\digital sign\
├── database/        # PostgreSQL schemas, seed data, docker compose & setup scripts
├── backend/         # Java 17 + Spring Boot 3.2 REST API + PDFBox & JWT Security
├── frontend/        # Dedicated SPA (Vite + Modern UI + Canvas Signing Pad)
└── run-all.bat      # 1-Click launcher starting both backend & frontend in parallel
```

---

## 🗄️ 1. Database (`/database`)

Dedicated database folder with complete PostgreSQL DDL definitions and initial seed data:
- **`schema.sql`**: Full DDL schema (9 tables: `organizations`, `users`, `documents`, `signing_requests`, `signer_invites`, `document_fields`, `signatures`, `audit_logs`, `webhooks`)
- **`seed-data.sql`**: Initial organization, System Admin, and Demo Sender accounts
- **`docker-compose.yml`**: One-command PostgreSQL 15 + pgAdmin 4 Docker container
- **`setup-postgres.bat`**: Windows script to create and seed local PostgreSQL via `psql`

### How to Run:
- **Using Docker**:
  ```cmd
  cd database
  docker compose up -d
  ```
  *(Starts PostgreSQL on `localhost:5432` and pgAdmin web console at `http://localhost:5050`)*
- **Using Local PostgreSQL**:
  ```cmd
  cd database
  .\setup-postgres.bat
  ```

---

## ⚙️ 2. Backend (`/backend`)

A pure Spring Boot 3.2 REST API with Java 17, Spring Data JPA, Spring Security 6 (Stateless JWT), and Apache PDFBox 3:
- **Pure REST APIs** under `/api/v1/`:
  - `/api/v1/auth/**`: Login, Register, Profile
  - `/api/v1/documents/**`: Upload (PDF up to 25MB), List, Details, Download, Cancel
  - `/api/v1/signing/**`: Create requests, OTP generation & verification, Signature submission (Draw, Type, Upload), Sealing with Audit Trail Certificate
  - `/api/v1/verify/**`: Public independent hash verification portal
  - `/api/v1/dashboard/**`: Real-time KPI counters & chained audit ledger
  - `/api/v1/admin/**`: User management & system-wide logs
- **CORS Enabled**: Configured to accept cross-origin requests from the frontend SPA.
- **Self-Contained Maven**: Includes bundled `.mvn-bin` and `mvnw.cmd`.

### How to Run:
```cmd
cd backend
.\run.bat       # Runs with PostgreSQL (port 5432)
.\run-dev.bat   # Runs with In-Memory DB (Instant testing without PostgreSQL)
```
*(Server listens on `http://localhost:8080`)*

---

## 💻 3. Frontend (`/frontend`)

A modern, responsive Single Page Application (SPA) powered by Vite, HTML5 Canvas, Bootstrap 5.3, and Font Awesome:
- **Zero-Install Mobile Signer Experience** (NFR-8): External signers do not need an account or app; they open the link on any phone or browser.
- **OTP Verification Flow** (FR-07): Signers verify identity with a 6-digit passcode.
- **Multi-Modal Signature Pad** (FR-06):
  - **Draw**: Interactive touch/mouse drawing canvas with clear, color choice, and undo
  - **Type**: Renders typed name into Great Vibes / Dancing Script cursive fonts
  - **Upload**: Scanned handwritten signature image upload
- **Legal Declaration**: Explicit checkbox agreeing to execution under Section 10A of the IT Act 2000.
- **Public Verification Portal** (`#/verify`): Paste any SHA-256 hash or upload a sealed PDF to verify authenticity and view the cryptographic audit chain.

### How to Run:
```cmd
cd frontend
.\run-frontend.bat
```
*(Or manually: `npm install` followed by `npm run dev`)*
*(Frontend dev server opens at `http://localhost:5173`)*

---

## 🚀 1-Click Launch All
To start both backend and frontend simultaneously:
```cmd
cd "d:\digital sign"
.\run-all.bat
```

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Password | Description |
|---|---|---|---|
| **System Admin** | `admin@esign.com` | `admin123` | User administration & system audit logs |
| **Demo Sender** | `demo@esign.com` | `password123` | Business user for uploading, routing, and sending agreements |

*(The login page features 1-click quick-fill buttons for both test accounts!)*

