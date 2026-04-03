# Shiftly Workforce Management Platform — Current Strategy (Updated March 2026)

## Executive Summary

The Shiftly platform has successfully transitioned from a static UI prototype to a connected, full-stack application. The core "Marketplace Loop" (Auth, Shift Creation, Applying, and Approval) is fully functional, backed by a Node.js/Express API and a PostgreSQL database via Prisma. 

Security baselines (Zod validation, Helmet, Rate Limiting) have also been established. The current strategy shifts focus from **bug fixing and wiring** to **completing the product feature set**, ensuring **production readiness**, and building out **native mobile capabilities**.

---

## 1. Current State Audit (What's Done)

- **Application State:** Pinia stores are fully integrated. Mock data has been eliminated.
- **Core Loop:** Creating shifts, applying for shifts, and manager approvals are fully wired.
- **Secondary Workflows:** Clock In/Out, Time Off, Sick Leave, and Shift Swaps are connected to the backend.
- **Routing & Navigation:** Global routing, including sidebar links and dashboard tiles, work correctly and navigation logic uses Vue Router.
- **Security:** Endpoints are protected with JWT auth. Zod validation secures all incoming payloads. Helmet and CORS configurations are active.
- **Database Architecture:** Prisma schema is robust, supporting all major entities with proper relation constraints.

---

## 2. Immediate Roadmap (What Needs to be Done)

The following phases outline the roadmap to achieve a 100% complete, production-ready product.

### Phase 1: Analytics & Reporting (Next Priority)
Currently, Analytics pages are scaffolded but lack data APIs or visual charts. 
- **Backend Task:** Create `analytics.controller.js` and `analytics.routes.js`. Build Prisma aggregation queries (e.g., total shifts, labor cost, fill rate).
- **Frontend Task:** Build Vue components using a charting library (e.g., `chart.js` or `apexcharts`). Wire `ManagerAnalytics.vue` and `WorkerAnalytics.vue` to new endpoints via pinia stores.

### Phase 2: Document Management & Compliance
The Document views exist as placeholders. The platform needs cloud storage for contracts and compliance files.
- **Backend Task:** Set up Cloudflare R2 or AWS S3 integration. Create `document.controller.js` to manage secure presigned URLs. Introduce `Document` model in Prisma.
- **Frontend Task:** Build a file picker and drag-and-drop zone in `ManagerDocuments.vue` and `WorkerDocuments.vue`. Connect uploads/downloads to the backend.

### Phase 3: Notifications Center Refinement
The backend structure for notifications exists (`notification.controller.js`), but the frontend interface is limited.
- **Task:** Expand `ManagerNotifications.vue` and `WorkerNotifications.vue` to render the list of notifications, handle read/unread state, and support quick actions (routing directly to unhandled shift applications or swaps from the notification).

### Phase 4: Production Deployment Architecture
- **Dockerization:** Create `Dockerfile` and `docker-compose.yml` to package the Node server, PostgreSQL instance, and Prisma migrations.
- **CI/CD:** Add a GitHub Actions pipeline (`.github/workflows/ci.yml`) to automatically build the Vite app, lint, and deploy.
- **Provisioning:** Deploy database to Neon/Supabase and deploy API to Render/Railway.

### Phase 5: Testing & Code Quality
- **Linting:** Install and configure ESLint and Prettier across frontend and backend.
- **Testing:** Integrate `vitest` for the backend integration tests and Vue component tests to ensure no regressions occur during deployment.
- **Structured Logging:** Implement `pino` logger in the backend.

### Phase 6: Native Mobile Enhancements (Capacitor)
Shiftly acts as a native app on mobile. We must leverage native capabilities.
- **Geolocation:** Introduce `@capacitor/geolocation` to ensure workers are physically at the worksite before validating a "Clock In" request.
- **Push Notifications:** Integrate Firebase Admin (backend) and `@capacitor/push-notifications` (frontend) to alert users to new shifts or urgent swaps outside the app.

### Phase 7: Real-Time Sync & Quality of Life
- **WebSockets:** Add `socket.io` to dispatch live updates (e.g., Manager dashboard updates instantly when a worker applies).
- **Offline Caching:** Use `@capacitor/preferences` to cache active shifts so a worker can view their schedule without network coverage.
- **Global Error Handling:** Build consistent Toast notifications globally directly from Axios interceptors.

---

## 3. Recommended Execution Order

1. **Phase 1 (Analytics)** and **Phase 3 (Notifications)**: These finish the essential web visual features directly visible to the users. 
2. **Phase 2 (Documents)**: Essential for HR compliance.
3. **Phase 5 (Testing/Quality)**: Required before serious deployment.
4. **Phase 4 (Deployment)**: Push the 1.0 version to cloud environments.
5. **Phase 6 & 7 (Mobile & Real-Time)**: Advanced polish for a premium mobile experience.
