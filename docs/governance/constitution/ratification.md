# Ratification — how documents gain and lose authority

Status: **Process definition (v0.1, draft).** Applies to every document in the
Institutional Knowledge registry (`src/services/aos/governance.ts`).

## The lifecycle

```
DRAFT ──→ REVIEW ──→ RATIFIED ──→ DEPRECATED
  ↑          │
  └──────────┘  (review can send a draft back)
```

| Status | Meaning | Who moves it |
|---|---|---|
| **Draft** | Written; no authority; may change freely | Author |
| **Review** | Under founder/department review; frozen except review edits | Owner submits |
| **Ratified** | Institutional authority; changes require amendment | **Founder only** |
| **Deprecated** | Superseded; kept for history; cite its replacement | **Founder only** |

## Rules (inherited from LAUNCH_DECISION_PRINCIPLE)

1. **Ratification requires evidence** that the document reflects reality — for
   architecture documents, that the code matches; for standards, that the
   practice is followed. A document describing an unbuilt system cannot be
   ratified; it stays draft or review.
2. **Every transition is recorded twice**: in the registry (code change,
   git-reviewed) and in the Company Brain (`governance-record` category), so
   both the reviewable history and the queryable memory agree.
3. **Constitutional documents** additionally log every transition in
   `constitution/changelog.md`.
4. **Deprecation never deletes.** Canon headers already say append-only; a
   deprecated document remains in the tree with its replacement named.
5. **Review dates are commitments.** A ratified document past `nextReview`
   shows as due on the Founder Cockpit — silence is not compliance.

## Recording a ratification

1. Founder states the decision (with evidence) — in writing.
2. Registry entry updated: `status`, `version`, `lastReview`, `nextReview`,
   `ratified: { on, by }` — via a reviewed commit.
3. `recordRatification()` writes the decision to the Company Brain.
4. Constitutional changes append to `changelog.md`.
