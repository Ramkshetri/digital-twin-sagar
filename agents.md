# agents.md — Digital Twin III 
## Purpose
You are assisting in building "Digital Twin III": a production-grade, cyber-hardened personal digital presence.
This system must be defensive by default, observable, and safe under real internet attack.

## Stack (Mandatory)
- Next.js 16+ (App Router)
- TypeScript
- Server Actions preferred (avoid REST APIs)
- Neon Postgres (via Vercel Storage)
- Drizzle ORM (schema + migrations)
- Shadcn UI
- Arcjet WAF (telemetry enabled)
- Vercel Firewall / rate limiting
- Resend (secure email + alerting)
- Vercel AI SDK v6 + Workflows (governed tool calling)

## Non-Negotiable Security Rules
1. No unauthenticated write operations.
2. Every Server Action must:
   - validate session
   - enforce RBAC/permissions
   - validate input (Zod)
   - sanitize/normalize strings
   - log suspicious behavior
   - fail safely (no internals in response)
3. Never expose secrets, internal IDs, stack traces, or debug output in production.
4. AI cannot publish or write to DB from user text without governance:
   - tool-call allowlist
   - permission checks
   - audit logs
   - approval flow for high-risk writes

## Project Documents
- docs/prd.md = product requirements (must follow)
- README.md = human entry point

## Coding Standards
- Prefer server-side execution
- Keep security logging centralized (single module)
- Use conventional commits:
  - feat:, fix:, chore:, docs:, security:, refactor:, test:
- When uncertain: deny by default; log the event.

## Output Expectations
When generating code:
- Provide secure defaults
- Include input validation and safe error handling
- Avoid introducing new endpoints or client-side secrets
- Use minimal dependencies and keep components accessible (a11y)
