-- =============================================================================
-- AI Enterprise Cybersecurity — Module 19 Quiz Questions
-- 15 questions covering: AI SOCs, post-quantum crypto, agentic security,
-- decentralized identity, and cybersecurity career futures
-- Apply AFTER 20260702000000_add_cyber_m19_structure.sql
-- =============================================================================

DO $$
DECLARE
  v_cid UUID;
  v_ch  UUID;
  v_qid UUID;
BEGIN
  SELECT id INTO v_cid FROM public.courses
    WHERE curriculum_version = 'cyber-v1';
  IF v_cid IS NULL THEN RAISE EXCEPTION 'cyber-v1 course not found'; END IF;

  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid AND order_index = 19;
  IF v_ch IS NULL THEN RAISE EXCEPTION 'M19 chapter not found'; END IF;

  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch LIMIT 1;
  IF v_qid IS NULL THEN RAISE EXCEPTION 'M19 quiz not found — run structure migration first'; END IF;

  -- Q1
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'In an Autonomous AI SOC, what is the PRIMARY role of human security professionals?',
    '["Manually triaging every alert the AI generates","Designing AI authorization frameworks, reviewing edge-case escalations, and making high-stakes response decisions","Monitoring dashboards 24/7 to catch AI errors in real time","Replacing the AI when it makes mistakes"]'::jsonb,
    1,
    'Human roles in the AI SOC shift from first-responder to architect, ethicist, and decision-maker — defining AI authorization scope, reviewing genuine escalations, and making consequential response calls that should not be fully automated.',
    'ai-soc-governance', 1);

  -- Q2
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'Which NIST post-quantum standard is designed for KEY ENCAPSULATION (replacing RSA/ECDH for key exchange)?',
    '["FIPS 204 (ML-DSA)","FIPS 205 (SLH-DSA)","FIPS 203 (ML-KEM)","FIPS 200 (Minimum Security Requirements)"]'::jsonb,
    2,
    'FIPS 203 (ML-KEM, based on CRYSTALS-Kyber) is the NIST post-quantum key encapsulation standard, replacing RSA and ECDH for key exchange. FIPS 204 covers digital signatures. FIPS 205 is a hash-based signature scheme.',
    'post-quantum-cryptography', 2);

  -- Q3
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'The "harvest now, decrypt later" (HNDL) threat means that organizations with data that must remain confidential for 10+ years face quantum risk:',
    '["Only after a cryptographically relevant quantum computer (CRQC) is publicly announced","Only in classified government systems","Already today, because adversaries may be collecting encrypted traffic for future decryption","Not until post-quantum standards are deprecated"]'::jsonb,
    2,
    'HNDL attacks are active now — adversaries collect and store encrypted traffic today, planning to decrypt it when a CRQC becomes available. For long-lived sensitive data, the quantum migration is an immediate data protection problem, not a future one.',
    'post-quantum-cryptography', 3);

  -- Q4
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'Which classical asymmetric algorithm is MOST VULNERABLE to Shor''s algorithm running on a cryptographically relevant quantum computer?',
    '["AES-256","RSA-2048","SHA-256","HMAC-SHA512"]'::jsonb,
    1,
    'Shor''s algorithm breaks asymmetric cryptography based on integer factorization (RSA) and discrete logarithm (ECC, DH). AES-256 and hash functions (SHA-256, HMAC) are affected only by Grover''s algorithm, which halves effective key strength but does not break them.',
    'post-quantum-cryptography', 4);

  -- Q5
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'An agentic AI red team system is authorized to test an organization''s defenses. Which governance element is MOST CRITICAL to define before deployment?',
    '["The AI vendor''s SLA and uptime guarantee","The authorized scope, decision authority boundaries, and human escalation triggers for the AI agent","The number of vulnerabilities the AI is expected to find per week","The AI system''s underlying model architecture and training data"]'::jsonb,
    1,
    'AI security agent governance requires explicit policy frameworks defining authorized scope, what actions the AI can take autonomously, what requires human escalation, and accountability for AI-generated findings — before any autonomous agent is deployed.',
    'ai-security-governance', 5);

  -- Q6
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'What distinguishes AI-generated attack patterns from human-executed attacks in ways that defenders must account for?',
    '["AI attacks are slower but more persistent than human attacks","AI attacks are faster, more systematic, cover more attack surface simultaneously, and adapt more quickly to defensive countermeasures","AI attacks exclusively target cloud environments and avoid on-premises systems","AI attacks generate fewer logs and leave less forensic evidence than human attacks"]'::jsonb,
    1,
    'AI-powered attacks operate at machine speed, can probe thousands of targets simultaneously, cover all attack vectors systematically rather than selectively, and rapidly adapt techniques based on what triggers defensive responses — characteristics that human-executed attacks cannot match at scale.',
    'ai-threat-landscape', 6);

  -- Q7
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'What is a Decentralized Identifier (DID) in the context of digital identity?',
    '["A username assigned by a central authority like Google or Microsoft","A W3C-standard identifier that is globally unique, controlled by the owner''s private key, and not dependent on any central authority","A multi-factor authentication token generated by an identity provider","An IP address assigned by an ISP for persistent device identification"]'::jsonb,
    1,
    'DIDs are a W3C standard for self-sovereign identity — globally unique identifiers controlled by cryptographic private keys, not by any central platform or authority. The owner can create, update, and control DIDs without institutional permission.',
    'decentralized-identity', 7);

  -- Q8
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'Verifiable Credentials (VCs) improve on traditional credentials (paper certificates, PDF diplomas) primarily because they are:',
    '["Stored on a government-controlled blockchain that cannot be hacked","Cryptographically signed by the issuer and verifiable by any party without contacting the issuer","Automatically updated when the issuing organization changes its policies","More visually professional and harder to photocopy"]'::jsonb,
    1,
    'VCs use cryptographic signatures tied to the issuer''s DID. Any verifier can check the signature against the issuer''s public key without contacting the issuer — making credentials portable, tamper-evident, and instantly verifiable globally.',
    'decentralized-identity', 8);

  -- Q9
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'Why does deepfake-resistant authentication become a core security requirement as AI-generated synthetic media advances?',
    '["Because deepfakes make it impossible to conduct video meetings securely","Because AI can generate synthetic voice, video, and behavioral patterns that defeat traditional biometric authentication methods","Because deepfakes are exclusively used by nation-state actors against government systems","Because synthetic media increases the file size of authentication tokens beyond system capacity"]'::jsonb,
    1,
    'Traditional biometric authentication — voice recognition, facial recognition — weakens as AI-generated synthetic media becomes indistinguishable from authentic content. Liveness detection, behavioral biometrics, and hardware-backed attestation become necessary to distinguish real human identity from AI-generated impersonation.',
    'future-identity-security', 9);

  -- Q10
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'In the Autonomous AI SOC model, the AI constructs "attack graphs" during the investigation layer. What is the purpose of an attack graph?',
    '["To visualize the organization''s network topology for capacity planning","To map threat actor lateral movement across kill chain stages — correlating indicators from initial access through privilege escalation to data exfiltration","To generate vulnerability scores for prioritizing patch management","To document all approved security tools in the SOC technology stack"]'::jsonb,
    1,
    'Attack graphs in AI SOC investigation automatically correlate indicators across multiple kill chain stages — tracing how a threat actor moved from initial access through privilege escalation to data exfiltration, without manual analyst correlation.',
    'ai-soc-governance', 10);

  -- Q11
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'By 2040, which distinction will largely disappear in enterprise security roles?',
    '["The distinction between red team and blue team functions","The distinction between cybersecurity professional and AI governance professional, as all technology systems will be AI-native","The distinction between cloud security and on-premises security","The distinction between security engineering and software development"]'::jsonb,
    1,
    'As all enterprise technology becomes AI-native, securing those systems will require AI governance expertise by default. The CISO, auditor, and compliance officer of 2040 will all work with AI systems as their primary domain, collapsing the boundary between cybersecurity and AI governance.',
    'career-futures', 11);

  -- Q12
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'NIST recommends that most federal systems complete migration to post-quantum cryptographic standards by:',
    '["2028","2030","2035","2045"]'::jsonb,
    1,
    'NIST recommends completing migration to post-quantum standards by 2030 for most federal systems, with RSA and ECC deprecated by 2035. Enterprise organizations are advised to align to this timeline given the HNDL threat and infrastructure migration lead time.',
    'post-quantum-cryptography', 12);

  -- Q13
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'What is the first step in building a quantum migration roadmap for an enterprise?',
    '["Immediately replace all TLS certificates with post-quantum alternatives","Conduct a cryptographic inventory — identifying every system, protocol, and certificate relying on RSA or ECC","Wait for a CRQC to be publicly confirmed before taking action","Migrate the most sensitive systems to AES-512 as an interim measure"]'::jsonb,
    1,
    'A cryptographic inventory is the prerequisite for any quantum migration — you cannot migrate what you have not mapped. Most enterprises have thousands of RSA/ECC dependencies across TLS, SSH, code signing, VPNs, JWTs, and custom implementations, many undocumented.',
    'post-quantum-cryptography', 13);

  -- Q14
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'The most impactful career decision for a cybersecurity professional over a 25-year horizon is:',
    '["Pursuing every available certification to maximize credential breadth","Choosing a specific domain intersection and developing irreplaceable depth at that intersection over time","Specializing exclusively in technical skills and avoiding governance or strategy work","Changing employers every 2–3 years to maximize salary growth regardless of domain alignment"]'::jsonb,
    1,
    'Domain depth at a specific intersection — AI security and healthcare, AI governance and financial services, AI risk and critical infrastructure — compounds over time in ways that broad but shallow credential portfolios cannot. The professionals with 25-year career impact choose a domain and develop genuine expertise.',
    'career-futures', 14);

  -- Q15
  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation, competency, order_index)
  VALUES (v_qid,
    'AI agent identity standards address which emerging security challenge?',
    '["How to authenticate AI training datasets to prevent data poisoning","How AI agents acting on behalf of humans authenticate, scope their authority, and attribute their actions back to the human principal","How to prevent AI models from generating harmful content in enterprise applications","How to verify that AI security tools are trained on current threat intelligence"]'::jsonb,
    1,
    'When AI agents act on behalf of humans — signing documents, accessing systems, making purchases — they need identity standards that scope their authority, enable verification of their human principal, and create attributable audit trails. This is the emerging field of AI agent identity.',
    'future-identity-security', 15);

  RAISE NOTICE 'M19 quiz — 15 questions inserted for quiz %', v_qid;
END $$;

-- VERIFY:
-- SELECT COUNT(*) FROM public.quiz_questions qq
-- JOIN public.quizzes qz ON qz.id = qq.quiz_id
-- JOIN public.chapters ch ON ch.id = qz.chapter_id
-- JOIN public.courses co ON co.id = ch.course_id
-- WHERE co.curriculum_version = 'cyber-v1' AND ch.order_index = 19;
-- Expected: 15
