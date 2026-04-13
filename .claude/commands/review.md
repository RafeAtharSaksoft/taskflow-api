# /review — Structured Code Review

Run a structured code review on the current working changes or the file specified.

Categorise findings as:
- 🔴 HIGH — Security vulnerability or breaking bug (must fix before merge)
- 🟡 MEDIUM — Performance issue or anti-pattern (should fix)
- 🟢 LOW — Style or minor improvement (nice to have)

For each finding:
- File name and line number
- Issue description
- Suggested fix (show code)

End with: Overall verdict — APPROVE / REQUEST CHANGES / NEEDS DISCUSSION