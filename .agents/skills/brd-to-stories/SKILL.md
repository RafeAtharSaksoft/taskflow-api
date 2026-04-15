---
name: brd-to-stories
description: Converts a Business Requirements Document (BRD) or raw feature notes into Agile user stories with Given/When/Then acceptance criteria. Use when someone asks to convert a BRD, feature request, or meeting notes into user stories, tickets, or acceptance criteria.
---

# BRD → User Stories Skill

## Output Format
For each user story:
1. Title: "As a [role], I want [goal] so that [benefit]"
2. Story Points estimate (Fibonacci: 1,2,3,5,8,13)
3. Acceptance Criteria in Given/When/Then format (minimum 3 scenarios)
4. Edge cases section
5. Out of scope (explicitly list what this story does NOT cover)

## Rules
- Maximum 5 user stories per BRD unless scope justifies more
- Each story must be independently testable
- Flag any ambiguities as open questions for the BA
- Story points > 8 must be flagged for splitting

## Template
Story ID: [PROJECT]-[number]
Title: As a [role], I want [capability] so that [benefit]
Points: [fibonacci]

Acceptance Criteria:
  Given [context]
  When [action]
  Then [outcome]

Edge Cases: ...
Out of Scope: ...
Open Questions: ...