# Business Analysis & Product Requirements Document (PRD)
**Project:** Tiny Kanban  
**Target Audience:** Product Managers, Business Analysts, Stakeholders, Engineering Leads  
**Version:** 1.3.0  
**Status:** Approved for Production

---

## 1. Product Vision & Value Proposition

### 1.1 Problem Statement
Modern project management suites (e.g. Jira, ClickUp, Asana) have evolved into bloated, complex, and slow platforms. Teams waste significant engineering hours waiting on slow page reloads, navigating multi-level configuration menus, and dealing with subscription paywalls for basic agile features like Gantt charts, subtasks, and sprint analytics.

### 1.2 The Tiny Kanban Solution
Tiny Kanban delivers a fast, distraction-free agile workspace that boots in under 200 milliseconds. It features:
- **Instantaneous Kanban Workflow:** Drag-and-drop task boards with zero network lag.
- **Enterprise Team Governance:** Multi-tenant workspace isolation with a Super Admin approval gate for all new signups.
- **Built-in Agile Analytics:** Integrated Gantt timeline, Sprint velocity charts, story points tracking, and effort variance analysis—without third-party plugins.

---

## 2. User Roles & Permission Matrix

The platform enforces four distinct authorization roles:

| Capability / Feature | Public Demo | Pending User | Standard User | Team Admin | Super Admin (`yigitcangenc`) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Browse Demo Board** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Login to Private Workspace** | ❌ | ❌ (Blocked: 403) | ✅ | ✅ | ✅ |
| **Create / Edit / Delete Cards** | ✅ (Demo only) | ❌ | ✅ (Assigned WS) | ✅ (Team WS) | ✅ (All WS) |
| **Manage Epics & Sprints** | ✅ (Demo only) | ❌ | ✅ | ✅ | ✅ |
| **Invite Team Members** | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Approve / Reject New Users** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Inspect System Audit Logs** | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Switch Across Workspaces** | ❌ | ❌ | ✅ (Permitted WS) | ✅ | ✅ (Global) |

---

## 3. Core Functional Modules

### 3.1 User Registration & Approval Gate (Anti-Spam & Security)
- **Self-Registration Portal:** Available at `/register` and `/register.html`.
- **Approval Workflow:**
  1. A prospective user enters their name, email/username, password, and optional company name.
  2. The system provisions their user account with `status: 'pending'`.
  3. The user cannot log in and receives an informative prompt: *"Hesabınız Super Admin onayını beklemektedir"*.
  4. An in-app notification (`type: 'user-signup-request'`) and audit log entry (`REGISTER_REQUEST`) are dispatched to the Super Admin.
  5. The Super Admin reviews the applicant in the Admin Console and clicks **Kabul Et** (`approve`) or **Reddet** (`reject`).
  6. Upon approval (`status: 'approved'`), the user gains immediate login privileges.

### 3.2 Kanban Board & Workflow Views
- **Board View:** Classic Kanban layout with three primary columns: `YAPILACAK` (To Do), `YAPILIYOR` (Doing), `TAMAMLANDI` (Done). Supports fluid HTML5 drag-and-drop.
- **List View:** Compact tabular view sorted by status, priority, due date, and story points.
- **Backlog View:** Grouped sprint backlog view allowing product owners to prioritize cards into future sprints or park them in the unassigned backlog.
- **Gantt Timeline:** Visual calendar bar chart displaying task durations (`startDate` to `dueDate`), active sprints, and multi-month zoom scaling.
- **Reports & Dashboard:** Agile metrics dashboard displaying:
  - Total story points completed vs planned.
  - Team effort variance (Estimated Effort vs Spent Effort hours).
  - Task completion ratio by priority and epic.

### 3.3 Task Details & Collaboration
Every task card supports deep collaboration attributes:
- **Unique Identifier:** Auto-incrementing identifier (`TK-1`, `TK-2`, ...).
- **Assignee Selection:** Dropdown populated by verified team members with color-coded avatar badges.
- **Story Points & Effort:** Fibonacci story points (1, 2, 3, 5, 8, 13) and hourly effort tracking.
- **Checklist Subtasks:** Interactive subtask checklist with instant completion toggles.
- **Discussion Thread:** Comment history with author name, avatar badge, and locale timestamp.
- **Labels & Epics:** Categorization by high-level business initiatives (Epics) and taxonomy badges (Bug, Feature, DevOps, Security, AI, Design).

---

## 4. Acceptance Criteria & Business Rules

1. **Rule 1 (Zero Data Loss):** Under no circumstances should user cards or historical tickets be deleted or overwritten without explicit user action.
2. **Rule 2 (Server Confirmation):** Every task creation, update, drag-and-drop column change, or deletion must receive positive server acknowledgement (HTTP 200/201). Silent fallback to local browser memory is strictly prohibited.
3. **Rule 3 (Super Admin Supremacy):** The system owner accounts (`yigitcangenc@gmail.com` and `gencyigitcan`) must always maintain Super Admin status, bypass registration approval, and hold permanent access to the primary personal workspace.
4. **Rule 4 (Auditing Integrity):** Any administrative intervention (approving a user, rejecting a user, removing an account, altering board states) must record an immutable audit log entry visible to Super Admins.
