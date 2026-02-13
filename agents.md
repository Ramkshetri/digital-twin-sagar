# agents.md — Digital Twin III

## Purpose
You are assisting in building "Digital Twin III": a production-grade, cyber-hardened personal digital presence.
This system must be defensive by default, observable, and safe under real internet attack.

## Core Documentation Index
- **Product Requirements:** `docs/prd.md`
- **Technical Design:** `docs/design.md`
- **Implementation Plan:** `docs/implementation-plan.md`
- **MCP Server:** `src/mcp-server/index.ts`

## Stack (Mandatory)
- **Framework:** Next.js 16+ (App Router)
- **Language:** TypeScript
- **API Pattern:** Server Actions preferred (avoid REST APIs where possible)
- **Database:** Neon Postgres (via Vercel Storage)
- **ORM:** Drizzle ORM (strict schema + migrations)
- **UI:** Shadcn UI
- **Security:** Arcjet WAF (telemetry enabled), Vercel Firewall
- **Email:** Resend
- **AI/MCP:** Vercel AI SDK v6 + Model Context Protocol (MCP)

## MCP Tool Instructions
The system uses a Model Context Protocol (MCP) server located in `src/mcp-server/`.
Available tools:
1.  **`rollDice`**: A connection test tool. Returns a random dice roll.
2.  **`runInterviewSimulation`**: Generates role-specific interview questions.
    * *Usage:* Call this tool when the user asks to practice for a job interview.
    * *Input:* Requires a `role` string (e.g., "Senior DevOps Engineer").
    * *Output:* Returns a structured list of technical and behavioral questions.

## Non-Negotiable Security Rules
1.  **No unauthenticated write operations.**
2.  **Strict Validation:** Every Server Action must validate session, permissions, and input (Zod).
3.  **Sanitization:** Sanitize/normalize all strings before DB insertion.
4.  **No Secrets:** Never expose secrets, internal IDs, stack traces, or debug output to the client.
5.  **AI Governance:** AI cannot publish or write to DB without human approval.

## Coding Standards
- Prefer server-side execution for all business logic.
- Keep security logging centralized.
- Use conventional commits (feat:, fix:, chore:, security:).
- When uncertain: **deny by default** and log the event.