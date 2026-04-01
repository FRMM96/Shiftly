# Full Stack Completion Strategy

**Shiftly Workforce Management Platform**
_Strategy to achieve a 100% complete, production-ready Full Stack Application_

---

## Executive Summary

We have successfully established the foundational architecture: a Vue 3 + Vite frontend (wrapped in Capacitor for mobile) and a Node.js + Express + Prisma backend. The core "Marketplace Loop" is fully wired (Auth, Creating Shifts, Applying, Approving). All secondary flows (Clock In/Out, Time Off, Sick Leave, Shift Swaps) are also connected end-to-end.

Security hardening (Tier 0-1) is complete: Prisma migrations applied, JWT secret secured, Zod input validation on all endpoints, Helmet security headers, rate limiting on auth, and CORS lockdown.

The remaining work focuses on **completing the product feature set**, **production deployment**, and **native mobile enhancements**.

---

## COMPLETED PHASES

### Phase 1: API Integration Wiring -- DONE

All controllers and frontend views are fully connected with real API calls.

- **Clock In/Out:** `clock.controller` + Worker dashboard buttons wired. Location field accepted (GPS plugin pending Phase 6).
- **Time Off & Sick Leave:** Full state machines (Pending -> Approved/Denied). Worker forms and Manager review dashboards connected.
- **Shift Swaps:** 3-step frontend flow (select your shift -> pick colleague -> select their shift) wired to `POST /api/swaps`. History tab shows past swaps.
- **New endpoint added:** `GET /api/shifts/user/:userId` for fetching a colleague's shifts during swap proposals.

### Phase 1.5: Security Hardening -- DONE

- **Zod validation** on all POST/PATCH endpoints (13 schemas in `Backend/src/schemas.js`)
- **Helmet** security headers
- **Rate limiting** (30 req/15min on `/api/auth`)
- **CORS lockdown** to configured origins (`CORS_ORIGINS` env var)
- **JWT secret** rotated to cryptographically secure 64-byte hex
- **Body size limit** (`express.json({ limit: "1mb" })`)

---

## REMAINING PHASES

### Phase 2: Analytics & Reporting (Complete the Product)

The analytics pages exist as scaffolds (KPIs show "---", charts say "Coming soon"). This phase fills them with real data.

#### 2.1 Analytics Backend

- **New file:** `Backend/src/controllers/analytics.controller.js`
- **New file:** `Backend/src/routes/analytics.routes.js`
- **Endpoints to build:**
  - `GET /api/analytics/summary` -- KPI cards: total shifts, fill rate, total hours worked, labor cost
  - `GET /api/analytics/shifts-by-status` -- Breakdown of ACTIVE/OPEN/COMPLETED/CANCELED for chart
  - `GET /api/analytics/hours-by-week` -- Weekly hours worked (from ClockEvent data) for line chart
  - `GET /api/analytics/attendance-rate` -- Clock-ins vs. scheduled shifts
- **Implementation:** Prisma `groupBy`, `count`, `aggregate` queries scoped to the manager's company

#### 2.2 Analytics Frontend

- **Files to modify:** `Frontend/src/views/manager/ManagerAnalytics.vue`, `Frontend/src/views/worker/WorkerAnalytics.vue`
- **Install:** `chart.js` or `apexcharts` + vue wrapper
- **Create:** `Frontend/src/stores/analyticsStore.js` to fetch and cache analytics data
- **Manager view:** KPI cards (total shifts, fill rate %, labor cost, avg hours) + bar/line charts
- **Worker view:** Personal KPIs (hours this week/month, shifts completed, upcoming count) + personal trends chart

---

### Phase 3: Document Management & Cloud Storage

The `ManagerDocuments` and `WorkerDocuments` views are empty-state placeholders. This phase adds real file upload/download.

#### 3.1 Cloud Storage Backend

- **Choose provider:** Cloudflare R2 (S3-compatible, no egress fees) or Supabase Storage
- **Install:** `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner`
- **New file:** `Backend/src/controllers/document.controller.js`
- **New file:** `Backend/src/routes/document.routes.js`
- **New Prisma model:** `Document` (id, name, key, contentType, size, uploadedById, companyId, category, timestamps)
- **Endpoints:**
  - `POST /api/documents/upload-url` -- Generate pre-signed upload URL
  - `GET /api/documents/:id/download-url` -- Generate pre-signed download URL
  - `GET /api/documents` -- List documents for company (filterable by category: contract, certification, ID, policy)
  - `DELETE /api/documents/:id` -- Manager-only delete
- **Env vars:** `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`

#### 3.2 Document Frontend

- **Files to modify:** `Frontend/src/views/manager/ManagerDocuments.vue`, `Frontend/src/views/worker/WorkerDocuments.vue`
- **Create:** `Frontend/src/stores/documentStore.js`
- **Features:**
  - File picker with drag-and-drop zone (standard `<input type="file">`)
  - Upload progress indicator
  - Document list with category filters (Contracts, Certifications, Policies)
  - Download button using pre-signed URLs
  - Manager: can upload company-wide documents and delete any document
  - Worker: can upload personal documents (ID, certifications) and download company policies

---

### Phase 4: Production Deployment

#### 4.1 Docker & Containerization

- **New files:** `Backend/Dockerfile`, `docker-compose.yml` (root)
- **docker-compose services:** `api` (Node.js), `db` (PostgreSQL), `migrate` (one-shot Prisma migration)
- **Multi-stage Dockerfile:** build stage + slim production image
- **Health check:** Expand `GET /` to return `{ status: "ok", version, uptime }` for container orchestration probes

#### 4.2 CI/CD Pipeline

- **New file:** `.github/workflows/ci.yml`
- **Pipeline steps:**
  1.  Checkout + Node.js setup
  2.  Install dependencies (Backend + Frontend)
  3.  Lint (once ESLint is added)
  4.  Build Frontend (`vite build`)
  5.  Run tests (once test suite exists)
- **Deployment trigger:** Auto-deploy on push to `main`

#### 4.3 Backend Deployment

- **Database:** Provision managed PostgreSQL (Neon free tier or Supabase)
- **API Server:** Deploy to Railway or Render (auto-deploy from GitHub, free tier available)
- **Environment:** Configure production env vars (DATABASE_URL, JWT_SECRET, CORS_ORIGINS, S3 credentials)

#### 4.4 Frontend Deployment

- **Web:** Connect repo to Vercel or Netlify. Set `VITE_API_BASE_URL` to production API URL.
- **Mobile:** Capacitor iOS/Android builds are already scaffolded.
  - Android: `npx cap sync android` -> Build `.aab` in Android Studio -> Upload to Google Play Console
  - iOS: `npx cap sync ios` -> Archive in Xcode -> Upload to TestFlight

---

### Phase 5: Code Quality & Testing

#### 5.1 Linting & Formatting

- **Backend:** Add `eslint` + `prettier` with Node.js config
- **Frontend:** Add `eslint` + `eslint-plugin-vue` + `prettier`
- **Add scripts:** `lint`, `lint:fix`, `format` to both `package.json` files
- **Add:** `.eslintrc.js` and `.prettierrc` to both packages

#### 5.2 Testing

- **Backend:**
  - Install `vitest` or `jest` + `supertest`
  - Integration tests for critical flows: register -> login -> create shift -> apply -> assign
  - Unit tests for schema validation edge cases
- **Frontend:**
  - Install `vitest` + `@vue/test-utils`
  - Component tests for critical views (login, create shift, marketplace)
  - Store tests for shiftStore, userStore actions

#### 5.3 Structured Logging

- **Backend:** Replace `console.log/error` with `pino` logger
- **Format:** JSON structured logs with request ID, user ID, and latency
- **Benefits:** Machine-parseable logs for production debugging and monitoring

---

### Phase 6: Native Mobile & Push Notifications

#### 6.1 Geolocation for Clock-In

- **Install:** `@capacitor/geolocation`
- **Frontend:** Auto-capture GPS coordinates when worker taps "Clock In". Pass as `location` field to `POST /api/clock`.
- **Backend:** Optionally validate location is within acceptable radius of workplace (geofencing).

#### 6.2 Push Notifications via Firebase

- **Backend:**
  - Install `firebase-admin`
  - Add `DeviceToken` Prisma model (userId, token, platform)
  - New endpoints: `POST /api/devices/register`, `DELETE /api/devices/:token`
  - Update `Backend/src/helpers/notification.js` to also dispatch FCM push when creating DB notifications
- **Frontend:**
  - Install `@capacitor/push-notifications`
  - Register device token on login, send to `POST /api/devices/register`
  - Handle foreground notifications (in-app banner) and background notifications (system tray)
- **Trigger events:** Shift assigned, application approved/rejected, swap status change, time-off decision

#### 6.3 Camera & File Capture

- **Install:** `@capacitor/camera`
- **Use case:** Workers can photograph certifications or IDs directly from the app for document uploads (Phase 3)

---

### Phase 7: Real-time & Offline (Polish)

#### 7.1 Real-time Data Sync

- **Install:** `socket.io` (backend) + `socket.io-client` (frontend)
- **Backend:** Attach Socket.io to the Express HTTP server in `app.js`. Emit events when:
  - A worker applies for a shift (manager dashboard updates instantly)
  - A shift is assigned (worker calendar updates)
  - A notification is created (bell badge increments without polling)
- **Frontend:** Connect socket in `main.js` after login. Listen for events and update Pinia stores reactively.

#### 7.2 Offline Caching

- **Install:** `@capacitor/preferences`
- **Frontend:** Cache the worker's upcoming schedule and recent notifications in device storage
- **Sync strategy:** Show cached data immediately, fetch fresh data in background, merge on arrival
- **Offline indicator:** Display a banner when the device loses connectivity

#### 7.3 Skeleton Loaders & Global Error Toasts

- **Skeleton loaders:** Replace text spinners ("Loading...") with animated placeholder cards that match the layout of the real content
- **Global error toast:** Add an Axios response interceptor that shows a toast component for network errors, 500s, and session expiry (beyond the existing 401 redirect)
- **Component:** Create `Frontend/src/components/shared/Toast.vue` with auto-dismiss

---

## Phase Summary & Priority Order

| Phase | Focus                      | Status   | Priority |
| ----- | -------------------------- | -------- | -------- |
| 1     | API Integration Wiring     | DONE     | --       |
| 1.5   | Security Hardening         | DONE     | --       |
| **2** | **Analytics & Reporting**  | **Next** | **High** |
| **3** | **Document Management**    | Planned  | **High** |
| **4** | **Production Deployment**  | Planned  | **High** |
| 5     | Code Quality & Testing     | Planned  | Medium   |
| 6     | Native Mobile & Push       | Planned  | Medium   |
| 7     | Real-time & Offline Polish | Planned  | Low      |

**Recommended next step:** Phase 2 (Analytics) -- it completes the product feature set that users will see, and the backend aggregation queries are straightforward Prisma calls.
