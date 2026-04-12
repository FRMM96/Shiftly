# Baudix — Next Steps Roadmap (April 2026)

_This document consolidates the remaining work identified from a full codebase audit cross-referenced against `strategy.md` and `full_stack_completion_strategy.md`. It is the single source of truth for what's left to do._

**Guiding Principle:** Every feature must be fully functional locally via `docker compose up` before any cloud provisioning begins. No paid services until the local stack is verified end-to-end.

---

## Completed Work (Confirmed by Audit)

All items below have been verified against the actual codebase — not just documented as "done" but confirmed present and functional.

| Area | Status | Evidence |
|------|--------|----------|
| Core Marketplace Loop (shifts, apply, approve) | ✅ Done | `shift.controller.js`, `marketplace.controller.js`, full frontend views |
| Clock In/Out with Geolocation | ✅ Done | `clock.controller.js`, `geolocationService.js` (Capacitor + browser fallback) |
| Time Off & Sick Leave | ✅ Done | `timeoff.controller.js`, `sick.controller.js`, manager approval flows |
| Shift Swaps | ✅ Done | `swap.controller.js`, 3-step proposal flow |
| Analytics & Reporting (Phase 1) | ✅ Done | `analytics.controller.js` (5 endpoints), Chart.js bar charts in both dashboards |
| Document Management (Phase 2) | ✅ Done | `multer` upload, `storageService.js` (local), full CRUD + frontend views |
| Notifications Center (Phase 3) | ✅ Done | Single `notification.controller.js`, deep-links via `actionUrl`, bell badge, tabs |
| Docker & CI (Phase 4) | ✅ Done | Multi-stage Dockerfiles, `docker-compose.yml` (4 services), GitHub Actions CI |
| Linting & Logging (Phase 5 partial) | ✅ Done | ESLint + Prettier (both dirs), Pino structured logging |
| WebSockets (Phase 7) | ✅ Done | `socket.io` with JWT auth, room-based messaging, real-time notification push |
| Offline Caching (Phase 7) | ✅ Done | `@capacitor/preferences`, `offlineCache.js` for schedule + user context |
| Global Error Handling (Phase 7) | ✅ Done | `AppToast.vue` + axios interceptor for 500s and network failures |
| Security Baseline | ✅ Done | JWT auth, Zod (12 schemas), Helmet, CORS, 1MB JSON limit |
| Email Infrastructure | ✅ Done | `mailer.js` with Nodemailer, SMTP configured, graceful fallback |

---

## Phase A: Branding & Identity

Rename the app from **Radix** to **Baudix** across the entire codebase.

- [ ] Update `Frontend/capacitor.config.json` — change `appId` from `com.radix.app` to `com.baudix.app` and `appName` from `Radix` to `Baudix`
- [ ] Search for any remaining "Radix" references in frontend/backend and update them
- [ ] Update page titles, meta tags, and any hardcoded app name strings

---

## Phase B: Pre-Launch Hardening

These items must be completed before any deployment or cloud migration. The goal is a fully verified, production-grade local stack.

### B.1 — Security

- [ ] **Replace JWT_SECRET placeholder.** The `.env` file still contains `"super_secret_change_me"`. Generate a strong secret via `openssl rand -base64 32`. The `.env.example` already has proper guidance.
- [ ] **Extend rate limiting to all API routes.** Currently only `/api/auth` is rate-limited (30 req/15min). Add a global rate limiter with sensible defaults for all endpoints, plus stricter limits on sensitive operations.

### B.2 — Test Coverage Expansion

Only 2 test files exist today:
1. `Backend/tests/core-flow.test.js` — integration test (register → login → create shift → apply)
2. `Frontend/tests/documentStore.test.js` — unit test for document store

**Target:** Cover all major backend flows with integration tests:
- [ ] Clock In/Out flow (clock in → clock out → verify ClockEvent records)
- [ ] Time Off request flow (create → manager approve/reject)
- [ ] Sick Leave flow (report → acknowledge)
- [ ] Shift Swap flow (propose → accept/reject)
- [ ] Document upload/download/delete flow
- [ ] Notification creation and read/unread toggling
- [ ] Analytics endpoint accuracy (verify aggregation math)

**Frontend:** Add component tests for critical views:
- [ ] Worker marketplace (shift list, apply action)
- [ ] Manager applicant review (accept/reject)
- [ ] Notifications panel (filtering, mark-all-read)

### B.3 — S3 Storage Provider Implementation

`Backend/src/services/storageService.js` currently only implements local disk storage. The S3 path is mentioned in comments but not coded.

- [ ] Install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
- [ ] Implement the S3 branch in `storageService.js` behind `STORAGE_PROVIDER=s3`
- [ ] Add `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT` to `.env.example`
- [ ] Verify local storage still works unchanged when `STORAGE_PROVIDER=local`

### B.4 — Local Stack Verification

- [ ] Run `docker compose up` from a clean state — all 4 services (db, migrate, api, frontend) must start without errors
- [ ] Run full test suites inside containers
- [ ] Manual smoke test of every core workflow through the UI
- [ ] Verify WebSocket notifications fire correctly in Docker environment

---

## Phase C: Push Notifications (Remaining from Phase 6)

Geolocation is done, but push notifications were deferred. This is the remaining mobile work before cloud deployment.

- [ ] **Backend:** Install `firebase-admin`. Create a `DeviceToken` Prisma model (`id`, `userId`, `token`, `platform`, `createdAt`). New endpoint `POST /api/devices/register`.
- [ ] **Backend:** Attach FCM dispatch to the existing `notification.js` helper — when a notification is created, also push via FCM if the user has a registered device token.
- [ ] **Frontend:** Install `@capacitor/push-notifications`. Request permission and register device token on post-login mount. Handle foreground banners and background system tray alerts.
- [ ] Test with real device (iOS Simulator / Android Emulator at minimum).

---

## Phase 8: Cloud Infrastructure Provisioning

> **Gate:** Do not start this phase until Phases A, B, and C are complete and the local stack passes all verification checks.

### 8.1 — Database
- [ ] Migrate local PostgreSQL to a managed provider (Supabase free tier or Neon free tier)
- [ ] Update `DATABASE_URL` for production environment
- [ ] Run `prisma migrate deploy` against remote DB and verify schema

### 8.2 — Backend API
- [ ] Deploy Express server to Render or Railway
- [ ] Configure environment variables: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `STORAGE_PROVIDER`, `S3_*` vars, `SMTP_*` vars
- [ ] Verify WebSocket connections work through the hosting provider's proxy

### 8.3 — Object Storage
- [ ] Provision S3-compatible bucket (AWS S3 or Cloudflare R2)
- [ ] Set `STORAGE_PROVIDER=s3` in production env and configure bucket credentials
- [ ] Test document upload/download through the deployed API

### 8.4 — Frontend Hosting
- [ ] Deploy Vite SPA to Vercel or Netlify
- [ ] Set `VITE_API_BASE_URL` to production backend URL
- [ ] Verify CORS and WebSocket connections from hosted frontend to hosted backend

### 8.5 — Continuous Deployment
- [ ] Extend `.github/workflows/ci.yml` with CD steps (currently CI only — no auto-deploy)
- [ ] Configure auto-deploy on merge to `main` for both backend and frontend

---

## Phase 9: Enterprise & Payroll Integrations

### 9.1 — Payroll Exporting
- [ ] Build controllers to export aggregated time-and-attendance data (`ClockEvent` records) as CSV and PDF
- [ ] Target compatibility with Gusto, ADP, and Paychex formats
- [ ] Manager-only UI to select date range and export

### 9.2 — SSO Authentication
- [ ] Introduce SAML / OAuth support for Enterprise Single Sign-On
- [ ] Target providers: Microsoft Entra, Google Workspace
- [ ] Maintain existing email/password auth as fallback

### 9.3 — Email Notifications (Quick Win)
- [ ] `Backend/src/lib/mailer.js` already exists with Nodemailer configured. Wire it into key workflows:
  - Shift application received (notify manager)
  - Application approved/rejected (notify worker)
  - Swap request received (notify target worker)
  - Time off approved/rejected (notify worker)

---

## Phase 10: Advanced Smart Scheduling

- [ ] **Smart Matching:** Auto-suggest workers to managers based on attendance rates, reliability scores, and historical shift matches
- [ ] **Auto-Approval Rules:** Allow managers to set thresholds for auto-approving low-priority shifts based on worker criteria
- [ ] **Prerequisite:** Sufficient analytics data must be accumulated before matching algorithms can be meaningful

---

## Phase 11: Real-Device Mobile App Release

- [ ] **Push Notifications:** Depends on Phase C being complete
- [ ] **App Store Submission:** Generate iOS and Android native builds using the Capacitor project (now branded as Baudix)
- [ ] **App Store / Google Play review:** Prepare store listings, screenshots, and privacy policy

---

## Phase 12: Platform Maturity

These are gaps identified in the audit that round out the platform for enterprise readiness.

- [ ] **Audit Logging:** Record a trail for shift approvals, denials, modifications, and sensitive admin actions. New `AuditLog` Prisma model.
- [ ] **Admin Panel:** Build admin-specific routes and views for company management, user management, and system-level configuration. The current `BOSS` role covers managers — consider a new `ADMIN` role or a super-admin flag.
- [ ] **Bulk Operations:** Bulk shift creation (e.g., recurring weekly schedules), bulk approval of applications to reduce manager friction.

---

## Priority Order

| Priority | Phase | Focus | Gate |
|----------|-------|-------|------|
| 1 | **A** | Branding (Radix → Baudix) | — |
| 2 | **B** | Pre-Launch Hardening | — |
| 3 | **C** | Push Notifications | — |
| 4 | **8** | Cloud Infrastructure | Phases A+B+C complete, local stack verified |
| 5 | **9** | Enterprise & Payroll | Phase 8 deployed |
| 6 | **10** | Smart Scheduling | Sufficient data in production |
| 7 | **11** | Mobile App Release | Phases C+8 complete |
| 8 | **12** | Platform Maturity | Ongoing, can parallel with 9–11 |
