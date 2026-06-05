# TfL Collaboration Portal — Prototype Feedback & Required Changes
## Context File for Claude Code Review

**Source:** Requirements workshop / prototype walkthrough with TfL (18 May 2026)  
**Participants:** Naviquate: Paul Mooney and Lucy Daniels | TfL: Ken Cheung, Karen Bunn, Ryan Brennan and Dzifa Amenya  
**Prototype:** Collaboration Portal (CP) MVP — early-stage prototype demonstrated during session  
**Purpose of this file:** Ensure Naviquate have a full and clear understanding of TfL's operational service change and tendering workflows, and capture feedback on current prototype. This file is for Claude Code review and implementation planning.

---

## 1. System Overview

The Collaboration Portal (CP) is a web-based tool used by Transport for London (TfL) to manage bus service changes. It works in conjunction with **Novus** — a separate route scheduling and data management system. The two systems are closely coupled: Novus holds the authoritative route and schedule data; CP manages the service change workflow and operator communication.

### Key entities in the data model

| Entity | Description |
|---|---|
| Route | A bus route. Has a route schedule and associated service changes. |
| Route Specification | The formal specification of a route at a point in time. One-to-one with a Service Change. Lives in Novus. |
| Service Change | A planned change to a route. Has a type, status, start date, operator, and description. Parent of Service Requests. |
| Service Request | A request sent to an operator to upload a schedule file. Child of Service Change. Contains file upload/download workflow. |
| Operator | A bus operating company. Has sub-operators (e.g. Arriva London North / South under Arriva London agency). |

### Current workflow (as-is, confirmed in session)

1. User creates a Service Change in CP (title, type, start date, operator, confidential flag, reason/description)
2. User goes to Novus, copies the Route Specification forward, links it to the Service Change reference number
3. User makes route edits in Novus (stop sequence, route trace, etc.)
4. User exports schedule header from Novus — this triggers data transfer to CP
5. User creates a Service Request in CP, selects operator contact(s), sends to operator portal
6. Operator logs in, downloads header, uploads MDV schedule file
7. Validation runs: first pass (CP — is it a valid file type?), second pass (Novus — does it pass schema/route checks?)
8. Errors returned to operator directly; warnings escalated to TfL team for review

### MVP workflow (current prototype — different entry point)

The current MVP inverts step 1: the Service Change is **created in Novus first** and pushed to CP, rather than created in CP. TfL confirmed this is acceptable as long as the linking is automatic and the outcome is the same. **Do not change this unless explicitly instructed.**

---

## 2. User Types & Permissions

Two distinct user profiles use CP. The prototype must support both with appropriate permission gating.

### 2.1 Read-Only Users
- **Who:** Multiple internal TfL departments (broader than initially assumed)
- **What they do:** Look up route information, view historical service changes, check upcoming changes, see contract and garage change history
- **Key screen:** The Route screen — this is their primary and critical touchpoint
- **Permission note:** Visibility is tiered — users can only see information relevant to their permission level. A user with access to a sensitive/pending change will see it; others will not.

### 2.2 Service Change Creators
- **Who:** Smaller core team responsible for creating and managing service changes
- **What they do:** Full workflow — create service changes, link to Novus, send to operators, review submissions
- **Sub-group — Tendering Team:** Restricted sub-set of creators. Can only view and action tender-type service changes. No other user type should be able to see active tender submissions.

### 2.3 Operators
- **Who:** External bus operators (e.g. Arriva London, Go-Ahead, Tower Transit)
- **What they do:** Log in to view their routes, download schedule headers, upload MDV files
- **Operator hierarchy:** Operators log in at the **agency level** (e.g. Arriva London) but the route spec is linked to a specific **sub-operator code** (e.g. Arriva London North). The sub-operator code must be inherited automatically from Novus — operators must not be required to select it manually.
- **Operators only see their own routes.** Operator-level security must be enforced.

---

## 3. Confirmed Workflow Requirements

### 3.1 Service Change creation
- Service change requires: title, type (see types below), start date, operator, confidential/status flag, description/reason
- Description field must display in full (not truncated) when a user drills into a service change
- In the list view, description can be truncated — but the detail view must show the complete text
- The description field is a free-text input — there is no template pre-population. The user types directly into the field.

### 3.2 Service Change types
The following types must be supported. Type determines workflow behaviour:

| Type | Behaviour |
|---|---|
| New Schedule | Standard workflow — operator uploads new schedule |
| Rerouting / Route Variation | Standard workflow — includes route trace changes in Novus |
| Stop Sequence Change | May be internal-only (no operator action required — see 3.5) |
| Curtailment Addition | Internal-only — no operator upload required (see 3.5) |
| New Tender | Multi-operator submission workflow (see 3.3) |
| Administrative Change | Internal-only record — no operator notification |

### 3.3 Tender workflow (NEW — not currently in MVP)
This is the most complex workflow and is not yet implemented. Full requirements:

**Creation:**
- User creates a service change with type = `Tender`
- User copies the route spec forward in Novus and strips all operator-identifying fields (operator, garage, contract code; operator code set to `00`) — this creates a neutral placeholder template
- The resulting service change has no operator assigned — it must display clearly as a tender in the CP route view

**Sending to operators:**
- User selects multiple operators to send the tender to
- The system generates one submission instance per operator (analogous to a Service Request, one per operator)
- Each submission instance is clearly labelled as `Draft` status
- Only the **Tendering Team** user role can view tender submissions

**Operator response:**
- Each operator logs in and sees their own submission instance
- Operator downloads the schedule header
- Operator uploads a draft schedule file (valid MDV format, but marked as a draft — not a finalised schedule)
- Operator may upload multiple times (each upload overwrites the previous draft for that operator)
- Operator does not need to select sub-operator — it is inherited from the route spec

**Award flow:**
- Tendering Team reviews all submissions
- Tendering Team selects the winning operator and clicks Accept
- A confirmation dialog must appear before committing: "Are you sure you want to award this tender to [Operator Name]?" with confirm/cancel options
- On confirmation: winning submission status → `Awarded`; all other submissions are automatically closed/rejected
- Service Change type remains `Tender` but status transitions to reflect the award
- Once awarded, the workflow transitions to standard service change model for subsequent changes (the awarded operator is now linked; future uploads follow the normal re-submission pattern)

**Permissions:**
- Only the Tendering Team role can see tender submissions
- Other operators cannot see other operators' submissions
- The awarded status and the transition to standard workflow should be visible to the standard Service Change Creator role

**Operator withdrawal:**
- An operator withdrawal phase exists between award and commencement but is **handled outside the system** (via email/phone). No system requirement at this time — do not implement.

### 3.4 Standard service change — operator file upload
- User sends a Service Request to an operator (or, if Service Request layer is collapsed — see 3.6 — uploads are directly against the Service Change)
- When sending, the system should default to selecting all contacts for that operator — user can deselect if needed
- An optional message field is available when sending
- Operator downloads the schedule header file
- Operator uploads an MDV schedule file
- **TfL only ever sends schedule headers to operators — not timetable files.** Timetables are published separately. Do not include timetable file sending in the standard workflow.
- Operator re-uploads overwrite the previous file — they do not create duplicate records. The old version is retained in the background (marked deleted) but the active version is always the most recent.

### 3.5 Internal-only service changes (no operator action)
Some service change types do not require operator notification or file upload. Examples: curtailment additions, administrative route record corrections.

**Required behaviour:**
- User must be able to create a service change and make edits in Novus without triggering any operator notification
- No Service Request should be sent
- The change should still be recorded and visible in the route's service change history
- The current workaround is to create a Service Request but not click Send — this is not acceptable long-term
- **Implementation approach:** Either (a) add a boolean flag `requiresOperatorAction` to Service Change, or (b) derive it from the service change type. The type-based approach is preferred as it removes manual decision-making.

### 3.6 Service Request layer — simplification (PENDING TIMELINE APPROVAL)
**Important:** This change is subject to confirmation that it does not impact the July 27 IBUS Phase 2 deadline. Do not implement until Paul confirms PM sign-off.

**Context:**  
The current Service Request layer is largely a workaround in TfL's workflow. For most service changes, there is only one Service Request, and having it as a separate entity adds unnecessary navigation complexity. Multiple Service Requests for one change occur only as a workaround for re-submissions.

**Proposed change:**  
Collapse the upload components (stop sequence, header download/upload) up to the **Service Change level** for the standard workflow. This removes the need to navigate into a Service Request to perform an upload.

**Constraint:**  
Another CP customer uses Service Requests as a genuine structural element. This change must be implemented as a **per-customer configuration option**, not a global removal. For TfL, Service Requests are suppressed; for other customers, they remain. Do not break existing Service Request behaviour for other customers.

---

## 4. CP–Novus Integration Requirements

### 4.1 Sync lag (PRIORITY FIX)
**Current problem:** CP polls Novus on an approximately 10-minute cycle. When a Service Change is created in Novus and pushed to CP, it takes up to 10 minutes to appear in CP. This causes workflow friction and confusion.

**Target behaviour:** Any data push or status change should trigger a near-real-time update, not wait for the next polling cycle. The preferred approach is a save-triggered push rather than a timed poll. Naviquate confirmed the intent is to trigger at the point of saving.

**Note:** This is the likely cause of a separate reported issue where service changes appeared to go missing in the Novus service change view — the delay was causing display inconsistencies. TfL's team has been advised not to use the Novus service change view as a result.

### 4.2 Bilateral sync (target state)
**Current state:** One-directional in MVP (Novus → CP). TfL's existing workflow goes CP → Novus.

**Target state:** Genuine bilateral communication. Specifically:
- Status changes made in Novus (e.g. setting a route to Current) should automatically reflect in CP
- Status changes made in CP should automatically reflect in Novus
- The goal is that users do not need to perform the same status update in both systems

**Note:** This is a target state discussion item, not a current sprint requirement. Flag as a known gap.

### 4.3 Operator code inheritance
When Novus creates or updates a Route Specification, the sub-operator code associated with that spec must be passed to CP automatically. Operators uploading files in CP must not be required to select their sub-operator — the correct code must be pre-assigned from the Novus data. This prevents the cross-operator upload error (operator uploading under the wrong sub-operator code) that exists in the current system.

---

## 5. UI / UX Feedback from Prototype

### 5.1 Things that worked — do not change
- Route-level service change view layout — immediately recognised and understood
- Service change detail view — full description display (not truncated) was explicitly praised
- Operator contact filter with optional message on the Send screen
- Two-layer validation concept (CP format check → Novus schema check)
- Overwrite-not-duplicate behaviour on re-submission

### 5.2 Changes required

#### Route screen
- Must include a **calendar view** showing which schedule runs on which day (e.g. bank holiday schedule assignments, special schedules mapped to specific dates). This view is present in the existing CP and must be replicated. Required for both authority view and operator view.
- Service change list on the route screen must show: service change reference, type, implementation date, route spec name, status. Description can be truncated in this list.

#### Service change detail screen
- Description must be displayed in full — no truncation
- Service change type must be visually prominent (label/badge)
- For tender-type changes, type label must be clearly distinct from standard types

#### Send to operator screen
- Default behaviour: all contacts for the selected operator are pre-selected. User can deselect.
- Optional message field should be present
- For tender sends: multi-operator selection UI required (select all potential operators, send in bulk). This generates one submission instance per operator.

#### Operator portal
- Operator-facing interface must be minimal and simple — the previous CP was rejected by operators due to complexity
- Operator should see: their routes, pending service requests / submissions, a download button for the header file, and an upload button for their schedule file
- No other workflow actions should be exposed to operators
- Operator should not need to select or confirm their sub-operator code — it must be pre-set

#### Validation feedback
- Current validation error messages are bare error codes. Operators are becoming familiar with them, but improving message language (human-readable instructions) is a **future backlog item** — not in current scope. Flag as technical debt.

#### Service change view in Novus
- TfL's team has been told not to use the service change view in Novus due to display issues (likely caused by the 10-minute sync lag). Once the sync lag is resolved (see 4.1), assess whether this view becomes reliable and communicate accordingly.

---

## 6. Known Bugs — Novus (for awareness, not CP codebase)

These are Novus-side bugs flagged during the session. They are not CP code changes, but CP behaviour may be affected by them, and they represent high-priority items for the Novus team.

### Bug 1 — ARC ID Duplication Exception Error (HIGH)
- **Symptom:** When copying a route forward, some routes trigger an exception error preventing the user from saving or extending the route. The error is caused by a duplicate ARC ID in the Novus database.
- **Impact:** Every copy-forward of an affected route perpetuates the error. Resolution requires manual SQL intervention from the dev team.
- **CP impact:** Until resolved, affected routes will block the standard service change creation workflow at the Novus step.
- **Frequency:** Consistent, affecting specific routes.

### Bug 2 — Route Record Trace Description Failure (HIGH)
- **Symptom:** The route trace occasionally fails to correctly describe all roads in the PDF route description output. Some roads are omitted entirely from the description.
- **Impact:** Route descriptions are contractual documents sent to operators and the DfT. Incorrect descriptions are currently being issued in tender documents.
- **CP impact:** CP receives and displays route description data from Novus. If the source data is incorrect, CP outputs will also be incorrect. Verify whether CP performs any independent validation of route description completeness.
- **Workaround (unreliable):** Delete and redraw the affected route section in Novus.

### Bug 3 — Schedule Validation Latency (MEDIUM)
- **Symptom:** Operators occasionally experience up to one hour of validation latency after uploading a schedule file.
- **Cause:** Novus processes file validation sequentially. High-volume timetable uploads block subsequent schedule validations.
- **CP impact:** CP shows a waiting state during validation. Ensure the UI handles long validation waits gracefully — do not time out prematurely or give misleading error messages.

---

## 7. Prioritised Change List for Implementation Planning

Use this list to plan sprint work. Items are ordered by priority within each tier.

### P1 — High Priority (blocking or contractual risk)

| # | Change | Notes |
|---|---|---|
| P1-1 | Fix CP–Novus 10-minute sync lag | Target save-triggered push (Naviquate confirmed intent). Likely cause of service change display issues in Novus view. Owner: Paul / Dev. |
| P1-2 | Implement Tender service change type | Multi-operator send, draft submission status, accept/reject with confirmation, auto-close of losing submissions, tendering-team-only permissions. Full spec in section 3.3. |
| P1-3 | Internal-only service change support | Service changes that do not trigger operator notification. Type-based derivation preferred. Full spec in section 3.5. |
| P1-4 | Confirm and implement operator code inheritance from Novus | Sub-operator code must be pre-assigned on CP Service Requests/submissions — no manual selection by operator. Full spec in section 4.3. |

### P2 — Medium Priority (workflow improvement, pending timeline sign-off)

| # | Change | Notes |
|---|---|---|
| P2-1 | Confirm Service Request layer collapse with PM re: July 27 deadline, then implement if approved | Per-customer config flag required. Must not break other customers. Full spec in section 3.6. |
| P2-2 | Operator portal simplification | Minimal UI: routes, pending items, download, upload. No complex workflow actions. |
| P2-3 | Default-select all operator contacts on Send screen | User can deselect. Prevents missed sends. |
| P2-4 | Tender type visual treatment in route and service change views | Distinct badge/label. Tender submissions restricted to Tendering Team role only. |
| P2-5 | Multi-operator send UI for tenders | Bulk-select operators, generate one submission instance per operator. |

### P3 — Lower Priority (UX improvement / backlog)

| # | Change | Notes |
|---|---|---|
| P3-1 | Add calendar view to Route screen | Schedule-to-day mapping (bank holidays, special schedules). Required for both authority and operator views. Already exists in old CP — replicate. |
| P3-2 | Improve operator-facing validation error messages | Human-readable instructions rather than bare error codes. Future backlog — not current scope. Flag as technical debt. |
| P3-3 | Assess bilateral CP–Novus sync once P1-1 is resolved | Target state: status changes in either system reflect automatically in the other. Currently one-directional. Flag as known gap. |
| P3-4 | Reassess Novus service change view reliability post P1-1 | Currently unreliable due to sync lag. Once fixed, test and communicate to TfL team. |

---

## 8. Questions / Ambiguities to Resolve Before Implementation

The following items were raised during the session but left unresolved. These should be flagged to Paul before implementation begins.

1. **Workflow entry point:** During the session there was a clear steer towards the Novus-first approach on the basis that it provides automatic linking without a manual step. TfL have been asked to formally confirm this as the agreed entry point. Do not finalise the workflow entry point in the prototype until confirmation is received, but Novus-first should be treated as the working assumption.

2. **Service Request layer collapse timeline:** Is the July 27 IBUS Phase 2 deadline impacted by collapsing the Service Request layer? Confirm with PM before designing this change.

3. **Tender — draft vs. awarded file versions:** When an operator re-uploads after award (the finalised schedule replacing the draft), should both versions be retained and viewable? TfL seemed unsure but leant towards keeping the audit trail. Clarify the retention requirement.

4. **Operator withdrawal phase:** After a tender is awarded, there is an industry-standard operator withdrawal period. TfL confirmed this is currently handled outside the system. Confirm there is no system requirement at this stage.

5. **Multi-tender per route:** A route can have multiple service changes open simultaneously. Can a route have multiple active tenders at the same time? TfL discussed this briefly but it was not fully resolved. If yes, each must be independent with its own operator submissions.

6. **Novus route record description in CP outputs:** Does CP independently validate or display route description data from Novus? If yes, assess whether CP should surface a warning when route description data appears incomplete (as a mitigation for Bug 2).

---

*End of context file.*  
*Prepared by: Paul Mooney, Naviquate | 19 May 2026*  
*Source: TfL Service Change Workflow Walkthrough session transcript, AI-assisted notes, and workshop summary.*
