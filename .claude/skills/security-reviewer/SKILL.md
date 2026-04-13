---
name: security-reviewer
description: Performs a security-focused code review looking for OWASP Top 10 vulnerabilities, authentication flaws, input validation gaps, and data exposure risks. Use when asked to do a security review, security audit, or find security issues.
---

# Security Reviewer Skill

## Checks (OWASP Top 10 Mapped)
- A01 Broken Access Control — missing auth middleware on routes
- A02 Cryptographic Failures — hardcoded secrets, weak hashing
- A03 Injection — unsanitized DB queries, no input validation
- A04 Insecure Design — missing rate limiting, no audit logs
- A05 Security Misconfiguration — CORS, error messages exposing stack traces
- A07 Auth Failures — JWT validation gaps, token expiry not checked
- A09 Logging Failures — missing security event logging

## Output Format
For each finding:
- OWASP category
- Severity: CRITICAL / HIGH / MEDIUM / LOW
- File + line number
- Description of vulnerability
- Recommended fix with code example
- CWE reference number