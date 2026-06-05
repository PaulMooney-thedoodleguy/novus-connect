# TfL Collaboration Portal

A web-based prototype for Transport for London's bus operator Collaboration Portal — built by [Naviquate](https://naviquate.com) on top of the Novus platform.

The portal manages the workflow between TfL and its bus operators for handling route specification changes and MDV schedule file submissions. It replaces TfL's existing end-of-life Alfresco-based portal.

---

## Running the prototype

The prototype is a standalone HTML/CSS/JS app — no build step or server required.

Open `tfl-collab-portal/index.html` directly in a browser.

### Demo credentials

Use any password with the following usernames:

| Username | Role |
|---|---|
| `tfl` | Service Change Creator (standard TfL user) |
| `tendering` | Tendering Team (sees New Tender service changes) |
| `readonly` | Read-only TfL user |
| `operator` | Arriva London operator portal |

---

## Project structure

```
tfl-collab-portal/
  index.html              # Full prototype — all screens and logic in one file
  portal.css              # All styles
  portal.js               # All JavaScript

tfl-collab-portal-demo.html   # Standalone single-file demo (self-contained)

resource/
  Agent files/            # Claude Code agent context files (per-role prompts)
  context/                # Project context documents for AI-assisted development
  info/                   # Source documents: user stories, wireflows, Novus guide
```

---

## What's built

- Login screen with role-based demo accounts
- Dashboard — routes table with search, filter, and sortable columns
- Route Details — info panel, schedule calendar, service changes table
- Service Change Details — info panel, edit/abandon dialogs, service requests table
- Service Request Details — dynamic schedule file card (all validation states), documents table
- Send to Operator dialog — recipient selection, operator filter, state update on send
- Create/Edit Service Change — route→operator auto-assign, type→description templating
- Breadcrumb navigation, snackbar feedback, Material Design component library
- New Tender workflow — tender submissions table, award flow, multi-operator invite
- Internal-only service change types — suppress operator UI for Curtailment Addition and Administrative Change

## What's not yet implemented

- **Operator user journey** — operator-specific screens are minimal stubs
- **MDV file upload** — dropzone UI present, file picker non-functional
- **Novus API integration** — all data is hardcoded; no backend calls
- **Authentication** — any credentials accepted; sessions not managed
- **Permissions enforcement** — all content visible to all users in prototype
- **MDV validation pipeline** — validation states render as static UI only
- **Email notifications** — not wired
- **Pagination** — UI present but non-functional

---

## Tech stack

| Layer | Current prototype | Target build |
|---|---|---|
| Framework | Vanilla HTML/CSS/JS | React |
| Routing | `go(screenId)` function | React Router |
| Styling | Custom CSS (Material Design 2) | CSS tokens + component library |
| Data | Hardcoded JS arrays | Novus REST API |
| Auth | None | LDAP/SSO (separate TfL workstream) |

---

## Design system

**Material Design 2** with TfL brand colours.

| Token | Value | Usage |
|---|---|---|
| `--pri` | `#003688` | TfL blue — primary brand |
| `--acc` | `#DC241F` | TfL red — accent, FAB, destructive |
| `--bg` | `#F5F5F5` | Page background |
| `--surf` | `#FFFFFF` | Card and dialog surfaces |

Typography: Roboto (Google Fonts). Icons: Google Material Icons.

---

## Recommended next steps

1. Operator user journey (role-specific login, dashboard, SR details with MDV upload)
2. Authentication with role detection (TfL user vs. operator)
3. React component migration
4. Novus route data API integration
5. MDV file upload and validation pipeline

See `resource/context/TfL_CollabPortal_ClaudeCode_Context.md` for the full technical context, data models, component patterns, and React migration plan.

---

*Developed by Naviquate · Built with Claude Code*
