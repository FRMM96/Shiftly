# Full App Rebuild & Fix Strategy

**Workforce Management Platform — Manager & Worker Portals**
_Version 1.0 | March 2026_

---

## Executive Summary

This document outlines a structured, phased strategy to transform the current prototype into a fully working workforce management application. The issues span both the Manager and Worker portals and fall into five categories: **broken UI interactions**, **non-functional filters/navigation**, **missing pages**, **data integrity problems**, and **missing backend/API logic**. The strategy below prioritizes stability first, then completeness, then polish.

---

## Phase 0 — Audit & Foundation (Before Writing Any New Code)

Before fixing anything, establish a solid foundation.

### 0.1 State Management Audit

- Centralize all application state using a proper store (Redux Toolkit, Zustand, or Context API with reducers).
- Eliminate all local mock data (Sara, etc.) from components and move it into a dedicated `mockData/` module that can be swapped for real API calls later.
- Define TypeScript interfaces (or PropTypes) for every entity: `Shift`, `Worker`, `Application`, `Notification`, `Schedule`, `TimeOffRequest`.

### 0.2 Date & Time Utilities

- Install and configure a single date library (e.g., `date-fns` or `dayjs`) used everywhere.
- Create a `useTodayDate()` hook that always returns the real current date.
- Implement a `TimeRoller` component (scroll/drum-roll picker) for all date and time inputs — **no free-text time entry**.
- Ensure all times display in **24-hour format** by default.
- Ensure all date pickers default to **today's date** on mount.

### 0.3 Currency & Localisation

- Add `SEK` as a currency option alongside any existing currencies.
- Create a `CurrencySelector` component used in shift creation and payment boxes.
- Store locale/currency preference in user profile settings.

### 0.4 Routing Review

- Audit all navigation links and `<button>` elements — any button without an `onClick` or route must be flagged and wired up before release.
- Ensure "View All" → Shift Management, "Today" button, calendar day clicks, and arrow navigation are all connected to real route or state changes.

---

## Phase 1 — Manager Portal: Core Fixes

### 1.1 Dashboard

| Problem                        | Fix                                                                                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Recent activity not updated    | Wire recent activity list to a shared activity log store; update on every shift publish, application change, and clock event             |
| "View All" → wrong destination | Route to Shift Management with today's date pre-selected                                                                                 |
| "Today" button does nothing    | Set selected date in calendar/schedule state to `new Date()`                                                                             |
| Arrow navigation does nothing  | Increment/decrement selected week or day in state                                                                                        |
| New Applicants section         | Display applicant cards with Name, Role, Shift applied for; add **Accept** and **Decline** action buttons that update application status |
| Urgent Alert not clickable     | Make alert cards clickable; open a modal or detail page to resolve the alert; mark as resolved in state                                  |

### 1.2 Shift Management

| Problem                     | Fix                                                                                                  |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Date defaults to wrong date | On page load, set date filter to today using `useTodayDate()`                                        |
| Filters do nothing          | Wire filter controls (status, date range, role, location) to filter the displayed shift list         |
| "Load More" doesn't load    | Implement pagination or infinite scroll; if no more shifts, show "No more shifts to display" message |

### 1.3 Create Shift

| Problem                                     | Fix                                                                                                                                                 |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Time in 12hr with AM/PM submitting the form | Replace AM/PM toggle with a 24-hour `TimeRoller` component; remove any form submission tied to AM/PM press                                          |
| Date is a text field                        | Replace with a rolling date picker (drum-roll or calendar popup); default to today                                                                  |
| No payment/currency field                   | Add a Payment section with amount input and `CurrencySelector` (include SEK)                                                                        |
| Cannot modify published shift               | Add an **Edit** button on published shifts visible to managers; all fields should be editable; re-publish triggers notification to assigned workers |
| Importance/priority missing                 | Add a **Priority** selector: Low / Normal / Urgent (or numeric 1–5)                                                                                 |

### 1.4 Manager Calendar

| Problem                       | Fix                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| Cannot click calendar days    | Attach `onClick` to each day cell; clicking opens a day detail panel or modal showing shifts for that day |
| Date is not today             | Default calendar view to current month with today highlighted                                             |
| "+ Assign Staff" does nothing | Open a staff assignment modal: show available workers, allow selection, save assignment to shift          |
| Three-dot menu does nothing   | Implement dropdown: Edit Worker Schedule, View Profile, Remove from Shift, Message Worker                 |

### 1.5 Staff Directory

| Problem                         | Fix                                                                                                                          |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| "+ Add New Worker" does nothing | Open a modal/form: Name, Role, Email, Phone, Contract Type; on submit, add worker to directory state                         |
| Filters do nothing              | Wire filters (role, status, department) to filter worker list                                                                |
| Pagination not working          | Implement real pagination: calculate total pages from data length, enable Previous/Next arrows and direct page number clicks |
| No notification shown           | Trigger an in-app notification on relevant actions (worker added, shift assigned, etc.)                                      |

### 1.6 Application Review Page

| Problem                         | Fix                                                                    |
| ------------------------------- | ---------------------------------------------------------------------- |
| Reviewed / Shortlist tabs empty | Filter application list by status field; populate each tab accordingly |
| "Load More" broken              | Same fix as Shift Management                                           |

---

## Phase 2 — Worker Portal: Core Fixes

### 2.1 Worker Dashboard

| Problem                      | Fix                                                                                                                                     |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Clock In/Out non-functional  | Implement clock in/out with timestamp; update worker status in state; send notification to manager with worker name, time, and location |
| "View Map" non-functional    | Open a map view (e.g., embedded Google Maps or Mapbox) showing the shift location                                                       |
| Upcoming shifts info missing | Clicking a shift card opens a detail modal: location, time, role, manager contact, pay                                                  |

### 2.2 Pending Applications

| Problem               | Fix                                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Details not clickable | Make each application row/card clickable; show shift details, status, and timeline in a modal or detail page |

### 2.3 Find Shift / Marketplace

| Problem                              | Fix                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Filters do nothing                   | Wire filters (date, role, location, pay rate) to filter displayed shifts                                                       |
| Already-applied shifts still visible | After worker applies, mark shift as "Applied" with a badge, or remove it from the available list entirely (toggle via setting) |

### 2.4 Worker Schedule

| Problem                               | Fix                                                                                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| No calendar view                      | Build a monthly calendar component; each day with a shift shows a coloured indicator                                                       |
| Days not clickable                    | Clicking a day opens options: View Shift Details, Request Day Off, Request Shift Exchange                                                  |
| Request Time Off broken (bad request) | Fix API call — validate date range before submission; use rolling date picker; on cancel, navigate back to dashboard (not blank screen)    |
| Shift Exchange                        | Worker selects a shift and a colleague's shift; sends exchange request to manager for approval; manager sees it in dashboard notifications |

### 2.5 My Application List

| Problem                                    | Fix                                                                                                         |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Pending / Approved / Denied filters broken | Filter list by `status` field on each application object                                                    |
| Notification and Settings links broken     | See Phase 3                                                                                                 |
| "+ New Application" goes nowhere           | Navigate directly to Find Shift / Marketplace page; optionally offer quick-apply for overtime or sick leave |

### 2.6 Team Calendar

- Implement a **read-only** team calendar showing all workers' scheduled shifts.
- Worker can see who is working when.
- Clicking a colleague's shift shows an option: **Request Shift Exchange** (triggers approval workflow with manager).

---

## Phase 3 — Notifications & Settings (Both Portals)

### 3.1 Notifications System

Build a unified notification system:

- **Notification Store**: maintain a list of notification objects `{ id, type, message, read, timestamp, actionUrl }`.
- **Notification Bell**: badge shows unread count; clicking opens notification panel.
- **Auto-generated notifications** for:
  - New shift published (workers)
  - Application received (manager)
  - Application accepted/declined (worker)
  - Clock in/out event (manager)
  - Shift exchange request (manager + target worker)
  - Time-off request (manager)
  - Urgent alert created (manager)
  - Shift modified after publish (assigned workers)
- Notifications page: list all notifications with read/unread state, timestamps, and clickable action links.

### 3.2 Settings Page (Manager)

Implement the following sections:

- **Profile**: Edit name, email, phone, profile photo, role/title.
- **Security**: Change password (current + new + confirm); optional 2FA toggle.
- **Preferences**: Default currency (include SEK), time format (24h default), language/locale.
- **Notifications**: Toggle which notification types to receive (email, in-app).
- **Log Out**: Clear session/token and redirect to login screen.

### 3.3 Settings Page (Worker)

- **Profile**: Edit personal info, emergency contact.
- **Security**: Change password.
- **Preferences**: Notification preferences.
- **Log Out**.

---

## Phase 4 — New Pages to Implement

### 4.1 Analytics & Reports Page (Manager)

Metrics to display:

| Metric                                | Visualisation               |
| ------------------------------------- | --------------------------- |
| Total hours worked (by week/month)    | Bar chart                   |
| Hours per worker                      | Horizontal bar / table      |
| Shift fill rate (published vs filled) | Donut chart                 |
| Application acceptance rate           | KPI card                    |
| Overtime hours                        | Line chart                  |
| Absenteeism / no-shows                | KPI card + trend            |
| Cost per shift / total labour cost    | KPI card (with SEK support) |
| Peak demand days                      | Heatmap calendar            |

Export options: PDF and CSV download for any report.

### 4.2 Analytics Page (Worker)

| Metric                       | Visualisation                |
| ---------------------------- | ---------------------------- |
| Hours worked this week/month | Bar chart                    |
| Upcoming scheduled hours     | Summary card                 |
| Approved time off            | Calendar indicator           |
| Application success rate     | KPI card                     |
| Pay estimate for period      | Summary card (with currency) |

### 4.3 Documents Page (Manager & Worker)

- Upload and categorise documents (contracts, certifications, policies).
- Worker can view documents shared with them.
- Manager can upload per-worker or company-wide documents.
- Show upload date, file type, and download link.

---

## Phase 5 — Data Cleanup & Quality

### 5.1 Remove All Mock Data

- Audit every component for hardcoded names (Sara, etc.) or placeholder data.
- Move all data to the central mock data module.
- Ensure the app works with zero workers and zero shifts (empty states with helpful messages).

### 5.2 Empty States

Every list view must have a proper empty state:

- No shifts: "No shifts found. Try adjusting your filters or create a new shift."
- No applications: "No applications received yet."
- No workers: "No workers in the directory. Add your first worker to get started."
- No notifications: "You're all caught up."

### 5.3 Error Handling

- All API/state operations must have try/catch with user-visible error messages (toast or inline).
- Form validation before submission on all forms.
- Console errors (like the time-off bad request) must be surfaced to the user with a clear message.

---

## Phase 6 — Polish & UX Consistency

- Ensure all primary action buttons (publish, submit, save) have loading states.
- Destructive actions (delete shift, decline application) require a confirmation dialog.
- All modals must have a working close/cancel button that returns to the previous view.
- Date and time pickers use the rolling drum-roll style consistently across the entire app.
- Responsive design review for mobile screens.
- Consistent use of SEK and 24-hour time wherever applicable.

---

## Recommended Implementation Order

```
Phase 0  →  Foundation & Tooling           (1–2 days)
Phase 1  →  Manager Portal Fixes           (3–5 days)
Phase 2  →  Worker Portal Fixes            (3–5 days)
Phase 3  →  Notifications & Settings       (2–3 days)
Phase 4  →  Analytics, Reports, Documents  (3–4 days)
Phase 5  →  Data Cleanup & Empty States    (1–2 days)
Phase 6  →  Polish & UX Review             (1–2 days)
```

**Total estimated effort**: 14–23 development days depending on team size and existing codebase quality.

---

## Quick Reference: Ghost Buttons to Wire Up

| Location                 | Button           | Required Action               |
| ------------------------ | ---------------- | ----------------------------- |
| Manager Dashboard        | View All         | Navigate to Shift Management  |
| Manager Dashboard        | Today            | Set schedule date to today    |
| Manager Dashboard        | ← → Arrows       | Navigate week/day             |
| Manager Dashboard        | Urgent Alert     | Open resolve modal            |
| Manager Calendar         | Day cell click   | Open day detail panel         |
| Manager Calendar         | + Assign Staff   | Open staff assignment modal   |
| Manager Calendar         | ⋯ (worker dots)  | Open worker action dropdown   |
| Staff Directory          | + Add New Worker | Open add worker form/modal    |
| Staff Directory          | Filters          | Apply filter to worker list   |
| Staff Directory          | Page numbers     | Navigate to that page         |
| Application Page         | Reviewed tab     | Show reviewed applications    |
| Application Page         | Shortlist tab    | Show shortlisted applications |
| Application Page         | Load More        | Load next batch of shifts     |
| Worker Marketplace       | Filters          | Filter available shifts       |
| Worker Schedule          | Day cell click   | Show day actions modal        |
| Worker My Applications   | Filters          | Filter by status              |
| Notifications page       | Any platform     | Show notification list        |
| Settings page            | Any platform     | Show settings sections        |
| Profile (Manager/Worker) | Edit fields      | Enable field editing          |
| Profile (Manager/Worker) | Change Password  | Open password change flow     |
| Profile (Manager/Worker) | Log Out          | Clear session, go to login    |
