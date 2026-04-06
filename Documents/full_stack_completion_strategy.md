# Full Stack Completion Strategy (Detailed Implementation Guide)

**Shiftly Workforce Management Platform**
_Technical strategy to achieve a 100% complete, production-ready full stack application._

---

## Executive Summary

This document serves as the detailed technical companion to `strategy.md`. It outlines the exact files, controllers, stores, and methodologies needed to execute the active roadmap.

The foundational architecture (Vue 3/Vite frontend + Node.js/Prisma backend) is solidly established. The core Marketplace Loop, secondary flows (Clock, Swaps, Time Off), and baseline security measures (Zod, Helmet, Rate Limiting) are complete. Our focus is executing the remaining 7 phases.

**Guiding Principle — Local-First Development:** Every feature must be fully functional using only free, local tooling (local PostgreSQL, local filesystem, Docker Compose). No paid cloud service (S3, Supabase, Render, Firebase, etc.) is introduced until the entire feature set is complete, tested, and ready for production. Cloud providers are treated as a deployment-time configuration swap, not a development dependency.

---

## COMPLETED FOUNDATION

- **API Integration Wiring:** All controllers and frontend views are fully connected.
  - `clock.controller` + Worker dashboard.
  - Time Off & Sick Leave state machines.
  - Shift Swaps (3-step flow to `POST /api/swaps`).
- **Security Hardening:** Prisma migrations applied, Zod validation on 19 schemas (`Backend/src/schemas.js`), Helmet headers, Rate limiting (30/15m on auth), CORS lockdown, express JSON limit (1mb).
  - **Action Required:** `JWT_SECRET` in `.env` is still a placeholder (`"super_secret_change_me"`). Generate a strong secret via `openssl rand -base64 32` before any production deployment.
- **Notifications Center:** `NotificationsContent.vue` (shared component) is fully functional with read/unread state, bell icon badge with unread count, tab filtering (All/Unread/Archived), mark-all-read, date grouping, and icon differentiation by type. `notificationStore.js` handles unread count tracking and pagination.
- **Axios Error Interceptor:** `Frontend/src/services/api.js` includes a response interceptor that handles 401 errors (clears token, redirects to `/login`).
- **Capacitor Foundation:** `@capacitor/core`, `@capacitor/android`, and `@capacitor/ios` are installed in the frontend.
- **Runtime:** Backend uses Express 5.2.1 (note: some middleware APIs differ from Express 4).

---

## IMPLEMENTATION PHASES

### Phase 1: Analytics & Reporting (Next Priority)

The analytics pages exist as scaffolds (KPIs show "---"). This phase fills them with real data.

#### 1.1 Analytics Backend

- **New file:** `Backend/src/controllers/analytics.controller.js`
- **New file:** `Backend/src/routes/analytics.routes.js`
- **Endpoints to build:**
  - `GET /api/analytics/summary` -- KPI cards (total shifts, fill rate, total hours worked, labor cost).
  - `GET /api/analytics/shifts-by-status` -- Breakdown for charts (ACTIVE, OPEN, CANCELED, COMPLETED).
  - `GET /api/analytics/hours-by-week` -- Weekly hours worked (aggregated from `ClockEvent`).
  - `GET /api/analytics/attendance-rate` -- Clock-ins vs. scheduled shifts.
- **Implementation:** Prisma `groupBy`, `count`, `aggregate` queries, strictly scoped to `companyId`.

#### 1.2 Analytics Frontend

- **Files to modify:** `Frontend/src/views/manager/ManagerAnalytics.vue`, `Frontend/src/views/worker/WorkerAnalytics.vue`
- **Install:** `chart.js` or `apexcharts` (+ Vue wrappers)
- **Stores:** Create `Frontend/src/stores/analyticsStore.js`
- **UI:** Render KPI cards and build out the bar/line charts using real Pinia state.

---

### Phase 2: Document Management & Compliance

Expand the `ManagerDocuments` and `WorkerDocuments` placeholder views.

#### 2.1 Local Storage Backend (Local-First)

- **Approach:** Use `multer` for multipart file uploads, saving to `Backend/uploads/{companyId}/`. Serve files via Express static middleware. Abstract storage behind a thin service layer (`Backend/src/services/storageService.js`) with `save()`, `getUrl()`, `remove()` methods — swap to S3/R2 later by toggling an env flag (`STORAGE_PROVIDER=local|s3`).
- **Dependencies:** `multer` (local disk). No cloud SDK needed during development.
- **New files:** `Backend/src/controllers/document.controller.js`, `Backend/src/routes/document.routes.js`, `Backend/src/services/storageService.js`
- **Prisma updates:** Add `Document` model `(id, name, key, contentType, size, uploadedById, companyId, category)`.
  - **Note:** This model does not exist yet in `prisma/schema.prisma` — must be added and migrated before any document endpoints can work.
- **Endpoints:**
  - `POST /api/documents/upload` (Multipart upload via `multer`, returns document metadata)
  - `GET /api/documents/:id/download` (Serve file from local disk or redirect to signed URL in production)
  - `GET /api/documents` (List by category, scoped to `companyId`)
  - `DELETE /api/documents/:id` (Manager only — removes file + DB record)
- **Cloud Migration Path:** When ready for production, install `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`, set `STORAGE_PROVIDER=s3` and add `S3_BUCKET`, `S3_REGION`, `S3_ENDPOINT` env vars. No controller or frontend changes needed.

#### 2.2 Document Frontend

- **Files to modify:** `Frontend/src/views/manager/ManagerDocuments.vue`, `Frontend/src/views/worker/WorkerDocuments.vue`
- **Stores:** Create `Frontend/src/stores/documentStore.js`
- **UI Details:** Implement drag-and-drop zone using native `<input type="file">`. Build a document list with category tags (Contracts, Certifications). Upload sends multipart `FormData` to `POST /api/documents/upload`.

---

### Phase 3: Notifications Center Refinement (~90% Complete)

The notifications frontend is largely implemented via `NotificationsContent.vue` (shared component used by both manager and worker views), with `notificationStore.js` handling state. Read/unread styling, bell badge, tab filtering, mark-all-read, and "Claim Shift" actions are all functional.

#### 3.1 Remaining Work

- **Deep-link navigation:** The "View Details" button exists but is not fully wired for all notification types. Clicking a notification should route the user to the relevant context (e.g., "New application received" → `ApplicantReview.vue`, swap approved → `WorkerSwapshift.vue`).
- **Backend cleanup:** Consolidate duplicate notification controllers. Both `notification.controller.js` and `notifications.controller.js` exist with conflicting field names (`read` vs `isRead`). One must be removed and all references unified.

---

### Phase 4: Production Deployment Architecture (Local-First)

#### 4.1 Containerization (Local — No Paid Services)

- **New files:** `Backend/Dockerfile`, `Frontend/Dockerfile`, `docker-compose.yml`
- **Setup:** Multi-stage Dockerfile for Node API. Separate Dockerfile for Frontend (Nginx serving Vite build output). Compose file includes `api`, `frontend`, `db` (PostgreSQL image), and a `migrate` init container for Prisma migrations.
- **Goal:** `docker compose up` runs the entire stack locally — anyone can clone the repo and have a working app with zero external accounts.

#### 4.2 CI/CD Pipeline (Free — GitHub Actions)

- **New file:** `.github/workflows/ci.yml`
- **Steps:** Checkout → Setup Node.js → Install dependencies → Build Frontend (`vite build`) → Run Tests.
- **Note:** GitHub Actions is free for public repos and has generous free-tier minutes for private repos. No paid service needed.

#### 4.3 Hosting Strategy (Deferred)

Cloud hosting is a deployment-time decision, not a development blocker. When the full feature set is complete and tested:

- **Database:** Supabase (free tier) or Neon (free tier) for PostgreSQL.
- **Backend:** Render (free tier) or Railway. Require env vars: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGINS`, `STORAGE_PROVIDER`, `S3_BUCKET`.
- **Frontend:** Vercel (free tier) or Netlify (free tier) pointing `VITE_API_BASE_URL` to production backend url.
- **Decision deferred until:** All phases 1-5 are complete and tested locally via Docker Compose.

---

### Phase 5: Testing & Code Quality

#### 5.1 Linting

- **Install & Config:** Add `eslint`, `prettier`, and `eslint-plugin-vue`. Add config files (`.eslintrc.js`, `.prettierrc`) to both Backend and Frontend dirs.
- **Npm Scripts:** `npm run lint` and `npm run format`.

#### 5.2 Test Suites

- **Backend:** Integrate `vitest` + `supertest`. Target integration tests for core flow `register -> login -> create shift -> apply`.
- **Frontend:** Integrate `vitest` + `@vue/test-utils`. Test components with complex state management (e.g., `shiftStore`).

#### 5.3 Structured Logging

- **Replace** standard `console.log` with `pino` logger to enable JSON structured logging, easily queried in production environments.

---

### Phase 6: Native Mobile Enhancements (Capacitor)

Leverage native capabilities as Shiftly operates as an app wrapper. **Note:** `@capacitor/core`, `@capacitor/android`, and `@capacitor/ios` are already installed in the frontend.

#### 6.1 Geolocation (Proof of Work)

- **Install:** `@capacitor/geolocation`
- **Implementation:** Modify the Worker dashboard clock-in button to capture GPS coordinates. Send them to `POST /api/clock` as the `location` string.

#### 6.2 Push Notifications (Deferred — Local Polling First)

- **Current state:** In-app notifications already work via `notificationStore` polling. This is sufficient for development and early testing.
- **Deferred implementation:** When a native mobile build is actually distributed to real devices, add FCM push:
  - **Backend:** Install `firebase-admin`, introduce `DeviceToken` Prisma model. New endpoints `POST /api/devices/register`. Attach FCM dispatches to the existing `notification.js` helper.
  - **Frontend:** Install `@capacitor/push-notifications`. Request token on post-login mount. Handle foreground banners and background system tray alerts.
- **Why deferred:** Firebase adds vendor lock-in and requires a Google Cloud project. The existing polling mechanism covers all dev/testing needs. Push notifications only matter when the app is on real phones.

---

### Phase 7: Real-Time Sync & Quality of Life

#### 7.1 WebSockets for Live Updates

- **Install:** `socket.io` (backend) + `socket.io-client` (frontend).
- **Implementation:** Attach `socket.io` to Express `app.js`. Broadcast events on application logic (shift applied, swap approved) so UI reactive state (`Pinia`) updates immediately without manual polling.

#### 7.2 Offline Caching

- **Install:** `@capacitor/preferences`
- **Implementation:** Store upcoming schedule and user context. Ensure the worker can still see "Where do I work today?" even with no network connection.

#### 7.3 Global Error Handling (Partially Implemented)

- **Already done:** `Frontend/src/services/api.js` has an axios response interceptor that catches `401` errors (clears token, redirects to `/login`).
- **Remaining:** Extend the interceptor to handle `500` server errors and network failures by driving a global `<Toast />` component, so error states never silently fail in the background.

---

---

### Known Bugs & Cleanup (Pre-Requisite)

These issues were identified during an April 2026 codebase audit and should be resolved before or alongside Phase 1 work.

| #   | Issue                                  | Severity | Details                                                                                                                                                                          |
| --- | -------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Duplicate notification controllers** | High     | Both `notification.controller.js` and `notifications.controller.js` exist with different field names (`read` vs `isRead`). Consolidate into one and remove the duplicate routes. |
| 2   | **Prisma schema index bug**            | Medium   | `Shift` model has `@@index([visibility])` but no `visibility` field is defined. Remove the orphaned index or add the field.                                                      |
| 3   | **JWT_SECRET placeholder**             | Critical | `.env` contains `"super_secret_change_me"`. Must be replaced with a cryptographically random value before any deployment.                                                        |
| 4   | **Dead file**                          | Low      | `Backend/src/somthing.js` is an empty file with a typo in the name. Delete it.                                                                                                   |

---

## Summary & Priority Order

| Phase  | Focus                      | Priority | Status                             |
| ------ | -------------------------- | -------- | ---------------------------------- |
| **--** | Known Bugs & Cleanup       | Critical | Complete                           |
| **1**  | Analytics & Reporting      | High     | Complete                           |
| **2**  | Document Management        | High     | Complete                           |
| **3**  | Notifications Center       | High     | Complete                           |
| **4**  | Production Deployment      | Medium   | Complete (4.1 + 4.2; 4.3 deferred) |
| **5**  | Testing & Code Quality     | Medium   | Complete                           |
| **6**  | Native Mobile Enhancements | Medium   | Not started                        |
| **7**  | Real-Time Sync & QoL       | Low      | Partial (7.3)                      |
