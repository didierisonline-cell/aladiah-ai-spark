# Capability Genome — Reference Model (design)

**Status: DESIGN.** How the genome relates to everything else.

```
            THE CONSTITUTIONAL SPINE (authority)
                        │ governs
                        ▼
   ┌────────────────────────────────────────────┐
   │            CAPABILITY GENOME               │
   │  §1 Identity      §5 Operation             │
   │  §2 References    §6 Lineage               │
   │  §3 Interfaces    §7 Memory                │
   │  §4 Assurance                              │
   └────────┬────────────────┬──────────────────┘
   validated by       collected into
        CI                   ▼
   (drift check)   INSTITUTIONAL REGISTRY  ── the constitutional catalog
                             │ surfaced on          (Amendment VI)
                             ▼
                    Founder Cockpit (Dashboard Spec 04)
                             │ mirrored to
                             ▼
                       COMPANY BRAIN (markers genome:<id>:v<n>)
```

- The genome is the UNIT; the Registry is the governed COLLECTION; the
  Dashboard is the VIEW; the Brain is the MEMORY; CI is the ENFORCER.
- Genomes are code (git-reviewed) like the governance registry — identity
  changes are reviewed commits, surviving model/tech/personnel change through
  three redundant stores (git, registry, Brain).
- The scanner (Registry Workforce Spec 05) discovers capabilities; discovery
  without a genome is a CI failure, not a warning.
