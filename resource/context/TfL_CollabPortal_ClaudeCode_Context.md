# TfL Collaboration Portal — Project Context for Claude Code

**Purpose of this file:** This document gives Claude Code the full context needed to continue building the TfL Collaboration Portal front end from the existing prototype. It covers the product background, source documents, UX/UI decisions, data models, component patterns, and the current state of the prototype — everything that was established during the initial design and prototype phase.

---

## 1. Project Overview

The TfL Collaboration Portal is a web platform that manages the workflow between Transport for London (TfL) and its bus operators for handling route specification changes and MDV schedule file submissions. It replaces an existing end-of-life portal built on the Alfresco content management platform, which has become unstable and unfit for purpose.

This is a **full platform reimagination**, not a like-for-like migration. The rebuild is developed by Naviquate and sits on top of the Novus platform, which provides route data, schedule data, and MDV file validation.

There are two distinct user types:
- **TfL Users** — internal TfL staff who create and manage service changes and send service requests to operators
- **Operator Users** — bus operators who receive service requests and respond by uploading MDV schedule files

---

## 2. Source Documents

The prototype was built from four primary source documents. All four should be provided alongside this context file.

### 2.1 NTA User Guide (`Novus-RouteSpec-Guide-v2_4.pdf`)
A step-by-step training guide for users of the existing Novus Collaboration Portal (live for a different customer — do not reference this customer by name in any TfL-facing materials). This document provides:
- The existing workflow that the TfL portal evolves from
- Screenshots of the current Novus UI (dark blue, legacy desktop-style interface) — useful as a reference for what functionality exists, **not** as a visual reference for the new portal
- The conceptual workflow: Create Route Spec in Novus → Assign to VDV Update in Portal → Edit Route Spec → Upload Service Requests → Send to Operator → Validate MDV → Accept

The TfL portal supersedes and modernises this workflow. Key terminology differences:
- The existing portal uses "VDV Update" as the top-level grouping. TfL uses **Route → Service Change → Service Request** as the hierarchy.
- The existing portal uses VDV files. TfL uses **MDV** files.
- The existing portal is branded for a different customer. All branding must be TfL.

### 2.2 User Stories (`CollabPortal-v2-UserStories-20250805.pdf`)
The agreed, authoritative specification for both user journeys. This is the primary source of truth for feature requirements and must be referenced for any screen-level decision.

Key sections:
- TfL User stories (Dashboard, Route Details, Create Service Change, Service Change Details, Service Request Details, Send to Operator)
- Operator User stories (Dashboard, Service Request Details, Schedule File upload and validation)
- TfL Admin User (extends TfL User with permission management via LDAP — handled externally)
- Permissions model (group-based, state-driven — see Section 5 of this document)
- Service Change and Service Request state definitions

### 2.3 Operator Low-Fi Wireflow (`TFL_Collab_Portal_Low-fi_Flows_-_Operator_User_-_20250805.pdf`)
A low-fidelity flow diagram showing the operator journey from login through to schedule file validation outcome. Shows screen-level layout sketches in TfL branding. Used as navigation/flow reference.

### 2.4 TfL User Low-Fi Wireflows Part 1 & 2
- `TFL_Collab_Portal_Low-fi_Flows_-_Tfl_User_Pt1_-_20250805.pdf` — covers login through to sending a service request to an operator, including the New Tender fork
- `TFL_Collab_Portal_Low-fi_Flows_-_Tfl_User_Pt2_-_20250805.pdf` — covers the post-response flow: operator accepted/rejected, validating state, validation success/failure outcomes, and completion

---

## 3. Technology & Design System

### 3.1 Stack (current prototype)
- Single-file HTML prototype (`tfl-collab-portal.html`)
- Vanilla JavaScript (no framework — to be migrated to React in Claude Code build)
- Google Fonts: Roboto (300, 400, 500, 700)
- Google Material Icons (icon font)
- No external component library — all components are custom-built to spec
- No backend or API connections in prototype — all data is hardcoded as JS arrays

### 3.2 Design Language
**Material Design** — clean, Google Material Design 2 conventions. Not MD3/Material You. Key principles applied:
- Cards with dp1/dp2/dp4/dp8 elevation shadows
- Outlined text fields with floating labels
- Contained, outlined, and text button variants
- Status chips (rounded pill, dot indicator + label)
- Data tables with MD column header typography
- FAB (floating action button) for primary dashboard action
- Snackbar for non-critical feedback (replaces alerts)
- Dialogs with slide-up animation and scrim overlay
- Breadcrumb navigation on all post-dashboard screens

### 3.3 Colour Tokens
```
--pri:       #003688   (TfL blue — primary brand colour)
--pri-dark:  #002a6e   (hover state for primary)
--pri-light: #e8edf7   (light blue tint — chip backgrounds, hover fills)
--acc:       #DC241F   (TfL red — accent, FAB, destructive actions)
--surf:      #FFFFFF   (card and dialog surfaces)
--bg:        #F5F5F5   (page background)
--on-surf:   #212121   (primary text)
--sec:       #757575   (secondary/muted text)
--div:       #E0E0E0   (dividers and borders)
--err:       #B00020   (error states)
```

### 3.4 Shadow Scale
```
--s1: 0 1px 3px rgba(0,0,0,.12), 0 1px 2px rgba(0,0,0,.24)   (resting card)
--s2: 0 3px 6px rgba(0,0,0,.15), 0 2px 4px rgba(0,0,0,.12)   (hover / raised)
--s4: 0 10px 20px rgba(0,0,0,.15), 0 3px 6px rgba(0,0,0,.10) (dialog, FAB)
--s8: 0 15px 25px rgba(0,0,0,.15), 0 5px 10px rgba(0,0,0,.05) (FAB hover)
```

### 3.5 Status Chip Colours
All status chips use the `.sc` base class plus a status modifier. Each chip has a coloured dot before the label.

| Status | Background | Text | Dot |
|---|---|---|---|
| pending | #FFF8E1 | #E65100 | #FFB300 |
| complete | #E8F5E9 | #2E7D32 | #43A047 |
| deleted / abandoned | #FAFAFA | #757575 | #BDBDBD |
| failed | #FFEBEE | #C62828 | #EF5350 |
| waiting | #FFF8E1 | #E65100 | #FFB300 |
| validated | #E8F5E9 | #2E7D32 | #43A047 |
| validating | #E3F2FD | #1565C0 | #1E88E5 |

### 3.6 Typography Scale
- Page headings (h1): 24px, weight 400, Roboto
- Card titles: 20px, weight 500, Roboto
- Section banners (doc): 20px, weight 500, white on TfL blue
- Table headers: 12px, weight 500, secondary text colour
- Table body: 13px, weight 400
- Primary table cell (route numbers, IDs): 14px, weight 500, TfL blue
- Secondary/muted table cell: 12px, secondary text colour
- Buttons: 14px, weight 500, uppercase, letter-spacing 0.089em
- Labels/chips: 12px, weight 500

---

## 4. Screen Inventory & Navigation

### 4.1 Screens Built in Prototype

| Screen ID | Name | Route (suggested) |
|---|---|---|
| `s-login` | Login | `/login` |
| `s-dash` | Dashboard | `/dashboard` |
| `s-route` | Route Details | `/routes/:routeId` |
| `s-sc` | Service Change Details | `/routes/:routeId/changes/:scId` |
| `s-sr` | Service Request Details | `/routes/:routeId/changes/:scId/requests/:srId` |

The prototype uses a simple `go(screenId)` function for navigation between screens. In the React build this should be replaced with React Router.

### 4.2 Navigation Structure

```
Login
  └── Dashboard (routes table)
        ├── [FAB / button] → Create Service Change dialog
        └── Route row click → Route Details
              ├── [button] → Create Service Change dialog
              └── Service Change row click → Service Change Details
                    ├── [Edit button] → Edit Service Change dialog
                    ├── [Abandon button] → Abandon confirmation dialog
                    └── Service Request row click → Service Request Details
                          ├── [Edit button] → Edit Service Request dialog
                          ├── [Send to Operator button] → Send to Operator dialog
                          └── Schedule file card (state-dependent)
```

### 4.3 Dialogs (modals)

All dialogs use a `.scrim` overlay + `.dlg` card. Clicking the scrim closes the dialog.

| Dialog ID | Trigger | Purpose |
|---|---|---|
| `d-sc-dialog` | "New Service Change" button / FAB | Create or edit a service change |
| `d-sr-dialog` | "Edit" on SR Details | Edit service request title, description, message |
| `d-send-dialog` | "Send to Operator" button | Select recipients and send SR |
| `d-abandon` | "Abandon" on SC Details | Confirm abandonment of a service change |

---

## 5. Data Models

### 5.1 Route
```javascript
{
  r: string,           // Route number e.g. '25', 'N25', 'X26'
  op: string,          // Operator name e.g. 'Arriva London'
  from: string,        // Start terminus
  to: string,          // End terminus
  mod: string,         // ISO date string e.g. '2025-05-14' (for sorting)
  disp: string,        // Display date e.g. '14 May 2025'
  st: string,          // Status: 'pending' | 'complete'
}
```

### 5.2 Service Change
```javascript
{
  id: string,          // e.g. 'SC-001'
  route: string,       // Route number
  op: string,          // Operator name (or 'UNKNOWN' for new tender)
  implDate: string,    // DD/MM/YYYY
  specName: string,    // Route spec name
  type: string,        // 'Stop Sequence Change' | 'Timetable Change' | 'Diversion' | 'New Tender' | 'Service Withdrawal'
  st: string,          // 'pending' | 'complete' | 'deleted' | 'abandoned'
  desc: string,        // Description text
  deleted: boolean,    // Whether archived (hidden by default)
}
```

**Service Change states (from user stories):**
- `pending` (amber) — in progress
- `complete` (green) — received a validated schedule file
- `deleted` (grey) — abandoned

### 5.3 Service Request
```javascript
{
  id: string,          // e.g. 'SR-001'
  title: string,       // e.g. 'Stop Sequence — Route 25'
  scRef: string,       // Parent service change ID
  route: string,       // Route number
  op: string,          // Operator name
  due: string,         // DD/MM/YYYY
  st: string,          // See states below
  updated: string,     // Display date e.g. '09 May 2025'
}
```

**Service Request states (from user stories):**

TfL user view:
- `pending` (amber) — in progress, not yet sent to operator
- `waiting` (amber) — sent, no schedule file received yet
- `validating` (amber/blue) — schedule file received, Novus validating
- `failed` (red) — validation failed
- `validated` (green) — validation successful

Operator user view:
- `waiting` — sent to them, awaiting their response
- `validating` — they uploaded a file, Novus is validating
- `failed` — validation failed, needs a new file
- `validated` — complete

### 5.4 Document (attachment)
```javascript
{
  name: string,        // Filename e.g. 'StopSeq_R25_v1.2.mdv'
  by: string,          // Uploaded by (person name)
  op: string,          // Operator name (empty string if TfL-uploaded)
  date: string,        // Display datetime e.g. '09 May 2025 14:32'
}
```

### 5.5 Recipient (operator user)
```javascript
{
  id: number,
  name: string,
  email: string,
  op: string,          // Operator name
  sel: boolean,        // Selected state (UI only)
}
```

### 5.6 Dummy Data (current prototype)
The prototype uses the following real TfL routes and operators as dummy data:

| Route | Operator | From | To |
|---|---|---|---|
| 25 | Arriva London | Oxford Circus | Ilford |
| 73 | Arriva London | Victoria | Stoke Newington |
| 38 | Arriva London | Victoria | Clapton Pond |
| N25 | Arriva London | Oxford Circus | Ilford |
| 8 | Go-Ahead London | Bow Church | Tottenham Court Rd |
| 55 | Go-Ahead London | Oxford Circus | Hackney Wick |
| 48 | Go-Ahead London | Walthamstow Central | London Bridge |
| 15 | Tower Transit | Trafalgar Square | Blackwall |
| N15 | Tower Transit | Trafalgar Square | Romford |
| 205 | Metroline | Paddington | Bow |
| 390 | Metroline | Archway | Notting Hill Gate |
| X26 | Metrobus | Croydon | Heathrow Airport |

---

## 6. Component Patterns

### 6.1 App Bar
Fixed top bar, 64px height, TfL blue background. Contains:
- Left: hamburger icon button, TfL roundel SVG, title text
- Right: notifications icon, help icon (where applicable), user avatar + name + dropdown arrow, logout icon

The TfL roundel is an inline SVG — red circle, blue horizontal bar, white "TfL" text. Do not use an image file.

```html
<!-- Roundel SVG -->
<svg width="34" height="34" viewBox="0 0 44 44">
  <circle cx="22" cy="22" r="20" fill="#DC241F"/>
  <rect x="2" y="17" width="40" height="10" fill="#003688"/>
  <text x="22" y="25.5" text-anchor="middle" fill="#fff" font-size="7" font-weight="700" font-family="Roboto,sans-serif">TfL</text>
</svg>
```

On the login screen, the app bar has no user controls — just roundel and title.

### 6.2 Card / Dashlet
```
.card → white background, border-radius 4px, shadow s1
  .card-hd → padding 16px 24px, flex row, border-bottom divider, min-height 64px
    .card-title → 20px weight 500, inline chip for count
    .card-sub → 12px secondary text
    [action buttons right-aligned]
  [.tbl-bar] → search field + info label
  [.tbl-wrap] → overflow-x auto wrapper for table
  [.tbl-foot] → pagination row
```

### 6.3 Data Table
Standard MD table pattern:
- `thead th` → 12px, weight 500, secondary colour, clickable for sort, `thi` inner span with sort icon
- `tbody tr` → hover state rgba(0,54,136,.04), cursor pointer
- Primary data cells (IDs, route numbers) → `.td-p` class, TfL blue, weight 500
- Secondary/metadata cells → `.td-muted` class, secondary colour, 12px
- Operator names → `.op-pill` chip (light grey background, blue-grey text)

### 6.4 Info Grid (detail panels)
Used on Route Details, Service Change Details, and Service Request Details to display key-value pairs:
```css
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px 24px;
  padding: 20px 24px;
}
.info-item label { /* 11px uppercase secondary label */ }
.info-item span  { /* 14px value text */ }
```
Values can contain HTML (e.g. a status chip inline).

### 6.5 Outlined Text Field with Floating Label
```html
<div class="tf [fl]">  <!-- add 'fl' class if value is pre-populated -->
  <input type="text" placeholder=" " />
  <label>Field Label</label>
</div>
```
The `fl` class forces the label into its floated (small, top) position. This is needed for read-only fields and pre-populated fields where `:not(:placeholder-shown)` doesn't fire.

For `select` elements, the label is always floated (via CSS) since selects don't support the placeholder trick.

### 6.6 Status Chip
```html
<span class="sc sc-{status}">{Label}</span>
```
Status values: `pending`, `complete`, `deleted`, `abandoned`, `waiting`, `validated`, `validating`, `failed`

### 6.7 Schedule File Card (Service Request Details)
The file card renders differently depending on SR status. This is the most complex stateful UI element in the prototype:

| SR Status | Card shows |
|---|---|
| `pending` | Dropzone for MDV/VDV upload (TfL view only — TfL doesn't upload, but operator does) |
| `waiting` | Holding message: awaiting operator upload |
| `validating` | Progress indicator: Novus is validating |
| `validated` | Success banner + file row + Download Report + Download File buttons |
| `failed` | Error banner + file row + Download Error Report + Replace File buttons |

For the **operator** view, the pending/waiting states are reversed — the operator sees the upload dropzone when the status is `waiting` (it's been sent to them and they need to respond).

### 6.8 Calendar (Route Details)
A custom month-view calendar rendered with a CSS grid (7 columns, Mon–Sun). Each day cell shows coloured trip-type tags:
- Mon–Fri days: `tt-mf` tag (blue) labelled "Mon–Fri"
- Saturday: `tt-sa` tag (purple) labelled "Sat"
- Sunday: `tt-su` tag (amber) labelled "Sun"

Data comes from Novus (in the wired build). In the prototype it is generated procedurally from the day of week. The calendar has prev/next month navigation.

### 6.9 Send to Operator Dialog
Contains:
1. Operator filter dropdown (filters recipient list by operator)
2. Recipient list — checkbox rows, each showing name, email, operator pill
3. Selected count display
4. Message textarea (optional, pre-populated with SR message)
5. Send button (disabled if no recipients selected)

For New Tender service changes (operator = UNKNOWN), all operators in the system are shown. For standard service changes, only operators assigned to the route are shown.

On send: SR status updates to `waiting`, file card updates to waiting state.

---

## 7. Key Workflow Logic

### 7.1 Create Service Change
1. User selects a route from the dropdown
2. Operator is **auto-populated** from the route (read-only field)
3. If route is "UNKNOWN (New Tender)", operator field shows "UNKNOWN"
4. User selects a Type — this **pre-populates the Description field** with a template string
5. User can always edit the description manually
6. Required fields: Title, Type, Route, Implementation Date

**Description templates by type:**
- Stop Sequence Change: "This service change relates to a stop sequence modification. Please review the updated stop order and provide a revised schedule file reflecting the agreed changes."
- Timetable Change: "This service change relates to a timetable amendment. Please review the revised departure times and return an updated schedule file for validation."
- Diversion: "This service change relates to a temporary or permanent route diversion. Please review the revised routing and provide an updated schedule file."
- New Tender: "This service change relates to a new tender exercise. Please review the route specification and submit your proposed schedule file in MDV or VDV format."
- Service Withdrawal: "This service change relates to a planned service withdrawal. Please confirm the final date of operation and return all required documentation."

### 7.2 Service Changes Table Sorting
The service changes table on Route Details sorts by implementation date **ascending** (soonest first) by default, so the next upcoming service change is always at the top of the list.

### 7.3 Archived (Deleted) Service Changes
Deleted/abandoned service changes are hidden by default. A "Show archived" checkbox in the card header toggles their visibility. When a service change is abandoned, its status becomes `deleted` and `deleted: true`.

### 7.4 Service Requests Table Sorting
The service requests table on Service Change Details sorts by due date ascending (soonest first) by default.

### 7.5 Abandon Service Change
- Triggers a confirmation dialog before acting
- On confirm: status → `deleted`, `deleted: true`, navigate back to Route Details
- **Cannot be triggered while a service request is in `validating` status** (guard not yet implemented in prototype — noted for wired build)

### 7.6 New Tender Workflow
When a service change has operator = UNKNOWN:
- The Send to Operator dialog shows all operators (not filtered to route)
- On send, the portal should duplicate the service request for each selected operator (back-end logic, not implemented in prototype)
- New Tender service changes and their requests have restricted visibility — only these permission groups can see them: Admin, Contracts Tendering and Evaluation, PTSP: Specification Team

---

## 8. Permissions Model

Group-based, state-driven permissions. When object status changes, permissions auto-update.

### 8.1 TfL User Groups (edit access)
- Contracts Tendering and Evaluation
- Monitoring & Implementation: Data
- Performance Team
- PTSP: Specification Team
- Admin

All other TfL users have read-only access.

### 8.2 Visibility Rules
- All statuses visible to everyone **except** `Provisional Confidential` — only visible to: Contracts Tendering and Evaluation, Monitoring & Implementation: Data, Performance Team, PTSP: Specification Team, Admin
- New Tender service changes and associated requests — only visible to: Admin, Contracts Tendering and Evaluation, PTSP: Specification Team

### 8.3 Operator Permissions
- Operators can only see service changes and requests for routes assigned to them, or UNKNOWN operator routes
- Operators cannot edit service requests — read only
- Operators can upload schedule files and reject with a reason

### 8.4 Authentication
- Username/password as baseline (LDAP/SSO is a separate TfL workstream, handled externally)
- Permissions are dynamically applied based on the authenticated user's group membership

---

## 9. Novus Integration Points

The prototype uses hardcoded data throughout. The wired build will need to integrate with the Novus database for the following:

| Data | Source | Required By |
|---|---|---|
| Route list (number, operator, termini) | Novus DB | Sprint 1 |
| Route schedule calendar (trip types per day) | Novus DB | Sprint 1 |
| Service change and request data | Novus DB | Sprint 2 |
| MDV file validation (trigger + result polling) | Novus validation API | Sprint 3 |
| Historical data migration | Novus DB | Sprint 5 |

Service requests are **created from within Novus** (not from the portal UI). When a user creates a service request in Novus, it automatically appears in the portal associated with the correct service change. The portal UI does not have a "Create Service Request" button — it shows a prompt directing users to Novus if no requests exist yet.

---

## 10. Email Notifications

The following notifications need to be sent by the system (not implemented in prototype):

| Event | Recipient |
|---|---|
| Service request sent to operator | Operator user(s) selected |
| Operator rejects a service request | TfL user who created the service change |
| Schedule file validated successfully | TfL user who created the service change |
| Schedule file validation failed | Operator user who submitted the file |

---

## 11. Current Prototype State & Known Gaps

### What is built and working in the prototype
- Login screen with error handling (any non-empty credentials accepted)
- Dashboard with routes table, search/filter, sortable columns
- Route Details with info panel, calendar, and service changes table
- Service Change Details with info panel, status chip, edit/abandon dialogs
- Service Request Details with info panel, dynamic schedule file card (all states), documents table
- Send to Operator dialog with recipient selection, operator filter, and state update on send
- Abandon service change with confirmation and archiving
- Create/Edit Service Change dialog with route → operator auto-assign and type → description templating
- Breadcrumb navigation throughout
- Snackbar feedback
- All status chip states rendering correctly
- Material Design component library (buttons, cards, tables, dialogs, chips, text fields, FAB)

### What is stubbed / not yet implemented
- **Operator user journey** — operator login, operator dashboard, operator SR details are not yet separate screens. The prototype only covers the TfL user journey fully.
- **Send to Operator** — sends correctly in UI (status updates) but back-end call and actual email notification not wired
- **Schedule file upload** — dropzone UI is present but file picker is not functional
- **MDV validation** — validation states render correctly as static UI; Novus API not connected
- **New Tender duplication** — service request duplication per operator not implemented
- **Abandon guard** — cannot abandon during validation check not implemented
- **Permissions enforcement** — all content visible to all users in prototype; permission groups not enforced
- **Real authentication** — any credentials accepted; session management not implemented
- **Novus data** — all data is hardcoded; no API calls
- **Pagination** — pagination UI is present but non-functional (all rows shown)
- **User profile screen** — shows toast only
- **Notifications** — shows toast only

### Recommended next build priorities
1. Operator user journey (separate login role, operator dashboard, operator SR details with upload)
2. Authentication with role detection (TfL user vs operator user)
3. React component migration (the prototype is single-file HTML — needs componentising for maintainability)
4. Novus route data API integration
5. MDV file upload and validation pipeline

---

## 12. File Format Notes

- **MDV** — the schedule file format used by TfL operators. Structurally similar to VDV (which is used in other markets). Both MDV and MDV-in-ZIP are valid upload formats.
- Do **not** reference VDV in any TfL-facing UI copy. MDV is the correct term for TfL.
- Validation is performed by Novus on the server side. The portal triggers validation on upload, polls for result, and renders the outcome (validated / failed + error report download).

---

## 13. Naming & Brand Conventions

- The platform is always called **"Collaboration Portal"** or **"TfL Collaboration Portal"**
- Naviquate is the supplier/developer — referenced in footers and documentation
- The underlying platform is **Novus** — referenced in technical contexts (validation, data source)
- **Never reference other Naviquate customers** in any TfL-facing material
- **Never reference "VDV"** in TfL-facing copy (MDV only)
- **Never reference "Alfresco"** in TfL-facing copy (it is the legacy system being replaced, but TfL does not need reminding of it in the product itself)
- **Never reference "Trapeze"** — the former company name; Naviquate is the current brand
- TfL roundel: always inline SVG, never an image file, always red circle (#DC241F) + blue bar (#003688) + white "TfL" text

---

## 14. React Migration Notes

When migrating the prototype to React in Claude Code, the following component breakdown is recommended:

```
src/
  components/
    layout/
      AppBar.jsx
      Breadcrumb.jsx
    common/
      Card.jsx
      StatusChip.jsx
      InfoGrid.jsx
      DataTable.jsx
      TextField.jsx (outlined with floating label)
      Dialog.jsx
      Snackbar.jsx
      FAB.jsx
      OperatorPill.jsx
    forms/
      CreateServiceChangeForm.jsx
      EditServiceRequestForm.jsx
      SendToOperatorForm.jsx
    calendar/
      RouteCalendar.jsx
    schedule/
      ScheduleFileCard.jsx   (handles all validation states)
  screens/
    LoginScreen.jsx
    DashboardScreen.jsx
    RouteDetailsScreen.jsx
    ServiceChangeDetailsScreen.jsx
    ServiceRequestDetailsScreen.jsx
  data/
    dummyData.js             (extract current hardcoded arrays)
  styles/
    tokens.css               (CSS custom properties)
  App.jsx                    (router + screen switching)
```

The CSS custom property token set (colours, shadows, app bar height) should be extracted to `tokens.css` and imported globally.

React Router paths should follow: `/`, `/dashboard`, `/routes/:routeId`, `/routes/:routeId/changes/:scId`, `/routes/:routeId/changes/:scId/requests/:srId`

---

*This context document was generated from the prototype build session in Claude.ai. It reflects the state of the prototype as of May 2025 and should be updated as the build progresses.*
