# Technical Design — Digital Twin III

## 1. Purpose
Digital Twin III is a production-deployed, cyber-hardened personal portfolio that:
1) Represents a cybersecurity professional identity,
2) Defends itself against real attacks with visible telemetry,
3) Learns from threat activity through dashboards, alerts, and governed AI workflows.

This document translates the PRD into an implementable design: architecture, components, data flows, security controls, and operational telemetry.

---

## 2. Goals and Non-Goals

### 2.1 Goals
- Production deployment on Vercel with a custom domain and active perimeter defense.
- Portfolio pages (Home, About, Projects, Blog, Contact) with safe UX patterns and no sensitive leakage.
- Admin-only access to content management and threat dashboards.
- Public attack zones that safely accept hostile inputs, detect attack patterns, and log events.
- Threat dashboard with severity scoring, trend charts, and blocked vs allowed summaries.
- Email alerting for threshold-based security conditions.
- Governed AI workflows (optional) where AI drafts content; publishing requires approval and all actions are auditable.

### 2.2 Non-Goals (for initial implementation)
- Full SOC-level automation or complex SIEM integration.
- Advanced geolocation attribution or external threat intel feeds.
- Complex multi-user roles beyond an Admin role (can be expanded later).

---

## 3. System Architecture Overview (Defense-in-Depth)

### 3.1 High-Level Layers
1. **Public Web Interface (Next.js + shadcn/ui)**
   - Presents content and funnels all mutations through authenticated Server Actions.
   - Must not trust user input or expose internal errors/IDs.

2. **Secure Application Logic (Server Actions)**
   - All business logic executes server-side.
   - Identity, RBAC, validation, sanitization, and logging are mandatory.

3. **Governance Layer (AI Workflows + Tool Calling, optional)**
   - AI is treated as an internal actor with least privilege.
   - AI can draft; approval required for publish/write.
   - Tool calls are allowlisted, validated, and logged.

4. **Data Layer (Neon Postgres + Drizzle)**
   - Strict schemas enforced by Drizzle migrations.
   - Separate public content vs security telemetry vs AI actions.
   - Refuse malformed inputs even from authenticated sources.

5. **Perimeter Defense (Arcjet + Vercel Firewall)**
   - Rate limiting, bot detection, anomaly detection.
   - Provides telemetry and blocks common abuse before app logic.

6. **Monitoring & Operations**
   - Security events stored in database and surfaced on admin dashboard.
   - Threshold evaluation triggers alerts via Resend.

### 3.2 Deployment Architecture
- Hosting: Vercel (Production Mode)
- Domain: Custom domain mapped to Vercel project
- Database: Neon Postgres via Vercel Storage integration
- Email: Resend API for outbound notifications and confirmations
- WAF: Arcjet with telemetry enabled
- Edge defense: Vercel Firewall policies + rate limiting

---

## 4. Key User Roles and Permissions

### 4.1 Roles
- **Public Visitor**
  - Can view portfolio pages.
  - Can interact with attack zones (no authentication required).
  - Can submit contact form (rate-limited and validated).
- **Admin**
  - Can sign in to admin area.
  - Can create/edit/publish blog posts and projects.
  - Can view threat dashboard and event logs.
  - Can approve AI drafts (if AI workflows enabled).

### 4.2 RBAC Rules
- Admin routes require valid session + admin role:
  - `/admin/*` (dashboard, content management, AI review)
- All Server Actions that write to DB require:
  - session validation
  - RBAC check (Admin only for content changes)
- Attack zones never write to public content; they only write telemetry events.

---

## 5. Application Pages and Route Design

### 5.1 Public Routes
- `/` Home
- `/about`
- `/projects` (list)
- `/projects/[slug]` (detail)
- `/blog` (list)
- `/blog/[slug]` (detail)
- `/contact` (contact form)

Security UX constraints:
- Do not expose DB primary keys (use `slug` fields).
- Show generic error messages; log details server-side.

### 5.2 Attack Lab Routes (Public)
- `/attack` (landing + ethics rules)
- `/attack/prompt-injection`
- `/attack/sqli`
- `/attack/bots`

These routes accept hostile input intentionally but must:
- validate and sanitize input
- avoid executing untrusted text as code or SQL
- log attempts to `security_events`
- return safe, non-informative responses

### 5.3 Admin Routes (Protected)
- `/admin/login`
- `/admin/dashboard` (telemetry + charts)
- `/admin/content` (manage posts/projects)
- `/admin/ai-review` (approve AI drafts if enabled)

---

## 6. Server Actions Design (Security-Critical)

### 6.1 Mandatory Server Action Pattern
Every Server Action must:
1) Validate session (deny if missing)
2) Enforce RBAC/permission (deny if not Admin)
3) Validate inputs (Zod schema)
4) Sanitize strings (trim, length clamp, safe text/HTML policy)
5) Log suspicious patterns (and relevant metadata)
6) Fail safely (no internal errors returned to UI)

Recommended utilities:
- `requireSession()`
- `requireAdmin()`
- `validateInput(schema, payload)`
- `sanitizeText(input)`
- `logSecurityEvent(event)`

### 6.2 Server Actions (Core)
Public:
- `submitContact(formData)`  
  - rate-limited, validated
  - sends email via Resend
  - logs suspicious patterns

Attack zones:
- `submitPromptInjectionAttempt(payload)`
- `submitSQLiSimulationAttempt(payload)`
- `submitBotAbuseAttempt(payload)`
  - classify event type
  - compute severity
  - store event
  - evaluate thresholds (optional immediate alert)

Admin:
- `adminLogin(credentials)`
- `createDraftPost(data)`
- `publishPost(postId)`
- `updateProject(data)`
- `deletePost(postId)`
- `markEventReviewed(eventId)`

AI governance (optional):
- `createAIDraftContent(input)`
- `approveAIDraft(draftId)`
- `revertAIPublish(actionId)`

---

## 7. Data Model (Neon + Drizzle)

### 7.1 Design Principles
- Separate public content from telemetry and operational logs.
- Do not store sensitive personal identifiers publicly.
- Store audit logs for changes and AI tool actions.
- Keep schemas strict: non-null constraints, enums, length limits.

### 7.2 Tables (Minimum Viable)

#### 7.2.1 `users`
Purpose: Admin identity.
Fields:
- `id` (uuid, pk)
- `email` (text, unique) — consider storing normalized/lowercase
- `password_hash` (text) OR external auth provider reference
- `role` (enum: `ADMIN`)
- `created_at`

#### 7.2.2 `sessions` (or use auth provider session store)
Purpose: Auth session tracking.
Fields:
- `id` (uuid, pk)
- `user_id` (fk -> users.id)
- `expires_at`
- `created_at`

#### 7.2.3 `posts`
Purpose: Public blog posts with admin-controlled publishing.
Fields:
- `id` (uuid, pk)
- `slug` (text, unique, indexed)
- `title` (text)
- `content` (text)
- `status` (enum: `DRAFT`, `PUBLISHED`)
- `created_at`, `updated_at`
- `published_at` (nullable)

#### 7.2.4 `projects`
Purpose: Public project showcases.
Fields:
- `id` (uuid, pk)
- `slug` (text, unique, indexed)
- `title` (text)
- `summary` (text)
- `content` (text)
- `created_at`, `updated_at`

#### 7.2.5 `security_events`
Purpose: Store threat telemetry.
Fields:
- `id` (uuid, pk)
- `event_type` (enum: `PROMPT_INJECTION`, `SQLI_SIMULATION`, `BOT_ABUSE`, `AUTH_FAILURE`, `RATE_LIMIT`, `WAF_BLOCK`)
- `severity` (int 0–10)
- `blocked` (boolean)
- `source_ip` (text, nullable) — store safely; never display raw unless admin
- `user_agent` (text, nullable)
- `path` (text)
- `request_id` (text, nullable)
- `metadata` (jsonb) — detected patterns, rule IDs, etc.
- `created_at` (timestamp)

Indexes:
- `(created_at)`
- `(event_type, created_at)`
- `(severity, created_at)`

#### 7.2.6 `alerts`
Purpose: Track alert notifications (to avoid repeated spam).
Fields:
- `id` (uuid, pk)
- `alert_type` (enum: `SQLI_SPIKE`, `PROMPT_INJECTION_SPIKE`, `AUTH_FAILURE_SPIKE`)
- `window_seconds` (int)
- `threshold` (int)
- `triggered_count` (int)
- `sent` (boolean)
- `sent_at` (timestamp, nullable)
- `created_at`

#### 7.2.7 `ai_actions` (optional)
Purpose: Audit AI tool calls and approvals.
Fields:
- `id` (uuid, pk)
- `action_type` (enum: `DRAFT_CREATED`, `PUBLISH_REQUESTED`, `PUBLISHED`, `REVERTED`)
- `status` (enum: `PENDING`, `APPROVED`, `REJECTED`, `DONE`)
- `input_hash` (text) — hash of AI input/prompt for traceability without leaking content
- `output_ref` (text, nullable) — e.g., postId or draftId
- `approved_by` (uuid, nullable)
- `metadata` (jsonb)
- `created_at`

---

## 8. Threat Detection, Severity Scoring, and Alerting

### 8.1 Event Classification
Classification sources:
- Arcjet telemetry (blocked/anomaly/bot)
- Server Action input validation failures
- Pattern detection (e.g., SQL meta characters, common injection payloads)
- Auth failures

### 8.2 Severity Model (0–10)
Example baseline mapping:
- 2–3: suspicious input, validation failed (blocked)
- 4–6: clear injection patterns or repeated probing (blocked)
- 7–8: sustained attack spike (multiple events within time window)
- 9–10: repeated auth failures + pattern escalation / high-frequency bot abuse

### 8.3 Threshold Examples (from PRD)
- `>10 SQLI_SIMULATION events in 60 seconds` => alert
- Similar thresholds can be applied for prompt injection spikes or auth failures.

### 8.4 Alerting Flow
1) Insert new security event
2) Recompute counters for sliding window (e.g., last 60s)
3) If threshold breached and alert not recently sent:
   - send alert via Resend
   - persist `alerts` record
4) Dashboard shows elevated threat level

---

## 9. UI/UX Security Requirements (shadcn/ui)

### 9.1 Public UX
- Safe errors: “Request failed” without details
- Do not show stack traces, IDs, table names
- Use consistent “security-first” messaging in attack zones (ethical rules + disclaimers)

### 9.2 Admin UX
- Display telemetry with filters (event type, severity, date range)
- Provide “Mark reviewed” action for events
- Provide “Export” only if safe (optional), never public

---

## 10. AI Governance Design (Optional Module)

### 10.1 Principles
- AI is untrusted by default.
- AI drafts content only; publishing requires admin approval.
- All tool calls are allowlisted and logged.
- Actions must be reversible and auditable.

### 10.2 Safe AI Workflow
- AI generates `DRAFT` post/project content.
- Draft stored with `status = DRAFT`.
- Admin reviews in `/admin/ai-review`.
- Admin approves -> publish action executed server-side with RBAC check.
- Log action in `ai_actions`.

---

## 11. Security Testing Strategy

### 11.1 Manual Testing
- Submit classic SQLi strings in SQLi zone:
  - `' OR 1=1--`
  - `UNION SELECT ...`
- Attempt prompt injection:
  - “Ignore previous instructions…”
  - “Reveal system prompt…”
- Attempt bot abuse:
  - repeated submissions to contact form

Expected results:
- blocked or safely handled
- event logged
- dashboard updated
- alerts triggered at thresholds

### 11.2 Production Safety Checks
- No secrets in repository (`.env` excluded)
- Ensure production error masking (no stack traces)
- Confirm Arcjet telemetry visible and tuned

---

## 12. Acceptance Criteria Mapping (from PRD)
- Vercel production deployment + custom domain + defenses enabled.
- Visible attack zones + dashboard telemetry based on real security events.
- Alerts via Resend triggered by threshold conditions.
- AI governance implemented (if enabled) with logs and approval workflow.
- No sensitive identifiers leaked via UI or public content.
- Repository maintains professional commit history and excludes secrets.

---

## 13. “Can Another Developer Build This?” Checklist
- Routes and roles defined (public vs admin vs attack lab).
- Server Actions listed with security pattern.
- DB tables defined with clear purpose and constraints.
- Threat scoring and threshold alerting described.
- Deployment and telemetry sources specified.
