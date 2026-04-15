---
name: tech-doc-generator
description: Generates technical documentation including API references, README files, architecture overviews, and onboarding guides from source code. Use when asked to document a module, generate API docs, write a README, or create developer guides.
---

# Technical Documentation Generator Skill

## Outputs Available
1. API Reference — endpoint list, request/response schemas, auth requirements
2. README — project overview, setup steps, usage examples
3. Architecture Doc — component diagram (text-based), data flow, key design decisions
4. Onboarding Guide — "Day 1" steps for a new developer

## Rules
- Extract examples from actual code — never invent them
- Flag any endpoint that lacks input validation (security note)
- Generate Mermaid diagrams for architecture docs where possible
- Always include a "Limitations & Known Issues" section