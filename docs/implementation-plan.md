# Implementation Plan — Digital Twin III

## 1. Objective
Translate the approved technical design into an actionable build plan with clear sequencing, dependencies, and AI-assisted workflow checkpoints.

This plan assumes:
- Next.js 16+ App Router + TypeScript
- Server Actions for mutations
- Neon Postgres + Drizzle migrations
- Arcjet WAF + Vercel Firewall
- Resend for email alerting
- Optional governed AI workflows

---

## 2. Work Breakdown Structure (WBS)

### Phase 0 — Repo + Workflow Hygiene (Week 2 completion)
1. Ensure required docs exist:
   - `docs/design.md`
   - `docs/implementation-plan.md`
2. Add evidence folders:
   - `project-management/week2/`
3. Establish conventions:
   - conventional commits
   - branch naming (`feat/*`, `security/*`, `docs/*`)
   - PR flow (even if solo: open PR → self-review → merge)

Dependencies: none

---

### Phase 1 — Project Scaffold + UI Shell
Tasks:
1. Initialize Next.js 16+ app (App Router, TS)
2. Install and configure shadcn/ui
3. Create public routes:
   - Home, About, Projects, Blog, Contact
4. Add layout, navigation, and safe error UI components

AI-assisted steps:
- Generate initial route scaffolding and UI components using AI
Human review:
- Ensure no client-side secrets
- Ensure error messages are generic and safe

Dependencies:
- Repo ready

---

### Phase 2 — Authentication + Admin Boundary (RBAC)
Tasks:
1. Choose auth approach (e.g., NextAuth/Auth.js or custom session)
2. Implement Admin role
3. Protect admin routes:
   - `/admin/dashboard`
   - `/admin/content`
4. Create utilities:
   - `requireSession()`
   - `requireAdmin()`

Human review checkpoints:
- Verify session checks occur on every admin action
- Ensure no unauthenticated writes are possible

Dependencies:
- Phase 1 routes in place

---

### Phase 3 — Database Layer (Neon + Drizzle)
Tasks:
1. Provision Neon Postgres via Vercel Storage
2. Set up Drizzle ORM and migration workflow
3. Implement schemas for:
   - users
   - sessions (if applicable)
   - posts
   - projects
   - security_events
   - alerts
   - (optional) ai_actions
4. Run migrations and validate constraints

AI-assisted steps:
- Generate Drizzle schema boilerplate and migrations
Human review:
- Ensure strict constraints, enums, and indexes
- Confirm separation of public content vs telemetry

Dependencies:
- Auth decisions (users/sessions) partially influence schema

---

### Phase 4 — Secure Server Actions (Business Logic)
Tasks:
1. Build input validation using Zod
2. Build sanitization helpers:
   - trim/normalize
   - max lengths
   - safe text policy
3. Implement core Server Actions:
   - contact submission
   - admin content create/update/publish
   - security event logging
4. Implement centralized logging module:
   - `logSecurityEvent({event_type, severity, blocked, metadata...})`

Human review checkpoints:
- Ensure deny-by-default behavior
- Ensure safe error handling (no stack traces returned)
- Ensure suspicious input triggers event logs

Dependencies:
- DB schema + auth utilities

---

### Phase 5 — Attack Zones (Ethical Testing)
Tasks:
1. Create routes:
   - `/attack`
   - `/attack/prompt-injection`
   - `/attack/sqli`
   - `/attack/bots`
2. Implement safe form submissions via Server Actions
3. Add detection logic:
   - keyword/pattern detection for SQLi attempts
   - prompt injection heuristics (jailbreak phrases)
   - bot abuse patterns (high frequency)
4. Log every attempt to `security_events`
5. Return safe responses that do not reveal internals

AI-assisted steps:
- Generate UI pages and baseline detection patterns
Human review:
- Ensure no untrusted input is executed
- Ensure responses are non-informative to attackers

Dependencies:
- Logging module + DB table `security_events`

---

### Phase 6 — Perimeter Defense (Arcjet + Vercel Firewall)
Tasks:
1. Install and configure Arcjet
2. Enable protections:
   - injection detection
   - bot protection
   - rate limits
3. Enable Vercel Firewall policies:
   - abuse prevention rules
   - edge-side error masking
4. Confirm telemetry is visible and actionable

Human review checkpoints:
- Verify blocked requests are reflected in telemetry
- Tune rules based on observed attempts

Dependencies:
- Routes exist (attack zones help generate real telemetry)

---

### Phase 7 — Threat Dashboard (Admin-only)
Tasks:
1. Build admin dashboard UI:
   - totals and counts
   - blocked vs allowed
   - severity trend chart
   - recent events table
2. Add filters:
   - date range
   - event type
   - severity threshold
3. Implement “Threat level” indicator based on recent events

AI-assisted steps:
- Generate UI components + chart scaffolding
Human review:
- Ensure no sensitive fields displayed to public
- Ensure admin-only enforcement is correct

Dependencies:
- Security events data + admin auth

---

### Phase 8 — Alerting (Resend)
Tasks:
1. Integrate Resend
2. Implement threshold checks:
   - example: >10 SQLi events in 60 seconds
3. Send email alerts when thresholds trigger
4. Store alert records to prevent spam (alerts table)
5. Add dashboard widget showing alerts sent

Human review checkpoints:
- Ensure emails do not leak sensitive data
- Ensure alert spam protection works

Dependencies:
- Security events + Resend config + alerts table

---

### Phase 9 — Optional AI Governance (If Used)
Tasks:
1. Implement draft creation workflow:
   - AI creates draft posts/projects
2. Approval UI:
   - `/admin/ai-review`
3. Enforce allowlist and permission checks
4. Log AI actions (`ai_actions`)
5. Add “revert” capability for published AI changes

AI-assisted steps:
- Generate draft text and structured summaries
Human review:
- Approve/reject, validate content safety

Dependencies:
- Content management actions + audit logging

---

## 3. Dependencies Summary
- Auth utilities required before any admin-only actions.
- DB schema required before Server Actions and dashboards.
- Attack zones should exist before tuning WAF rules (they create real telemetry).
- Alerts depend on consistent severity scoring and event logging.

---

## 4. Quality Gates (Must Pass Before Production)
1. No secrets committed (verify `.env` not tracked)
2. No public stack traces or debug info in prod
3. All writes happen server-side with session + RBAC checks
4. Attack zone requests always log events
5. Dashboard reflects real DB telemetry
6. Alert thresholds trigger and are recorded

---

## 5. Evidence Plan for Final Submission
During build, capture evidence continuously:
- screenshots of attack attempts and the UI response
- dashboard updates showing new events
- Arcjet telemetry screenshots showing blocks
- email alert screenshot (Resend delivery)
- before/after of any vulnerability fixed
- OWASP Top 10 mapping table in final PDF

---

## 6. Suggested Commit/PR Pattern (Solo-Friendly but “Team-like”)
- Use branches:
  - `docs/design`
  - `feat/attack-zones`
  - `security/logging-and-alerts`
- Create PRs even if solo:
  - Open PR, self-review checklist, then merge
- Mention AI usage in commits where applicable:
  - `docs: generate design draft using AI`
  - `feat: scaffold dashboard UI (AI-assisted), add human review fixes`

This provides provenance evidence of an AI-human workflow.
