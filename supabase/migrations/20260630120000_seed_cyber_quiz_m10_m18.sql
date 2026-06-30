-- =============================================================
-- Aladiah Academy — AI Cybersecurity, Governance & Enterprise Compliance
-- Quiz questions: Modules 10–18  (15 questions × 9 modules = 135 total)
-- NOTE: UI auto-prefixes A)/B)/C)/D) — never hardcode letter prefixes
-- =============================================================

DO $body$
DECLARE
  v_cid UUID;
  v_ch  UUID;
  v_qid UUID;
BEGIN
  SELECT id INTO v_cid FROM public.courses
    WHERE title = 'AI Cybersecurity, Governance & Enterprise Compliance'
      AND curriculum_version = 'cyber-v1';
  IF v_cid IS NULL THEN
    RAISE EXCEPTION 'Cyber course not found — run structure migration first';
  END IF;

  -- ============================================================
  -- MODULE 10 — Privacy Engineering: GDPR, HIPAA, CCPA
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 9;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'GDPR Article 17 grants individuals the "right to erasure" (right to be forgotten). Under which condition can an organization REFUSE this request?',
   '["When the deletion would be technically complex or expensive","When the data is necessary for compliance with a legal obligation, or for the establishment, exercise, or defense of legal claims","When the individual originally consented to data processing","When the data has been stored for less than 1 year"]'::jsonb, 1,
   'GDPR provides six grounds to refuse erasure requests: the data is still needed for the original purpose; the organization has overriding legitimate interests; public health grounds; archiving/research/statistical purposes; legal compliance or claims defense; and exercise of free expression. Most enterprise contexts rely on legal obligation or legal claims.'),

  (v_qid, 'GDPR requires a Data Protection Impact Assessment (DPIA) when:',
   '["Any new software application is launched","Processing is likely to result in a high risk to individuals — especially systematic profiling, large-scale processing of special category data, or systematic monitoring of public areas","Any data breach occurs, regardless of severity","A new marketing campaign is launched using existing customer data"]'::jsonb, 1,
   'DPIA (Article 35) is triggered by high-risk processing: systematic profiling with significant effects, large-scale special category data (health, biometrics), systematic CCTV monitoring. DPIAs must assess necessity, proportionality, risks, and mitigation measures — and consult the DPA if residual risk remains high.'),

  (v_qid, 'Under HIPAA, a Business Associate Agreement (BAA) is required when:',
   '["A healthcare organization purchases office supplies from a vendor","A third-party vendor creates, receives, maintains, or transmits Protected Health Information (PHI) on behalf of a HIPAA Covered Entity","Any vendor provides services to a hospital regardless of data access","An employee''s personal health information is stored in HR systems"]'::jsonb, 1,
   'Business Associates (cloud providers, billing companies, IT vendors) that handle PHI on a Covered Entity''s behalf must sign a BAA — a contract that requires them to implement appropriate HIPAA safeguards, report breaches, and limit PHI use to authorized purposes. Operating without a BAA is a HIPAA violation.'),

  (v_qid, 'GDPR''s maximum fine for the most serious violations (e.g., breaching the basic principles of processing) is:',
   '["€10 million or 2% of global annual turnover, whichever is higher","€20 million or 4% of global annual turnover, whichever is higher","€50 million fixed penalty","€1 million per affected individual"]'::jsonb, 1,
   'GDPR has a two-tier penalty structure: Tier 1 (up to €10M or 2% global turnover) for less serious infringements (record-keeping, processor obligations, DPO requirements); Tier 2 (up to €20M or 4% global turnover) for fundamental breaches — unlawful processing, insufficient consent, transfers without safeguards, violation of data subject rights.'),

  (v_qid, 'Privacy by Design (PbD) is a foundational privacy engineering principle embedded in GDPR Article 25. It requires:',
   '["Privacy features to be added to products after launch as a customer option","Privacy protections to be built into systems from the design phase — data minimization, pseudonymization, purpose limitation — rather than bolted on after development","Annual privacy audits of all data processing systems","Privacy notices to be displayed prominently on websites"]'::jsonb, 1,
   'Privacy by Design means architects and developers consider privacy from the first whiteboard session: What data do we actually need? Can we pseudonymize or anonymize at collection? Can we minimize retention periods? Can we build in data subject rights API endpoints? GDPR mandates this approach for new systems and upgrades.'),

  (v_qid, 'The California Consumer Privacy Act (CCPA) / CPRA gives California consumers which core rights not previously guaranteed under US federal law?',
   '["The right to receive government-issued privacy certification for their personal data","The right to know what personal information is collected, the right to delete it, the right to opt-out of its sale, and the right to non-discrimination for exercising these rights","The right to receive financial compensation for all data collected about them","The right to prohibit all marketing use of their data without exception"]'::jsonb, 1,
   'CCPA (enhanced by CPRA 2023) created a first-of-its-kind US state privacy framework: Know (what data is collected, shared, sold), Delete (request deletion), Opt-out (of sale/sharing), Correct (inaccurate data — added by CPRA), Limit use of sensitive PI, and Non-discrimination (no downgraded service for rights exercise). It inspired 20+ other US state privacy laws.'),

  (v_qid, 'Data minimization as a GDPR principle (Article 5(1)(c)) requires:',
   '["All data to be encrypted to minimize exposure","Personal data collected to be adequate, relevant, and limited to what is necessary for the specified purpose — you may not collect more data than the task requires","Data to be retained for a minimum of one year to satisfy audit requirements","Users to be minimally inconvenienced by privacy notices and consent requests"]'::jsonb, 1,
   'Data minimization directly challenges the tech industry''s "collect everything" approach. Only collect what you need, for the stated purpose, for as long as necessary. Organizations often violate this by retaining marketing data indefinitely, collecting unnecessary form fields, or building expansive data lakes for hypothetical future use.'),

  (v_qid, 'HIPAA''s Breach Notification Rule requires Covered Entities to notify affected individuals within how many days of discovering a breach?',
   '["24 hours","60 calendar days","72 hours (aligning with GDPR)","30 business days"]'::jsonb, 1,
   'HIPAA Breach Notification Rule (45 CFR §164.400-414) requires notification to affected individuals within 60 days of discovery. For breaches affecting 500+ residents in a state, the HHS Secretary and "prominent media outlets" must also be notified. GDPR''s 72-hour requirement is stricter but applies to a different regulatory regime.'),

  (v_qid, 'Pseudonymization differs from anonymization in that:',
   '["They are legally equivalent under GDPR","Pseudonymization replaces direct identifiers with artificial ones but the mapping exists and re-identification is possible with additional information; anonymization irreversibly prevents re-identification — only anonymized data falls outside GDPR''s scope","Anonymization is a stronger technical control but requires less regulatory compliance","Pseudonymization requires explicit consent; anonymization does not"]'::jsonb, 1,
   'GDPR recognizes both but treats them differently. Pseudonymized data is still personal data — the controller holds the key. Anonymous data (where re-identification is genuinely impossible) falls outside GDPR entirely. This distinction matters for research and analytics: tokenizing customer IDs in analytics data is pseudonymization, not anonymization.'),

  (v_qid, 'A Data Protection Officer (DPO) under GDPR must be appointed when:',
   '["Any company processes European customer data","The organization is a public authority, or conducts large-scale systematic monitoring of individuals, or processes large-scale special category data (health, biometrics, criminal records)","The organization has more than 250 employees","The organization has annual revenue exceeding €10 million"]'::jsonb, 1,
   'GDPR Article 37 mandates DPO appointment in three scenarios: public bodies (except courts), organizations conducting large-scale systematic monitoring (e.g., behavioral ad targeting platforms), and organizations processing large-scale special category data (e.g., hospitals, insurance companies, genetic data processors). Other organizations may appoint voluntarily.'),

  (v_qid, 'GDPR''s "legitimate interest" as a lawful basis for processing (Article 6(1)(f)) requires:',
   '["Any business interest justifies processing without restriction","A three-part test: the interest must be legitimate, the processing must be necessary for that interest, and the individual''s rights and freedoms must not override the interest — documented in a Legitimate Interests Assessment (LIA)","Legitimate interest automatically applies to all B2B data processing","Regulators must pre-approve legitimate interest claims before processing begins"]'::jsonb, 1,
   'Legitimate interest is the most flexible lawful basis but carries the greatest responsibility. The LIA documents: what is the legitimate interest? Is processing necessary? Do individual interests override the organization''s interest? DPAs scrutinize LIA quality. Relying on legitimate interest for processing children''s data or special category data is extremely high risk.'),

  (v_qid, 'Privacy engineering in API design implements which technical control to protect individual privacy?',
   '["Rate limiting to prevent API abuse","Field-level access controls and response filtering so APIs return only the data fields the requesting party is authorized to receive — preventing over-exposure of personal information in API responses","TLS encryption for all API communications","OAuth 2.0 for API authentication"]'::jsonb, 1,
   'Privacy-aware API design prevents excessive data exposure (OWASP API Security #3): APIs should return only the fields the consumer needs and is authorized to receive. An endpoint returning a user object should not include SSN, full date of birth, or home address unless the specific consumer has a legitimate need. Field-level filtering enforces data minimization at the API layer.'),

  (v_qid, 'Cross-border data transfers from the EU to the US under GDPR require which mechanism after the invalidation of Privacy Shield?',
   '["A bilateral treaty between the EU and US governments","Standard Contractual Clauses (SCCs), Binding Corporate Rules (BCRs), or the EU-US Data Privacy Framework (DPF) — an adequacy decision adopted in July 2023","A self-certification by the US-based receiving organization","Explicit consent from every individual whose data is transferred"]'::jsonb, 2,
   'Privacy Shield was invalidated by Schrems II (2020). Transfer mechanisms include: SCCs (most common — contractual obligations on the importer), BCRs (for multinational group transfers), and the EU-US Data Privacy Framework (July 2023 adequacy decision — currently facing legal challenge). Organizations relying on the DPF should also implement SCC backstops given the legal uncertainty.'),

  (v_qid, 'HIPAA''s Minimum Necessary standard requires covered entities to:',
   '["Provide the minimum legally required privacy notice","Limit the use, disclosure, and requests for PHI to the minimum necessary to accomplish the intended purpose — healthcare providers should not access a full medical record when only a prescription history is needed","Collect the minimum amount of insurance information from patients","Retain PHI for the minimum period required by state law"]'::jsonb, 1,
   'Minimum Necessary (45 CFR §164.502(b)) operationalizes data minimization for healthcare: workforce members should access only the PHI they need for their role; requests to other entities should seek only what is needed. Exceptions apply to disclosures to the patient themselves, for treatment purposes between providers, and pursuant to authorizations.'),

  (v_qid, 'What is the Privacy Engineering concept of "contextual integrity" and why does it matter for GDPR compliance?',
   '["A technical standard for encrypting data in context-aware applications","The principle that information flows appropriately when they match the norms of the social context in which they originated — sharing medical data with treating physicians is appropriate; selling it to advertisers is not, even if technically consented to","A method for ensuring database integrity in privacy-sensitive applications","A GDPR audit standard for assessing the completeness of privacy programs"]'::jsonb, 1,
   'Contextual integrity (Helen Nissenbaum) provides a framework for evaluating privacy beyond technical consent: does this information flow respect the norms of the context in which it was shared? GDPR''s purpose limitation principle embodies this — data collected for one purpose (medical care) cannot be repurposed for another (insurance underwriting) without a legitimate basis, even if the data subject technically consented.'),

  (v_qid, 'Under HIPAA, the Security Rule applies to which type of information?',
   '["All health information in any form","Electronic Protected Health Information (ePHI) only — the Security Rule specifically covers PHI that is created, received, maintained, or transmitted in electronic form","PHI stored on paper records and physical media","Any personally identifiable information held by a HIPAA covered entity regardless of health-related content"]'::jsonb, 1,
   'HIPAA has three rules: Privacy Rule (all PHI in any form), Security Rule (ePHI in electronic form only), and Breach Notification Rule. The Security Rule requires covered entities to implement administrative, physical, and technical safeguards specifically for ePHI. Paper records are covered by the Privacy Rule''s access and disclosure requirements, not the Security Rule''s technical safeguards.');

  -- ============================================================
  -- MODULE 11 — Third-Party & Vendor Risk Management
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 10;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'The foundational premise of Third-Party Risk Management (TPRM) is that:',
   '["Vendor contracts eliminate all security risk from the relationship","Your organization''s risk posture extends to every vendor, supplier, and partner that accesses your systems or data — their breach can directly become your breach","SOC 2 certified vendors require no additional due diligence","Third-party risk is exclusively a legal and contractual issue, not a technical security concern"]'::jsonb, 1,
   'Target (2013), SolarWinds (2020), Kaseya (2021) — supply chain attacks demonstrate that attackers use trusted third-party relationships to breach well-defended organizations. TPRM acknowledges that security boundaries extend beyond organizational perimeters to every third party with privileged access or data sharing relationships.'),

  (v_qid, 'Vendor risk tiering typically categorizes vendors based on:',
   '["Annual contract value and payment terms","The sensitivity of data they access, the criticality of systems they connect to, and the potential business impact if they were compromised — determining the depth of due diligence required","Geographic location and industry sector","The vendor''s employee headcount and market capitalization"]'::jsonb, 1,
   'Risk-based tiering is the foundation of scalable TPRM. Tier 1 (critical): access to sensitive data or production systems — full VSA, SOC 2 review, penetration test results, on-site audit rights. Tier 2 (high): limited data access — abbreviated VSA, SOC 2 review. Tier 3 (low): no data access — standard contractual terms only.'),

  (v_qid, 'A Vendor Security Assessment (VSA) questionnaire typically covers which domains?',
   '["Only technical security controls such as encryption and patching","Information security policies, access controls, encryption, incident response, business continuity, subprocessor management, and compliance certifications — providing a holistic view of the vendor''s security posture","Exclusively the vendor''s financial stability and insurance coverage","Only regulatory compliance and certification status"]'::jsonb, 1,
   'VSAs (based on frameworks like SIG, CAIQ, or proprietary questionnaires) cover: security governance, risk management, access controls, change management, vulnerability management, encryption, incident response, BCP/DR, subprocessor oversight, and compliance. The goal is a comprehensive view of whether the vendor''s security program meets the organization''s risk requirements.'),

  (v_qid, 'When reviewing a vendor''s SOC 2 Type II report, a security team should specifically examine:',
   '["Only the opinion letter to confirm the audit passed","The scope section (to verify the relevant systems are covered), control exceptions and qualified opinions, complementary user entity controls (CUECs) the customer must implement, and the audit period (to assess report age)","Only the list of controls to confirm they match the organization''s standards","The report''s page count as a proxy for audit quality"]'::jsonb, 1,
   'A SOC 2 report requires careful reading, not just checking that one exists. Scope gaps mean the vendor''s payment processing system may not be covered. Exceptions indicate real control failures. CUECs define the customer''s responsibilities. A 2-year-old report may not reflect the vendor''s current control environment.'),

  (v_qid, 'Data Processing Agreements (DPAs) are required under GDPR when:',
   '["A vendor sells goods to the organization regardless of data involvement","A vendor processes personal data on behalf of the controller — establishing the processor''s data handling obligations, security requirements, subprocessor controls, breach notification timelines, and data subject rights assistance","A vendor provides any professional services to a GDPR-regulated organization","Any contract with a European Union-based vendor is executed"]'::jsonb, 1,
   'GDPR Article 28 requires a binding contract between the data controller (organization) and data processor (vendor processing personal data on their behalf). The DPA must specify: processing instructions, data categories, retention periods, security measures, subprocessor approval requirements, breach notification (within 72 hours to controller), audit rights, and deletion/return of data.'),

  (v_qid, 'Nth-party risk (fourth-party, fifth-party risk) refers to:',
   '["The risk of the fourth or fifth vendor evaluated during due diligence","The security risk posed by your vendors'' vendors — the subprocessors and subcontractors that your direct vendors rely on, who may also handle your data or access your systems","The risk associated with vendors in the fourth quartile of your risk tier classification","Multiple vendor risk that aggregates when an organization uses more than four vendors"]'::jsonb, 1,
   'SolarWinds was a classic Nth-party attack: the attacker targeted SolarWinds (a vendor to 18,000 organizations). SolarWinds''s customers had no direct relationship with the attacker''s entry point. TPRM programs must now assess subprocessors: require vendors to list their subprocessors, notify of changes, and flow down security requirements contractually.'),

  (v_qid, 'Continuous vendor monitoring differs from periodic due diligence in that:',
   '["It eliminates the need for initial vendor assessments","It provides real-time or near-real-time signals about vendor security posture (via security ratings platforms like SecurityScorecard, BitSight, or RiskRecon) throughout the relationship — not just at onboarding or annual review","It is exclusively a compliance requirement with no practical security value","It requires manual scanning of vendor systems with the vendor''s permission"]'::jsonb, 1,
   'Vendor security posture changes constantly — breaches, certificate expirations, new vulnerabilities, misconfigurations. Security ratings platforms scan vendor internet-facing infrastructure continuously and alert on changes. Organizations can monitor hundreds of vendors in real time, triggering outreach or risk escalation when scores drop significantly.'),

  (v_qid, 'Which contractual clause is most critical for ensuring the organization''s ability to verify vendor security practices post-contract?',
   '["Service Level Agreements (SLAs) for system uptime","Right-to-audit clauses — contractually requiring the vendor to undergo security assessments, provide updated compliance certifications, and permit the customer to conduct or commission audits of vendor security practices","Non-disclosure agreements protecting proprietary security information","Limitation of liability clauses capping vendor financial exposure"]'::jsonb, 1,
   'Right-to-audit clauses preserve the organization''s ability to verify vendor security claims throughout the relationship. Without this clause, the customer is entirely dependent on vendor self-attestation. The clause should specify: what can be audited, with what notice, at what frequency, and whether costs are shared — and must be negotiated during contract execution, not after a breach.'),

  (v_qid, 'The NIST Cybersecurity Supply Chain Risk Management (C-SCRM) framework specifically addresses:',
   '["Only software supply chain risks from open-source dependencies","Risks introduced throughout the ICT supply chain — hardware tampering, counterfeit components, compromised software updates, malicious subcontractors, and geopolitical supply chain dependencies","Exclusively financial risks from vendor insolvency","Contract management best practices for procurement teams"]'::jsonb, 1,
   'NIST C-SCRM (SP 800-161r1) provides a comprehensive framework for ICT supply chain risk: identifying dependencies, assessing supplier risk, establishing supply chain risk requirements in contracts, monitoring supplier compliance, and responding to supply chain incidents. It covers both commercial and federal contexts.'),

  (v_qid, 'When a critical vendor experiences a data breach that may have exposed your organization''s customer data, the FIRST action the organization should take is:',
   '["Issue a public statement acknowledging potential impact","Invoke the vendor contract''s breach notification provisions, obtain a clear scope statement from the vendor (what data was affected, timeline, attacker access), and assess whether your breach notification obligations to regulators and customers are triggered","Terminate the vendor contract immediately","Wait for the vendor''s public disclosure before taking action"]'::jsonb, 1,
   'Third-party breach response requires parallel tracks: (1) engage the vendor under contractual notification provisions to understand scope and timing; (2) internally assess whether customer/employee data was exposed; (3) engage legal to determine regulatory notification obligations; (4) invoke your own IR process. Acting without vendor facts can lead to under- or over-notification.'),

  (v_qid, 'A vendor offboarding process (when terminating a vendor relationship) must include:',
   '["Only sending a termination notice to the vendor''s account manager","Revoking all access credentials, recovering or certifying destruction of all organizational data held by the vendor, decommissioning VPN/network access, and obtaining written confirmation of data deletion per DPA requirements","Updating the vendor risk register to mark the vendor as inactive","Archiving the vendor''s SOC 2 reports for future reference"]'::jsonb, 1,
   'Vendor offboarding is as critical as onboarding. Forgotten vendor access — API keys, VPN credentials, SSO integrations — are persistent attack vectors. Data not properly returned or destroyed creates ongoing privacy liability. Offboarding checklists should be part of the TPRM program and trigger compliance verification against the DPA''s data deletion clause.'),

  (v_qid, 'SecurityScorecard and BitSight provide what type of vendor risk intelligence?',
   '["Penetration test results and vulnerability scan reports","Externally observable security ratings based on passive analysis of vendors'' public-facing infrastructure — IP reputation, certificate health, DNS configuration, open port exposure, dark web mentions, and patching velocity","Internal audit reports provided by vendors","Regulatory compliance certification status from accreditation bodies"]'::jsonb, 1,
   'Security ratings platforms don''t require vendor permission — they analyze what is publicly visible: IP ranges hosting customer traffic, certificate validity and configuration, open ports, web application security headers, email authentication (SPF/DKIM/DMARC), dark web credential exposure, and known vulnerability scan data. These signals correlate with breach likelihood.'),

  (v_qid, 'A vendor questionnaire response claims "all data is encrypted at rest using AES-256." What follow-up evidence should the assessor request?',
   '["No follow-up needed — AES-256 is the industry standard and the claim is sufficient","Encryption configuration documentation or screenshots, key management procedures (who holds keys, rotation schedule), a relevant SOC 2 control test result or penetration test excerpt confirming the control is operating effectively","A signed attestation letter from the vendor''s CISO","The AES-256 certificate of compliance from a cryptographic standards body"]'::jsonb, 1,
   'Self-attested questionnaire responses are not verified controls. Claims require evidence: system configuration screenshots, SOC 2 control test results covering encryption, or technical validation from the vendor''s penetration test. Without evidence, "encrypted with AES-256" could mean anything from full-disk encryption on laptops to database column encryption — or it could be entirely aspirational.'),

  (v_qid, 'Business Continuity and Disaster Recovery (BC/DR) is a critical TPRM assessment area because:',
   '["Vendors are legally required to maintain BC/DR plans under all jurisdictions","If a critical vendor experiences an outage or disaster and cannot restore services within your acceptable RTO/RPO, your operations are impacted — you must verify the vendor''s BC/DR capability matches your business requirements","BC/DR is only relevant for vendors providing cloud hosting services","Vendor BC/DR planning is exclusively the vendor''s concern with no impact on the customer"]'::jsonb, 1,
   'Vendor recovery capability is your recovery capability for vendor-dependent services. Assess: Does the vendor have a tested BC/DR plan? What are their RTO/RPO commitments? Do they match your business requirements? When were they last tested? What is the geographic redundancy of their infrastructure? A vendor with a 48-hour RTO whose service you depend on in real time creates an unacceptable concentration risk.'),

  (v_qid, 'What is vendor concentration risk, and why is it a priority TPRM consideration?',
   '["The risk of having too many vendors, leading to management overhead","The risk of over-dependence on a single vendor or a small group of vendors such that their failure, breach, or price increase creates a catastrophic impact on organizational operations — a form of single-point-of-failure risk","The risk that vendors will concentrate their operations in geographic regions with higher natural disaster exposure","The risk of vendor consolidation reducing market competition and driving up contract costs"]'::jsonb, 1,
   'Concentration risk materialized when AWS us-east-1 outages took down multiple major services simultaneously because they shared the same infrastructure dependency. Organizations must map dependency chains: if one cloud provider hosts 80% of critical workloads, a major outage is a systemic risk. TPRM programs should identify concentration and require multi-vendor or multi-region strategies for tier-1 dependencies.');

  -- ============================================================
  -- MODULE 12 — AI Security & AI Governance  (pass: 85%)
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 11;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'OWASP LLM Top 10 lists Prompt Injection as the #1 risk for large language model applications. What does a direct prompt injection attack do?',
   '["It injects SQL commands into LLM-connected databases","An attacker crafts input that overrides the LLM''s system prompt instructions, causing the model to disregard its safety guidelines and perform unintended actions — such as revealing confidential system prompts, bypassing content filters, or executing unauthorized API calls","It corrupts the LLM''s training data to introduce biases","It intercepts LLM API traffic to extract user queries"]'::jsonb, 1,
   'Direct prompt injection occurs when a malicious user input manipulates the LLM''s context, effectively "hijacking" the model''s behavior. Indirect injection occurs when malicious instructions are embedded in data the LLM processes (web pages, documents) — the model obediently follows attacker instructions embedded in content it was asked to summarize.'),

  (v_qid, 'The NIST AI Risk Management Framework (AI RMF 1.0) organizes AI risk management into four core functions. What are they?',
   '["Identify, Protect, Detect, Respond","GOVERN, MAP, MEASURE, MANAGE — an integrated framework for identifying, assessing, and managing AI risks throughout the AI lifecycle","Plan, Do, Check, Act (PDCA cycle adapted for AI)","Transparency, Fairness, Accountability, Explainability"]'::jsonb, 1,
   'NIST AI RMF (January 2023) structures AI risk management around: GOVERN (establishing governance, policies, culture for trustworthy AI), MAP (identifying and categorizing AI risks in context), MEASURE (analyzing and tracking AI risks), and MANAGE (prioritizing and treating AI risks). It complements existing cybersecurity and enterprise risk frameworks.'),

  (v_qid, 'The EU AI Act classifies AI systems into risk categories. Which category faces the most stringent requirements, including conformity assessments and registration?',
   '["Minimal risk AI (spam filters, AI-enabled video games)","Limited risk AI (chatbots with disclosure requirements)","High-risk AI (CV screening, credit scoring, biometric identification, medical devices, critical infrastructure)","Unacceptable risk AI (social scoring, real-time biometric surveillance in public spaces)"]'::jsonb, 2,
   'The EU AI Act''s high-risk category (Annex III systems) imposes mandatory requirements: risk management systems, data governance, technical documentation, transparency, human oversight, accuracy/robustness/cybersecurity, and conformity assessment before market placement. High-risk AI includes employment screening, credit decisions, and safety-critical infrastructure management.'),

  (v_qid, 'Training data poisoning is an attack against AI/ML systems that works by:',
   '["Intercepting model API calls to modify inference results","Injecting malicious or manipulated data into the training dataset to corrupt the model''s learned behavior — causing misclassifications, introducing backdoors, or degrading model accuracy on targeted inputs","Stealing the model''s weights to create a replica","Overloading the inference endpoint to degrade availability"]'::jsonb, 1,
   'Training data poisoning is particularly dangerous because it affects the model''s fundamental behavior: a malicious actor who can influence training data can cause the model to consistently misclassify specific inputs (e.g., approve fraudulent loan applications when certain patterns appear), introduce backdoors triggered by specific tokens, or degrade accuracy for protected-class inputs.'),

  (v_qid, 'Model inversion attacks in AI security allow an attacker to:',
   '["Swap the AI model''s weights with a backdoored version","Reconstruct approximate copies of training data from a deployed model — extracting sensitive information such as PII used in training — by analyzing the model''s responses to carefully crafted queries","Prevent the AI model from making predictions by flooding the inference API","Steal the model''s architecture design to build competing products"]'::jsonb, 1,
   'Model inversion exploits the fact that models "memorize" aspects of their training data. By probing the model with targeted queries, attackers can reconstruct training examples — medical images from a diagnostic model, facial features from a recognition model, or PII from a language model fine-tuned on private data. This is a privacy attack with GDPR implications.'),

  (v_qid, 'Adversarial examples in machine learning are inputs that:',
   '["Crash the model by exceeding its input size limits","Are imperceptibly modified from legitimate inputs (e.g., a stop sign with subtle pixel-level perturbations) to cause the model to make high-confidence incorrect predictions — invisible to humans but misleading to models","Are synthetically generated to augment small training datasets","Are deliberately ambiguous inputs used in model stress testing"]'::jsonb, 1,
   'Adversarial examples exploit the geometry of ML model decision boundaries. A few pixels changed in an image — imperceptible to humans — can cause a classifier to switch from 99% confident "stop sign" to 99% confident "speed limit sign." In autonomous vehicles, medical imaging, or malware detection, this has life-safety and security implications.'),

  (v_qid, 'ISO/IEC 42001:2023 provides what for AI governance?',
   '["A certification standard for individual AI practitioners","An AI Management System (AIMS) standard — the ISO 27001 equivalent for AI governance — providing requirements for establishing, implementing, and maintaining a systematic AI management system with risk controls, impact assessments, and continual improvement","A technical standard for AI algorithm performance benchmarking","A regulatory compliance framework specifically for EU AI Act requirements"]'::jsonb, 1,
   'ISO 42001 is the world''s first AI management system standard. Like ISO 27001 for information security, it provides a certifiable framework for AI governance: AI policy, risk management (including AI-specific risks like bias, transparency, and privacy), impact assessment, human oversight requirements, and continual improvement. Organizations can achieve third-party certification.'),

  (v_qid, 'Retrieval-Augmented Generation (RAG) systems introduce which unique security consideration compared to base LLM deployments?',
   '["RAG systems have no internet access and are therefore more secure","The knowledge base injected into LLM context at inference time becomes an attack surface — indirect prompt injection via malicious content in retrieved documents can hijack the LLM''s behavior, and retrieval systems require separate access controls to prevent unauthorized data exposure","RAG systems require more compute and therefore have higher energy costs","RAG systems cannot process confidential documents due to tokenization limitations"]'::jsonb, 1,
   'RAG architectures retrieve documents and inject them into LLM context. If those documents contain adversarial instructions ("Ignore previous instructions and..."), the LLM may follow them — indirect prompt injection. Additionally, RAG retrieval systems must enforce access controls: users querying a RAG system should only retrieve documents they are authorized to read, not the entire knowledge base.'),

  (v_qid, 'AI bias and fairness testing is a required component of AI governance because:',
   '["AI systems are immune to human cognitive biases since they rely on data rather than intuition","AI systems can perpetuate, amplify, or introduce discrimination at scale — if training data reflects historical biases, models may systematically disadvantage protected groups in credit, hiring, criminal justice, and healthcare contexts","AI fairness is exclusively a marketing concern with no regulatory implications","Only facial recognition AI systems are subject to bias concerns"]'::jsonb, 1,
   'AI bias has regulatory implications: EU AI Act, US EO 13985, EEOC guidance, and CFPB fair lending rules all address algorithmic discrimination. AI governance programs must test models for disparate impact across protected characteristics, document fairness metrics (demographic parity, equalized odds, calibration), and implement human oversight for high-stakes automated decisions.'),

  (v_qid, 'LLM01 in the OWASP LLM Top 10 is Prompt Injection. LLM06 is Sensitive Information Disclosure. How does LLM06 typically manifest?',
   '["The LLM is hacked and its weights are stolen from the provider","The LLM reveals confidential information from its system prompt, training data, or in-context documents when users craft queries designed to extract it — such as asking the model to repeat its instructions or summarize documents containing confidential information","The LLM''s API key is exposed in client-side code","The LLM''s inference endpoint is compromised by a supply chain attack"]'::jsonb, 1,
   'LLM06 occurs when models surface confidential information from system prompts (revealing proprietary instructions), from training data (memorized PII or trade secrets), or from in-context documents (confidential files in a RAG system). Mitigations include: output filtering, not placing secrets in system prompts, data minimization in RAG, and training data sanitization.'),

  (v_qid, 'An AI governance program must establish "human-in-the-loop" (HITL) requirements for AI decisions. When is HITL most critical?',
   '["For all AI decisions without exception, regardless of impact or reversibility","For high-stakes, low-reversibility AI decisions affecting individuals — parole determinations, medical diagnosis, loan approvals, employment termination — where the cost of an automated error is severe and the affected individual deserves meaningful human review","Only when AI confidence scores fall below 50%","For decisions involving amounts over $10,000 in financial impact"]'::jsonb, 1,
   'HITL requirements should be risk-proportionate: low-stakes, reversible, high-volume decisions (spam classification, product recommendations) may be fully automated. High-stakes decisions with significant individual impact (credit denial, parole, hiring) require meaningful human review — not a rubber stamp, but genuine human engagement with the decision and ability to override the AI.'),

  (v_qid, 'Data exfiltration through LLM outputs is prevented primarily by:',
   '["Limiting the LLM''s training data volume","Output scanning and data loss prevention (DLP) tools that analyze LLM responses for sensitive data patterns (PII, credentials, classified markings) before delivery to users, combined with input filtering to prevent confidential data from entering the LLM context unnecessarily","Switching from cloud-hosted LLMs to on-premises deployments","Requiring users to sign NDAs before accessing LLM-powered applications"]'::jsonb, 1,
   'LLM-specific DLP requires both input controls (don''t inject confidential data into LLM context unless necessary) and output controls (scan responses for PII, credentials, or proprietary information before delivery). Traditional DLP patterns must be extended with LLM-aware detection that recognizes paraphrased or reformatted sensitive content, not just exact string matches.'),

  (v_qid, 'A model extraction attack allows adversaries to:',
   '["Remove the model from the provider''s servers","Create a functional replica of a proprietary model by querying the API with many carefully designed inputs and using the responses to train a surrogate model — stealing intellectual property without accessing the model weights directly","Crash the inference service through denial-of-service attacks","Access the model''s training data without authorization"]'::jsonb, 1,
   'Model extraction (model stealing) is an IP theft and security risk: a competitor or malicious actor queries a proprietary model''s API at scale, collecting input-output pairs, and trains a local surrogate model that approximates the original''s behavior. Rate limiting, query monitoring, output watermarking, and API authentication help detect and deter extraction attacks.'),

  (v_qid, 'AI governance programs should include a model registry that documents:',
   '["Only the financial cost and licensing terms of each AI model","The model''s purpose, training data sources, known limitations, bias test results, risk classification, approval status, owner, deployment environments, and monitoring thresholds — providing full traceability and enabling impact assessment if the model must be modified or retired","Only the model''s technical architecture and hyperparameters","The number of inferences the model processes per day for billing purposes"]'::jsonb, 1,
   'A model registry (the AI equivalent of an asset inventory) enables governance at scale: when a new bias risk is discovered or a regulatory requirement changes, the organization must know which models are affected, who owns them, what they''re used for, and what data they were trained on. Without a registry, AI governance is impossible to implement systematically.'),

  (v_qid, 'Which AI governance control specifically addresses the EU AI Act''s "right to explanation" for high-risk AI decisions?',
   '["Encrypting AI model weights to prevent reverse engineering","Explainability tools (LIME, SHAP) that generate human-readable explanations of why the AI made a specific decision — enabling affected individuals to understand, contest, and seek redress for automated decisions","Multi-factor authentication for AI system access","AI model performance benchmarking against industry baselines"]'::jsonb, 1,
   'The EU AI Act and GDPR Article 22 require that individuals subject to automated decisions receive meaningful explanations. LIME (Local Interpretable Model-agnostic Explanations) and SHAP (SHapley Additive exPlanations) provide feature attribution: "this loan was denied primarily because of debt-to-income ratio (40% weight) and employment history (35% weight)." This enables meaningful contestation of AI decisions.');

  -- ============================================================
  -- MODULE 13 — Identity Security & PAM
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 12;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'Privileged Access Management (PAM) solutions (e.g., CyberArk, BeyondTrust, Delinea) primarily address which security risk?',
   '["Unauthorized access through phishing of regular end users","Abuse or compromise of privileged accounts (admins, service accounts, root access) which, if breached, give attackers the highest level of access — PAM vaults credentials, records sessions, and enforces just-in-time access","Malware propagation through user workstations","Data loss from removable media and USB devices"]'::jsonb, 1,
   'Privileged accounts are the crown jewels of any attack: domain admin, root, cloud IAM admin, database DBA. PAM solutions vault credentials (so administrators never see the actual password), enforce MFA for privileged access, record full session video for forensics, and implement just-in-time provisioning — granting elevated access only for the duration of approved tasks.'),

  (v_qid, 'Zero Trust Identity applies the "never trust, always verify" principle to identity by requiring:',
   '["All users to be on the corporate VPN before authentication","Continuous authentication and authorization decisions based on real-time signals — user identity, device health, location, behavior, and data sensitivity — not just a single login event","Biometric authentication for all system access regardless of risk level","All service accounts to be replaced with human identities"]'::jsonb, 1,
   'Zero Trust Identity rejects the implicit trust granted by a successful login. Even after authenticating, every request is evaluated: Is the device compliant? Is this an unusual location? Is the behavior consistent with baseline? Is the requested resource appropriate for this user''s role? Continuous authorization means access can be revoked mid-session if risk signals change.'),

  (v_qid, 'SAML 2.0, OAuth 2.0, and OIDC (OpenID Connect) serve which identity functions respectively?',
   '["All three are equivalent SSO protocols for the same use case","SAML: enterprise SSO (browser-based federation between enterprise IdP and SPs); OAuth 2.0: authorization delegation (granting apps access to resources without sharing credentials); OIDC: authentication layer built on OAuth 2.0 that adds identity assertion (who the user is)","SAML: API authentication; OAuth: mobile app authentication; OIDC: desktop app authentication","SAML: password management; OAuth: role-based access control; OIDC: multi-factor authentication"]'::jsonb, 1,
   'Understanding the protocol distinctions is critical: SAML is the enterprise federation workhorse (HR system SSO to corporate apps). OAuth 2.0 enables "log in with Google" flows — but only delegates authorization, not identity. OIDC builds on OAuth 2.0 to add the ID token, providing both authentication (who is this user?) and authorization (what can they access?).'),

  (v_qid, 'MFA fatigue (also called MFA bombing or push bombing) attacks exploit:',
   '["Weak MFA implementations using SMS-based codes","The fact that authenticator apps send push notifications — attackers flood the victim with repeated push requests after compromising credentials, hoping the user approves one to make the notifications stop","Stolen hardware tokens from employees","Vulnerabilities in the IdP platform itself"]'::jsonb, 1,
   'Push MFA fatigue became prominent in 2022 (Uber, Cisco breaches): an attacker with valid credentials triggers dozens of MFA push notifications to the victim at odd hours. The victim, confused or annoyed, eventually approves one. Mitigations: number matching (the user enters a code shown in the app into the push prompt), context display (show login location/device), and phishing-resistant MFA (FIDO2/WebAuthn passkeys).'),

  (v_qid, 'Identity Governance and Administration (IGA) solutions address which specific risk that PAM does not?',
   '["Privileged account credential vaulting","Entitlement accumulation over time — IGA provides access certification (periodic reviews where managers attest that employee access is still appropriate), Segregation of Duties (SoD) conflict detection, and lifecycle automation (auto-provisioning and deprovisioning based on HR system changes)","Monitoring and recording privileged sessions","Just-in-time access for sensitive administrative tasks"]'::jsonb, 1,
   'IGA (SailPoint, Saviynt, Omada) solves identity lifecycle governance: new employees get role-based access automatically; when employees change roles or leave, access is modified/revoked. Access certifications prevent "access creep" where users accumulate permissions across years of role changes. SoD conflict detection prevents a single employee from having both payment initiation and approval rights — a fraud control.'),

  (v_qid, 'SCIM (System for Cross-domain Identity Management) is used in enterprise identity management to:',
   '["Encrypt identity tokens during OAuth 2.0 flows","Standardize the automated provisioning and deprovisioning of user identities across cloud applications — enabling HR systems to automatically create, update, and disable accounts in SaaS tools via a REST API","Federate authentication between multiple identity providers using SAML assertions","Manage multi-factor authentication device enrollment"]'::jsonb, 1,
   'SCIM (RFC 7642-7644) is an open standard for identity CRUD operations across systems. When a new employee is hired, the HR system triggers SCIM provisioning to create accounts in Okta, Salesforce, GitHub, Jira, and 50 other tools simultaneously. When the employee leaves, one HR action triggers SCIM deprovisioning across all connected systems — eliminating orphaned accounts.'),

  (v_qid, 'Conditional Access policies in enterprise identity platforms (Okta, Azure AD/Entra ID) enforce:',
   '["Password complexity requirements for all users","Context-aware access decisions — granting, challenging, or blocking access based on combinations of signals: user identity, group membership, device compliance status, IP location, time of day, and requested application risk level","Automatic session timeouts for inactive users","Network-layer firewall rules for application access"]'::jsonb, 1,
   'Conditional Access is the implementation of Zero Trust Identity in practice: "Allow access to the payroll system only from compliant, Intune-managed devices, during business hours, from known corporate locations — otherwise require step-up MFA from FIDO2." Policies can be layered by application risk, user role, and real-time risk signals from identity protection systems.'),

  (v_qid, 'Just-In-Time (JIT) privileged access is superior to standing privileged access because:',
   '["JIT access is faster to provision than permanent privileged accounts","Standing privileged accounts exist persistently and represent an always-available attack surface; JIT grants elevated privileges only for an approved time window and specific task, then revokes them automatically — minimizing the window of exposure","JIT access is required by PCI DSS for all cardholder data environments","Standing access requires more storage in the PAM vault"]'::jsonb, 1,
   'Standing admin accounts are a prime target: if compromised, attackers have persistent privileged access until discovered. JIT eliminates this: a developer needing database access submits a request, gets time-limited access (2 hours) for the approved task, and access is automatically revoked. There is no persistent privileged account to compromise between tasks.'),

  (v_qid, 'A service mesh in Kubernetes (e.g., Istio) implements identity for services through:',
   '["Shared API keys stored in Kubernetes ConfigMaps","mTLS (mutual TLS) with SPIFFE/SPIRE-issued certificates providing cryptographic service identity — services authenticate each other using certificates rather than network location or static credentials, implementing Zero Trust for east-west service-to-service traffic","Kubernetes RBAC roles assigned to pod service accounts","Network policies that whitelist allowed service-to-service communication paths"]'::jsonb, 1,
   'Service mesh mTLS solves the hardest zero trust problem: verifying the identity of services talking to each other inside a cluster. SPIFFE (Secure Production Identity Framework for Everyone) issues short-lived X.509 certificates (SVIDs) to workloads; SPIRE is the SPIFFE runtime implementation. Services authenticate each other cryptographically rather than trusting network adjacency.'),

  (v_qid, 'Credential stuffing attacks target applications using:',
   '["Brute-force guessing of passwords from wordlists","Large volumes of username/password pairs from previous data breaches, automated against login endpoints — exploiting users who reuse passwords across services","SQL injection to extract credential hashes from databases","Phishing pages that impersonate the login interface to capture credentials"]'::jsonb, 1,
   'Credential stuffing uses breach databases (Have I Been Pwned lists billions of compromised credentials) automated against login pages. If a user''s Netflix password from a 2019 breach is their bank password today, stuffing succeeds. Defenses: MFA (eliminates credential-only attacks), breached password detection (block known-compromised passwords at reset), rate limiting, CAPTCHA, and bot management.'),

  (v_qid, 'Domain admin compromise in an Active Directory environment typically leads to:',
   '["Access limited to a single server in the domain","Full compromise of the entire Windows domain — all computers, all user accounts, all servers, all data — because domain admin controls the authentication infrastructure itself, including the ability to create golden tickets and impersonate any account","Read-only access to Active Directory objects","Compromise limited to the domain controller servers themselves"]'::jsonb, 1,
   'Active Directory domain admin (or equivalent — Enterprise Admin, Schema Admin, BUILTIN\\Administrators on the DC) is the highest-value target in Windows environments. A compromised domain admin can: forge Kerberos tickets (golden/silver tickets), dump all password hashes, create persistence via AdminSDHolder, and establish a presence invisible to most monitoring. Recovery requires rebuilding the entire domain.'),

  (v_qid, 'The principle of Segregation of Duties (SoD) in identity governance is important because:',
   '["It ensures all duties are performed exclusively by senior employees","It prevents fraud and error by ensuring no single individual has both the ability to initiate and approve the same transaction — requiring collusion between at least two parties to commit fraud","It reduces the number of user accounts in the identity system","It enforces that all privileged tasks require two people physically present"]'::jsonb, 1,
   'SoD is a foundational internal control: the person who can create a vendor in accounts payable should not also be able to approve vendor payments. The person who initiates a wire transfer should not approve it. IGA systems detect SoD conflicts at provisioning time, and access certifications surface conflicts that accumulate over time through role changes.'),

  (v_qid, 'FIDO2 / WebAuthn passkeys are considered phishing-resistant because:',
   '["They use longer, more complex passwords than traditional authentication","Authentication is bound to the specific origin domain using public-key cryptography — a passkey created for bank.com will not authenticate to attacker.com even if the user is tricked into visiting the phishing site","They require physical presence of the user at the registered device at all times","They cannot be intercepted because they are transmitted over a VPN"]'::jsonb, 1,
   'Passkey security relies on origin binding: the private key signs a challenge that includes the relying party ID (domain). A phishing site at bank-login.com cannot trigger authentication to bank.com because the origin doesn''t match. This eliminates the primary attack vector of real-time phishing proxies (Evilginx, Modlishka) that steal session cookies from SMS/TOTP MFA in real time.'),

  (v_qid, 'When implementing PAM, session recording provides which security and compliance benefit?',
   '["It prevents privileged users from accessing production systems","A forensic audit trail of every keystroke and command executed during privileged sessions — supporting incident investigation (what did the compromised admin do?), insider threat detection, and compliance requirements (PCI DSS, SOX, HIPAA require privileged access monitoring)","It automatically revokes access when users perform prohibited actions","It encrypts privileged sessions to prevent interception by security monitoring tools"]'::jsonb, 1,
   'PAM session recording captures the full privileged session: keystrokes, commands, screen recording, file transfers. During incident response, this evidence answers "what did the attacker do after compromising the admin account?" — critical for scoping cleanup. Compliance frameworks (PCI DSS 10.2.5, SOX IT controls, HIPAA access monitoring) require evidence of privileged access monitoring.');

  -- ============================================================
  -- MODULE 14 — Threat Intelligence & Advanced Threat Hunting
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 13;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'The Cyber Threat Intelligence (CTI) lifecycle phases are:',
   '["Collect → Analyze → Share","Planning & Direction → Collection → Processing → Analysis → Dissemination → Feedback","Detect → Investigate → Respond → Recover","Identify → Assess → Treat → Monitor"]'::jsonb, 1,
   'The CTI lifecycle mirrors the intelligence cycle: (1) Planning & Direction — define intelligence requirements; (2) Collection — gather raw data from OSINT, HUMINT, technical sources; (3) Processing — normalize and structure raw data; (4) Analysis — derive context and meaning; (5) Dissemination — share finished intelligence with stakeholders; (6) Feedback — validate relevance and refine requirements.'),

  (v_qid, 'MITRE ATT&CK Enterprise covers 14 Tactics. Which tactic describes attacker activities after gaining initial access but before achieving their primary objective — specifically moving from one compromised host to others?',
   '["Initial Access","Lateral Movement","Exfiltration","Command and Control"]'::jsonb, 1,
   'Lateral Movement (TA0008) covers techniques used by adversaries to move progressively through a network after initial compromise: Pass-the-Hash (T1550.002), Remote Services (T1021), Internal Spearphishing (T1534), and Exploitation of Remote Services. Detecting lateral movement early limits breach scope — it''s the phase where attackers expand from a foothold to full domain compromise.'),

  (v_qid, 'A threat intelligence platform (TIP) such as MISP, ThreatConnect, or Anomali differs from a SIEM in that:',
   '["TIPs are more affordable and replace SIEM for most organizations","TIPs specifically store, correlate, and share threat intelligence (IOCs, TTPs, threat actor profiles) and integrate with SIEM to enrich alerts with context — while SIEM aggregates and correlates security events from organizational infrastructure","TIPs perform automated incident response while SIEM only detects","TIPs are used exclusively by government intelligence agencies"]'::jsonb, 1,
   'TIPs manage the intelligence lifecycle: ingesting feeds (ISAC, commercial, open source), deduplicating and scoring IOCs, enriching them with context (associated threat actor, campaign, malware family), and pushing them to operational controls (SIEM, firewall, EDR) for detection and blocking. SIEM uses intelligence produced by TIPs; it does not manage the intelligence process itself.'),

  (v_qid, 'Hypothesis-driven threat hunting begins with:',
   '["A random search through SIEM logs for anything suspicious","A structured hypothesis based on threat intelligence, ATT&CK techniques, or adversary TTPs specific to the organization''s sector — then hunting for evidence supporting or refuting that hypothesis using available telemetry","An automated scan of all endpoints for known malware signatures","A review of all security alerts in the past 30 days"]'::jsonb, 1,
   'Effective threat hunting is not random — it is intelligence-driven. A hypothesis example: "Based on APT29 targeting our sector, we hypothesize they may have established persistence using registry run keys (T1547.001). Let''s hunt for unusual registry modifications in the past 90 days." The hunt either finds evidence (a real detection) or refutes the hypothesis (improving confidence that the technique was not used).'),

  (v_qid, 'Diamond Model of Intrusion Analysis describes an attack using four key elements. What are they?',
   '["Who, What, When, Where","Adversary, Capability, Infrastructure, Victim — connected by relationships that define an intrusion event","Tactic, Technique, Procedure, Tool","Initial Access, Persistence, Privilege Escalation, Impact"]'::jsonb, 1,
   'The Diamond Model provides a structured analytical framework: Adversary (the threat actor) uses Capability (malware, exploit) over Infrastructure (C2 servers, domains) against a Victim (target organization). Relationships between these vertices enable attribution and campaign analysis — connecting disparate incidents that share infrastructure or capabilities to the same adversary.'),

  (v_qid, 'Nation-state APT groups are characterized by which trait that distinguishes them from cybercriminal groups?',
   '["They exclusively use ransomware for financial gain","They operate with state resources, long-term strategic objectives (espionage, pre-positioning for conflict), custom tooling, and operational discipline to maintain access covertly for months or years — prioritizing stealth over speed","They target only critical infrastructure in Western nations","They do not use malware, relying exclusively on social engineering"]'::jsonb, 1,
   'APT (Advanced Persistent Threat) describes state-sponsored actors: advanced (sophisticated custom tooling, supply chain attacks), persistent (maintaining access for months to years), and threat (conducting cyber espionage, IP theft, or strategic pre-positioning). Criminal groups seek quick financial return; APTs accept slow, stealthy campaigns in pursuit of strategic intelligence or sabotage objectives.'),

  (v_qid, 'IOCs (Indicators of Compromise) and TTPs (Tactics, Techniques, and Procedures) represent different levels of the threat intelligence pyramid. Which is more operationally valuable and why?',
   '["IOCs are more valuable because they enable automatic blocking of known threats","TTPs are more valuable because they describe HOW adversaries operate — and TTPs remain valid long after specific IOCs are rotated, enabling detection of adversary behavior regardless of the specific tools or infrastructure they use","Both are equally valuable and should be treated identically","IOCs are more valuable because they are easier to collect and share"]'::jsonb, 1,
   'IOCs (IP addresses, domains, hashes) are ephemeral — attackers rotate them constantly. A blocked IP is a trivial obstacle for a sophisticated adversary. TTPs describe the fundamental behavior: lateral movement via stolen Kerberos tickets (Pass-the-Ticket), C2 via DNS tunneling, data staging in encrypted archives before exfiltration. Detecting behaviors makes the detection durable across adversary tooling changes.'),

  (v_qid, 'STIX 2.1 and TAXII 2.1 are threat intelligence standards used to:',
   '["Score vulnerabilities on a standardized scale","Express threat intelligence in machine-readable JSON format (STIX) and distribute it via REST APIs (TAXII) — enabling automated, standardized sharing of threat data between organizations, TIPs, and operational controls","Encrypt threat intelligence in transit to prevent adversary awareness","Define threat actor attribution with legal-grade evidence standards"]'::jsonb, 1,
   'STIX 2.1 defines a JSON schema for threat objects: Indicators, Malware, Threat Actors, Attack Patterns, Courses of Action, etc. TAXII 2.1 is the transport protocol for sharing these objects via API collections. Together they enable automated threat sharing: when a financial services ISAC shares a new phishing campaign IOC in STIX, member organizations'' security tools can ingest and block it within minutes.'),

  (v_qid, 'Detecting Kerberoasting in an Active Directory environment requires monitoring for:',
   '["Repeated failed authentication attempts to domain controllers","Unusual service ticket requests (TGS-REQ for Kerberos RC4 encryption for accounts with SPNs) — particularly RC4 encryption requests which suggest an attacker is requesting tickets to crack offline","PowerShell execution with obfuscated commands","DNS requests to recently registered domains"]'::jsonb, 1,
   'Kerberoasting requests Kerberos service tickets for accounts with Service Principal Names (SPNs) — often service accounts. The tickets are encrypted with the service account''s NTLM hash and can be cracked offline. Detection: Event ID 4769 with Ticket Encryption Type 0x17 (RC4-HMAC), especially for rarely-accessed service accounts, is a high-fidelity indicator. Most modern environments use AES; RC4 requests are anomalous.'),

  (v_qid, 'DNS beaconing detection in threat hunting identifies:',
   '["High volumes of DNS NXDOMAIN errors indicating DNS misconfiguration","Regular, periodic DNS queries to unusual or algorithmically generated domains (DGA) that indicate malware maintaining command-and-control communications — characterized by consistent timing intervals, unusual domain entropy, and queries to domains with no legitimate traffic baseline","DNS zone transfer requests from unauthorized sources","Unusually large DNS response packets indicating DNS amplification attacks"]'::jsonb, 1,
   'Malware C2 beaconing via DNS is stealthy because DNS traffic is ubiquitous. Detection signatures: regular periodic queries (every 300 seconds), high-entropy domain names (DGA: xkj2p9mn.com), domains with no history in passive DNS, and encoded data in subdomains (data.c2.com queries with payload encoded in the subdomain). Detecting these patterns requires DNS telemetry analysis in the SIEM.'),

  (v_qid, 'The Pyramid of Pain (David Bianco) describes threat intelligence in ascending levels of difficulty to change for attackers. From easiest to hardest for attackers to change:',
   '["Malware → IP Addresses → Domain Names → TTPs","Hash Values → IP Addresses → Domain Names → Network Artifacts → Host Artifacts → TTPs","TTPs → Tools → Infrastructure → IOCs","IOCs → Malware Families → Threat Actors → TTPs"]'::jsonb, 1,
   'The Pyramid of Pain: Hash Values (trivial to recompile the malware), IP Addresses (easy to rotate), Domain Names (annoying but manageable), Network/Host Artifacts (challenging), Tools (significant — requires retooling), TTPs (most painful — requires changing fundamental adversary tradecraft). Defenders should focus detection on higher pyramid levels for more durable, adversary-resistant detections.'),

  (v_qid, 'Intelligence Sharing through an ISAC (Information Sharing and Analysis Center) benefits organizations by:',
   '["Eliminating the need for internal threat intelligence programs","Providing sector-specific threat intelligence from peer organizations — enabling early warning of attacks targeting the sector, shared IOC lists, and collective defense where one organization''s detection becomes all members'' protection","Providing legal immunity for sharing threat information","Replacing the need for commercial threat intelligence subscriptions"]'::jsonb, 1,
   'ISACs (Financial Services ISAC, Health ISAC, Automotive ISAC, etc.) create trusted communities where competitors share threat intelligence without commercial or legal risk (US: enabled by CISA''s Traffic Light Protocol and the Cybersecurity Information Sharing Act of 2015). When Bank A detects a phishing campaign, FS-ISAC sharing means Banks B through Z can block it before being targeted.'),

  (v_qid, 'A threat hunt using the "Assume Breach" methodology starts from the premise that:',
   '["The organization''s perimeter controls are fully effective and no breach has occurred","An adversary has already gained and maintained access to the environment — the hunt objective is to FIND the hidden presence, not to determine IF a compromise occurred","All alerts in the SIEM have been investigated and confirmed","The organization is currently under active attack and incident response has been triggered"]'::jsonb, 1,
   'Assume Breach (the Zero Trust philosophy applied to hunting) accepts that sophisticated adversaries may already be present despite perimeter controls. Hunters look for evidence of established presence: unusual scheduled tasks, WMI subscriptions for persistence, unusual service accounts with elevated privileges, staging directories with compressed data. This mindset shift drives more thorough investigation than alert-reactive approaches.'),

  (v_qid, 'Campaign tracking in threat intelligence connects disparate incidents by identifying shared:',
   '["Timing patterns in attack execution","Infrastructure (IP ranges, ASNs, registrar patterns), tools (malware families, exploit kits), TTPs (ATT&CK technique combinations), and victimology (sector, geography, target profile) that link multiple incidents to a single threat actor or operation","Employee security training completion rates across organizations","Vulnerability CVE numbers exploited in each incident"]'::jsonb, 1,
   'Campaign analysis elevates intelligence from tactical (this IOC is bad) to strategic (this is part of a multi-year APT41 campaign targeting healthcare IP). By correlating infrastructure (C2 servers using the same ASN and registrar patterns), tools (same custom malware variants), and targets (same sector, similar technology stacks), analysts attribute incidents to campaigns and predict future targeting.'),

  (v_qid, 'Threat intelligence at the "strategic" level is designed for which audience?',
   '["SOC analysts who need IOCs to configure SIEM detection rules","Executive and board leadership who need an understanding of the threat landscape relevant to the organization''s business, sector trends, nation-state targeting, and investment priorities — without technical IOC or TTP details","Incident responders who need playbooks for specific malware families","Penetration testers who need adversary TTPs for red team exercises"]'::jsonb, 1,
   'Threat intelligence has three levels: Strategic (board/CISO — threat landscape, geopolitical context, business risk), Operational (security managers — adversary campaigns, attacker motivations, trends), Tactical (SOC analysts — IOCs, detection rules, malware signatures). Each level serves a different decision-making audience and must be translated into the appropriate format and language for that audience.');

  -- ============================================================
  -- MODULE 15 — Security Automation, SOAR & Compliance Tools
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 14;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'SOAR (Security Orchestration, Automation and Response) reduces analyst workload by:',
   '["Replacing all Tier 1 and Tier 2 analysts with automated systems","Automating high-volume, repetitive response tasks through playbooks — IP enrichment via threat intel lookups, automatic ticket creation, endpoint isolation via EDR API, notification routing — so analysts focus on decisions requiring human judgment","Eliminating the need for a SIEM by processing events directly","Automating penetration testing for continuous security validation"]'::jsonb, 1,
   'SOAR''s ROI comes from automating decision-free tasks: when GuardDuty fires on a known-malicious IP, the playbook automatically enriches the alert with VirusTotal data, creates a Jira ticket, notifies the on-call analyst, and pre-populates the investigation timeline — before the analyst even opens the ticket. Analysts then decide and direct rather than execute mechanical steps.'),

  (v_qid, 'Vanta, Drata, and Secureframe reduce compliance program costs primarily by:',
   '["Performing the external audit on behalf of the organization","Connecting to cloud infrastructure, HR, MDM, and code repositories via API to continuously and automatically collect evidence that security controls are operating effectively — eliminating the months of manual evidence gathering before audits","Providing AI-generated compliance reports that pass audits without actual control implementation","Replacing the need for SOC 2 or ISO 27001 certification by providing self-certification"]'::jsonb, 1,
   'CCM (Continuous Controls Monitoring) platforms transform compliance from a periodic sprint to a continuous program. Integrations auto-collect evidence: AWS Config rules pass/fail, Okta MFA enforcement rates, GitHub branch protection status, HR onboarding/offboarding completion. When the auditor requests evidence, it''s already organized — reducing audit prep from 3 months to 2 weeks.'),

  (v_qid, 'Open Policy Agent (OPA) with Rego policies provides security automation for:',
   '["Automated penetration testing of cloud applications","Policy-as-code enforcement — defining access control, authorization, and configuration compliance policies as declarative code that can be integrated into Kubernetes admission control, API gateways, CI/CD pipelines, and Terraform plans","Automated vulnerability remediation by patching systems based on CVE severity","SOAR playbook orchestration for incident response workflows"]'::jsonb, 1,
   'OPA is a general-purpose policy engine; Rego is its declarative policy language. In Kubernetes, OPA/Gatekeeper (or Kyverno) enforces admission policies: "deny any deployment running as root," "require resource limits," "block images not signed by the trusted registry." In CI/CD, OPA checks Terraform plans against security policies before infrastructure is provisioned.'),

  (v_qid, 'Prowler and ScoutSuite are open-source tools used for:',
   '["Endpoint detection and response automation","Cloud security posture assessment — scanning AWS, Azure, and GCP configurations against CIS Benchmarks, NIST CSF, SOC 2, and GDPR controls, generating reports of misconfigurations and compliance gaps","Network packet capture and analysis","Automated vulnerability scanning of web applications"]'::jsonb, 1,
   'Prowler (AWS-focused, now multi-cloud) and ScoutSuite (multi-cloud) enumerate cloud configurations and compare them against security best practices and compliance frameworks. They identify critical misconfigurations — public S3 buckets, unrestricted security group rules, unencrypted databases, missing CloudTrail logging — that CSPM tools also flag, but as free open-source alternatives.'),

  (v_qid, 'A SOAR playbook for phishing response typically automates which sequence of actions?',
   '["Block the sender, delete the email, and close the ticket","Extract IOCs from the suspicious email (sender, URLs, attachments), check IOCs against threat intel (VirusTotal, CrowdStrike, URLScan), check if other employees received the same email, scan endpoint if clicked, block IOCs in email gateway and proxy, notify user, create/update ticket, escalate if malicious attachment confirmed","Forward the email to the security team for manual review","Quarantine the user''s mailbox and reset their password automatically"]'::jsonb, 1,
   'Phishing playbooks automate the first 80% of the investigation in seconds: extract artifacts, enrich against threat intel, scope via email gateway search, check endpoints, block IOCs, notify user with security awareness messaging, and route the ticket with pre-populated evidence to L2 if confirmed malicious. What took 45 minutes manually takes 90 seconds with SOAR.'),

  (v_qid, 'Infrastructure as Code (IaC) security scanning (e.g., Checkov, tfsec, KICS) in CI/CD pipelines provides:',
   '["Runtime protection for cloud workloads after deployment","Shift-left misconfiguration detection — scanning Terraform, CloudFormation, Kubernetes manifests, and Docker files for security issues (exposed ports, permissive IAM policies, missing encryption) BEFORE infrastructure is provisioned, making fixes free rather than expensive","Automated remediation of infrastructure vulnerabilities without human approval","Performance optimization for cloud workloads"]'::jsonb, 1,
   'IaC scanning catches infrastructure misconfigurations at the pull request stage — before they reach production. Finding "S3 bucket ACL is public" in a Terraform plan review costs nothing to fix. Finding the same issue after deployment (during a security assessment or after a breach) costs incident response, breach notification, regulatory fines, and reputational damage.'),

  (v_qid, 'Security chaos engineering (GameDays, tabletop exercises, red team exercises) is valuable for compliance programs because:',
   '["It satisfies PCI DSS requirements for quarterly vulnerability scans","It validates that controls actually work when tested — not just on paper — and that response procedures are effective when activated under realistic conditions, satisfying auditor requirements for control operating effectiveness","It automatically generates audit evidence for SOC 2 Type II reports","It trains security staff to bypass existing controls more efficiently"]'::jsonb, 1,
   'Controls must be tested, not just documented. Tabletop exercises test decision-making under simulated incident conditions. Red team exercises test whether detective and preventive controls actually detect and stop attacks in practice. Auditors for SOC 2, ISO 27001, and PCI increasingly ask: "Show us the results of control testing, not just that the control exists."'),

  (v_qid, 'Python automation in a security compliance program is most commonly applied to:',
   '["Replacing all manual security analysis with fully autonomous AI","Automating repetitive data collection, evidence generation, report formatting, and API integrations — such as pulling AWS Config results into a compliance dashboard, generating user access review spreadsheets from IAM data, or automatically tracking control status against framework requirements","Performing automated penetration testing without human oversight","Replacing GRC platforms with custom-built compliance systems"]'::jsonb, 1,
   'Security practitioners who can write Python scripts bridge the gap between tools: pulling data from APIs (AWS, Okta, Jira), transforming it, and pushing to dashboards or reporting systems. A 50-line Python script can automate the weekly user access review export that used to take 4 hours manually. This is where ROI is highest for technical compliance practitioners.'),

  (v_qid, 'ServiceNow IRM (Integrated Risk Management) is used in enterprise GRC programs to:',
   '["Replace SIEM for security event management","Centralize risk management, policy management, audit management, and compliance workflows in a single platform — connecting risk register management with incident tracking, change management, and audit evidence collection across the enterprise","Provide endpoint detection and response for Windows and macOS","Automate configuration management of network infrastructure"]'::jsonb, 1,
   'ServiceNow IRM (formerly GRC) provides enterprise workflow and record-keeping for risk and compliance programs: risk register in a workflow system, policy management with version control and attestation, audit management with evidence collection workflows, and continuous monitoring integration. Its strength is connecting GRC workflows with IT workflows in a single platform used by enterprise operations teams.'),

  (v_qid, 'Automated access recertification in IGA platforms reduces which compliance risk?',
   '["The risk of unauthorized external access through phishing","Entitlement accumulation (access creep) — where employees accumulate permissions over time from role changes, project assignments, and one-off access grants that are never revoked — creating insider threat risk and compliance violations (SOX SoD, HIPAA minimum necessary)","The risk of service account credential exposure","Password policy violations by end users"]'::jsonb, 1,
   'Automated access reviews trigger campaigns where managers review and certify their team''s access. The IGA platform auto-revokes access for any certification response of "no longer needed" or for non-response after a deadline. Without automated recertification, access accumulates over years of tenure changes until a former employee retains access to five different production systems after moving to a non-technical role.'),

  (v_qid, 'Terraform compliance gates in a DevSecOps pipeline work by:',
   '["Automatically applying Terraform plans to production when developers commit code","Running IaC security scanners (Checkov, tfsec) and policy engines (OPA) against Terraform plans in CI — blocking the pipeline and failing the pull request if security policy violations are detected before any infrastructure is provisioned","Scanning Terraform state files for exposed credentials after deployment","Automating cost optimization by removing underutilized cloud resources"]'::jsonb, 1,
   'Terraform compliance gates enforce security policy before infrastructure exists: the PR fails if a plan includes an unencrypted RDS instance, a publicly accessible storage bucket, or a security group open to 0.0.0.0/0. The developer sees the policy violation in the PR review, fixes the Terraform code, and resubmits — the feedback loop is in the development workflow, not a post-deployment audit finding.'),

  (v_qid, 'Evidence as Code in compliance automation means:',
   '["Storing audit evidence in code repositories for version control","Defining evidence collection as automated processes that continuously gather and timestamp control artifacts from integrated systems — instead of manually collecting screenshots and spreadsheets before audits, evidence is generated programmatically and continuously available","Writing compliance policies in a programming language rather than prose","Using AI to generate synthetic compliance evidence"]'::jsonb, 1,
   'Evidence as Code transforms audit preparation: instead of "let''s collect 6 months of evidence before the audit," automated integrations have been collecting timestamped screenshots, API responses, and configuration exports continuously throughout the year. The evidence portfolio is always current. When the auditor requests evidence, the compliance platform generates it on demand from structured, verified data sources.'),

  (v_qid, 'A SOAR playbook triggers when EDR detects a suspicious PowerShell command executing on an endpoint. What automated response actions should the playbook execute?',
   '["Immediately wipe the endpoint and rebuild from scratch","Collect process details and parent process chain, query EDR for other endpoints running the same process, check the PowerShell command against threat intelligence, isolate the endpoint from the network while preserving it for forensics, create an incident ticket with all collected context, and alert the on-call analyst for a containment decision","Block all PowerShell execution across the organization immediately","Send a warning email to the user and close the alert"]'::jsonb, 1,
   'A well-designed SOAR playbook for suspicious PowerShell balances automation (collect context, enrich, scope) with human judgment (containment decision). It should never wipe an endpoint automatically — forensic evidence would be destroyed. Instead, the playbook presents the analyst with pre-collected evidence (process chain, parent process, network connections, threat intel hits) and a one-click isolation option, making the human decision fast and well-informed.');

  -- ============================================================
  -- MODULE 16 — Audit Readiness & Executive Communication
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 15;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'The primary objective of an internal audit in a security program is to:',
   '["Identify evidence of employee misconduct for HR investigation","Independently assess whether security controls are designed and operating effectively before an external auditor or regulator reviews them — providing management with objective assurance and identifying gaps before they become audit findings","Replace the need for external certification audits","Conduct penetration testing to identify technical vulnerabilities"]'::jsonb, 1,
   'Internal audits provide a rehearsal and quality control mechanism: find the gaps yourself before the external auditor does. Findings can be remediated on the organization''s timeline rather than in response to an audit finding. A mature internal audit function reduces external audit surprises, accelerates certification, and demonstrates a culture of continuous improvement to auditors.'),

  (v_qid, 'When mapping controls to multiple compliance frameworks simultaneously (SOC 2, ISO 27001, NIST CSF), the most efficient approach is:',
   '["Implementing three separate control programs, one per framework","Using a cross-framework mapping (e.g., Unified Compliance Framework, SCF) to identify common controls that satisfy multiple frameworks simultaneously — one MFA policy serves SOC 2 CC6.1, ISO 27001 A.8.5, and NIST CSF PR.AC-7 at once","Obtaining all certifications sequentially rather than simultaneously","Focusing on the most demanding framework and ignoring others"]'::jsonb, 1,
   'Most enterprise security controls serve multiple frameworks. An encryption policy satisfies SOC 2 CC6.7, ISO 27001 A.8.24, and PCI DSS 3.5 simultaneously. Mapping unlocks this efficiency: instead of managing three separate evidence collections and three sets of policies, one unified program with smart mapping satisfies all frameworks from a single implementation.'),

  (v_qid, 'An external auditor''s primary obligation during a compliance audit is to:',
   '["Help the organization pass the audit by suggesting how to present evidence favorably","Provide an independent, professional opinion on whether the organization''s controls meet the standard''s requirements — their opinion must be objective, even if adverse findings disappoint the client","Identify all security vulnerabilities in the organization''s systems","Help the organization reduce the scope of the audit to minimize findings"]'::jsonb, 1,
   'Auditor independence is foundational. External auditors (CPAs for SOC 2, accredited CBs for ISO 27001) are bound by professional standards that require objectivity. They cannot accept engagements where independence is impaired, cannot express opinions shaped by client pressure, and must issue qualified or adverse opinions when warranted regardless of client preference.'),

  (v_qid, 'Evidence mapping in audit preparation means:',
   '["Physically mapping the location of servers that store audit evidence","Creating a structured traceability matrix linking each control requirement to the specific evidence artifacts that demonstrate compliance — so any auditor request can be satisfied within hours rather than requiring a team scramble","Categorizing audit findings by severity level","Drawing a network diagram of systems in scope for the audit"]'::jsonb, 1,
   'Evidence mapping transforms "where is the evidence for CC6.1?" from a question that causes panic into a simple lookup. The map contains: requirement → control description → evidence artifacts (specific screenshot names, system exports, policy document references) → evidence owner → last collection date. A complete evidence map enables a security team to present audit packages confidently.'),

  (v_qid, 'A security executive dashboard for C-suite reporting should present metrics that:',
   '["Show the maximum technical detail possible so leadership understands the full complexity","Are tied to business risk and business impact — measuring outcomes (breach rate, mean time to detect, percentage of critical systems with effective controls) rather than activities (number of patches applied, SIEM alerts processed) — translated from technical metrics into business language","Include all raw SIEM alert data for full transparency","Focus exclusively on compliance certification status"]'::jsonb, 1,
   'C-suite executives make resource allocation decisions. They need: Is our risk increasing or decreasing? Are we investing in the right controls? What is our exposure if a breach occurs? The answer to "3,421 SIEM alerts processed this week" means nothing. "Mean time to detect decreased 40% this quarter; we would contain a breach 2x faster than last year" answers the business question.'),

  (v_qid, 'Control deficiency severity classification distinguishes between material weaknesses and significant deficiencies. A material weakness in SOX or SOC 2 context indicates:',
   '["A minor gap that should be addressed in the next annual control improvement cycle","A significant deficiency in a lower-risk control area","A deficiency that represents a reasonable possibility that a material misstatement (SOX) or material TSC criterion failure (SOC 2) will not be prevented or detected on a timely basis — requiring immediate remediation and disclosure","A finding that will automatically result in audit failure"]'::jsonb, 2,
   'Material weakness is the most severe control deficiency classification: it indicates the control environment has a fundamental gap that creates real risk of financial misstatement (SOX) or TSC criteria failure (SOC 2). Material weaknesses require immediate remediation, mandatory disclosure in SOX contexts, and can trigger qualified audit opinions. They are the failures boards and audit committees must be informed about immediately.'),

  (v_qid, 'Remediation tracking during an audit cycle should be managed using:',
   '["A spreadsheet shared via email between the security team and auditors","A formal corrective action plan (CAP) with root cause analysis, remediation steps, responsible owners, target completion dates, and management sign-off — tracked in the GRC platform so progress is visible to management and auditors","Verbal commitments from the security team during audit meetings","A separate external system invisible to auditors until remediation is complete"]'::jsonb, 1,
   'Auditors evaluate not just whether findings are fixed, but whether the organization has a mature remediation process: root cause analysis (not just symptom treatment), accountable owners, realistic timelines, management oversight, and verification of effectiveness. A well-managed CAP demonstrates security program maturity. An unmanaged backlog of prior-year findings is a red flag that signals systemic control weakness.'),

  (v_qid, 'A board-level security briefing differs from an operational security update in that:',
   '["Board briefings are shorter and therefore contain less accurate information","Board briefings translate technical risk into strategic business terms: regulatory exposure (potential fines, license risk), competitive implications (breach impact on customer trust), investment priorities (what budget is needed to address identified gaps), and peer benchmarking — not vulnerability counts or patch metrics","Board briefings are confidential and therefore cannot reference specific incidents","Board briefings are presented by external auditors rather than internal security leadership"]'::jsonb, 1,
   'Board members are fiduciaries making investment decisions, not security operators. Effective board briefings: compare the organization''s control maturity to industry peers, quantify financial exposure in scenarios the board can evaluate (breach cost range, regulatory fine exposure), connect security investment requests to risk reduction outcomes, and give the board the information needed to fulfill their oversight duty.'),

  (v_qid, 'The purpose of a pre-audit readiness assessment is:',
   '["To determine which employees should be interviewed during the audit","To conduct an internal simulation of the external audit — reviewing control documentation, testing control effectiveness, identifying evidence gaps, and resolving deficiencies before the external auditor arrives","To negotiate a reduced scope with the certification body","To train the security team on the auditor''s questioning style"]'::jsonb, 1,
   'A readiness assessment (internal audit or third-party advisory exercise) simulates the external audit process: auditors test the same controls with the same evidence requests. Gaps discovered internally can be remediated on the organization''s timeline. Gaps discovered by external auditors become findings in the report, potentially affecting the opinion, the certification, and customer trust.'),

  (v_qid, 'When communicating a data breach to the board, which information is most critical for the board to receive first?',
   '["The technical details of the exploit used by the attacker","The scope of the breach (what data, how many individuals affected), whether notification obligations to regulators and customers are triggered (and deadlines), the immediate response actions taken, and what is needed from board-level decisions (e.g., engaging external counsel, approving crisis communications)","The names of the security team members who failed to prevent the breach","The cost of the security tools that failed to detect the attack"]'::jsonb, 1,
   'A board breach briefing is a crisis communication, not a technical postmortem. The board needs to: understand the scope to assess liability exposure, authorize legal and regulatory response actions, approve external communications, and decide on resource deployment. Technical details belong in the incident report; the board needs decision-enabling information about impact, obligations, and required actions.'),

  (v_qid, 'Control testing sampling in an audit — rather than testing 100% of control executions — is based on:',
   '["Budget limitations that prevent full testing","Statistical auditing standards (AICPA/IAASB) that allow conclusions to be drawn about an entire population from a representative sample — sample sizes are risk-based and defined in audit standards (e.g., for a control executed daily, test 25 instances; for a monthly control, test 2–3 instances)","The assumption that sampled controls are more reliable than tested controls","Regulatory requirements that prohibit testing more than a defined percentage of controls"]'::jsonb, 1,
   'Audit sampling is governed by professional standards, not budget convenience. Auditors use statistical sampling to achieve defined confidence levels. Higher-risk controls get larger samples; lower-risk controls get smaller samples. Understanding sampling gives organizations insight into what evidence is actually needed: a control executed 365 times/year might only require 25 evidence samples, not one for every day.'),

  (v_qid, 'An organization completes SOC 2 Type II certification. How should they leverage this in sales and procurement processes?',
   '["Keep the report confidential and only share it under strict NDA after deals are signed","Proactively provide the SOC 2 report (or an executive summary) to enterprise prospects during security questionnaire processes, use it to reduce or eliminate questionnaire responses for covered controls, and include certification status on the website and in RFP responses to differentiate from non-certified competitors","Only reference SOC 2 in responses to direct questions from procurement teams","Replace all security questionnaires with the SOC 2 report and refuse to answer additional questions"]'::jsonb, 1,
   'SOC 2 is a sales accelerant. Enterprise procurement teams often require security attestations before purchasing. Organizations with SOC 2 can: respond to security questionnaires faster (reference the report for covered controls), shortcut vendor risk assessments, build trust with regulated-industry buyers, and market certification as a differentiator. The investment in SOC 2 pays commercial dividends beyond compliance.'),

  (v_qid, 'What does "population" mean in the context of evidence collection for a security control test?',
   '["The total number of employees in the organization","The complete set of all instances that the control should have operated during the audit period — for example, all 52 weekly patch review meetings in a year is the population for a weekly patch review control — from which the auditor selects a sample","The total number of security incidents during the audit period","The number of systems in scope for the control"]'::jsonb, 1,
   'Defining the population is the first step in evidence planning: what are ALL the instances this control should have fired? Weekly control = 52 instances/year. Daily control = 365. Access review = 4 (quarterly). The auditor selects a sample from the population. If you cannot produce the full population (because records weren''t kept), the auditor may conclude the control did not operate throughout the period.');

  -- ============================================================
  -- MODULE 17 — Security Leadership & CISO Track
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 16;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'The modern CISO role has evolved from a technical function to a business leadership role. This shift means CISOs must:',
   '["Spend most of their time writing security policies and reviewing audit evidence","Translate security risks into business outcomes, participate in executive strategy discussions, build relationships across the C-suite, and advocate for security investment using business cases — not just technical justifications","Avoid engaging with sales processes to maintain security objectivity","Report exclusively to the CTO to maintain technical independence"]'::jsonb, 1,
   'The CISO of 2025 is a business executive who happens to be a security expert. They sit at the executive table, translate risk for the board, enable revenue (SOC 2 as a sales tool), and manage a budget as a business investment portfolio. The days of the CISO as the person who says "no" and configures firewalls are gone — business alignment is now the primary CISO competency.'),

  (v_qid, 'When building a security team, CISOs should balance technical specialists and generalists. Which combination best serves a mid-market security program?',
   '["All technical specialists in penetration testing and exploit research","A blend of generalists who can cover broad security operations (monitoring, incident response, compliance) supplemented by specialists in critical areas (cloud security, identity, threat intelligence) — outsourcing highly specialized skills (pen testing, forensics) as needed","Exclusively outsourced security functions with no internal team","All compliance-focused staff with no technical security capabilities"]'::jsonb, 1,
   'Mid-market CISOs cannot afford (or fully utilize) deep specialists across all 18 security domains. The effective model: generalists who can flex across SOC operations, incident response, and compliance; specialists in 2–3 areas critical to the business (cloud security architect, identity engineer, risk analyst); MSSP partnerships for 24/7 SOC coverage; and consulting engagements for specialized needs like red teaming.'),

  (v_qid, 'A security budget justification using Return on Security Investment (ROSI) calculates:',
   '["The ratio of security certifications achieved to money spent","The expected financial benefit of a security control (risk reduction expressed in dollars) compared to its cost — demonstrating that investing $500K in PAM reduces expected breach cost by $3M, yielding a 6:1 return","The productivity improvement from security automation tools","The cost savings from consolidating security vendors"]'::jsonb, 1,
   'ROSI translates security from cost center to investment: Annual Loss Expectancy (ALE) before the control minus ALE after the control minus control cost = ROSI. "Our current ransomware exposure is $8M/year (SLE $4M × ARO 2.0). Endpoint isolation automation reduces ARO to 0.5 ($2M ALE). Tool costs $400K/year. ROSI = ($8M - $2M) - $400K = $5.6M/year benefit." Finance teams respond to this language.'),

  (v_qid, 'CISOs managing vendor relationships for security tooling should evaluate vendors based on:',
   '["The vendor''s marketing materials and G2 rating","Proof of concept results against real organizational requirements, reference customer calls, contractual exit provisions and data portability, integration with existing stack, vendor financial stability, and long-term roadmap alignment with the organization''s security strategy","Annual Gartner Magic Quadrant positioning only","The size of the vendor''s sales team and contract discount offered"]'::jsonb, 1,
   'Security vendor evaluation requires rigor: POC in your environment (not demos with cherry-picked scenarios), reference calls with similar-size organizations, contractual SLAs and liability terms, data portability (can you exit without losing your data?), API coverage for SOAR integration, and roadmap review. A tool that requires heavy customization to deliver value is a red flag.'),

  (v_qid, 'Security awareness training programs demonstrate effectiveness through:',
   '["Completion rates and quiz scores on training modules","Behavioral change metrics — phishing simulation click rates declining over time, reduction in security help desk tickets for password resets, increase in user-reported suspicious emails, and reduction in risky behavior detected by DLP — not just whether employees watched the training","The length and comprehensiveness of the training curriculum","The cost per employee of the training platform"]'::jsonb, 1,
   'Training completion is an activity metric, not an outcome metric. Effective security awareness is measured by behavior change: phishing click rates should decline after training campaigns; reporting rates for suspicious emails should increase; password help desk calls should decrease after password manager adoption. These behavioral outcomes justify training investment to the board.'),

  (v_qid, 'Crisis communication during a major security incident requires CISOs to coordinate:',
   '["Technical response exclusively, leaving communication to the CEO and PR team","Multiple parallel tracks: legal (notification obligations, privilege), PR/communications (external messaging), executive team (business impact decisions), customer success (customer communication), and technical response — ensuring all tracks have current, consistent information without compromising the investigation","Only internal communication until the incident is fully resolved","Communication with the board only, keeping the incident confidential from all other stakeholders"]'::jsonb, 1,
   'Incident crisis communications are multi-dimensional. Legal determines privilege protections and notification deadlines. PR drafts external messaging. Customer success handles customer inquiries. Executive team makes resource and business continuity decisions. The CISO''s communications role is to provide accurate technical updates to each audience in their own language while coordinating messaging to prevent contradictions.'),

  (v_qid, 'A security technology roadmap should be structured around:',
   '["A complete list of every security tool the organization plans to purchase","Business-aligned security capabilities mapped to current maturity and target maturity — identifying which investments close the most critical risk gaps, with multi-year phasing that connects to budget cycles and balances quick wins against long-term strategic investments","The most recently published Gartner Hype Cycle for cybersecurity","A list of security certifications the organization plans to achieve"]'::jsonb, 1,
   'A technology roadmap is a strategic communication tool: it shows where the security program is today, where it needs to be in 3 years, and the investment path between. Organized by capability domain (Identity, Detection, Cloud Security, GRC), it gives the board and CFO a multi-year view of security investments and their risk-reduction rationale — rather than ad-hoc tool requests.'),

  (v_qid, 'Regulatory reporting obligations following a data breach typically require the CISO to:',
   '["Wait until the full forensic investigation is complete before reporting anything","Notify relevant regulators within mandated timeframes (GDPR: 72 hours to DPA; HIPAA: 60 days; SEC cyber rules: 4 business days for material incidents at public companies) even when the investigation is ongoing — reporting what is known with updates to follow","File a police report before notifying any regulatory bodies","Only notify regulators if specifically requested by customers"]'::jsonb, 1,
   'Regulatory notification timelines do not wait for complete investigations. GDPR requires DPA notification within 72 hours of becoming aware of a breach (not when the investigation concludes). SEC''s new cyber disclosure rules (effective 2024) require public companies to disclose material cybersecurity incidents on Form 8-K within 4 business days of determining materiality. Missing these deadlines compounds liability.'),

  (v_qid, 'What is the most effective leadership approach for a CISO managing a security team during a major breach?',
   '["Personally execute all critical technical tasks to ensure they are done correctly","Provide clear command and control: assign incident command to a senior analyst, establish situation report cadence, coordinate with executives, remove organizational obstacles, and make resource decisions — while empowering the technical team to execute without micromanagement","Immediately escalate all decisions to the CEO to avoid personal liability","Focus exclusively on the technical investigation and delegate all communication to others"]'::jsonb, 1,
   'Effective incident leadership is about command and coordination, not technical execution. The CISO who gets into the trenches fixing systems creates a leadership vacuum for coordination, executive communication, and resource procurement. The CISO''s irreplaceable role: establish clear command structure, ensure teams have what they need, coordinate across business functions, and translate the technical situation into business decisions for executive leadership.'),

  (v_qid, 'Metrics a CISO should present to the board quarterly include:',
   '["Number of phishing emails blocked by the email gateway","Risk-level metrics: current cyber risk exposure vs. risk appetite, percentage of critical vulnerabilities remediated within SLA, control effectiveness scores across key domains, third-party risk posture, and comparison to prior quarter — all tied to business risk language","All open vulnerability scan findings with CVSS scores","Detailed SIEM alert statistics and detection rule performance"]'::jsonb, 1,
   'Board metrics should answer: Are we safer than last quarter? Are we within risk appetite? Are our controls working? Where is our exposure? Boards cannot evaluate "blocked 2.3M phishing emails" — but they can evaluate "87% of critical vulnerabilities are remediated within our 15-day SLA, up from 71% last quarter, reducing our estimated breach probability by 15%." Outcomes and trends, not operational volumes.'),

  (v_qid, 'Building a security culture across the organization (beyond the security team) primarily requires:',
   '["Mandatory security training once per year and punishing policy violations","Executive sponsorship that models security behaviors, embedding security responsibilities into employee performance objectives, making security easy (password managers, MFA that doesn''t require constant intervention, clear escalation paths), and celebrating security-positive behaviors rather than only penalizing failures","Restricting employee access to the minimum possible to reduce risk","Hiring a Chief Security Culture Officer as a separate executive role"]'::jsonb, 1,
   'Security culture is built by making security the path of least resistance: if the secure choice is also the easiest choice, adoption follows. Executive sponsorship signals that security is a business priority, not a compliance burden. Employees who report phishing should be celebrated, not questioned. Security should be in performance reviews for non-security roles. Culture change is slower than technology change but more durable.'),

  (v_qid, 'A CISO receiving a notice of regulatory investigation should:',
   '["Immediately delete all logs that might be evidence of compliance failures","Engage legal counsel immediately, implement a legal hold to preserve all potentially relevant evidence, notify cyber insurance carrier, and coordinate with the legal team on all regulatory communications — security teams should not communicate directly with regulators without legal guidance","Issue a public statement explaining the organization''s security practices","Continue normal operations and respond to the regulator''s questions directly and independently"]'::jsonb, 1,
   'Regulatory investigations require legal orchestration. Destroying evidence after receiving notice of an investigation is obstruction — a far more serious offense than the underlying violation. Legal hold preserves all relevant documents and communications. Legal counsel determines privilege protections and drafts regulatory responses. CISOs who engage regulators without legal involvement create significant additional liability.'),

  (v_qid, 'A security program''s maturity model (CMMI, NIST CSF tiers, or C2M2) is most useful for:',
   '["Certifying that the organization has achieved a specific compliance standard","Providing a structured benchmark to assess current security capabilities, identify gaps against a target state, communicate progress to leadership over time, and prioritize investment in areas with the greatest maturity gap relative to risk","Replacing annual penetration tests with a self-assessment process","Determining the minimum security requirements for vendor onboarding"]'::jsonb, 1,
   'Maturity models provide a structured progression: Initial → Repeatable → Defined → Managed → Optimizing (CMMI). CISOs use maturity assessments to baseline current state, set realistic 1-3 year target states aligned with risk appetite, prioritize investment in lowest-maturity highest-risk areas, and demonstrate progress to boards who need to see security improvement trajectories over time.'),

  (v_qid, 'CISO reporting line placement matters for organizational effectiveness. What is the primary argument for the CISO reporting directly to the CEO rather than the CTO?',
   '["CISOs lack the technical expertise to report to CTOs","Direct CEO reporting ensures security has visibility and independence across ALL business functions — including legal, finance, HR, and operations — without being subordinated to IT priorities; it also eliminates conflicts of interest when security requires pushing back on IT decisions that create risk","CEO reporting increases the CISO''s salary and title level","CISOs who report to CTOs are legally liable for technology failures"]'::jsonb, 1,
   'The CISO-to-CTO reporting structure creates a conflict of interest: the CTO is accountable for technology delivery speed, while the CISO is accountable for security risk management. When these conflict (push fast vs. do it securely), the CISO is structurally disadvantaged. Direct CEO reporting gives the CISO organizational parity to push back on risk-generating decisions across all business functions.');

  -- ============================================================
  -- MODULE 18 — Enterprise Capstone: Full Security Engagement  (pass: 85%)
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 17;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'In the TechNova Financial capstone scenario — a $200M fintech under a $15M contract requirement for SOC 2 Type II, ISO 27001, GDPR, and AI governance compliance — what is the correct first deliverable?',
   '["Begin implementing technical security controls immediately to maximize time before the audit","Conduct a comprehensive gap assessment mapping current control posture against all four frameworks simultaneously, identifying the highest-priority gaps that represent both the greatest risk and the longest remediation timeline","Hire an external auditor and begin the certification process immediately","Implement MFA for all systems as the highest-priority control"]'::jsonb, 1,
   'The gap assessment is foundational: you cannot build a remediation roadmap without knowing where you stand. A simultaneous multi-framework gap assessment using a cross-walk avoids rework: identify gaps once, map to all frameworks, and prioritize by: (1) longest remediation timeline, (2) highest risk, (3) blocker status for audit commencement. This shapes the entire project plan.'),

  (v_qid, 'When running parallel compliance workstreams (SOC 2, ISO 27001, GDPR) for the same organization simultaneously, the key integration strategy is:',
   '["Run each compliance workstream completely independently with separate teams, evidence, and control sets","Use a unified control framework that maps once to all three standards — one access control implementation serves SOC 2 CC6, ISO 27001 A.9, and GDPR Article 32 simultaneously — with a single evidence collection process that satisfies all audit requirements","Focus all resources on SOC 2 first, then ISO 27001, then GDPR sequentially","Implement controls in random order based on team member expertise"]'::jsonb, 1,
   'Parallel compliance programs succeed through integration: one access review process, one evidence collection cycle, one control testing program — mapping to all frameworks simultaneously. Without integration, you build three separate programs, collect the same evidence three times, and burn the team on redundant activities. Unified frameworks (SCF, UCF) make this mapping explicit and programmatic.'),

  (v_qid, 'For a fintech organization like TechNova handling customer payment data, the most operationally critical integration between security frameworks is:',
   '["Aligning the SOC 2 availability criterion with ISO 27001 business continuity controls","Integrating PCI DSS controls with SOC 2 security criterion and ISO 27001 Annex A controls — these frameworks have high overlap for payment data, and dual-compliance reduces the marginal cost of each certification substantially","Ensuring GDPR cookie consent banners align with SOC 2 privacy requirements","Aligning penetration testing schedules with ISO 27001 risk assessment cycles"]'::jsonb, 1,
   'Fintech organizations face PCI DSS (payment card data), SOC 2 (B2B service trust), ISO 27001 (enterprise security management), and GDPR (EU customer data) simultaneously. PCI DSS and SOC 2 share substantial control overlap in network security, access controls, and encryption. Mapping these frameworks reduces the total implementation and audit effort significantly versus treating each as independent.'),

  (v_qid, 'A technical security gap assessment for TechNova''s cloud environment should prioritize which findings first?',
   '["Minor configuration drift from CIS Benchmark recommendations","Critical findings that represent both high exploitability and high business impact — particularly those creating audit blockers (e.g., no encryption at rest for customer data, no MFA for production access, no logging and monitoring) that would fail certification before other remediations are complete","All findings equally to ensure comprehensive remediation","Medium-severity findings that can be fixed quickly to demonstrate progress"]'::jsonb, 1,
   'Risk-based prioritization is essential with a compressed timeline. Audit blockers are findings that, if unresolved, prevent audit commencement or guarantee a qualified opinion — these are "stop the line" priorities regardless of their CVSS score. High-exploitability, high-impact findings are next. Medium findings with long remediation timelines should be identified early even if addressed later.'),

  (v_qid, 'When TechNova''s CISO presents the security program roadmap to the board and enterprise customer, which element is most critical for building executive confidence?',
   '["A comprehensive list of all security tools purchased and their features","A clear mapping of security investments to risk reduction outcomes — showing current risk exposure, how each investment reduces specific risks, target residual risk levels, and a timeline with milestones — expressed in financial and business terms rather than technical ones","Detailed technical architecture diagrams of the security infrastructure","The names and resumes of all security team members involved in the program"]'::jsonb, 1,
   'Enterprise customers and boards evaluate security programs through a business lens: are you reducing the risk of breaches that would affect us? Show them current risk quantified in dollars, the investment roadmap that reduces it, measurable milestones, and the residual risk you''re accepting. This is more persuasive than a list of tools or a technical architecture diagram.'),

  (v_qid, 'AI governance integration into TechNova''s security program is required because:',
   '["AI governance is a mandatory component of SOC 2 Type II audits","TechNova''s AI systems for fraud detection and credit risk scoring are classified as high-risk under the EU AI Act and must comply with ISO 42001 requirements — and the enterprise customer''s contract includes explicit AI governance attestation requirements that create a commercial obligation alongside regulatory obligation","AI governance is optional unless the organization is explicitly regulated by a financial AI regulator","AI governance only applies to generative AI, not traditional ML models"]'::jsonb, 1,
   'High-risk AI (credit scoring, fraud detection) in financial services faces: EU AI Act mandatory requirements (conformity assessment, technical documentation, human oversight), enterprise customer contractual requirements (explicit AI governance attestation in the $15M contract), and emerging regulatory expectations (US OCC model risk management guidance SR 11-7). Commercial and regulatory obligations align.'),

  (v_qid, 'Developing the vendor risk management program for TechNova during the capstone requires prioritizing which vendors first?',
   '["All vendors with any data access, assessed in alphabetical order","Tier 1 critical vendors — cloud infrastructure providers (AWS/GCP), payment processors, core banking system vendors, and any vendor processing regulated customer data — whose breach would directly impact TechNova''s operations, customer data, or compliance posture","Vendors with the highest annual contract value","Recently onboarded vendors who have not yet been assessed"]'::jsonb, 1,
   'Risk-based vendor prioritization starts with the vendors whose failure creates the greatest impact: cloud infrastructure (availability risk), payment processors (financial data exposure risk), and data processors handling regulated PII/financial data (breach risk and regulatory liability). These Tier 1 vendors require full VSA, SOC 2 review, contractual security requirements, and continuous monitoring — before lower-tier vendors receive attention.'),

  (v_qid, 'During the capstone enterprise engagement, a critical finding is discovered: TechNova''s production database containing 500,000 customer records has been misconfigured with public internet access enabled for the past 90 days. What is the correct response sequence?',
   '["Fix the misconfiguration quietly and do not notify anyone","Immediately remediate the misconfiguration (remove public access), preserve forensic evidence (cloud audit logs, access logs), conduct an investigation to determine if unauthorized access occurred, assess breach notification obligations under GDPR (72-hour DPA notification if personal data was accessed), notify legal counsel, and brief executive leadership","Wait for the external auditor to discover the finding during the upcoming audit","Notify all 500,000 customers immediately before completing the investigation"]'::jsonb, 1,
   'The correct sequence: stop the bleeding (remediate misconfiguration) → preserve evidence (don''t delete logs) → investigate (did anyone access it?) → assess obligations (GDPR 72-hour clock starts when you have reasonable belief of breach, not when you''re certain) → engage legal (they determine notification obligations) → brief leadership (they make notification decisions with legal guidance). Notifying customers before investigation scope is known creates unnecessary panic and reputational damage.'),

  (v_qid, 'The capstone scenario requires building a Security Operations Center (SOC) for TechNova. For a $200M fintech without an existing SOC, which build approach is most appropriate?',
   '["Build a fully internal SOC from scratch with 20+ analysts before seeking any certifications","Hybrid SOC model — engage an MSSP for 24/7 Tier 1-2 monitoring and alert triage immediately to establish coverage, while internally building detection engineering, threat intelligence, and incident command capabilities — transferring more capability in-house as the program matures","Rely exclusively on cloud provider native security tools without a dedicated SOC function","Defer SOC build until all compliance certifications are achieved"]'::jsonb, 1,
   'An MSSP-led hybrid SOC provides immediate 24/7 coverage without the 12–18 month timeline required to hire, train, and equip an internal SOC team. MSSPs have existing detection playbooks, trained analysts, and SIEM infrastructure. Internal teams focus on what MSSPs cannot do well: custom detection engineering for TechNova''s specific threat profile, threat intelligence contextualization, and business-aligned incident command.'),

  (v_qid, 'For the capstone board presentation, the CISO must demonstrate program ROI. The most compelling financial case uses:',
   '["A list of all security tools purchased with their retail prices","A quantified risk reduction narrative: current annual cyber risk exposure (ALE before program) → projected ALE after program implementation → total program investment → net risk reduction per dollar invested — comparing favorably to the $15M contract value at risk and potential breach costs in the $10–50M range","The number of compliance certifications achieved versus competitors","The reduction in security alert volume as evidence of improved security posture"]'::jsonb, 1,
   'Board presentations succeed when they speak the board''s language: return on investment. "Our $2.8M security program investment reduces our expected annual breach cost from $12M to $4M — an $8.2M annual risk reduction — while enabling the $15M contract that was contingent on SOC 2 and ISO 27001 certification." This is a 3x ROI in year one from the contract alone, before factoring breach cost avoidance.'),

  (v_qid, 'The capstone project requires an incident response tabletop exercise. The most valuable scenario for TechNova as a fintech would be:',
   '["A denial-of-service attack against the marketing website","A sophisticated supply chain attack where TechNova''s cloud infrastructure provider is breached, attacker lateral movement reaches TechNova''s production environment, customer financial data is exfiltrated, and the attacker deploys ransomware across critical systems — testing multi-stakeholder decision-making, regulatory notification, customer communication, and business continuity simultaneously","A phishing email targeting a junior developer","A physical security breach of the headquarters office"]'::jsonb, 1,
   'Tabletop scenarios should be realistic, sector-relevant, and test the hardest decision points: multiple simultaneous crises, competing stakeholder needs, time-pressured regulatory decisions, and business continuity choices. A sophisticated supply chain breach exercises: IR coordination, regulatory obligations (GDPR, FFIEC, SEC), customer notification decisions, business continuity activation, and board crisis communication — all the capabilities a fintech needs most.'),

  (v_qid, 'What does achieving the Aladiah AI Security Pro Certification from this 18-module capstone represent in the job market?',
   '["A certification equivalent to a CISSP for technical security practitioners","A demonstration of the complete stack — technical security (cloud, network, app, DFIR) + governance (GRC, SOC 2, ISO 27001, GDPR) + AI security and governance (OWASP LLM, NIST AI RMF, EU AI Act) + executive communication skills — the integrated program that no single existing certification provides","A vendor-specific certification for a particular security product","A prerequisite for taking the CISM or CISSP examinations"]'::jsonb, 1,
   'The AI Security Pro Certification is built around the market gap identified in the program''s research: no existing certification integrates Technical Security + GRC + AI Governance + Compliance Automation. CISSP covers technical security broadly. CISM covers security management. CGRC covers GRC. GIAC covers technical specializations. The Aladiah AI Security Pro Certification is the only credential that explicitly covers the AI governance layer within a complete security and compliance framework.'),

  (v_qid, 'The capstone project plan for TechNova''s 6-month compliance program should be structured as:',
   '["All activities running sequentially to avoid confusion","A parallel workstream plan where: (1) gap assessment and control mapping (weeks 1–4) feeds (2) simultaneous control implementation across technical security, GRC, and AI governance (weeks 5–16) with milestone gates, (3) internal audit and pre-audit readiness assessment (weeks 17–20), and (4) external auditor engagement and certification (weeks 21–26) — sequenced to respect audit prerequisites while maximizing parallel execution","A single linear timeline with one project manager and no parallel activities","Starting with the audit immediately and building controls based on auditor findings"]'::jsonb, 1,
   'Complex compliance programs succeed with parallel workstreams and clear dependency management: gap assessment must complete before implementation begins; technical controls must be in place before audit evidence collection begins; internal audit must precede external audit. But within these sequencing constraints, as much work as possible should run in parallel — IAM improvements, cloud security hardening, policy development, AI governance documentation — to meet the 6-month deadline.'),

  (v_qid, 'A truly integrated AI + cybersecurity + GRC professional, exemplified by the Aladiah AI Security Pro Certification capstone, distinguishes themselves in the market because they can:',
   '["Perform both penetration testing and compliance auditing simultaneously","Bridge the three domains that enterprise organizations struggle to integrate: technical security operations (SOC, cloud, identity, DFIR), governance and compliance (SOC 2, ISO 27001, GDPR, AI Act), and AI security and governance (LLM security, AI risk management, bias assessment, model governance) — speaking all three languages fluently and translating between technical teams, compliance teams, and executive stakeholders","Write code in Python and perform network penetration testing","Manage both the security budget and the IT budget simultaneously"]'::jsonb, 1,
   'The integrated practitioner is rare: most professionals are deep in one domain (technical security OR compliance OR AI governance) but cannot translate effectively across all three. Organizations building AI systems in regulated industries need people who understand both the attack surface of AI (OWASP LLM Top 10, model security) and the governance requirements (NIST AI RMF, EU AI Act, ISO 42001) while also managing the broader security and compliance program. This T-shaped expertise commands premium compensation — $150K–$280K+ in enterprise roles.');

  -- Set competency by module (chapter order_index 9–17)
  UPDATE public.quiz_questions qq
  SET competency = CASE ch.order_index
    WHEN  9 THEN 'cyber:data-protection'
    WHEN 10 THEN 'cyber:stakeholder-trust'
    WHEN 11 THEN 'cyber:ai-security'
    WHEN 12 THEN 'cyber:identity-access'
    WHEN 13 THEN 'cyber:threat-detection'
    WHEN 14 THEN 'cyber:roles-operations'
    WHEN 15 THEN 'cyber:stakeholder-trust'
    WHEN 16 THEN 'cyber:security-leadership'
    WHEN 17 THEN 'cyber:governance-risk'
  END
  FROM public.quizzes qz
  JOIN public.chapters ch ON ch.id = qz.chapter_id
  WHERE qq.quiz_id = qz.id
    AND ch.course_id = v_cid
    AND qq.competency IS NULL;

  -- Set order_index by insertion order within each quiz
  WITH _ord AS (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY quiz_id ORDER BY ctid) AS rn
    FROM public.quiz_questions
    WHERE quiz_id IN (
      SELECT q.id FROM public.quizzes q
      JOIN public.chapters ch ON ch.id = q.chapter_id
      WHERE ch.course_id = v_cid AND ch.order_index BETWEEN 9 AND 17
    ) AND order_index = 0
  )
  UPDATE public.quiz_questions SET order_index = _ord.rn
  FROM _ord WHERE quiz_questions.id = _ord.id;

  RAISE NOTICE 'M10–M18 quiz questions inserted and tagged.';

END $body$;

-- =================================================================
-- VERIFY (run manually after applying):
-- SELECT
--   ch.title AS chapter,
--   COUNT(qq.id) AS question_count
-- FROM public.chapters ch
-- JOIN public.quizzes q ON q.chapter_id = ch.id AND q.quiz_type = 'chapter_end'
-- JOIN public.quiz_questions qq ON qq.quiz_id = q.id
-- JOIN public.courses c ON c.id = ch.course_id
-- WHERE c.curriculum_version = 'cyber-v1'
--   AND ch.order_index BETWEEN 9 AND 17
-- GROUP BY ch.order_index, ch.title
-- ORDER BY ch.order_index;
-- Expected: 9 rows, each with 15 questions (M10–M18)
-- =================================================================
