# SignEase — Digital Signature Platform (Java Spring Boot + PostgreSQL)

A full-stack, legally defensible electronic signature and contract execution platform for Indian SMEs, lenders, and enterprises, built with **Java 17, Spring Boot 3.2, and PostgreSQL**, compliant with **Section 10A of the Information Technology Act, 2000** and the **Indian Contract Act, 1872**.

---

## 🌟 Key Features (Matched to Business Requirements Document)

| Requirement | Implementation |
|---|---|
| **BO-1 Turnaround Under 30 Mins** | Effortless multi-party document upload, field placement, and instant email delivery with expiring unique tokens. |
| **BO-2 100% Legally Defensible** | Tamper-evident cryptographic ledger where every event is hashed and chained with `prev_hash`. Final sealed PDF carries an **Official Audit Trail Certificate**. |
| **BO-3 5-Minute Onboarding** | One-click demo sender & admin logins, instant sample PDF generation, and intuitive wizard. |
| **FR-06 Multi-Modal Signature** | External signers can **Draw** (HTML5 touch/mouse canvas), **Type** (rendered in Great Vibes & Dancing Script cursive scripts), or **Upload** scanned signature image. |
| **FR-07 Signer OTP Verification** | 6-digit One-Time Passcode sent to signer's email/SMS with rate limiting and automated verification. |
| **FR-08 Sealed PDF Output** | Apache PDFBox stamps signatures at target coordinates and appends a tamper-proof **Completion & Audit Trail Certificate** page with SHA-256 fingerprints. |
| **FR-09 Chained Audit Ledger** | Immutable audit table storing `prev_hash` $\to$ `current_hash` (blockchain-like integrity) recording signer IP, user agent, action, and timestamp. |
| **FR-13 Public Hash Verification** | Public `/verify` portal where auditors, banks, and legal teams can paste a SHA-256 hash or upload any PDF to verify authenticity. |
| **FR-14 & FR-15 REST API & Webhooks** | API endpoints for programmatic document upload, dispatch, status polling, and signed webhook event dispatching. |
| **NFR-8 Mobile-First Signing** | External signers require **no account or app install** — works directly in any smartphone or desktop browser. |

---

## 🏗️ Architecture & Technology Stack

- **Backend Framework**: Spring Boot 3.2.0 (Java 17)
- **Database**: PostgreSQL (with support for local in-memory H2 fallback in DEV mode)
- **Database Migrations**: Flyway (Scripts located in `src/main/resources/db/migration/`)
- **Security**: Spring Security 6 (Hybrid: Session-based for Web UI + Stateless JWT for REST API)
- **PDF Engine**: Apache PDFBox 3.0.1 (coordinate stamping + Audit Certificate generation)
- **Frontend / Templating**: Thymeleaf + Bootstrap 5.3 + Font Awesome 6 + HTML5 Canvas
- **Email Notifications**: Spring Mail (MimeMessage with Thymeleaf HTML email templates)

---

## 📁 Project Structure

```
d:\digital sign\esign-platform\
├── pom.xml                                   # Maven configuration with all dependencies
├── mvnw.cmd                                  # Self-contained Maven wrapper
├── run.bat                                   # 1-click startup script (PostgreSQL mode)
├── run-dev.bat                               # 1-click startup script (In-Memory Dev mode)
├── README.md
├── src/main/
│   ├── java/com/esign/platform/
│   │   ├── EsignPlatformApplication.java     # Main Spring Boot entrypoint
│   │   ├── config/
│   │   │   ├── SecurityConfig.java           # Spring Security 6 + Public & Protected endpoints
│   │   │   ├── WebConfig.java                # CORS, Multipart upload & Static handlers
│   │   │   └── DataInitializer.java          # Auto-seeds default Admin & Demo users on startup
│   │   ├── controller/
│   │   │   ├── AuthController.java           # Login, Registration & JWT API
│   │   │   ├── DashboardController.java      # Dashboard metrics & Recent Activity
│   │   │   ├── DocumentController.java       # Document Upload, View, Download, Cancel
│   │   │   ├── SigningController.java        # Public Signer Flow, OTP & Signature Pad
│   │   │   ├── VerificationController.java   # Public /verify Ledger Portal
│   │   │   ├── AdminController.java          # User Management & System Audit Log
│   │   │   └── ApiDocumentController.java    # REST API v1 for third-party integrations
│   │   ├── dto/                              # DTO records for requests & responses
│   │   ├── exception/                        # Global exception handlers
│   │   ├── model/
│   │   │   ├── User.java                     # Signers, Admins, Viewers
│   │   │   ├── Organization.java             # Business workspace & plan
│   │   │   ├── Document.java                 # Status machine, SHA-256 hashes, file metadata
│   │   │   ├── DocumentField.java            # Field placements (Signature, Date, Text, Checkbox)
│   │   │   ├── SigningRequest.java           # Request container & due dates
│   │   │   ├── SignerInvite.java             # Token, OTP verification & signer states
│   │   │   ├── Signature.java                # Signature data (Base64), mode & legal basis
│   │   │   ├── AuditLog.java                 # Chained hash immutable ledger
│   │   │   └── Webhook.java                  # Integrations & webhook subscriptions
│   │   ├── repository/                       # Spring Data JPA repositories
│   │   ├── security/                         # JWT Token Provider & Filter
│   │   └── service/
│   │       ├── AuthService.java              # User registration & JWT auth
│   │       ├── DocumentService.java          # PDF file handling & hash computation
│   │       ├── SigningService.java           # Signing workflow & sealing orchestration
│   │       ├── PdfService.java               # PDFBox stamping & Certificate generator
│   │       ├── HashService.java              # SHA-256 cryptographic utility
│   │       ├── AuditService.java             # Tamper-evident hash chaining engine
│   │       ├── VerificationService.java      # Public ledger inspector
│   │       └── EmailService.java             # HTML invite & notification emails
│   └── resources/
│       ├── application.yml                   # PostgreSQL default configuration
│       ├── application-dev.yml               # H2 In-Memory rapid testing configuration
│       ├── db/migration/                     # Flyway SQL migrations (V1 to V4)
│       └── templates/                        # Modern responsive Thymeleaf templates
│           ├── layout.html                   # Master layout with navbar & alerts
│           ├── index.html                    # Public landing page
│           ├── login.html                    # Login page with 1-click test credentials
│           ├── register.html                 # Organization workspace registration
│           ├── dashboard.html                # KPI metrics & ledger feed
│           ├── verify.html                   # Public document verification portal
│           ├── documents/                    # list.html, upload.html, view.html
│           ├── signing/                      # request.html, sign.html, completed.html
│           ├── admin/                        # users.html, audit-logs.html, documents.html
│           └── email/                        # HTML email templates
```

---

## 🚀 How to Run

### Option 1: Running with PostgreSQL (Production / Standard Mode)

1. Make sure **PostgreSQL** is running on your machine (port `5432`).
2. Create the database:
   ```sql
   CREATE DATABASE esign_db;
   ```
3. Open a terminal in `D:\digital sign\esign-platform` and run:
   ```cmd
   .\run.bat
   ```
   *(or `.\mvnw.cmd spring-boot:run`)*

---

### Option 2: Rapid DEV Mode (Zero-Setup In-Memory Mode)

If PostgreSQL is not currently installed or running, you can launch immediately in DEV mode using the built-in database:
```cmd
.\run-dev.bat
```
*(or `.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=dev`)*

---

## 🔑 Default Credentials

The platform automatically initializes the following accounts upon startup:

| Account | Email | Password | Role | Description |
|---|---|---|---|---|
| **System Admin** | `admin@esign.com` | `admin123` | `ADMIN` | Full access to users, system audit logs, and documents. |
| **Demo Sender** | `demo@esign.com` | `password123` | `SIGNER` | Standard business user for uploading and sending contracts. |

> **Tip**: The login page includes quick **1-click fill buttons** to automatically load test credentials!

---

## 📱 Walkthrough: End-to-End Signing Workflow

1. **Sign In**: Go to `http://localhost:8080/login` and log in as `demo@esign.com`.
2. **Upload PDF**: Click **Upload**, pick a PDF (or leave empty to auto-generate a sample agreement).
3. **Configure Signers**: In the **Send for Signature** wizard:
   - Enter Signer Name, Email, and Mobile number.
   - Choose **Sequential** or **Parallel** routing.
   - Click **Send Signing Invites**.
4. **Signer Experience (No login required)**:
   - On the document details page, click the **Open Signer Page** button.
   - **Step 1 (OTP Verification)**: Click *Send OTP Code*, enter the 6-digit code (shown on screen in dev mode), and click *Verify Code*.
   - **Step 2 (Adopt Signature)**: Choose **Draw** (using mouse/touch pad), **Type** (rendered in beautiful cursive font), or **Upload** an image.
   - **Step 3 (Legal Consent)**: Check the declaration under Section 10A of the IT Act 2000.
   - Click **Execute & Seal Document**.
5. **Sealed PDF & Audit Certificate**:
   - The document status moves to **COMPLETED**.
   - Download the **Sealed PDF** to see the merged signatures and the generated **Completion & Audit Trail Certificate** page.
6. **Public Verification**:
   - Copy the document's final SHA-256 hash.
   - Navigate to `http://localhost:8080/verify`, paste the hash (or upload the sealed PDF), and observe the verified ledger status!

---

## ⚖️ Legal Standing under Indian Law

- **Contract Law Electronic Signature**: Fully recognized under **Section 10A of the Information Technology Act, 2000** ("Validity of contracts formed through electronic means") and Section 10 of the Indian Contract Act, 1872.
- **Evidentiary Admissibility**: Tamper-evident chained audit ledger meets the electronic record admissibility criteria under **Section 65B of the Indian Evidence Act, 1872**.
- **Clear Disclosure**: In accordance with NFR-1, every signature is labeled with its legal basis and execution timestamp.

