-- =============================================================================
-- AI Enterprise Cybersecurity — Module 19 Lesson Content
-- Masterclass: The Future of AI Cybersecurity, Governance & Digital Trust
-- 5 lessons × full EN transcripts
-- Apply AFTER 20260702000000_add_cyber_m19_structure.sql
-- =============================================================================

DO $$
DECLARE
  v_cid UUID;
  v_ch  UUID;
BEGIN
  SELECT id INTO v_cid FROM public.courses
    WHERE curriculum_version = 'cyber-v1';
  IF v_cid IS NULL THEN RAISE EXCEPTION 'cyber-v1 course not found'; END IF;

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid AND order_index = 19;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M19 chapter not found — run structure migration first'; END IF;

-- ─── LESSON 1: Autonomous AI SOCs ────────────────────────────────────────────

  UPDATE public.videos SET
    description = 'The Security Operations Center of 2030 will be run by AI, not analysts. Learn how autonomous detection, triage, and response systems will transform enterprise security — and what human roles will remain.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Autonomous AI SOCs — The Self-Defending Enterprise',
      'description', 'The Security Operations Center of 2030 will be run by AI, not analysts. Learn how autonomous detection, triage, and response systems will transform enterprise security — and what human roles will remain.',
      'transcript', 'The Security Operations Center as we know it today — a room of analysts watching dashboards, manually triaging alerts, and escalating incidents through a human chain of command — will not exist in its current form by 2035. What replaces it is something fundamentally different: the Autonomous AI SOC, a self-defending enterprise security system that detects, triages, investigates, and responds to threats without waiting for a human to read an alert.

This is not science fiction. The foundational components are already in production. AI-native SIEM platforms like Chronicle and Microsoft Sentinel already use machine learning to correlate events across billions of log lines in real time. SOAR (Security Orchestration, Automation and Response) platforms execute response playbooks — isolating endpoints, revoking tokens, blocking IPs — in milliseconds. EDR vendors deploy behavioral AI that detects novel malware variants without signature files. The shift from 2025 to 2035 is a matter of degree and integration, not a step-change in kind.

The Autonomous AI SOC of 2030 will operate across five layers. At the detection layer, AI systems continuously ingest telemetry from every endpoint, network segment, cloud workload, identity provider, and SaaS application — not just sampling events, but processing the full stream. Behavioral baselines are maintained for every entity: users, devices, service accounts, applications. Anomalies are scored in real time, and the AI distinguishes noise from signal with a false positive rate orders of magnitude lower than rule-based systems. At the investigation layer, the AI constructs attack graphs automatically — mapping the lateral movement of a threat actor from initial access through privilege escalation to data exfiltration, correlating indicators across multiple kill chain stages without manual analysis. At the containment layer, the AI executes pre-authorized response actions: isolating affected hosts, invalidating compromised credentials, deploying honeypots, and activating backup systems. At the communication layer, the AI generates incident reports for human stakeholders, translating technical findings into executive-ready summaries with business impact quantification. At the learning layer, every incident — resolved or ongoing — feeds the AI''s evolving model, making detection more accurate and response faster with every event.

What changes for human security professionals is not that they become obsolete — it is that their function shifts from first-responder to architect, ethicist, and decision-maker. Humans in the AI SOC of 2030 will define the rules by which the AI is authorized to act, review edge cases that exceed the AI''s confidence threshold, investigate incidents that require business context the AI cannot independently assess, and make the final call on high-impact response actions (evicting a threat actor from a production system during peak business hours, for instance, is not a decision any organization should fully automate). The ratio shifts: where today a tier-1 analyst processes 50 alerts per shift, the AI SOC analyst of 2030 reviews 5 AI-curated escalations per week — each one a genuine high-stakes decision.

The governance implications are significant. When an AI autonomously takes a containment action — isolating a production server, blocking a payment processor''s API, or disabling a C-suite executive''s account — the organization needs clear policies defining the AI''s decision authority, logging requirements for every autonomous action, and rollback procedures when autonomous response causes unintended business impact. AI SOC governance frameworks will become a standard component of enterprise security programs. The organizations that define these frameworks proactively will deploy autonomous security with confidence. Those that do not will experience autonomous systems making consequential decisions without appropriate oversight — which is its own category of risk.

The career opportunity in this transition is significant. Security professionals who understand how to architect, govern, validate, and improve AI security systems will be among the most valuable professionals in the industry. The skill that makes this transition possible is not technical — it is the ability to think about AI decision-making with the same rigor applied to human decision-making: what should it be authorized to do, what evidence justifies that authorization, and what are the failure modes when authorization is too broad or too narrow. That is a governance skill, a risk skill, and a judgment skill — precisely the skills this program has trained you to apply.'
    ))
  WHERE chapter_id = v_ch AND order_index = 1;

-- ─── LESSON 2: Quantum-Resistant Cryptography ────────────────────────────────

  UPDATE public.videos SET
    description = 'Quantum computers will break RSA and ECC. NIST has already published post-quantum standards. Learn what this means for enterprise cryptography, how to build a quantum migration roadmap, and why the clock is already running.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Quantum-Resistant Cryptography & Post-Quantum Security',
      'description', 'Quantum computers will break RSA and ECC. NIST has already published post-quantum standards. Learn what this means for enterprise cryptography, how to build a quantum migration roadmap, and why the clock is already running.',
      'transcript', 'In August 2024, NIST published its first finalized post-quantum cryptography standards — FIPS 203 (ML-KEM, based on CRYSTALS-Kyber for key encapsulation), FIPS 204 (ML-DSA, based on CRYSTALS-Dilithium for digital signatures), and FIPS 205 (SLH-DSA, based on SPHINCS+ for stateless hash-based signatures). This publication marked the formal beginning of the post-quantum cryptographic migration era. The cybersecurity profession now has a mandate: migrate cryptographic infrastructure before a sufficiently capable quantum computer exists to break current standards.

The threat model is specific. Shor''s algorithm, when run on a cryptographically relevant quantum computer (CRQC), can break RSA and elliptic curve cryptography (ECC) — the asymmetric algorithms that protect nearly every TLS connection, digital certificate, VPN tunnel, and code-signing operation on the internet today. Symmetric algorithms like AES-256 are affected differently: Grover''s algorithm provides a quadratic speedup, effectively halving the key size, but AES-256 remains secure post-quantum (it''s equivalent to AES-128 against a quantum attacker, which is still computationally infeasible). The threat is specifically to asymmetric cryptography: RSA, ECDSA, ECDH, and DHE.

The timeline matters even before a CRQC exists. The "harvest now, decrypt later" (HNDL) attack is active today: adversaries — primarily nation-state actors — are collecting encrypted traffic now, storing it, and planning to decrypt it when a CRQC becomes available. For data that must remain confidential for 10–25 years (government secrets, medical records, intellectual property, long-term financial data), the threat is already present. If that data is encrypted with RSA-2048 today, and a CRQC arrives in 2035, the adversary can decrypt it in 2035. The migration to post-quantum cryptography is not a future problem — it is an active data protection problem for any organization with long-lived sensitive data.

NIST''s selected algorithms work differently from RSA and ECC. ML-KEM (CRYSTALS-Kyber) is a lattice-based key encapsulation mechanism — it derives shared keys based on the hardness of the Learning With Errors (LWE) problem over lattices, which no known quantum algorithm can efficiently solve. ML-DSA (CRYSTALS-Dilithium) is a lattice-based digital signature scheme. SLH-DSA (SPHINCS+) is a hash-based signature scheme that derives security purely from the collision resistance of hash functions — extremely conservative and quantum-resistant but with larger signature sizes.

Building a quantum migration roadmap requires four steps. First, cryptographic inventory: identify every system, protocol, and certificate that relies on RSA or ECC. This includes TLS certificates, code signing certificates, SSH keys, VPN configurations, JWT signing keys, S/MIME email encryption, and any custom cryptographic implementations. Most enterprises have thousands of these — many undocumented. Second, classify by sensitivity and longevity: data that must remain confidential for more than 10 years is your highest priority for quantum migration. Third, prioritize hybrid approaches: transition systems to hybrid cryptography (classical + post-quantum) where possible, providing protection against both classical and quantum attacks during the migration period. Fourth, develop a migration timeline: NIST recommends completing migration to post-quantum standards by 2030 for most federal systems, with RSA and ECC deprecated by 2035. Enterprise organizations should align to this timeline.

The career implication is direct. Post-quantum cryptography migration will be one of the largest infrastructure programs in enterprise security history — comparable in scale to the Y2K remediation programs of the 1990s, but more technically complex. Security architects, GRC professionals who understand cryptographic compliance, and security engineers who can implement post-quantum algorithms will be in sustained high demand through the 2030s. Understanding this transition at a conceptual and governance level — even if you are not a cryptographer — makes you more effective at every layer of security leadership.'
    ))
  WHERE chapter_id = v_ch AND order_index = 2;

-- ─── LESSON 3: Agentic Security & AI Red vs. Blue ────────────────────────────

  UPDATE public.videos SET
    description = 'AI agents are being deployed as both attackers and defenders. Learn how agentic security systems work, what AI-powered offensive capabilities look like, and how organizations are building AI blue teams to counter them.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Agentic Security Systems & AI Red vs. Blue Teams',
      'description', 'AI agents are being deployed as both attackers and defenders. Learn how agentic security systems work, what AI-powered offensive capabilities look like, and how organizations are building AI blue teams to counter them.',
      'transcript', 'The most consequential shift in offensive and defensive cybersecurity over the next decade will not be a new vulnerability class or a new attack technique — it will be the deployment of autonomous AI agents on both sides of every security engagement. AI red teams will probe enterprise defenses continuously, at machine speed, across every attack surface simultaneously. AI blue teams will detect, analyze, and respond to those probes in real time. The human security professional''s role shifts from executing these operations to designing, governing, and supervising the AI systems that execute them.

Agentic security systems are AI-powered systems that autonomously plan and execute multi-step security tasks without requiring human input for each step. On the offensive side, an AI red team agent receives an objective — "identify exploitable vulnerabilities in the external attack surface of this organization" — and autonomously executes reconnaissance, identifies targets, selects attack techniques, attempts exploitation, documents findings, and generates a report. It can operate continuously, across thousands of targets simultaneously, and adapt its approach based on what works. Vulnerability research that previously took a skilled human penetration tester weeks to complete can be accelerated dramatically with AI assistance.

The defensive implications are immediate. If AI can autonomously execute offensive security tasks, then threat actors — including nation-states, ransomware groups, and cybercrime organizations — will use AI to scale and accelerate their attacks. The organizations that defend against these attacks must be able to detect AI-generated attack patterns, which look different from human-executed attacks: they are faster, more systematic, cover more surface area simultaneously, and adapt more quickly to defensive countermeasures.

AI blue team systems are the response. These systems operate as continuous automated red teams against your own infrastructure — probing your defenses with the same AI-powered techniques an adversary would use, identifying gaps before adversaries do. Breach and Attack Simulation (BAS) platforms like Cymulate, AttackIQ, and SafeBreach are early implementations of this concept. The AI blue team of 2030 is significantly more capable: it maintains a continuously updated model of the organization''s attack surface, simulates adversary behavior using current threat intelligence, identifies exploitable paths through the environment, and generates prioritized remediation recommendations — all autonomously.

The governance framework for AI security agents presents new challenges. When an AI red team agent is authorized to test an organization''s defenses, what constraints define its authorized scope? What happens if it discovers a genuine vulnerability that an adversary could also find? What authorization is required before an AI agent executes a potentially disruptive test against a production system? These questions require explicit policy frameworks — AI security agent governance policies that define authorized actions, scope boundaries, required logging, human escalation triggers, and accountability for AI-generated findings.

For security professionals, the practical skill is understanding how to work with AI security tools as a force multiplier rather than a replacement. The security engineer who knows how to direct an AI vulnerability scanner, interpret its findings, and prioritize remediation is more effective than either the pure-human security engineer or a fully autonomous AI system without human judgment. The penetration tester who uses AI to scale reconnaissance and initial exploitation while applying human creativity to the most complex attack paths is more effective than the one who does not. And the GRC professional who has designed the governance framework for AI security tool deployment is more valuable than the one who has not thought about it yet — because AI security tools are being deployed now, and the governance frameworks are lagging behind.'
    ))
  WHERE chapter_id = v_ch AND order_index = 3;

-- ─── LESSON 4: Digital Identity, Decentralized Trust & Human-AI Collaboration ─

  UPDATE public.videos SET
    description = 'The identity layer of the internet is being rebuilt — from centralized identity providers to decentralized, self-sovereign identity. Learn how verifiable credentials, DID standards, and human-AI collaboration are reshaping digital trust.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Digital Identity, Decentralized Trust & Human–AI Collaboration',
      'description', 'The identity layer of the internet is being rebuilt — from centralized identity providers to decentralized, self-sovereign identity. Learn how verifiable credentials, DID standards, and human-AI collaboration are reshaping digital trust.',
      'transcript', 'The current model of digital identity is fundamentally broken, and the security profession knows it. Identity is siloed: you have separate identities at Google, Microsoft, your bank, your healthcare provider, your employer, and hundreds of other services. Each silo stores your credentials, each is a target for credential theft, and none of them talk to each other in a way that puts you in control. The breaches of identity providers — from LinkedIn to Yahoo to government databases — have exposed billions of identity records precisely because centralizing identity creates high-value targets. Decentralized identity is the architectural response: shifting control of identity from platforms back to individuals.

Decentralized Identifiers (DIDs) are a W3C standard that enables individuals and organizations to create identifiers that are not controlled by any central authority. A DID is a globally unique identifier — formatted like `did:example:123456789abcdefghi` — that resolves to a DID Document containing cryptographic keys, service endpoints, and authentication mechanisms. The owner controls the private keys associated with the DID; no central authority can revoke, suspend, or modify it without the owner''s consent.

Verifiable Credentials (VCs) are the W3C standard for digital credentials that are cryptographically signed and verifiable without contacting the issuer. A university issues a VC of your degree — digitally signed with the university''s private key, stored in your digital wallet. When an employer wants to verify your credential, you present it from your wallet. The employer verifies the cryptographic signature against the university''s published public key. No phone call to the registrar, no paper transcript, no central verification service. The credential is portable, tamper-evident, and instantly verifiable. The same model applies to professional certifications, government-issued identity documents, employment records, health credentials, and financial credentials.

The Aladiah Academy certificate you earn upon completing this program is designed to operate as a Verifiable Credential — a portable, cryptographically signed proof of competency that you own and control, verifiable by any employer anywhere in the world without contacting Aladiah. This is the future of professional certification: not a PDF you email to a recruiter, but a credential in your digital wallet that any employer can verify in seconds.

Human-AI collaboration in identity and trust introduces new challenges. When an AI agent acts on behalf of a human — executing tasks, signing documents, making purchases, accessing systems — how does the system know whether it is interacting with a human or an AI agent? This is the emerging field of AI agent identity: defining standards for how AI agents authenticate, what credentials they present, how their authority is scoped, and how their actions are attributed back to the human principal on whose behalf they act. NIST''s AI Risk Management Framework and emerging standards from the World Wide Web Consortium (W3C) are beginning to address this, but the field is nascent.

The security implications are profound. If an AI agent can impersonate a human well enough to pass identity verification — generating synthetic voice, video, and behavioral patterns — then traditional authentication models fail. Deepfake-resistant authentication will become a core security requirement: systems that can distinguish real human identity from synthetic identity generated by AI. Biometric authentication systems that were considered strong — voice recognition, facial recognition — become weaker as AI-generated synthetic media becomes indistinguishable from authentic media. The response is liveness detection (can the system detect that it is interacting with a real, present human?), behavioral biometrics (does the interaction pattern match the established behavioral profile?), and hardware-backed attestation (is the device presenting authenticated credentials a genuine, trusted device?). These are the identity security challenges of the 2030s, and the professionals who understand them — conceptually and from a governance perspective — will be the architects of the trust infrastructure that the digital economy depends on.'
    ))
  WHERE chapter_id = v_ch AND order_index = 4;

-- ─── LESSON 5: Cybersecurity Careers 2030–2050 ───────────────────────────────

  UPDATE public.videos SET
    description = 'What cybersecurity careers look like in 2030, 2040, and 2050. Which roles AI creates, which it transforms, and what skills compound in value over a 25-year career horizon. The most important career decisions you will make in the next 5 years.',
    translations = jsonb_build_object('en', jsonb_build_object(
      'title', 'Cybersecurity Careers 2030–2050 — The 25-Year Roadmap',
      'description', 'What cybersecurity careers look like in 2030, 2040, and 2050. Which roles AI creates, which it transforms, and what skills compound in value over a 25-year career horizon. The most important career decisions you will make in the next 5 years.',
      'transcript', 'Most career advice is optimized for the next 18 months. The skills this program has given you are optimized for the next 25 years. That is an unusual claim, so let me make the case for it explicitly.

The skills that will compound most in a cybersecurity career over the next 25 years are not technical skills — although technical literacy matters. They are judgment skills: the ability to identify what matters most in a complex, ambiguous environment, to translate that into decisions, and to communicate those decisions in ways that move organizations. Every component of this program has been designed to build that kind of judgment. The CIA Triad is not a fact to memorize — it is a lens for decomposing security decisions. Risk assessment methodology is not a template to fill in — it is a framework for thinking under uncertainty. AI Security, Governance, and the Future of Digital Trust are not advanced topics to revisit later — they are the environment in which every security decision will be made for the next three decades.

In 2030, the cybersecurity job market will be defined by three categories of roles. The first category is AI-augmented technical roles: penetration testers, incident responders, security engineers, and SOC analysts who work alongside AI systems, directing them, interpreting their outputs, and handling the edge cases that require human judgment. These roles pay well and are in high demand, and they require the same technical foundations that are required today, plus the ability to work effectively with AI tools. The second category is AI governance and risk roles: AI security architects, AI risk managers, AI compliance officers, and AI ethics specialists who design and govern the frameworks within which AI security systems operate. These roles barely exist today and will be among the highest-demand, highest-compensation roles in the industry by 2030. The third category is AI-native security roles that do not yet exist: roles that will emerge from capabilities that are currently being developed in research labs and early-stage startups. These roles are by definition not fully defined yet, but the professionals who will fill them are building the skills to do so right now.

In 2040, the distinction between "cybersecurity professional" and "AI governance professional" will largely disappear, because all enterprise technology systems will be AI-native and securing them will require AI governance expertise by default. The CISO of 2040 will be accountable for AI risk across the organization, not just information security risk in the traditional sense. The auditor of 2040 will audit AI systems, not just financial controls. The compliance officer of 2040 will certify AI model behavior and output quality, not just data handling practices. The security engineer of 2040 will design systems that are secure by design for both human users and AI agents.

In 2050, the most consequential security challenges will likely involve: the security of AI systems that themselves possess significant decision-making authority over critical infrastructure; the governance of AI systems that interact with billions of humans without meaningful human oversight of each interaction; the protection of human identity and agency in a world where AI-generated synthetic content is indistinguishable from authentic human-generated content; and the governance of AI systems that themselves conduct security operations with minimal human involvement. The professionals who will lead the field at that point are making decisions right now about what skills to build and what problems to focus on.

The most important career decision in the next five years is not which company to join or which certification to pursue. It is which problem domain to develop deep expertise in. The professionals who will have the most impact and the most options in 2030 and beyond are the ones who choose a specific intersection — AI security and healthcare, AI governance and financial services, AI risk and critical infrastructure, AI ethics and public policy — and develop a level of domain expertise that makes them irreplaceable at that intersection. This program has given you the cross-domain foundation. The decision about where to focus that foundation is yours to make. Make it deliberately, with a 25-year time horizon, and you will find yourself exactly where you intended to be.'
    ))
  WHERE chapter_id = v_ch AND order_index = 5;

  RAISE NOTICE 'M19 lesson content applied — 5 lessons with full EN transcripts.';
END $$;

-- VERIFY:
-- SELECT v.order_index,
--        left(v.translations->''en''->>''title'', 60) AS lesson,
--        length(v.translations->''en''->>''transcript'') AS chars
-- FROM public.videos v
-- JOIN public.chapters ch ON ch.id = v.chapter_id
-- JOIN public.courses co ON co.id = ch.course_id
-- WHERE co.curriculum_version = ''cyber-v1'' AND ch.order_index = 19
-- ORDER BY v.order_index;
-- Expected: 5 rows, each chars > 3000
