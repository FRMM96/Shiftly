# Baudix Workforce Management Platform — Current Strategy (Updated April 2026)

## Executive Summary

The Baudix platform has successfully transitioned from a static UI prototype to a connected, full-stack application. The core "Marketplace Loop" (Auth, Shift Creation, Applying, and Approval) is fully functional and stable, backed by a Node.js/Express API and a PostgreSQL database via Prisma.

As of April 2026, the comprehensive roadmap focusing on Analytics, Document Management, Real-Time Sync, Containerization, and Native Mobile foundations has been fully executed. The strategic focus now shifts from **feature development** to **Hardening, Cloud Provisioning, Enterprise Scaling, and V1 Launch**.

> **Guiding Principle — Local-First Development:** Every feature must be fully functional using only free, local tooling (local PostgreSQL, local filesystem, Docker Compose). Cloud providers are treated as a deployment-time configuration swap, not a development dependency. No cloud work begins until the local stack is verified end-to-end.

---

## 1. Current State Audit (What's Done)

The application has achieved substantial completion of its primary phases, operating as a Local-First full-stack system.

- **Core Workflows:** Creating shifts, applying, approvals, Clock In/Out (with geolocation), Time Off, Sick Leave, and Shift Swaps are fully wired up.
- **Analytics & Reporting:** Real-time KPI aggregation and charting (Chart.js via Vue wrappers) are fully operational across manager and worker dashboards.
- **Document Management:** Local-first storage (`multer`) is implemented with `storageService.js` abstracting storage operations. S3 migration path is planned but not yet coded — local storage only.
- **Real-Time Sync & Notifications:** WebSockets (`socket.io`) with JWT-authenticated connections broadcast immediate state updates via user and company rooms. Notification deep-links route to relevant views.
- **Native Mobile Foundation:** Capacitor handles device APIs. Geolocation captures GPS on clock-in. Offline caching via `@capacitor/preferences` stores schedule and user context. **Push notifications are not yet implemented.**
- **Security:** JWT auth (7-day expiry), Zod validation (12 schemas), Helmet headers, rate limiting on auth endpoints (30/15min), CORS lockdown, 1MB JSON limit.
- **Code Quality:** ESLint + Prettier configured for both backend and frontend. Pino structured logging. `vitest` scaffolded with integration smoke tests — **coverage is minimal (2 test files: core-flow and document store).**
- **Email Infrastructure:** Nodemailer configured in `mailer.js` with SMTP support and graceful fallback. Not yet wired into application workflows.
- **Production Architecture:** Full stack Dockerized (`docker-compose.yml` with 4 services). CI pipeline via GitHub Actions (lint, test, build). **CD (auto-deploy) is not yet configured.**

### Known Gaps & Technical Debt

| Gap                         | Severity | Details                                                                                               |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------- |
| JWT_SECRET placeholder      | Critical | `.env` still contains `"super_secret_change_me"` — must replace before any deployment                 |
| Minimal test coverage       | High     | Only 2 test files; no tests for clock, swaps, time off, sick leave, analytics, or frontend components |
| Auth-only rate limiting     | Medium   | Rate limiter only covers `/api/auth`; all other endpoints are unprotected                             |
| S3 storage not implemented  | Medium   | `storageService.js` only supports local disk; S3 branch is a comment, not code                        |
| No push notifications       | Medium   | FCM/Firebase not set up; only in-app WebSocket notifications exist                                    |
| Capacitor branding mismatch | Low      | Config uses `com.radix.app` / `Radix` — must update to `com.baudix.app` / `Baudix`                    |
| No audit logging            | Low      | No trail for shift approvals, denials, or sensitive operations                                        |
| No admin panel              | Low      | No admin-specific routes or views; only BOSS (manager) and EMPLOYEE roles exist                       |

---

## 2. Next Horizon: V1 Launch & Enterprise Scaling

See `next_steps.md` for the detailed, actionable checklist. Below is the strategic overview.

### Phase A: Branding & Identity

Rename from Radix to Baudix across the entire codebase — Capacitor config, page titles, meta tags, and any hardcoded references.

### Phase B: Pre-Launch Hardening

Close the gaps identified above before any deployment: replace JWT_SECRET, expand test coverage across all major flows, extend rate limiting globally, implement the S3 storage provider toggle, and run a full Docker Compose smoke test.

### Phase C: Push Notifications

Complete the remaining mobile work from the original Phase 6 — Firebase/FCM setup, `DeviceToken` model, device registration endpoint, and native push dispatch.

### Phase 8: Cloud Infrastructure Provisioning

> **Gate:** Only after Phases A, B, and C are complete and the local stack passes all checks.

- **Database:** Migrate local PostgreSQL to a managed provider (Supabase or Neon).
- **Backend API:** Deploy the Express server to Render or Railway.
- **Object Storage:** Activate S3-compatible storage (AWS S3 or Cloudflare R2) using the `STORAGE_PROVIDER` toggle built in Phase B.
- **Frontend Hosting:** Deploy the Vite SPA to Vercel or Netlify.
- **CD Pipeline:** Extend GitHub Actions CI with auto-deploy on merge to `main`.

### Phase 9: Enterprise & Payroll Integrations

- **Payroll Exporting:** Export aggregated time-and-attendance data (ClockEvents) as CSV/PDF compatible with Gusto, ADP, or Paychex.
- **SSO Authentication:** SAML / OAuth support for Enterprise Single Sign-On (Microsoft Entra, Google Workspace).
- **Email Notifications:** Wire the existing `mailer.js` into key workflows (application received, approved/rejected, swap requests, time off decisions). This is a quick win since the infrastructure already exists.

### Phase 10: Advanced Smart Scheduling

- **Smart Matching:** Auto-suggest workers based on attendance rates, reliability scores, and historical shift data.
- **Auto-Approval Rules:** Managers set thresholds to auto-approve low-priority shifts, reducing application queue bottlenecks.

### Phase 11: Real-Device Mobile App Release

- **Push Notifications:** Depends on Phase C being complete.
- **App Store Submission:** Generate iOS and Android native builds from the Capacitor project (branded as Baudix) for App Store and Google Play review.

### Phase 12: Platform Maturity

- **Audit Logging:** Record a trail for approvals, denials, modifications, and sensitive actions.
- **Admin Panel:** Admin-specific routes and views for company/user management and system configuration.
- **Bulk Operations:** Bulk shift creation (recurring schedules) and bulk application approval.
