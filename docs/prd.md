# Product Requirements Document (PRD) — Digital Twin III

## 1. Overview
Digital Twin III is a production-deployed, cyber-hardened personal portfolio that:
1) Represents a cybersecurity professional identity,
2) Defends itself against real attacks with visible telemetry,
3) Learns from threat activity through dashboards, alerts, and governed AI workflows.

## 2. Study / Reference URLs
- Workshop / course materials: (insert your LMS links here)
- Arcjet docs: https://arcjet.com/docs
- Vercel Firewall: https://vercel.com/docs/security/vercel-firewall
- Neon Postgres: https://neon.tech/docs
- Drizzle ORM: https://orm.drizzle.team/docs
- Resend: https://resend.com/docs
- Vercel AI SDK: https://sdk.vercel.ai/docs

## 3. Technical Requirements (Mandatory)
- Next.js 16+ App Router, TypeScript
- Prefer Server Actions over REST APIs
- Neon Postgres provisioned via Vercel Storage
- Drizzle ORM with strict schema + migrations
- Arcjet WAF enabled with visible telemetry
- Vercel firewall + abuse prevention + rate limiting
- Resend for secure outbound email (alerts, confirmations)
- AI agent workflows governed by zero-trust tool calling

## 4. Functional Requirements
### 4.1 Public Portfolio
- Home, About, Projects, Blog, Contact
- No internal IDs exposed; safe error messages

### 4.2 Authentication & RBAC
- Admin-only access to dashboards and content management
- Secure session validation on every Server Action

### 4.3 Attack Zones (Ethical Testing)
- Public “attack lab” pages:
  - Prompt injection zone
  - SQL injection simulation zone
  - Bot/abuse zone
- Each attack attempt must be detected, logged, and safely handled

### 4.4 Threat Dashboard
- Visualize threat events:
  - counts, categories, severity
  - blocked vs allowed
  - trends over time
- Show “threat level” state

### 4.5 Alerting
- Threshold-based alerts via email (Resend)
- Example: >10 SQLi attempts in 60s triggers alert

### 4.6 AI Governance (if used)
- AI may draft content; publishing requires approval
- Tool calls must be validated, permission-checked, and logged
- AI actions must be reversible/auditable

## 5. Non-Functional Requirements
- No crashes, no blank pages, no console errors in prod
- No stack traces or debug metadata exposed
- Defensive defaults: deny-by-default, log suspicious activity
- Privacy: no sensitive personal identifiers publicly exposed

## 6. Acceptance Criteria (for final submission)
- Live Vercel production site on custom domain with defenses enabled
- Visible attack zones + dashboard telemetry based on real events
- Evidence pack PDF showing OWASP mapping + logs/screenshots + alerts + reflection
- Team repo with professional commits/PRs, no secrets committed
