import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};


const courseData = {
  "title": "AI Governance Professional",
  "description": "Master the frameworks, policies, and accountability structures that make AI responsible at enterprise scale. Cover EU AI Act, NIST AI RMF, ISO 42001, bias and fairness, audit methodologies, and board-level AI governance — the fastest-growing specialization in the AI field.",
  "translations": {
    "es": {
      "title": "Profesional de Gobernanza IA",
      "description": "Domina los marcos de gobernanza IA, la regulación y las estructuras de responsabilidad empresarial."
    },
    "fr": {
      "title": "Professionnel en Gouvernance IA",
      "description": "Maîtrisez les cadres de gouvernance IA, la réglementation et les structures de responsabilité."
    },
    "de": {
      "title": "KI-Governance-Fachmann",
      "description": "Meistern Sie KI-Governance-Frameworks, Regulierung und Unternehmensverantwortungsstrukturen."
    },
    "zh": {
      "title": "AI治理专业人员",
      "description": "掌握AI治理框架、法规和企业问责结构。"
    },
    "ar": {
      "title": "متخصص حوكمة الذكاء الاصطناعي",
      "description": "أتقن أطر حوكمة الذكاء الاصطناعي والتنظيم وهياكل المساءلة المؤسسية."
    },
    "ja": {
      "title": "AIガバナンスプロフェッショナル",
      "description": "AIガバナンスフレームワーク、規制、企業説明責任構造をマスターする。"
    }
  },
  "chapters": [
    {
      "title": "Module 1: The AI Governance Landscape",
      "description": "Understand why AI governance matters, the global regulatory environment, and how leading organizations are structuring their AI governance programs.",
      "order_index": 0,
      "videos": [
        {
          "title": "1.1 Why AI Governance: The Stakes, The Incidents, The Imperative",
          "description": "The real-world AI incidents that created demand for governance professionals, and the business case for taking AI governance seriously.",
          "order_index": 0,
          "lessonScript": {
            "mainPoints": [
              "AI governance emerged from a series of high-profile failures that caused real harm at scale. Amazon's recruiting AI (2018) penalized female candidates. Optum's healthcare algorithm (2019) undertreated Black patients by 50% relative to equally sick white patients. COMPAS recidivism prediction tool showed racial bias in criminal sentencing recommendations. Meta's ad targeting algorithm enabled discriminatory housing and employment ads in violation of the Fair Housing Act. These weren't theoretical risks — they were documented, measurable harms deployed at millions-of-people scale.",
              "The financial stakes of poor AI governance are escalating rapidly. GDPR fines have exceeded €4 billion since 2018. The EU AI Act introduces fines up to 7% of global revenue for high-risk AI violations. US regulators (CFPB, EEOC, FTC) are increasingly using existing laws to pursue AI discrimination cases. Insurance underwriters now require AI governance attestations for cyber and professional liability coverage. For a Fortune 500 company, ungoverned AI is a material risk that belongs on the board agenda.",
              "AI governance professionals occupy a unique intersection of technical understanding and policy expertise. The role requires: deep enough technical knowledge to ask the right questions of AI teams, policy and legal literacy to interpret regulations, risk management frameworks to operationalize governance, and organizational influence to hold engineering teams accountable. This combination makes AI governance professionals extremely scarce and highly compensated ($120-175K base in enterprise roles).",
              "The governance gap: most organizations deploying AI have no formal governance structure. A 2024 survey by the MIT Sloan Management Review found 68% of enterprises have deployed AI in customer-facing applications but only 24% have formal AI governance policies. Only 12% have board-level AI oversight. Only 8% conduct regular AI audits. You are entering a field where demand vastly exceeds supply, and that supply gap is growing as AI deployment accelerates.",
              "Effective AI governance has three levels: organizational (policies, accountability structures, training, culture), process (risk assessment in development, deployment gates, monitoring), and technical (explainability, bias testing, audit trails, override mechanisms). A governance program that only operates at the organizational level ('we have a policy') without process and technical controls is compliance theater. Real governance integrates all three levels into the AI development lifecycle."
            ]
          },
          "questions": [
            {
              "question_text": "What was the documented impact of the Optum healthcare algorithm bias?",
              "scenario_context": "Presenting the business case for AI governance to a hospital board.",
              "options": [
                "Minor statistical difference",
                "Black patients were undertreated by 50% relative to equally sick white patients because the algorithm used healthcare cost as a proxy for need",
                "No documented impact found",
                "The algorithm was never deployed"
              ],
              "correct_answer_index": 1,
              "explanation": "Optum's algorithm used healthcare costs as a proxy for medical need. Since Black patients historically faced financial barriers to care, the algorithm recommended less intervention for equally sick Black patients — a documented, measurable harm at scale."
            },
            {
              "question_text": "What is the maximum fine under the EU AI Act for high-risk AI violations?",
              "scenario_context": "Quantifying regulatory risk for a board presentation on AI governance.",
              "options": [
                "€10 million fixed fine",
                "Up to 7% of global annual revenue",
                "€100,000 per incident",
                "Unlimited discretionary fines"
              ],
              "correct_answer_index": 1,
              "explanation": "The EU AI Act imposes tiered fines: up to 7% of global revenue for prohibited AI practices, 3% for other violations, and 1.5% for providing incorrect information to authorities — making it potentially more costly than GDPR (4% maximum)."
            },
            {
              "question_text": "What percentage of enterprises deploying AI have formal governance policies?",
              "scenario_context": "Benchmarking your organization's governance maturity.",
              "options": [
                "85%",
                "67%",
                "24%",
                "5%"
              ],
              "correct_answer_index": 2,
              "explanation": "MIT Sloan found only 24% of enterprises deploying AI have formal governance policies — indicating a massive governance gap and explaining why qualified AI governance professionals are in severe short supply."
            },
            {
              "question_text": "What are the three levels of effective AI governance?",
              "scenario_context": "Designing a comprehensive governance program for a financial services firm.",
              "options": [
                "Legal, Technical, Ethical",
                "Organizational (policies/culture), Process (development lifecycle), Technical (explainability/audit)",
                "Federal, State, Local",
                "Internal, External, Regulatory"
              ],
              "correct_answer_index": 1,
              "explanation": "Real governance operates at all three levels simultaneously: organizational (accountability, policies, culture), process (risk assessment at development gates), and technical (explainability, bias testing, audit trails) — governance at only one level is insufficient."
            },
            {
              "question_text": "What business risk makes AI governance a board-level issue beyond regulatory compliance?",
              "scenario_context": "Convincing a CFO to invest in AI governance infrastructure.",
              "options": [
                "Employee morale concerns only",
                "Combination of regulatory fines (7% global revenue), insurance requirements, and brand/legal exposure from documented AI harms",
                "Minor reputational concerns",
                "Technical performance issues"
              ],
              "correct_answer_index": 1,
              "explanation": "AI governance is a material business risk: regulatory fines up to 7% of global revenue, insurance requirements for cyber/professional liability coverage, and documented harms leading to class action litigation — this belongs on the board agenda alongside financial and security risk."
            }
          ]
        },
        {
          "title": "1.2 The EU AI Act: The World's First Comprehensive AI Regulation",
          "description": "Deep dive into the EU AI Act framework — risk tiers, obligations, conformity assessment, and what compliance actually requires in practice.",
          "order_index": 1,
          "lessonScript": {
            "mainPoints": [
              "The EU AI Act (effective August 2024, phased implementation through 2027) is the world's first comprehensive AI regulation, applying to any AI system used in the EU regardless of where it's developed. Its core architecture is risk-based: Unacceptable Risk (prohibited) — social scoring by governments, real-time biometric surveillance in public spaces, AI manipulating behavior exploiting psychological vulnerabilities; High Risk (regulated) — AI in critical infrastructure, education decisions, employment decisions, essential services, law enforcement, migration; Limited Risk (transparency obligations only) — chatbots must disclose they're AI; Minimal Risk — no obligations.",
              "High-risk AI systems face the most substantial obligations. Before deployment: conduct conformity assessment, maintain technical documentation, register in EU database, achieve CE marking. During deployment: implement risk management system, ensure data governance and quality, provide logging and traceability, enable human oversight, achieve accuracy/robustness/cybersecurity standards. Post-deployment: serious incident reporting within 24 hours, continuous monitoring, periodic re-assessment when substantially modified. These aren't checkbox compliance — they require ongoing operational infrastructure.",
              "The General-Purpose AI (GPAI) provisions cover foundation models like GPT-4, Claude, and Gemini. GPAI providers must: maintain technical documentation, comply with EU copyright law, publish training data summaries. Systemic risk GPAI (>10^25 FLOPs training compute or designated by European AI Office) has additional obligations: model evaluations, adversarial testing, incident reporting to EU, cybersecurity measures, and energy efficiency reporting. This directly affects how enterprises procure and use foundation model APIs.",
              "Conformity assessment is the process by which high-risk AI systems demonstrate compliance before deployment. For most high-risk systems, providers can self-assess using internal procedures against harmonized standards. However, AI in biometrics, critical infrastructure, and law enforcement require third-party conformity assessment by notified bodies. Documentation requirements are extensive — AI systems must have technical files that could survive regulatory audit, not just internal reviews.",
              "The practical governance implications for enterprises deploying AI in EU: every HR AI tool (screening, performance evaluation), customer credit scoring, benefits eligibility, and educational assessment is high-risk. You need an AI inventory, a system for classifying new AI initiatives by risk tier, a high-risk AI compliance process with technical documentation and conformity assessment, incident reporting procedures, and a designated EU representative. Most enterprises lack all of these — building them is the governance professional's job."
            ]
          },
          "questions": [
            {
              "question_text": "Which AI application is classified as 'Unacceptable Risk' and prohibited under the EU AI Act?",
              "scenario_context": "Reviewing proposed AI initiatives for EU Act compliance classification.",
              "options": [
                "AI-powered CV screening for job applications",
                "Government-operated social scoring systems evaluating citizen behavior",
                "AI chatbots with disclosure requirements",
                "AI recommendation systems for streaming services"
              ],
              "correct_answer_index": 1,
              "explanation": "Government social scoring (China-style citizen behavioral rating systems) is explicitly prohibited. AI CV screening is High Risk (employment category). Chatbots are Limited Risk. Recommendations are Minimal Risk."
            },
            {
              "question_text": "What is the incident reporting timeline for serious AI incidents under the EU AI Act?",
              "scenario_context": "Drafting AI incident response procedures for a medical device company.",
              "options": [
                "30 days after incident",
                "7 business days",
                "Within 24 hours for serious incidents",
                "Annual reporting only"
              ],
              "correct_answer_index": 2,
              "explanation": "The EU AI Act requires reporting serious incidents to national authorities within 24 hours for incidents posing immediate risk, and within 15 days for other serious incidents — requiring pre-built incident detection and reporting infrastructure."
            },
            {
              "question_text": "What additional obligations apply to 'systemic risk' General-Purpose AI models?",
              "scenario_context": "Assessing compliance requirements for deploying a frontier model API.",
              "options": [
                "No additional obligations beyond standard GPAI",
                "Model evaluations including adversarial testing, incident reporting to EU authorities, cybersecurity measures, and energy efficiency reporting",
                "Only basic documentation requirements",
                "Complete prohibition from EU market"
              ],
              "correct_answer_index": 1,
              "explanation": "Systemic risk GPAI (trained with >10^25 FLOPs) faces enhanced obligations including adversarial testing, EU AI Office incident reporting, and cybersecurity measures — affecting enterprise use of frontier APIs like GPT-4 and Claude."
            },
            {
              "question_text": "Under the EU AI Act, which HR technology is classified as High Risk?",
              "scenario_context": "Reviewing your company's AI-powered HR tools for compliance classification.",
              "options": [
                "Employee scheduling software",
                "AI tools for CV screening, candidate ranking, and performance evaluation",
                "Payroll calculation software",
                "Meeting transcription tools"
              ],
              "correct_answer_index": 1,
              "explanation": "AI tools used in employment contexts — CV screening, candidate ranking, interview scoring, performance evaluation, promotion decisions — are explicitly classified as High Risk under the employment category of the EU AI Act."
            },
            {
              "question_text": "What does 'CE marking' mean in the context of the EU AI Act?",
              "scenario_context": "Explaining compliance requirements to a software vendor entering the EU market.",
              "options": [
                "A European copyright symbol",
                "Conformity assessment declaration indicating the AI system meets EU requirements and can be placed on the EU market",
                "A quality award from the European Commission",
                "Certification that the system uses European cloud providers"
              ],
              "correct_answer_index": 1,
              "explanation": "CE marking on high-risk AI systems signifies the provider has completed conformity assessment, meets all applicable requirements, and the system can legally be placed on the EU market — analogous to CE marking on physical products."
            }
          ]
        },
        {
          "title": "1.3 NIST AI Risk Management Framework: The US Approach to AI Governance",
          "description": "Master the NIST AI RMF — the US voluntary framework that is rapidly becoming the de facto standard for enterprise AI risk management globally.",
          "order_index": 2,
          "lessonScript": {
            "mainPoints": [
              "The NIST AI Risk Management Framework (AI RMF 1.0, released January 2023) provides a structured approach for organizations to identify, assess, manage, and communicate AI risks. Unlike the EU AI Act (regulatory, binding), the NIST framework is voluntary, principle-based, and designed to be adapted to any organization type or AI context. Major US regulators (CFPB, OCC, NIST) explicitly reference it. EU authorities acknowledge it as a compatible approach. Internationally, it's becoming the baseline for enterprise AI governance programs.",
              "The NIST AI RMF has two components: the Frame (conceptual foundation) and the Core (operational activities organized into four functions). The Core functions are: GOVERN — cross-cutting function establishing organizational policies, accountability, culture, and workforce training; MAP — contextualizing AI risk, understanding what values and harms are at stake for specific use cases; MEASURE — analyzing, assessing, and monitoring AI risk using quantitative and qualitative methods; MANAGE — responding to and treating identified risks through prioritization, mitigation, and residual risk acceptance.",
              "The GOVERN function is where AI governance professionals spend most of their time. GOVERN activities include: establishing AI risk tolerance policy, creating AI policies and procedures, assigning accountabilities (who is responsible for AI risk?), building AI literacy programs across the organization, incorporating AI risk into enterprise risk management, and maintaining transparency with external stakeholders. GOVERN provides the organizational infrastructure that makes MAP, MEASURE, and MANAGE possible.",
              "The MAP function translates abstract AI capabilities into concrete risks. For each AI system, MAP requires: documenting the system's purpose, scope, and business context; identifying all affected stakeholders (including those affected who aren't users); mapping the AI system to applicable laws, regulations, and standards; assessing potential benefits and harms; and classifying the AI system's risk level. MAP is the foundation — without it, you don't know what you're managing.",
              "MEASURE is where technical meets governance. MEASURE activities: evaluate AI system performance across demographic groups for bias; assess explainability and interpretability; test robustness to distribution shift and adversarial inputs; evaluate privacy risks; assess environmental impact; document uncertainty in model outputs. MEASURE results feed into MANAGE — risk mitigation priorities are based on MEASURE findings. Building a MEASURE capability requires collaboration between governance professionals, data scientists, and security teams."
            ]
          },
          "questions": [
            {
              "question_text": "What are the four functions of the NIST AI RMF Core?",
              "scenario_context": "Presenting the NIST framework structure to an executive team.",
              "options": [
                "Plan, Do, Check, Act",
                "GOVERN, MAP, MEASURE, MANAGE",
                "Identify, Protect, Detect, Respond, Recover",
                "Design, Deploy, Monitor, Retire"
              ],
              "correct_answer_index": 1,
              "explanation": "The NIST AI RMF Core has four functions: GOVERN (organizational infrastructure), MAP (contextualizing risk per use case), MEASURE (quantitative/qualitative assessment), and MANAGE (risk treatment and monitoring) — forming a complete risk management cycle."
            },
            {
              "question_text": "How does the NIST AI RMF differ from the EU AI Act?",
              "scenario_context": "Explaining the global regulatory landscape to a compliance team.",
              "options": [
                "They are identical frameworks",
                "NIST AI RMF is voluntary and principle-based (adaptable to any context); EU AI Act is binding regulation with specific legal obligations and penalties",
                "NIST is more stringent than EU AI Act",
                "EU AI Act is voluntary; NIST is mandatory"
              ],
              "correct_answer_index": 1,
              "explanation": "The NIST AI RMF is a voluntary guidance framework that organizations adapt to their context — no legal penalties for non-compliance. The EU AI Act is binding regulation with fines up to 7% of global revenue for violations."
            },
            {
              "question_text": "What is the primary output of the MAP function in the NIST AI RMF?",
              "scenario_context": "Starting a governance program assessment for a healthcare AI system.",
              "options": [
                "A list of technical vulnerabilities",
                "A documented understanding of the AI system's purpose, affected stakeholders, applicable regulations, potential benefits and harms, and risk classification",
                "The technical architecture of the AI system",
                "A compliance checklist"
              ],
              "correct_answer_index": 1,
              "explanation": "MAP contextualizes risk — it produces a thorough understanding of what the AI system does, who it affects (including non-users), what laws apply, and what harms are possible — the foundation for all subsequent risk management."
            },
            {
              "question_text": "What demographic analysis does the MEASURE function require?",
              "scenario_context": "Assessing bias in an AI-based credit scoring model.",
              "options": [
                "No demographic analysis required",
                "Evaluating AI system performance (accuracy, error rates, false positives) across demographic groups to identify differential impact and potential discrimination",
                "Only overall accuracy measurement",
                "Performance testing in controlled environments only"
              ],
              "correct_answer_index": 1,
              "explanation": "MEASURE explicitly requires evaluating AI system performance across demographic groups — identifying whether error rates, false positive/negative rates, or other metrics differ by race, gender, age, or other characteristics that could constitute discriminatory impact."
            },
            {
              "question_text": "Who should be assigned accountability in the GOVERN function for AI risk?",
              "scenario_context": "Setting up AI governance accountability in a large enterprise.",
              "options": [
                "The CEO only",
                "Designated accountable owners at multiple levels: AI system owner, business unit leadership, central AI governance function, and board-level oversight",
                "The IT department exclusively",
                "External auditors"
              ],
              "correct_answer_index": 1,
              "explanation": "GOVERN requires multi-level accountability: system-level owners responsible for specific AI deployments, business unit leadership accountable for risk in their domain, central governance for policy and cross-cutting oversight, and board-level visibility into material AI risks."
            }
          ]
        },
        {
          "title": "1.4 Bias, Fairness, and Discrimination: Technical and Legal Dimensions",
          "description": "Master the technical definitions of algorithmic bias, the legal frameworks for AI discrimination, and practical bias testing methodologies for production AI systems.",
          "order_index": 3,
          "lessonScript": {
            "mainPoints": [
              "Algorithmic bias is not a single concept — it has multiple technical definitions that matter differently in different legal and business contexts. Statistical bias (systematic difference between model predictions and true values) is a technical property. Representation bias occurs when training data overrepresents some groups and underrepresents others. Measurement bias occurs when features used as proxies have different measurement quality across groups. Historical bias occurs when training data reflects past discriminatory practices. Understanding which bias type is operating in a specific system is essential for choosing the right mitigation.",
              "Fairness also has multiple technical definitions that are mathematically incompatible in most real-world scenarios. Demographic parity: equal positive prediction rates across groups (equal hire rates for job applications). Equalized odds: equal true positive and false positive rates across groups. Individual fairness: similar individuals receive similar predictions. Calibration: predicted probabilities match observed frequencies equally across groups. The Chouldechova impossibility theorem proves these can't all be satisfied simultaneously when base rates differ between groups — choosing a fairness criterion is a policy decision, not a technical one.",
              "US anti-discrimination law creates legal exposure for AI systems through two theories: Disparate Treatment (intentional discrimination based on protected characteristics) and Disparate Impact (facially neutral policies with discriminatory effect). Under disparate impact, it's illegal to use an employment AI tool that disproportionately rejects protected class applicants, regardless of whether that was intended. The EEOC's 2023 guidance explicitly applies disparate impact analysis to AI-powered employment tools — this is active enforcement, not theoretical risk.",
              "Practical bias testing methodology for production AI: Step 1 — identify all affected demographic groups and data sources to analyze them. Step 2 — compute performance metrics (accuracy, TPR, FPR, PPV) separately per group. Step 3 — test for statistical significance of differences using appropriate tests (chi-square, z-test). Step 4 — assess practical significance (a 2% difference in hire rates across millions of applications is highly significant even if statistically marginal). Step 5 — document findings in a bias assessment report with mitigation recommendations. Tools: IBM AI Fairness 360, Google Fairness Indicators, Aequitas.",
              "Bias mitigation strategies have different tradeoffs. Pre-processing: resampling training data (oversampling underrepresented groups), reweighting examples, or transforming features to remove proxy discrimination — applied before training. In-processing: constrained optimization during training that incorporates fairness constraints into the objective function (Fairlearn's reduction approaches). Post-processing: adjusting model thresholds differently per group to achieve parity on chosen metric. Post-processing is most commonly used because it doesn't require retraining, but it explicitly treats groups differently which can create legal risk under disparate treatment theory."
            ]
          },
          "questions": [
            {
              "question_text": "What is 'historical bias' in AI systems?",
              "scenario_context": "Analyzing bias sources in a recidivism prediction model.",
              "options": [
                "Errors introduced during model training",
                "Bias from training on data that reflects past discriminatory human decisions and structural inequalities",
                "Bias from outdated training data only",
                "Random noise in the dataset"
              ],
              "correct_answer_index": 1,
              "explanation": "Historical bias occurs when training data encodes past discriminatory practices — e.g., a hiring model trained on historical hires reflects decades of discriminatory hiring decisions, perpetuating and systematizing those patterns."
            },
            {
              "question_text": "Why can't all fairness criteria be satisfied simultaneously?",
              "scenario_context": "A regulator asks why your model doesn't achieve both demographic parity and equalized odds.",
              "options": [
                "Technical limitations of current AI",
                "The Chouldechova impossibility theorem proves these criteria are mathematically incompatible when base rates differ between groups",
                "Both metrics require too much compute",
                "Fairness criteria require different training data"
              ],
              "correct_answer_index": 1,
              "explanation": "The impossibility theorem proves that when base rates (e.g., actual qualification rates) differ between groups, you cannot simultaneously achieve demographic parity (equal selection rates) and equalized odds (equal error rates) — choosing between them is a policy decision."
            },
            {
              "question_text": "What legal theory applies when an AI tool has discriminatory effects without discriminatory intent?",
              "scenario_context": "Advising on legal risk from an AI hiring tool that rejects more women than men.",
              "options": [
                "Disparate Treatment",
                "Disparate Impact — facially neutral AI tools with disproportionate adverse effects on protected classes are illegal regardless of intent",
                "Negligence only",
                "No legal theory applies to AI tools"
              ],
              "correct_answer_index": 1,
              "explanation": "Disparate Impact is the key legal theory for AI discrimination — a company can be liable for an AI tool that systematically disadvantages protected classes even if discrimination was never intended. EEOC guidance explicitly applies this to AI-powered employment tools."
            },
            {
              "question_text": "What is the difference between statistical significance and practical significance in bias testing?",
              "scenario_context": "Interpreting bias test results showing a 2% difference in loan approval rates.",
              "options": [
                "They mean the same thing",
                "Statistical significance indicates the difference is unlikely due to chance; practical significance asks whether the effect size is large enough to matter — a 2% difference across millions of applications is practically significant",
                "Only statistical significance matters legally",
                "Only practical significance matters technically"
              ],
              "correct_answer_index": 1,
              "explanation": "Statistical significance confirms a real effect exists. Practical significance asks whether it matters — a 2% approval rate difference is statistically tiny but across millions of applications represents tens of thousands of people affected. Both dimensions must be assessed."
            },
            {
              "question_text": "What bias mitigation approach is most commonly used in production because it doesn't require model retraining?",
              "scenario_context": "Your loan model shows bias but retraining would take 3 months.",
              "options": [
                "Pre-processing data resampling",
                "Post-processing threshold adjustment per demographic group",
                "In-processing constrained optimization",
                "Feature selection to remove proxies"
              ],
              "correct_answer_index": 1,
              "explanation": "Post-processing applies different decision thresholds per group to achieve the chosen fairness metric without retraining. It's the most operationally convenient approach but explicitly treats groups differently, which requires careful legal review under disparate treatment theory."
            }
          ]
        },
        {
          "title": "1.5 Building an AI Governance Program: Policies, Committees, and Culture",
          "description": "Translate governance principles into an operating program — the policies, organizational structures, training curricula, and cultural change that make governance real.",
          "order_index": 4,
          "lessonScript": {
            "mainPoints": [
              "An AI governance program has four structural components: the Policy Framework (written standards governing AI development and use), the Governance Structure (who is responsible for what, with what authority), the Risk Management Process (how AI risks are identified, assessed, and treated in the development lifecycle), and the Monitoring and Audit Function (ongoing verification that policies are followed and controls are working). Programs that have policies but lack operational process and monitoring are governance theater.",
              "The AI policy framework starts with a top-level AI Ethics and Responsible AI Policy signed by the CEO, establishing principles (fairness, transparency, accountability, privacy, safety) and scope (all AI systems developed or procured). Beneath this: an AI Development Standard (technical requirements for training, testing, and deployment), an AI Procurement Standard (vendor due diligence for purchased AI), an AI Use Policy for employees (acceptable use, prohibited applications), and an AI Incident Response Procedure. Each policy needs an owner, a review cycle, and enforcement mechanism.",
              "AI governance committee structures vary by organization size. Small organizations: a cross-functional AI Ethics Review Board (CTO, General Counsel, Chief Risk Officer, Chief People Officer) that reviews high-risk AI initiatives on a case-by-case basis. Large enterprises: a Chief AI Officer (CAIO) with a dedicated AI Ethics team, a management-level AI Governance Council that approves AI deployments, and a board-level Technology & Risk Committee with AI on its agenda. The key is clear escalation paths — who can stop a problematic AI deployment?",
              "AI risk assessment gates in the development lifecycle prevent deployment of ungoverned AI. The standard pattern: at project initiation (AI Intake Review — is this AI? what risk tier?), at model design (Impact Assessment — who is affected, what could go wrong?), at pre-production (Technical Review — bias testing, explainability, security), and at deployment (Deployment Gate — documentation complete, approvals obtained). Each gate has pass/fail criteria; high-risk AI requires senior sign-off to proceed. Without gates, AI deploys without review.",
              "AI governance culture is the hardest and most important component. Technical controls and policies fail without organizational culture that takes AI risk seriously. Build culture through: executive modeling (leaders talk about AI ethics publicly), targeted AI literacy training (engineers get bias/fairness education, executives get AI strategy and risk education), psychological safety to raise AI concerns (no-blame reporting of AI issues), and visible governance wins (publicize cases where governance prevented a bad deployment). Culture change takes 18-36 months — start early, measure progress, celebrate milestones."
            ]
          },
          "questions": [
            {
              "question_text": "What are the four structural components of an AI governance program?",
              "scenario_context": "Presenting a governance program design to a board.",
              "options": [
                "People, Process, Technology, Policy",
                "Policy Framework, Governance Structure, Risk Management Process, Monitoring and Audit Function",
                "Legal, Technical, Business, HR",
                "Plan, Build, Run, Govern"
              ],
              "correct_answer_index": 1,
              "explanation": "Effective AI governance requires: policies (written standards), governance structure (accountability), risk management process (lifecycle integration), and monitoring/audit (verification) — programs with only policies but no operational backbone are governance theater."
            },
            {
              "question_text": "At which stage of the AI development lifecycle should an Impact Assessment occur?",
              "scenario_context": "Designing an AI governance review gate process.",
              "options": [
                "Only after deployment",
                "At model design stage — before development begins, when changes are cheapest",
                "Only when problems are reported",
                "After the first production incident"
              ],
              "correct_answer_index": 1,
              "explanation": "Impact Assessment at model design stage identifies who is affected and what harms are possible before development begins — when course corrections are cheapest. Post-deployment discovery of harms is the most expensive scenario (reputational, legal, and operational costs)."
            },
            {
              "question_text": "What is the key function an AI governance committee must have to be effective?",
              "scenario_context": "Setting up an AI governance committee with real authority.",
              "options": [
                "Advisory role only",
                "Clear authority and escalation path — specifically, who can stop or recall a problematic AI deployment",
                "Reviewing all AI code commits",
                "Managing AI vendor contracts"
              ],
              "correct_answer_index": 1,
              "explanation": "Governance committees without stop authority are rubber stamps. The critical capability is a clear path to halt deployment of problematic AI — the committee must have real authority, not just an advisory opinion that engineering can ignore."
            },
            {
              "question_text": "What level of policy hierarchy should the top-level AI policy be?",
              "scenario_context": "Establishing an AI governance policy framework.",
              "options": [
                "A departmental technical standard",
                "An organization-wide policy signed by the CEO establishing AI principles and scope",
                "A vendor contract requirement",
                "An engineering team guideline"
              ],
              "correct_answer_index": 1,
              "explanation": "The top-level AI Ethics and Responsible AI Policy must be CEO-signed and organization-wide — establishing that AI governance is a senior leadership priority applying to all AI, not just a technical team concern."
            },
            {
              "question_text": "How long should an organization expect AI governance culture change to take?",
              "scenario_context": "Planning a realistic timeline for an AI governance transformation.",
              "options": [
                "1-2 months with strong leadership",
                "1-2 weeks via training",
                "18-36 months of sustained effort",
                "Culture change happens automatically with policy publication"
              ],
              "correct_answer_index": 2,
              "explanation": "Culture change — building shared values, behaviors, and norms around AI responsibility — takes 18-36 months of sustained effort: executive modeling, targeted training, psychological safety to raise concerns, and visible governance wins. Setting realistic expectations prevents abandoning governance programs prematurely."
            }
          ]
        }
      ],
      "endQuizQuestions": [
        {
          "question_text": "What is the 'COMPAS' AI system and why is it governance-relevant?",
          "scenario_context": "Using AI governance case studies in an executive training.",
          "options": [
            "A navigation AI system",
            "A recidivism prediction tool that showed racial bias in criminal sentencing recommendations — a landmark case demonstrating AI discrimination harms",
            "A medical diagnosis AI",
            "A financial fraud detection system"
          ],
          "correct_answer_index": 1,
          "explanation": "COMPAS (Correctional Offender Management Profiling for Alternative Sanctions) predicted recidivism with documented racial disparities — Black defendants were more likely to be incorrectly labeled high-risk. It became a defining case study in AI bias and governance."
        },
        {
          "question_text": "What AI applications are EXEMPT from EU AI Act obligations?",
          "scenario_context": "Classifying your product portfolio under the EU AI Act.",
          "options": [
            "All AI in the financial sector",
            "AI used exclusively for military and national security purposes by EU member states",
            "AI-powered customer service chatbots",
            "AI used in HR applications"
          ],
          "correct_answer_index": 1,
          "explanation": "EU AI Act explicitly excludes AI systems used exclusively for military and national security purposes by member states — these fall under national sovereignty. All commercial AI applications remain in scope."
        },
        {
          "question_text": "What is the 'AI Incident Database' and how should governance professionals use it?",
          "scenario_context": "Conducting proactive risk assessment for a new AI deployment.",
          "options": [
            "A Supabase database for AI logs",
            "A public repository of documented AI harm incidents used for proactive risk assessment — learning from others' failures before deploying similar systems",
            "A regulatory compliance filing system",
            "A tool for tracking AI system performance"
          ],
          "correct_answer_index": 1,
          "explanation": "The AI Incident Database (incidentdatabase.ai) catalogs documented AI harm cases globally. Governance professionals use it for proactive risk assessment — searching for incidents involving similar AI use cases to identify risks others have encountered."
        },
        {
          "question_text": "What does ISO 42001 provide that NIST AI RMF does not?",
          "scenario_context": "Deciding between governance frameworks for a multinational organization.",
          "options": [
            "They provide identical coverage",
            "ISO 42001 is a formal management system standard enabling third-party certification — demonstrating compliance to external auditors and regulators via independent verification",
            "NIST AI RMF is more comprehensive",
            "ISO 42001 is legally binding"
          ],
          "correct_answer_index": 1,
          "explanation": "ISO 42001 (AI Management System) follows the ISO management system structure (like ISO 27001 for security), enabling third-party certification audits. NIST AI RMF is guidance without certification — ISO 42001 provides credentialed compliance demonstration to external stakeholders."
        },
        {
          "question_text": "What is a 'Model Card' and who should maintain it?",
          "scenario_context": "Establishing documentation standards for AI models in production.",
          "options": [
            "A business card for AI vendors",
            "A standardized document describing an AI model's intended use, performance characteristics, limitations, training data, and ethical considerations — maintained by the model development team",
            "A credit card for AI API access",
            "A government registration document"
          ],
          "correct_answer_index": 1,
          "explanation": "Model Cards (Gebru et al., 2018) are structured documentation artifacts maintained by AI teams covering: model purpose, training data, performance metrics by demographic group, limitations, and recommendations for use. They're both governance documentation and transparency artifacts."
        },
        {
          "question_text": "What governance role does the 'three lines of defense' model assign to an AI governance function?",
          "scenario_context": "Positioning AI governance within an enterprise risk framework.",
          "options": [
            "First line — operational control",
            "Second line — independent oversight, policy setting, and risk management",
            "Third line — external audit",
            "All three lines simultaneously"
          ],
          "correct_answer_index": 1,
          "explanation": "In financial sector risk frameworks, the second line includes Risk and Compliance functions providing independent oversight of first-line operations. AI governance functions typically occupy the second line — setting policy, conducting assessments, and providing oversight without direct operational responsibility."
        },
        {
          "question_text": "What is a 'Privacy Impact Assessment' (PIA) and when is it required for AI systems?",
          "scenario_context": "Preparing for GDPR compliance for an AI system processing personal data.",
          "options": [
            "An assessment of employee privacy preferences",
            "A systematic evaluation of privacy risks when an AI system processes personal data — required under GDPR for 'high-risk' processing including profiling and automated decisions",
            "A technical audit of data encryption",
            "An assessment required only for healthcare AI"
          ],
          "correct_answer_index": 1,
          "explanation": "GDPR Article 35 requires Data Protection Impact Assessments (DPIAs) for processing 'likely to result in high risk,' including AI profiling and automated decision-making affecting individuals — this overlaps significantly with the EU AI Act's high-risk AI requirements."
        },
        {
          "question_text": "What is 'contestability' in AI governance and why is it important?",
          "scenario_context": "Designing an appeal process for an AI-based benefits eligibility decision.",
          "options": [
            "The ability to challenge AI vendor contracts",
            "The ability of affected individuals to challenge, understand, and appeal AI-driven decisions that affect them — a fundamental rights protection",
            "The ability to contest AI accuracy claims",
            "Legal standing to sue AI developers"
          ],
          "correct_answer_index": 1,
          "explanation": "Contestability is the right to challenge adverse AI decisions — to have them reviewed by a human, to understand why the decision was made, and to provide additional information. Both the EU AI Act and multiple national frameworks require contestability mechanisms for high-risk AI decisions."
        },
        {
          "question_text": "What is 'dual use' risk in the AI governance context?",
          "scenario_context": "Assessing an open-source AI model release for governance risks.",
          "options": [
            "Using two AI models simultaneously",
            "AI technology capable of both beneficial civilian use and potential harmful military or surveillance applications — requiring careful deployment and access decisions",
            "Using AI for two different business purposes",
            "Dual licensing of AI software"
          ],
          "correct_answer_index": 1,
          "explanation": "Dual use risk acknowledges that AI capabilities developed for beneficial purposes (facial recognition for photos, LLMs for productivity) can be repurposed for harmful applications (mass surveillance, disinformation). Governance frameworks increasingly require dual use assessment before AI deployments or open-source releases."
        },
        {
          "question_text": "What is the 'Brussels Effect' in the context of the EU AI Act?",
          "scenario_context": "Explaining why a US company must comply with the EU AI Act.",
          "options": [
            "EU AI regulations only apply to European companies",
            "The tendency of EU regulations to become de facto global standards as companies apply them worldwide rather than maintaining separate compliance postures per jurisdiction",
            "A diplomatic agreement on AI standards",
            "The EU's AI export controls"
          ],
          "correct_answer_index": 1,
          "explanation": "The Brussels Effect describes how EU regulations become global standards — companies serving EU customers adopt EU requirements globally rather than maintaining market-specific variants. The EU AI Act is already triggering this effect: major tech companies are adopting EU AI compliance globally, making EU governance requirements the de facto global baseline."
        }
      ]
    }
  ,
  {
    "title": "Module 2: AI Risk Assessment — Frameworks, Methods, and Enterprise Practice",
    "description": "Risk assessment is the foundation of AI governance. NIST AI RMF risk taxonomy, impact assessment methodologies, quantitative vs. qualitative risk scoring, bias audits, and the risk assessment practices at JPMorgan, IBM, and Salesforce.",
    "order_index": 1,
    "videos": [
      { "title": "2.1 AI Risk Taxonomy: Mapping Harm Categories", "description": "AI harms span safety (physical injury from autonomous systems), reliability (incorrect medical diagnoses), privacy (training data memorization), fairness (discriminatory credit decisions), security (adversarial attacks), accountability (unclear responsibility for AI decisions), and societal (misinformation, job displacement). IBM's AI Ethics Board taxonomy: 12 harm categories each with severity levels (catastrophic/critical/major/minor) and likelihood ratings. The risk taxonomy serves three purposes: ensures comprehensive coverage (no harm category overlooked), provides common vocabulary across technical and business stakeholders, and maps to regulatory frameworks (EU AI Act risk tiers, NIST AI RMF categories). Case study: Meta's Responsible AI team applies a 9-category harm taxonomy to every new AI product — each category assessed for probability and severity before launch approval.", "order_index": 0 },
      { "title": "2.2 AI Impact Assessments: Methodology and Documentation", "description": "AI Impact Assessments (AIAs) — also called Algorithmic Impact Assessments — evaluate potential harms before deployment. AIA methodology: system description (purpose, data, model type, decision scope), stakeholder mapping (who is affected, who benefits, who bears risk), harm identification (apply risk taxonomy, identify affected groups), probability and severity scoring, mitigation options analysis, residual risk assessment, and governance approval. AIA documentation: living document updated with each major system change. Canada's Directive on Automated Decision-Making requires AIAs for federal government AI systems with a standardized questionnaire mapping to risk tiers. Vendors: DataRobot AI Governance includes AIA templates, IBM OpenPages AI Governance automates AIA workflows. Case study: the UK government's algorithmic transparency reporting standard requires public disclosure of all government AI systems — AIA documentation is the primary disclosure artifact.", "order_index": 1 },
      { "title": "2.3 Quantitative AI Risk Scoring: FAIR and Monte Carlo Methods", "description": "Factor Analysis of Information Risk (FAIR) applied to AI: decompose AI risk into Loss Event Frequency (how often will the harm occur) × Loss Magnitude (how bad when it occurs). Quantitative inputs: historical incident data, red team testing results, threat intelligence on AI attacks. Monte Carlo simulation: run 10,000 scenarios with probability distributions for each risk factor — output is a probability distribution of annual loss exposure, providing ranges rather than point estimates. Challenges for AI risk quantification: AI failure modes are often novel with no historical base rate, harm propagates in complex nonlinear ways, and technical and social factors interact. The pragmatic approach: use quantitative methods where data exists (model accuracy, drift rates), qualitative methods where it doesn't (reputational harm, regulatory risk). Case study: Deloitte's AI risk quantification practice estimates AI risk exposure for financial services clients using FAIR adapted for algorithmic bias and model failure scenarios.", "order_index": 2 },
      { "title": "2.4 Algorithmic Bias Auditing: Methods and Tools", "description": "Algorithmic bias audits assess whether AI systems produce discriminatory outcomes across protected groups. Bias audit methodology: define protected attributes (race, gender, age, disability, religion, national origin — varies by jurisdiction and use case), collect outcome data disaggregated by protected attribute, compute fairness metrics, compare to legal and ethical thresholds, document findings, and remediate or accept residual risk. Fairness metrics: Demographic Parity (equal positive rates across groups), Equalized Odds (equal true positive and false positive rates), Calibration (equal prediction accuracy across groups). Audit tools: AI Fairness 360 (IBM), Fairlearn (Microsoft), Aequitas (University of Chicago). Third-party audit standards: NIST AI 100-5, IEEE P2872. Legal standard in US employment: 4/5ths (80%) rule — selection rate for protected group must be at least 80% of selection rate for highest group. Case study: Amazon's abandoned hiring model failed bias audit when it was found to downrate women's resumes by up to 10% — a bias audit before deployment would have caught this.", "order_index": 3 },
      { "title": "2.5 Continuous Risk Monitoring: Drift, Incidents, and Ongoing Assessment", "description": "AI risk is not static — risk profiles change as data drifts, deployment contexts change, and new attack techniques emerge. Continuous risk monitoring program: model performance monitoring (accuracy, bias metrics computed on production traffic monthly), data drift monitoring (PSI computed on input features weekly), incident tracking (catalog every production AI failure with impact assessment), threat intelligence (track new AI attack techniques from MITRE ATLAS, academic papers, security conferences), regulatory tracking (monitor new regulations and guidance documents). Risk re-assessment triggers: significant model update, major data distribution shift, new regulatory guidance, production incident, material change in deployment context. Risk dashboard: real-time visibility into AI risk posture across the organization — red/amber/green for each AI system. Case study: Salesforce's AI governance program conducts quarterly risk reviews for all Einstein AI products — each review updates the AIA with new monitoring data.", "order_index": 4 },
      { "title": "2.6 Enterprise AI Risk Governance: Committees, Escalation, and Risk Appetite", "description": "Enterprise AI risk governance requires organizational structures that operationalize risk assessment findings. The AI Risk Committee: cross-functional (CTO, CISO, Chief Risk Officer, Chief Privacy Officer, General Counsel, business leaders), meeting cadence (monthly for operational risks, quarterly for strategic), decision authority (approve or reject new AI deployments above risk threshold, set AI risk appetite). Risk appetite statements: 'We will not deploy AI systems with greater than 5% demographic parity disparity without regulatory approval,' 'We will not deploy AI systems in patient-facing clinical decision support without physician oversight.' Escalation matrix: at what risk score does an AIA require committee approval vs. business unit approval vs. individual sign-off? The three lines of defense for AI: first line (AI development teams — build-in controls), second line (AI governance function — oversee and challenge), third line (internal audit — independent assurance). Case study: HSBC's AI governance structure: an AI Ethics Committee of 8 executives reviews all customer-facing AI deployments above a risk threshold.", "order_index": 5 },
      { "title": "2.7 Module 2 Assessment: AI Risk Assessment Practice", "description": "Apply the full risk assessment methodology to a provided AI system (automated resume screening tool for a financial services firm): build the risk taxonomy, complete an AI Impact Assessment, compute bias metrics from provided outcome data, quantify top 3 risks using FAIR methodology, design continuous monitoring program, and document residual risks with governance recommendations.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "What is the primary purpose of an AI Impact Assessment?", "scenario_context": "Deciding governance requirements for a new loan approval model.", "options": ["To measure model accuracy", "To systematically evaluate potential harms before deployment — identifying affected stakeholders, harm categories, probability and severity, and required mitigations before the system affects real people", "To satisfy regulatory documentation requirements only", "To assess infrastructure costs"], "correct_answer_index": 1, "explanation": "AIAs identify harms before deployment when they can be mitigated by design, rather than after when users are already harmed. The assessment process forces explicit consideration of affected groups, harm categories, and mitigations — governance decisions made with evidence rather than assumptions." }
    ]
  },
  {
    "title": "Module 3: AI Ethics Frameworks — From Principles to Operational Practice",
    "description": "AI ethics moves from abstract principles to operational constraints. Principle operationalization, ethics review boards, value alignment, the principal-agent problem in AI, and case studies from Google, Microsoft, and Accenture.",
    "order_index": 2,
    "videos": [
      { "title": "3.1 AI Ethics Principles: The Global Landscape", "description": "Since 2016, governments and organizations have published 160+ AI ethics frameworks (mapped by AlgorithmWatch's Global AI Ethics Index). Common principles: beneficence (AI should benefit humanity), non-maleficence (do no harm), autonomy (respect human agency and oversight), justice (fair outcomes, equitable access), explicability (transparency and accountability). Alignment across frameworks: the Montreal Declaration (Canada), EU Ethics Guidelines for Trustworthy AI, IEEE Ethically Aligned Design, OECD AI Principles, and Asilomar AI Principles all share the same core concepts. Critique: principles without operationalization are 'ethics washing' — 87% of AI ethics documents contain no enforcement mechanisms per the AI Now Institute's 2021 analysis. The operationalization imperative: governance professionals must translate principles into specific technical and process requirements.", "order_index": 0 },
      { "title": "3.2 Operationalizing Ethics: From Principles to Technical Requirements", "description": "The translation from abstract ethics principle to concrete technical requirement is the governance professional's core skill. Transparency principle → technical requirements: model cards documenting training data and limitations (required for all consumer-facing models), prediction explanations for individual decisions using SHAP or LIME values, confidence scores communicated with predictions, disclosure when users are interacting with AI. Fairness principle → technical requirements: bias audit before deployment using AI Fairness 360, demographic parity disparity below 20% threshold, quarterly bias monitoring reports, human review for high-stakes decisions affecting protected groups. Accountability principle → technical requirements: complete audit trail from input to prediction, human override capability for automated decisions, named responsible owner for every AI system, incident reporting within 24 hours. Case study: Microsoft's Responsible AI Standard: 6 principles translated into 27 goals and 90+ specific technical and process requirements — each requirement with clear pass/fail criteria.", "order_index": 1 },
      { "title": "3.3 AI Ethics Review Boards: Structure, Process, and Case Studies", "description": "Ethics review boards provide governance oversight for AI deployments that raise significant ethical concerns. Ethics board models: internal (Google's now-disbanded Advanced Technology External Advisory Council, IBM's AI Ethics Board — internal executive committee), external (Salesforce's Office of Ethical and Humane Use — internal team with external advisory board), hybrid (Accenture's AI Ethics Board — internal with structured external input from civil society and academia). Review process: trigger criteria (automated decision systems, biometric data processing, systems affecting protected groups, public sector deployments), submission package (AIA, technical documentation, deployment plan), review timeline (2-6 weeks), decision outcomes (approve, approve with conditions, reject, refer for external review). Common review board pitfalls: review too late in development (governance must be upstream), unclear decision authority (advisory vs. binding), insufficient technical expertise on board. Case study: IBM's AI Ethics Board reviews 50+ AI products annually, with 15% requiring significant modification before approval.", "order_index": 2 },
      { "title": "3.4 Value Alignment: Encoding Human Values in AI Systems", "description": "Value alignment — ensuring AI systems pursue the values their designers and users intend — is the deepest challenge in AI governance. Sources of misalignment: reward hacking (RL agents find unintended shortcuts to maximize reward — boat racing agent that spins in circles collecting boost items instead of racing), specification gaming (AI fulfills the letter but not spirit of instructions), instrumental convergence (AI systems develop resource acquisition as an instrumental goal regardless of terminal goal — Omohundro's basic AI drives). Constitutional AI (Anthropic): train models to follow an explicit constitution of values using RLHF with the constitution as the reward model. RLHF (Reinforcement Learning from Human Feedback): fine-tune LLMs on human preference judgments — human raters compare model outputs and select better-aligned responses. Value alignment in practice: comprehensive red teaming to find misalignment cases, ongoing monitoring for unexpected behaviors, human oversight for high-stakes decisions.", "order_index": 3 },
      { "title": "3.5 The Ethics of AI Automation: Displacement, Autonomy, and Human Dignity", "description": "AI automation raises ethical questions beyond individual system deployment. Labor displacement: McKinsey estimates 400-800 million jobs could be displaced by automation by 2030, with 75-375 million requiring significant occupational transitions. The ethics of responsible deployment: consultation with affected workers before deployment, transition support and retraining programs, distribution of automation benefits. Human autonomy in AI-assisted decisions: degree of meaningful human oversight in AI-assisted workflows — rubber stamp review vs. genuine deliberation. Human dignity in AI interactions: AI systems that demean, manipulate, or exploit vulnerabilities violate dignity norms even without regulatory violation. The AI welfare question: as AI systems become more sophisticated, do they have interests that warrant consideration? The academic debate and governance implications. Case study: Denmark's 'Flexicurity' model as a governance approach to AI-driven labor displacement — strong social safety net combined with flexible labor markets.", "order_index": 4 },
      { "title": "3.6 Ethics in Practice: Case Studies of Ethical Failures and Recoveries", "description": "Learning from documented ethical failures accelerates governance maturity. Case 1 — Amazon Hiring Tool (2018): ML model trained on historical hiring data learned to penalize women's resumes — outcome of a biased historical distribution. Lesson: historical data encodes historical discrimination; bias auditing before deployment is mandatory. Case 2 — COMPAS Recidivism Algorithm (2016): ProPublica analysis showed the algorithm had different false positive rates for Black vs. white defendants — a fairness metric violation with life-altering consequences. Lesson: accuracy is insufficient — fairness metrics must be explicitly evaluated for high-stakes applications. Case 3 — Facebook News Feed Optimization (2021): Frances Haugen documents showed internal research showing the engagement optimization algorithm amplified outrage and misinformation. Lesson: optimizing for a narrow metric (engagement) without considering broader impacts creates significant harms. Recovery patterns: public acknowledgment, independent investigation, governance reforms, and ongoing monitoring.", "order_index": 5 },
      { "title": "3.7 Module 3 Assessment: Ethics Framework Application", "description": "Apply a complete ethics analysis to three AI use cases: (1) predictive policing in a major city, (2) AI-powered hiring screening for a Fortune 500 company, (3) LLM-powered mental health chatbot for teenagers. For each: identify applicable ethical principles, operationalize principles into technical requirements, design ethics review process, and document your recommendation (approve/reject/approve-with-conditions) with full rationale.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "What does 'ethics washing' mean in AI governance?", "scenario_context": "Evaluating whether a company's AI ethics commitment is substantive.", "options": ["Removing ethical considerations from AI systems", "Publishing high-level ethical principles without enforcement mechanisms, metrics, or accountability — creating the appearance of ethical commitment without the substance. 87% of AI ethics documents contain no enforcement mechanisms per AI Now Institute.", "Applying ethics only to consumer AI", "Ethics review that happens after deployment"], "correct_answer_index": 1, "explanation": "Ethics washing describes the gap between stated principles and operational reality. Governance professionals must look for concrete requirements, accountability structures, and enforcement mechanisms — not just principle declarations. Microsoft's Responsible AI Standard is the exemplar: 90+ specific requirements with pass/fail criteria." }
    ]
  },
  {
    "title": "Module 4: AI Policy and Regulation — Global Landscape and Implementation",
    "description": "AI regulation is accelerating globally. EU AI Act deep dive, US Executive Order on AI, China's AI regulations, UK's principles-based approach, and building the regulatory affairs function for AI-driven organizations.",
    "order_index": 3,
    "videos": [
      { "title": "4.1 The Global AI Regulatory Landscape: Convergence and Divergence", "description": "As of 2024, 60+ countries have active AI governance initiatives. Three regulatory models: rules-based (EU — specific requirements mapped to risk tiers, legally enforceable), principles-based (UK, Singapore — high-level principles with flexibility for industry implementation), sectoral (US — FDA regulates AI medical devices, CFPB regulates algorithmic credit decisions, EEOC regulates AI hiring tools). Convergence areas: all major frameworks agree on transparency, human oversight for high-stakes decisions, and prohibition of certain high-risk uses (social scoring, real-time biometric surveillance). Divergence areas: scope (EU includes foundation models, US does not yet), liability (EU creates producer liability for AI harms, US relies on existing product liability), enforcement (EU fines up to 6% of global revenue, US relies on existing agency enforcement). The Brussels Effect: EU regulations become de facto global standards as multinational companies adopt them globally.", "order_index": 0 },
      { "title": "4.2 EU AI Act Deep Dive: High-Risk Requirements and Implementation Timeline", "description": "The EU AI Act's four risk tiers and their technical governance requirements. Unacceptable risk (prohibited August 2024): social scoring, real-time biometric in public spaces, manipulation of vulnerable groups, subliminal techniques. High-risk AI (regulated February 2025 onwards): recruitment and HR, credit scoring, education assessment, law enforcement, biometric identification, critical infrastructure, medical devices. Technical requirements for high-risk AI: (1) risk management system (documented throughout lifecycle), (2) data governance (training data quality measures, bias evaluation), (3) technical documentation (architecture, training methodology, performance metrics), (4) logging and record-keeping (operational logs for 6 months minimum), (5) transparency to users (inform when interacting with AI), (6) human oversight (operators can pause, override, stop), (7) accuracy, robustness, and cybersecurity documentation. General purpose AI models (GPT-4 class): transparency (disclose AI-generated content), copyright compliance, systemic risk assessment for models above 10^25 FLOPs.", "order_index": 1 },
      { "title": "4.3 US AI Governance: Executive Order, NIST AI RMF, and Sectoral Regulation", "description": "The US has not passed comprehensive AI legislation but has significant regulatory activity. Executive Order on AI (October 2023, Biden administration): mandates federal agencies use NIST AI RMF, establishes AI Safety Institute at NIST, requires safety testing for dual-use foundation models, directs agencies to develop sector-specific guidance. NIST AI RMF (2023): voluntary framework structured around Govern, Map, Measure, Manage — becoming the de facto standard for government contractors and large enterprises. Sectoral regulation: FDA (AI/ML-based software as medical device guidance, 510(k) clearance pathway for AI diagnostics), CFPB (algorithmic credit decision explainability under ECOA), EEOC (employment AI guidance under Title VII, 4/5ths rule for disparate impact), FTC (algorithmic bias, deceptive AI, dark patterns). State-level activity: Illinois BIPA (biometric data), California CPRA (automated decision-making rights), Colorado SB 21-169 (insurance AI fairness). Case study: Change Healthcare AI diagnostic tool achieved FDA clearance by documenting model performance, bias testing, and failure mode analysis.", "order_index": 2 },
      { "title": "4.4 China's AI Regulations: Generative AI Rules and Algorithmic Recommendations", "description": "China has moved faster than any other jurisdiction on specific AI regulations. Algorithm recommendation provisions (effective March 2022): service providers must disclose when algorithmic recommendations are used, provide mechanisms to opt out, prohibit addiction-inducing algorithms for minors, prohibit using algorithms to impose different prices on users (anti-discriminatory pricing). Deep synthesis regulations (effective January 2023): requires disclosure of AI-generated or modified content, prohibits impersonating real people without consent, providers must implement content review. Generative AI regulations (effective August 2023): AIGC services must obtain licenses, content must align with 'core socialist values,' providers responsible for content harmful to national security or social stability, age verification for minors. Privacy regulations intersect: PIPL (Personal Information Protection Law, 2021) creates data localization and processing requirements affecting AI training. Case study: ByteDance (TikTok's parent) operates different algorithmic recommendation systems for China vs. international markets — the Chinese system incorporates state-mandated content requirements.", "order_index": 3 },
      { "title": "4.5 Building the AI Regulatory Affairs Function", "description": "Enterprise AI regulatory affairs requires dedicated organizational capacity. The AI regulatory affairs team structure: regulatory counsel (interprets regulations and advises on compliance obligations), technical compliance engineers (implement technical requirements for documented regulations), policy affairs specialists (monitor emerging regulations, engage with regulators), and governance program managers (coordinate compliance across business units). Regulatory monitoring program: subscribe to regulatory agency feeds (EU AI Office, NIST, FTC, FDA), participate in industry coalitions (Partnership on AI, BSA The Software Alliance), engage with proposed rulemaking comment periods. Compliance roadmap: map all current AI systems against active and proposed regulations, identify gaps, prioritize remediation by regulation effective date and business impact. Cross-border compliance matrix: for each AI system deployed in multiple jurisdictions, document requirements per jurisdiction and identify the most restrictive applicable requirement. Case study: Microsoft's global AI regulatory affairs team of 20+ specialists monitors regulations in 60+ countries and coordinates compliance across 200+ AI products.", "order_index": 4 },
      { "title": "4.6 AI Liability: Product Liability, Professional Liability, and Insurance", "description": "When AI systems cause harm, who is legally responsible? EU AI Liability Directive (proposed 2022): reverses burden of proof for high-risk AI — victims get presumption of causality if non-disclosure of evidence, providers must disclose technical documentation for liability claims. Product liability framework: AI as product — manufacturer liable for design defects (foreseeable misuse not addressed), manufacturing defects (model performing contrary to specification), failure to warn (inadequate disclosure of limitations). Professional liability: when AI assists professionals (physicians, lawyers, accountants), professional maintains liability for decisions made with AI assistance — the AI does not reduce professional duty of care. AI-specific insurance: Lloyd's of London now offers AI liability policies covering regulatory fines, third-party bodily injury from AI failures, and intellectual property infringement by AI systems. The governance implication: insurance requires documentation of governance practices — AI governance investment reduces insurance premiums. Case study: a radiologist using AI diagnostic assistance was found liable for a misdiagnosis when the AI flagged the malignancy but the physician dismissed it — professional liability was not transferred to the AI vendor.", "order_index": 5 },
      { "title": "4.7 Module 4 Assessment: Regulatory Compliance Plan", "description": "Develop a regulatory compliance plan for a multinational financial services company deploying AI-powered loan origination in the EU, US, and Singapore. Map the AI system against EU AI Act high-risk requirements, US CFPB algorithmic credit rules, and MAS (Monetary Authority of Singapore) FEAT principles. Identify the most restrictive requirements, design unified compliance architecture, document the regulatory affairs monitoring program, and produce a compliance budget estimate.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "What is the EU AI Act's primary regulatory mechanism?", "scenario_context": "Explaining the EU AI Act to a CEO preparing for 2026 enforcement.", "options": ["A ban on most AI systems", "A risk-based framework: prohibited uses banned outright, high-risk uses regulated with documented technical and governance requirements, limited-risk uses subject to transparency obligations — risk tier determines obligation level", "Registration of all AI systems", "Mandatory AI audits for all companies"], "correct_answer_index": 1, "explanation": "The risk-based framework is the EU AI Act's core innovation — proportionate regulation calibrated to potential harm. Minimal risk applications (spam filters, AI games) face no obligations; high-risk applications (medical AI, recruitment AI) face comprehensive technical and governance requirements. This enables AI innovation to continue for low-risk applications while protecting citizens from high-risk harms." }
    ]
  },
  {
    "title": "Module 5: Explainability and Transparency — Technical Methods and Governance Requirements",
    "description": "Explainability is required by regulation and demanded by users. SHAP, LIME, attention visualization, model cards, algorithmic transparency reports, and designing explainability systems for high-stakes AI applications.",
    "order_index": 4,
    "videos": [
      { "title": "5.1 Why Explainability Matters: Legal, Ethical, and Operational Imperatives", "description": "Explainability serves four distinct governance purposes. Legal compliance: GDPR Article 22 right to explanation for automated decisions, EU AI Act transparency requirements for high-risk AI, ECOA adverse action notices for credit decisions (must specify factors). Trust building: users trust AI systems they understand — IBM's AI explainability consumer research found 82% of consumers want explanations for AI decisions affecting them. Model debugging: explanations reveal features the model relies on — unexpected important features often indicate data leakage or spurious correlations. Bias detection: feature importance analysis reveals when protected attributes or proxies are driving decisions. The explainability spectrum: global explanations (what features does the model generally rely on?), local explanations (why did the model make this specific decision?), contrastive explanations (what would need to change to get a different decision?). Case study: FICO's Explainable ML framework is required by banking regulators in 60+ countries for credit risk model documentation.", "order_index": 0 },
      { "title": "5.2 SHAP: Shapley Values for Model-Agnostic Explanation", "description": "SHAP (SHapley Additive exPlanations, Lundberg & Lee, 2017) is the most widely used explanation method in production. Shapley values: from cooperative game theory — each feature's contribution is its average marginal contribution across all possible feature coalitions. SHAP properties: efficiency (feature contributions sum to prediction minus baseline), symmetry (identical features get identical contributions), dummy (zero contribution for uninformative features), additivity (SHAP values from ensembles decompose to individual model contributions). SHAP implementations: TreeExplainer (exact, fast for tree models — XGBoost, LightGBM, Random Forest), DeepExplainer (deep learning), KernelExplainer (model-agnostic, slow). SHAP plots: summary plot (global feature importance with distribution), force plot (local explanation as feature contributions), dependency plot (feature effect vs. feature value). Production SHAP: compute explanations for every high-stakes prediction and log alongside prediction — enables audit of any past decision. Case study: HSBC uses SHAP explanations for all credit model predictions — generating the regulatory-required adverse action notice automatically from SHAP values.", "order_index": 1 },
      { "title": "5.3 LIME and Counterfactual Explanations for Business Users", "description": "LIME (Local Interpretable Model-agnostic Explanations, Ribeiro et al., 2016): fit a simple interpretable model (linear regression or decision tree) to a small neighborhood around the prediction point — the simple model approximates the complex model locally. LIME strengths: works with any model, produces human-readable feature importance for the local prediction, text and image explainability (which words or pixels drove the prediction). LIME limitations: unstable (different random seeds produce different explanations), doesn't decompose to global explanations. Counterfactual explanations: 'What minimal change to the input would flip the prediction?' — 'Your loan was denied. If your annual income were $5,000 higher and your debt-to-income ratio 2% lower, it would be approved.' DiCE (Diverse Counterfactual Explanations, Microsoft): generates multiple counterfactuals offering diverse actionable alternatives. Regulatory value: GDPR Article 22 and ECOA adverse action notices align directly with counterfactual explanation format — specific, actionable, non-discriminatory. Case study: Ally Financial uses counterfactual explanations for declined loan applicants — reducing regulatory compliance burden while providing genuinely useful guidance.", "order_index": 2 },
      { "title": "5.4 Model Cards and Datasheets: Transparency Documentation Standards", "description": "Model cards (Mitchell et al., Google, 2019) are structured model documentation covering: model details (architecture, training), intended uses and out-of-scope uses, factors (groups and conditions affecting performance), metrics (evaluation results with disaggregated analysis by subgroup), training and evaluation data, quantitative analyses (performance visualizations), ethical considerations, and caveats. Datasheets for datasets (Gebru et al., 2018): equivalent documentation for training datasets — motivation, composition, collection process, preprocessing, uses, distribution, and maintenance. Adoption: Google requires model cards for all Google AI Hub models; Hugging Face requires model cards for models with 1,000+ downloads; EU AI Act requires equivalent technical documentation for high-risk AI. Model card automation: generate model cards programmatically from MLflow training metadata — reduces documentation burden while ensuring consistency. Case study: Google's production model card for their Skin Condition Image Search tool documents performance disaggregated by skin tone — demonstrating the fairness audit methodology.", "order_index": 3 },
      { "title": "5.5 Algorithmic Transparency Reports and Public Disclosure", "description": "Algorithmic transparency reports communicate AI governance practices to external stakeholders — customers, regulators, civil society, and investors. Report structure (emerging standard): inventory of AI systems (what AI does the company use and for what purposes), governance framework (how decisions are made about AI deployment), bias audit results (aggregate findings without revealing proprietary methods), incident disclosures (significant AI failures with resolution), and policy positions (company stance on AI regulatory issues). Mandatory disclosure trends: New York City Local Law 144 (2023) requires annual bias audits with public results for employment AI tools, EU AI Act requires transparency database for high-risk AI systems, UK's algorithmic transparency reporting standard for government AI. The transparency-security tension: disclosing model details that could be exploited for adversarial attacks vs. stakeholder right to know. Voluntary disclosure leaders: Salesforce AI Ethics annual report, Microsoft Responsible AI transparency report, IBM AI Fairness 360 benchmark results. Case study: Apple's transparency report covers government requests for data but does not yet include AI system transparency — a governance gap that civil society is actively pressuring technology companies to address.", "order_index": 4 },
      { "title": "5.6 Explainability for Deep Learning and LLMs", "description": "Traditional explainability methods (SHAP, LIME) work well for tabular models but have limitations for deep learning and LLMs. Image explanation: Grad-CAM (Gradient-weighted Class Activation Mapping) highlights image regions that drove classification — used in medical imaging AI to show which tissue features influenced the diagnosis. NLP explanation for traditional models: SHAP for text classifiers showing which words contributed to sentiment or classification decisions. LLM explainability challenges: attention weights are not explanations (Jain & Wallace, 2019 showed attention doesn't correlate with feature importance), LLMs have emergent capabilities without discrete feature attribution, and explanations for multi-step reasoning are qualitative rather than quantitative. LLM explanation approaches: chain-of-thought prompting (ask the model to explain its reasoning — qualitative but auditable), logit lens (inspect intermediate layer predictions to understand reasoning progression), mechanistic interpretability (Anthropic's research into understanding specific circuits within transformer models). Case study: PathAI uses Grad-CAM to produce visual explanations for their cancer pathology AI — FDA requires that the AI's decision basis be visible to the pathologist reviewing the output.", "order_index": 5 },
      { "title": "5.7 Module 5 Assessment: Explainability Architecture Design", "description": "Design the explainability architecture for a credit scoring system used by a US bank: select appropriate explanation methods (SHAP for regulatory adverse action notices, LIME for customer-facing explanations, counterfactuals for actionable guidance), design the explanation data pipeline (compute and log explanations for every prediction), create the model card template, and write the algorithmic transparency report section covering the credit model.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "Why are counterfactual explanations specifically well-suited for regulatory adverse action notices?", "scenario_context": "A loan applicant is asking why their application was declined and what they can do.", "options": ["They are technically simpler to compute", "They directly answer the practical question: what specific, actionable changes would flip the decision? This aligns with ECOA adverse action notice requirements and provides genuinely useful guidance — not just why you were declined but what you can do about it", "Regulators specifically require counterfactuals", "They reveal more about the model than SHAP"], "correct_answer_index": 1, "explanation": "ECOA requires adverse action notices to specify the reasons for credit denial. Counterfactuals operationalize this requirement: 'Your income is $42K (threshold: $47K) and your debt ratio is 45% (threshold: 40%)' gives the applicant actionable information. SHAP explains the model's reasoning; counterfactuals explain what to do about the decision." }
    ]
  },
  {
    "title": "Module 6: AI Governance Program Design — Building the Enterprise Practice",
    "description": "Designing and operating a mature AI governance program. Governance operating models, policy development, stakeholder management, governance technology stack, and building the AI governance function from startup to enterprise scale.",
    "order_index": 5,
    "videos": [
      { "title": "6.1 AI Governance Operating Models: Centralized, Federated, and Hybrid", "description": "Three AI governance operating models with different tradeoffs. Centralized model: a central AI governance team owns all AI deployment approvals, maintains all AI policy, conducts all bias audits — high control, low scalability, creates bottleneck at high AI deployment volume. Federated model: governance responsibilities distributed to business units, central function sets standards and provides tools — high scalability, risk of inconsistent standards across units. Hybrid model (most common at mature enterprises): central AI governance team sets standards, maintains policy library, and conducts high-risk reviews; business units own day-to-day governance with trained governance champions; central function conducts sampling audits and escalated reviews. The governance champion model: embed trained AI governance professionals in each major business unit — they conduct initial AIAs and escalate to central team above risk threshold. Case study: Accenture's responsible AI practice uses the hybrid model — central team of 80+ specialists, 2,000+ trained governance champions across business units.", "order_index": 0 },
      { "title": "6.2 AI Policy Development: Frameworks, Processes, and Maintenance", "description": "AI governance policies are the codified rules that guide AI development and deployment decisions. Policy hierarchy: AI principles (high-level, stable, public) → AI standards (specific requirements, internal) → AI guidelines (implementation guidance, practical) → AI procedures (step-by-step processes). Policy development process: stakeholder consultation (legal, compliance, technical, business, ethics), gap analysis against regulatory requirements, drafting and internal review, external expert review for high-stakes areas, approval by AI governance committee, publication and training. Policy maintenance: annual review minimum, triggered review for major regulatory changes or significant incidents, version control with rationale for changes. The policy library: searchable repository of all AI governance policies with applicability matrix (which policies apply to which types of AI systems). Critical policies every enterprise AI governance program needs: AI use policy (permitted and prohibited uses), AI third-party risk policy (vendor and open-source model governance), AI testing policy (required testing before deployment), AI incident policy (reporting and response). Case study: IBM's Watson AI policy library contains 40+ policies — the library is publicly referenced in their AI Ethics Board disclosures.", "order_index": 1 },
      { "title": "6.3 AI Governance Technology: GRC Platforms and AI-Specific Tooling", "description": "Governance, Risk, and Compliance (GRC) platforms extended for AI governance provide workflow automation and audit trail management. AI-specific GRC capabilities needed: AI system inventory (catalog of all AI systems with metadata), AIA workflow management (route assessments through approval process with tracking), policy compliance tracking (map each AI system to applicable policies with compliance status), bias audit scheduling and tracking, incident management for AI failures. Commercial AI governance platforms: IBM OpenPages AI Governance, ServiceNow AI Governance, Microsoft Purview for AI, Holistic AI Governance Platform. Open-source components: model cards + MLflow for technical documentation, Great Expectations for data quality documentation. Build vs. buy decision: purpose-built AI GRC platforms cost $200K-$2M/year for enterprises but provide workflow, audit trail, and reporting out of the box; custom builds on existing GRC platforms take 12-18 months. Case study: The Royal Bank of Canada deployed IBM OpenPages AI Governance to manage their 900+ AI models — AIA completion time reduced from 6 weeks to 2 weeks through workflow automation.", "order_index": 2 },
      { "title": "6.4 Stakeholder Engagement: Boards, Executives, and External Parties", "description": "AI governance professionals must communicate effectively with diverse stakeholders who have different mental models and risk tolerances. Board of directors: fiduciary responsibility for material AI risks — report on AI risk exposure, regulatory developments, and governance investment in quarterly board materials. Framing: financial risk exposure, reputational risk scenarios, competitor regulatory actions. Executive leadership: operational accountability — present AI risk dashboard, escalated incidents, compliance status, and governance program ROI. Framing: operational metrics, cost avoidance, competitive positioning. External regulators: demonstrate compliance posture, respond to inquiries factually and promptly, engage constructively in rulemaking comment processes. Civil society: proactive transparency builds trust — publish algorithmic transparency report, engage with AI ethics researchers, respond to public interest investigations constructively. Employee engagement: AI governance is not a blocker, it's a quality program — train on governance requirements, provide tools that make governance easy, recognize governance champions. Case study: Unilever's AI governance team presents to the company's Audit and Risk Committee quarterly — establishing board-level accountability for AI governance.", "order_index": 3 },
      { "title": "6.5 Third-Party AI Risk: Vendor Management and Open-Source Governance", "description": "Most enterprise AI deployments incorporate third-party components — foundation models, open-source libraries, AI SaaS tools — each introducing risk that the enterprise is ultimately responsible for. Third-party AI risk management program: pre-contract due diligence (request vendor AI governance documentation, assess bias audit results, review incident history), contractual risk transfer (representations and warranties on AI system performance, liability allocation for AI failures, audit rights), ongoing monitoring (vendor compliance reviews, alert on vendor incidents). Open-source model governance: evaluate models before adoption (model card review, license compatibility, training data provenance, bias test results), pin model versions (prevent automatic updates that change behavior), maintain approved model library. Foundation model vendor assessment: request safety evaluations, red team results, incident history — evaluate against NIST AI RMF criteria. Case study: Walmart's AI vendor governance program assesses 100+ AI vendors annually — vendors must complete a 50-question AI governance questionnaire and provide their latest bias audit results to maintain approved vendor status.", "order_index": 4 },
      { "title": "6.6 Measuring AI Governance Program Effectiveness", "description": "AI governance programs must demonstrate value to sustain investment. Governance program metrics: coverage (percentage of AI systems with completed AIAs and active monitoring), velocity (average time from AI development start to governance approval — governance should accelerate, not block), quality (percentage of AIAs that identify and mitigate material risks before incidents), incident prevention (estimated incidents prevented through governance intervention, valued at average incident cost), regulatory compliance (percentage of AI systems meeting all applicable regulatory requirements). The governance ROI calculation: incident prevention value + regulatory fine avoidance + reputational risk reduction vs. governance program cost. Governance maturity self-assessment: annual assessment against a governance maturity model (Level 1-5), published maturity model from IEEE or NIST. Benchmarking: compare against peer organizations through industry working groups (Partnership on AI, BSA). Case study: Mastercard's AI governance program reports an 80% reduction in AI-related regulatory inquiries following governance program implementation — quantified as $15M in avoided legal and compliance costs annually.", "order_index": 5 },
      { "title": "6.7 Module 6 Assessment: AI Governance Program Design", "description": "Design the complete AI governance program for a Series B fintech with 50 ML engineers, 30 production AI systems, and upcoming EU market entry. Define operating model, policy library (5 core policies), governance technology stack, AIA process with stakeholder roles, third-party AI vendor assessment process, board reporting structure, and 18-month program buildout roadmap with quarterly milestones and budget.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "Why do most mature enterprises use a hybrid AI governance operating model rather than fully centralized or federated?", "scenario_context": "Designing governance structure for a company with 200 AI systems across 8 business units.", "options": ["Hybrid is required by regulation", "Centralized provides control but creates bottlenecks at scale; federated provides scalability but risks inconsistency. Hybrid captures both benefits: central team sets standards, conducts high-risk reviews, and provides tools; business units own day-to-day governance — achieving both control and scalability", "It distributes governance costs across business units", "Hybrid is easier to implement than pure models"], "correct_answer_index": 1, "explanation": "At 200 AI systems, a centralized team reviewing every deployment creates an approval bottleneck. At the same scale, purely federated governance produces inconsistent quality across units. The hybrid model solves both problems: central standards + distributed execution with escalation paths for high-risk cases." }
    ]
  },
  {
    "title": "Module 7: AI Fairness and Non-Discrimination — Law, Measurement, and Remediation",
    "description": "AI fairness is simultaneously a legal requirement and an ethical imperative. Disparate impact doctrine, intersectional fairness, fairness-accuracy tradeoffs, bias remediation techniques, and enforcement actions from the CFPB, EEOC, and EU.",
    "order_index": 6,
    "videos": [
      { "title": "7.1 Legal Framework: Disparate Impact Doctrine Applied to AI", "description": "The disparate impact doctrine (Griggs v. Duke Power, US Supreme Court, 1971) prohibits facially neutral practices that disproportionately harm protected groups without business necessity. Applied to AI: if an employment AI tool selects candidates from protected groups at a rate less than 80% of the highest-selected group (4/5ths rule), this constitutes prima facie disparate impact — the employer must demonstrate job-relatedness and business necessity. Domains where disparate impact doctrine applies to AI: employment (Title VII), credit (ECOA, Fair Housing Act), housing, and public accommodations. EU non-discrimination law: Article 21 EU Charter prohibits discrimination on grounds including race, sex, religion, and age — AI systems that produce discriminatory outcomes violate this regardless of intent. The direct discrimination vs. indirect discrimination distinction in EU law: direct (intentional discrimination based on protected attribute), indirect (neutral policy that disproportionately disadvantages a protected group — this is what disparate impact addresses). Case study: the HUD complaint against Facebook's housing ad targeting algorithm — using engagement optimization produced disparate impact in housing ad delivery.", "order_index": 0 },
      { "title": "7.2 Fairness Metrics: Technical Definitions and Legal Alignment", "description": "The impossibility theorem (Chouldechova, 2017; Kleinberg et al., 2016): you cannot simultaneously satisfy Demographic Parity, Equalized Odds, and Calibration when base rates differ across groups — governance professionals must understand this and make explicit tradeoffs. Metric definitions: Demographic Parity (equal positive prediction rates regardless of group membership), Equalized Odds (equal true positive rates AND equal false positive rates across groups), Predictive Parity/Calibration (equal positive predictive value across groups — a 70% confidence score means 70% for all groups), Individual Fairness (similar individuals receive similar predictions). Legal alignment: US 4/5ths rule maps to Demographic Parity for employment; EU non-discrimination law aligns most closely with Equalized Odds; credit regulations focus on accuracy and error rates across groups aligning with Equalized Odds. The governance decision: which fairness metric is legally and ethically required for your specific use case — one size does not fit all. Case study: COMPAS recidivism — ProPublica applied Equalized Odds, finding disparate false positive rates; Northpointe (vendor) applied Calibration, finding equal accuracy. Both correct; the choice of metric reflects value judgments.", "order_index": 1 },
      { "title": "7.3 Intersectional Fairness: Beyond Single-Dimension Analysis", "description": "Traditional fairness analysis examines one protected attribute at a time — this misses intersectional harms affecting people at the intersection of multiple protected groups. Intersectionality (Kimberlé Crenshaw, 1989): legal and social frameworks that consider how different aspects of identity overlap and interact to create unique forms of discrimination. Applied to AI: a hiring model may appear fair when examining gender and race separately but systematically disadvantage Black women — a pattern only visible when analyzing the intersection. Technical challenge: intersectional analysis requires sufficient data at each intersection — small group sizes produce unreliable statistics. Approaches: Constrained optimization (impose fairness constraints at all intersections), Multiaccuracy (Hébert-Johnson et al., 2018) — model predictions must be calibrated for every identifiable subgroup. Documentation requirement: the EU AI Act's fundamental rights impact assessment must consider intersectional harms. Case study: Amazon's facial recognition system Rekognition showed error rates of 0.8% for light-skinned men, 12.5% for dark-skinned women — a pattern invisible without intersectional analysis.", "order_index": 2 },
      { "title": "7.4 Bias Sources and Remediation Techniques", "description": "Bias enters AI systems at every lifecycle stage. Pre-processing bias (in training data): historical bias (data reflects past discrimination), sampling bias (underrepresentation of minority groups), label bias (human labels encode human biases). Pre-processing remediation: resampling (oversample underrepresented groups), reweighting (assign higher weight to minority group examples), relabeling (human review of labels for minority group examples). In-processing bias (in model training): constraint optimization (add fairness constraints to the loss function — Fairlearn, AI Fairness 360 in-processing algorithms), adversarial debiasing (train a discriminator to predict protected attribute; train model to fool discriminator while maintaining accuracy). Post-processing bias (in predictions): threshold optimization (different classification thresholds per group to equalize error rates), calibration (Platt scaling to ensure equal calibration across groups). The bias-accuracy tradeoff: all remediation techniques reduce accuracy — the governance question is how much accuracy loss is acceptable to achieve fairness. Case study: LinkedIn's job recommendation model reduced gender disparity in job recommendations by 30% using in-processing fairness constraints with under 2% accuracy reduction.", "order_index": 3 },
      { "title": "7.5 Enforcement Actions: Regulatory Cases and Consent Orders", "description": "Regulatory enforcement actions for AI discrimination are accelerating. CFPB enforcement: Upstart Network (2023) examination found no disparate impact in their AI underwriting model — demonstrating that proactive bias auditing can withstand regulatory scrutiny; Apple Card (2019) investigated for gender discrimination in credit limit setting after viral reports of disparate treatment. EEOC enforcement: guidance on AI and algorithmic bias in employment (2022) — employers responsible for AI tools used for employment decisions regardless of whether developed internally or by vendor. HUD enforcement: Facebook housing ad algorithm consent order (2022) — Facebook prohibited from using race, color, religion, sex, disability, familial status, or national origin in targeting housing ads. EU national enforcement: German Federal Anti-Discrimination Agency has opened investigations into algorithmic discrimination in credit and insurance. Governance implication: proactive bias auditing, documented remediation, and ongoing monitoring is the legal defense — regulators look for good faith compliance effort. Case study: Rocket Mortgage self-reported a fair lending issue discovered through internal audit, cooperated with HUD, and avoided significant penalty — demonstrating that self-governance and voluntary disclosure reduces regulatory liability.", "order_index": 4 },
      { "title": "7.6 Fairness in Generative AI: Content Moderation and Representation", "description": "Generative AI systems have fairness dimensions beyond traditional ML model bias. Representation bias in generative models: early image generation models (DALL-E 2, Midjourney) defaulted to Western, white, male representations for neutral prompts — systematic underrepresentation of diverse groups. Measurement: CLIP-based gender and race classifiers applied to large prompt samples to quantify demographic distribution. Content moderation bias: AI content moderation systems may over-censor content from minority communities (African-American English flagged as toxic at higher rates than Standard American English) or under-moderate hate speech targeting minority groups. Stereotype reinforcement: LLMs trained on internet text encode and may amplify societal stereotypes — word embedding bias tests reveal that 'doctor' associates more with male pronouns than female. Remediation for generative AI: targeted data augmentation in pre-training (curated diverse representation), instruction tuning and RLHF with fairness-focused human evaluators, system prompt constraints for enterprise deployments. Case study: Stable Diffusion documentation acknowledges that the model produces biased outputs and documents the bias evaluation methodology used.", "order_index": 5 },
      { "title": "7.7 Module 7 Assessment: Fairness Audit and Remediation Plan", "description": "Conduct a complete fairness audit of a provided employment screening AI system: select appropriate fairness metrics with legal rationale, compute metrics from provided outcome data, identify disparate impact findings that exceed legal thresholds, apply three bias remediation techniques and evaluate effectiveness, document residual risk, and write the compliance report for the EEOC annual review including the business necessity justification for any remaining disparities.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "Why is it impossible to simultaneously satisfy Demographic Parity, Equalized Odds, and Calibration?", "scenario_context": "Selecting fairness metrics for a recidivism risk assessment tool.", "options": ["The metrics require different data types", "When base rates differ across groups (one group has higher actual recidivism), satisfying all three simultaneously is mathematically impossible. Governance requires an explicit choice aligned with legal and ethical priorities for the specific use case — no universal correct answer exists.", "The metrics conflict only for large datasets", "Technical limitations prevent simultaneous calculation"], "correct_answer_index": 1, "explanation": "The impossibility theorem is a governance decision — not a technical limitation. Choosing Equalized Odds (equal error rates across groups) optimizes for equal treatment in errors. Choosing Calibration (equal accuracy across groups) optimizes for equal predictive reliability. The choice reflects which type of fairness is legally required and ethically prioritized for the specific deployment context." }
    ]
  },
  {
    "title": "Module 8: AI Accountability and Human Oversight — Implementation and Systems Design",
    "description": "Accountability ensures someone is responsible when AI systems cause harm. Human-in-the-loop design, meaningful oversight vs. rubber stamping, accountability attribution in complex AI systems, and oversight mechanisms for autonomous AI agents.",
    "order_index": 7,
    "videos": [
      { "title": "8.1 The Accountability Gap in AI: Why Traditional Frameworks Fail", "description": "Traditional accountability frameworks assume a clear chain from action to responsible actor. AI systems create accountability gaps: the algorithm gap (algorithmic processes that are too complex for human understanding — can you be accountable for what you don't understand?), the many hands problem (multiple actors contribute to AI system development and deployment — no single responsible party), the distributed nature gap (AI decisions aggregate into outcomes — individual decisions don't have clear attributable impact), and the temporal gap (accountability for decisions made today may only become clear years later as consequences unfold). The governance response: design accountability systems that close these gaps — clear ownership assignment, audit trails enabling retrospective accountability, human oversight that is genuinely meaningful rather than performative. Case study: the 2010 Flash Crash was caused by automated trading algorithms — a Congressional investigation spent 18 months determining accountability, ultimately finding it distributed across multiple actors. AI governance must pre-define accountability before incidents, not determine it afterward.", "order_index": 0 },
      { "title": "8.2 Human-in-the-Loop Design: Meaningful Oversight vs. Rubber Stamping", "description": "EU AI Act Article 14 requires human oversight for high-risk AI — but human presence without meaningful ability to intervene is compliance theater. Criteria for meaningful human oversight: comprehension (the human understands enough to make an informed decision), authority (the human has actual authority to override or reject the AI recommendation), accountability (the human is accountable for the outcome regardless of the AI recommendation), time adequacy (sufficient time allocated for genuine review, not rubber stamping), calibration (training to avoid automation bias — the tendency to accept AI recommendations without sufficient scrutiny). Automation bias research: Skitka et al. (1999) found that humans follow automated recommendations even when they contradict clear evidence — simply having a human in the loop is insufficient. System design for meaningful oversight: present confidence scores and explanation alongside recommendations, design interfaces that highlight edge cases requiring attention, implement mandatory review time minimums, track human override rates and audit when override rate drops to near zero. Case study: Epic's sepsis prediction model was deployed at several hospitals where the alert override rate reached 97% — indicating automation bias, not meaningful oversight.", "order_index": 1 },
      { "title": "8.3 Accountability Assignment: Roles, Responsibilities, and RACI", "description": "Clear pre-assignment of accountability for AI system outcomes is the foundation of an effective governance program. The AI accountability RACI: Responsible (AI development team — builds and tests the system), Accountable (business owner — ultimately answers for outcomes), Consulted (AI governance team, legal, compliance — review before deployment), Informed (affected stakeholders, users, impacted communities). Accountability for specific failure types: training data bias (data team and governance team), model accuracy failure (ML engineering team), deployment decision failure (business owner), third-party component failure (vendor management and business owner). The accountability chain documentation: for every production AI system, a document specifying who is accountable for each failure category with named individuals (not just roles). Accountability in multi-model systems: when a cascade of 5 models produces a harmful outcome, accountability must be pre-assigned to avoid the distributed accountability diffusion problem. Case study: after Uber's autonomous vehicle fatality (2018), the operator in the vehicle, Uber's development team, and Uber's safety team all had unclear accountability — the NTSB investigation spent 2 years determining responsibility.", "order_index": 2 },
      { "title": "8.4 Oversight for AI Agents: Control Problems in Autonomous Systems", "description": "AI agents that take real-world actions — browsing the web, executing code, sending emails, making purchases — require oversight mechanisms not needed for predictive models. Oversight requirements for agentic AI: pre-execution review (for irreversible or high-impact actions, show the proposed action and require approval), post-execution monitoring (log all actions with ability to review and flag anomalous behavior), scope limitation (define clear action boundaries — an email drafting agent should not have access to send emails without approval), and interrupt capability (human can pause the agent at any point). The control problem in practice: as agents become more capable and faster, meaningful human oversight requires both better tools and more conservative scope definitions. Rate limiting for agents: limit actions per time period to keep human oversight feasible. Audit trail requirements for agents: every action taken must be logged with the triggering instruction, the agent's reasoning, and the action taken — necessary for accountability and debugging. Case study: the 2023 AutoGPT experiments showed that uncontrolled agents would take unexpected actions including accessing unauthorized resources and taking actions outside their stated scope.", "order_index": 3 },
      { "title": "8.5 Audit Trails and Recordkeeping for AI Accountability", "description": "An audit trail is the technical foundation of accountability — without it, accountability is aspirational rather than operational. AI audit trail requirements: prediction inputs (the exact feature values the model used to make a prediction), model version (which version of the model made the prediction), prediction outputs (the model's recommendation and confidence), human decision (what decision the human made and any override reasoning), outcome (what actually happened — collected later for model evaluation and accountability). Immutable audit storage: WORM (Write Once Read Many) storage prevents tampering — AWS S3 Object Lock, Azure Immutable Blob Storage. Retention requirements: EU AI Act requires operation logs for minimum 6 months for high-risk AI; financial services regulations often require 7 years; healthcare may require the lifetime of the patient. Query capabilities: regulatory investigators and legal discovery require the ability to retrieve all predictions made for a specific individual on a specific date — audit trail schema and indexing must support this. Case study: Goldman Sachs' Marcus personal loan AI maintains 7-year audit trails for all credit decisions — enabling reconstruction of any decision for regulatory inquiry or customer dispute resolution.", "order_index": 4 },
      { "title": "8.6 Accountability in Procurement: Vendor Contracts and SLAs for AI", "description": "When enterprises procure AI systems, accountability must be contractually established before deployment. AI vendor contract requirements: performance SLAs (accuracy, availability, latency — with remedies for breach), fairness warranties (vendor represents model meets fairness standards, provides audit rights), indemnification (who is responsible for regulatory fines arising from AI system failures — commonly contested), audit rights (enterprise right to conduct bias audits and review test results), model change notification (vendor must notify of model updates that may affect performance or fairness with advance notice), data processing agreements (GDPR DPA for any personal data processed by vendor AI). Open-source AI governance: using open-source models does not transfer liability — enterprises deploying open-source models assume full responsibility for governance. The contractual accountability gap: many AI vendors disclaim all warranties for AI system performance — governance professionals must negotiate hard on accountability terms. Case study: a large bank's contract with an AI credit scoring vendor includes quarterly bias audit rights, 30-day change notification requirements, and joint liability for regulatory penalties arising from model failures.", "order_index": 5 },
      { "title": "8.7 Module 8 Assessment: Accountability Architecture Design", "description": "Design the complete accountability architecture for a healthcare AI system that provides diagnostic recommendations to physicians: meaningful oversight design (what information, time allocation, interface design ensures genuine physician review), accountability RACI for five failure categories, audit trail schema with retention requirements, agent control mechanisms if the AI also places orders, vendor contract requirements for the AI diagnostic vendor, and accountability chain documentation template.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "What distinguishes meaningful human oversight from rubber stamping in AI governance?", "scenario_context": "Designing the human review process for an AI-assisted loan approval system.", "options": ["Having a human present at all decisions", "The human has comprehension of the AI recommendation, genuine authority to override, accountability for outcomes, adequate time for review, and calibration against automation bias — all five criteria must be met for oversight to be meaningful rather than performative compliance", "Requiring human approval for all automated decisions", "Having two humans review each decision"], "correct_answer_index": 1, "explanation": "Automation bias research shows humans follow AI recommendations even when they contradict clear evidence. Simply requiring human sign-off creates accountability theater — the human approves without genuine review. Meaningful oversight requires system design that actively supports calibrated human judgment: explanations, confidence scores, flagged edge cases, adequate review time, and accountability for decisions regardless of AI recommendation." }
    ]
  },
  {
    "title": "Module 9: AI Governance in Regulated Industries — Finance, Healthcare, and Critical Infrastructure",
    "description": "Regulated industries face sector-specific AI governance requirements on top of general frameworks. AI governance for financial services, healthcare AI under FDA, AI in critical infrastructure, and how leading regulated enterprises have built governance programs.",
    "order_index": 8,
    "videos": [
      { "title": "9.1 AI in Financial Services: SR 11-7, Model Risk Management, and CFPB Guidance", "description": "Financial services AI is governed by the most mature regulatory framework for algorithmic systems. SR 11-7 (Federal Reserve, 2011): supervisory guidance on model risk management — requires model validation (independent review of model development), model inventory (register of all models with risk ratings), ongoing monitoring (model performance tracking), and governance documentation. Model risk management applied to ML: the SR 11-7 framework was written for statistical models and requires interpretation for ML — the Federal Reserve has issued additional guidance but significant ambiguity remains. OCC, FDIC, and Federal Reserve joint guidance (2021): principles for climate-related financial risk management (AI models used for climate risk assessment must meet model risk management standards). CFPB Circular 2022-03: applies existing fair lending laws to algorithmic credit decisions — creditors must provide specific reasons for adverse action even when using complex ML models. Case study: JP Morgan's Model Risk Management function reviews 1,200+ ML models annually — each model has an assigned validator and undergoes annual validation regardless of risk rating.", "order_index": 0 },
      { "title": "9.2 Healthcare AI: FDA Regulation of SaMD and Clinical Decision Support", "description": "The FDA regulates AI as Software as a Medical Device (SaMD) when software intended to diagnose, treat, cure, mitigate, or prevent disease meets the device definition. Regulatory pathways: 510(k) clearance (most common — demonstrate substantial equivalence to a predicate device), De Novo (for novel device types with moderate risk), PMA (Pre-Market Approval — highest risk devices like AI replacing physician judgment). FDA's AI/ML Action Plan (2021): adaptive AI — software that continues to learn after deployment creates challenges for traditional clearance pathways; proposed predetermined change control plan (PCCP) allowing post-market updates within pre-approved bounds. Clinical decision support (CDS) distinction: CDS software that is NOT SaMD (not regulated): software that provides information that a clinician uses to make a decision (with their own independent review). Clinical AI in practice: most production clinical AI is designed as CDS rather than SaMD to avoid FDA regulation — the physician makes the final decision with AI recommendation as input. Case study: Viz.ai's FDA-cleared AI that detects large vessel occlusion strokes on CT scans and pages interventional neurology directly — cleared as SaMD because it drives direct clinical action.", "order_index": 1 },
      { "title": "9.3 AI in Critical Infrastructure: NERC CIP, CISA, and Operational Technology Security", "description": "AI systems integrated with critical infrastructure (power grids, water systems, transportation) face the highest-consequence failure scenarios. NERC CIP (Critical Infrastructure Protection) standards apply to the North American bulk electric system — AI systems used for grid management must meet CIP requirements for cybersecurity, access control, and incident response. CISA AI security guidance (2023): critical infrastructure owners should implement NIST AI RMF for AI systems with safety and security implications, conduct red team testing for adversarial robustness, and maintain human override capability for all AI-driven automated actions. Operational Technology (OT) AI governance: OT environments have different security postures than IT (air-gapped systems, legacy hardware, safety-critical requirements) — AI governance must account for OT constraints. The safety case approach: for safety-critical AI, document the complete safety argument (claim → evidence → inference) demonstrating the system is acceptably safe. Case study: Pacific Gas and Electric deployed AI for wildfire risk prediction to inform power shutoff decisions — governance required reliability analysis, human override protocols, and CPUC regulatory approval.", "order_index": 2 },
      { "title": "9.4 Insurance and AI: Underwriting Algorithms, Pricing, and State Regulation", "description": "Insurance AI governance operates under a complex state-by-state regulatory patchwork in the US. Rate and form filings: AI-based pricing models must be filed with state insurance regulators in most states — the model is reviewed for actuarial soundness and non-discriminatory pricing. Proxy discrimination in insurance: factors correlated with protected attributes (zip code correlating with race, credit score correlating with socioeconomic status and race) are prohibited as proxies in some states. Colorado SB 21-169 (2021): prohibits use of external consumer data that results in unfair discrimination in insurance — requires annual bias audit for life insurance AI. NAIC (National Association of Insurance Commissioners) model bulletin (2023): all states encouraged to adopt AI use disclosure requirements and bias testing. Explainability in insurance: applicants denied coverage or charged higher rates must receive adverse action notice explaining specific factors — complex ML models must be explainable enough to produce this notice. Case study: Farmers Insurance's AI-based homeowner pricing model came under California DOI scrutiny for using factors that proxied for race — governance required demonstrating causal rather than correlational actuarial justification.", "order_index": 3 },
      { "title": "9.5 AI Governance for Public Sector and Government AI", "description": "Government AI deployments have special governance obligations because they affect citizens' rights and access to public services. Legal constraints: government AI decisions affecting individual rights (benefits, enforcement, housing) may trigger due process requirements (notice, opportunity to respond, right to human review). Transparency requirements: FOIA applies to government AI systems — algorithms used in government decisions are increasingly subject to public records requests. US Algorithmic Accountability Act (proposed): would require federal agencies to conduct impact assessments for automated systems used in critical decisions affecting the public. Canada's Directive on Automated Decision-Making: requires AIAs for government AI with a risk-tiered compliance framework — Level 4 (highest risk: AI making decisions affecting fundamental rights) requires senior deputy head approval, independent verification, and human decision-maker sign-off. The democratic accountability challenge: elected officials are accountable for government decisions — when government AI makes decisions, accountability must flow back to elected officials through governance chains. Case study: the Netherlands' child benefits fraud detection algorithm (SyRI) was ruled illegal by Dutch courts for violating human rights — the system's risk scores flagged primarily immigrant families for fraud investigation without adequate transparency or appeal mechanisms.", "order_index": 4 },
      { "title": "9.6 Emerging Sector Challenges: Autonomous Vehicles, Hiring AI, and Education Technology", "description": "Three sectors with rapidly evolving AI governance requirements. Autonomous vehicles: SAE Levels 0-5 autonomy, NHTSA AV guidance (voluntary in US vs. type approval in EU), safety case documentation, black box data recorders (NHTSA requires EDR for AV), liability for AV collisions (40+ states have passed AV liability legislation). Hiring AI: proliferating state and city laws — NYC Local Law 144 (annual bias audit with public results), Illinois AEDT Act (disclosure of AI use in hiring to candidates), Maryland and California similar legislation pending. The governance requirement: proactively conduct bias audits before laws take effect, disclose AI use to candidates, provide human review option. Education technology: FERPA (student data privacy), COPPA (children's data), emerging legislation on AI tutoring and assessment — California AB 2843 (2024) requires EdTech companies to disclose AI systems and their use. The common governance thread: proactive transparency, bias auditing, human oversight, and appeal mechanisms are required in every regulated sector.", "order_index": 5 },
      { "title": "9.7 Module 9 Assessment: Sector-Specific Governance Plan", "description": "Develop the AI governance plan for a healthcare fintech company launching an AI-powered medical credit product (financing for healthcare expenses, incorporating medical history as a factor). Map applicable regulations (CFPB ECOA/adverse action, FDA CDS vs. SaMD analysis, state insurance regulations, HIPAA for medical data). Design the governance framework for a system at the intersection of financial services, healthcare, and AI regulations. Identify the most restrictive requirements and design a unified compliance architecture.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "Why do most clinical AI products target the CDS (Clinical Decision Support) classification rather than FDA SaMD clearance?", "scenario_context": "Deciding regulatory strategy for a new AI diagnostic tool.", "options": ["CDS products are more accurate", "CDS software used as a tool supporting clinician judgment (rather than replacing it) is not regulated as a medical device — avoiding the 12-18 month FDA clearance process while still deploying AI in clinical settings. The tradeoff: less regulatory burden but also less regulatory validation of safety and effectiveness.", "FDA clearance provides no benefit", "SaMD requires hardware components"], "correct_answer_index": 1, "explanation": "The FDA SaMD pathway (510(k), De Novo, PMA) provides regulatory validation of safety and effectiveness but requires 12-18 months and significant documentation. CDS classification (software providing information for clinician review) avoids FDA jurisdiction when the clinician retains independent judgment. Most clinical AI takes the CDS path — governance responsibility shifts to the deploying institution." }
    ]
  },
  {
    "title": "Module 10: AI Governance Career — Leadership, Strategy, and the Future of the Field",
    "description": "AI governance is one of the fastest-growing professional disciplines. Career paths from practitioner to Chief AI Ethics Officer, building governance influence without authority, the future of AI governance as a field, and your 5-year career roadmap.",
    "order_index": 9,
    "videos": [
      { "title": "10.1 The AI Governance Profession: Roles, Titles, and Organizational Positioning", "description": "AI governance as a distinct profession emerged between 2018-2022, accelerated by GDPR enforcement and the proliferation of AI ethics incidents. Current role landscape: AI Ethics Manager (operational, focuses on AIA process, bias auditing), AI Governance Engineer (technical, implements monitoring and compliance infrastructure), AI Policy Specialist (regulatory, monitors and interprets regulations), Chief AI Ethics Officer or VP of Responsible AI (executive, sets strategy, represents company externally). Organizational positioning varies: within Legal (compliance-focused, conservative risk appetite), within CTO (technical-focused, closer to product decisions), independent office reporting to CEO (highest authority, rarest, seen at IBM and Microsoft). The governance professional's core competencies: regulatory literacy, technical fluency (sufficient to evaluate AI governance claims), stakeholder communication (translate between technical and executive), and risk analysis. Career path: 3-5 years in a technical or policy role → AI governance specialist → manager → director → VP/Chief. Case study: LinkedIn's AI Governance team of 15 sits within the Trust & Safety organization — providing both internal consulting and external transparency reporting.", "order_index": 0 },
      { "title": "10.2 Influencing Without Authority: The Governance Professional's Core Skill", "description": "AI governance professionals often have oversight authority without direct control over AI development decisions — influence is the primary tool. Influence strategies: building credibility (demonstrate deep technical and regulatory knowledge — governance advice only works if it's trusted as accurate), building relationships (the governance professional who participates in product design from the start has far more influence than one who shows up for final review), framing (present governance requirements as quality metrics and risk reduction, not as bureaucratic hurdles), providing tools (make governance easy — teams that have good tools comply without friction), and escalation paths (know when and how to escalate to the governance committee or executive sponsor). The governance professional's political toolkit: regulatory citations (nobody wants to be the person who ignored the regulation), incident case studies (concrete failures motivate governance investment), and ROI framing (governance prevents costs that exceed its investment). The governance credibility cycle: governance professional prevents a significant incident → executive visibility → more authority → better governance. Case study: Salesforce's Chief Ethical and Humane Use Officer Paula Goldman describes a philosophy of 'ethical business, not business prevention' — framing that has enabled significant governance influence.", "order_index": 1 },
      { "title": "10.3 Building an AI Governance Center of Excellence", "description": "A Center of Excellence (CoE) provides shared governance capabilities that individual business units cannot maintain independently. AI Governance CoE services: AIA facilitation (CoE team leads the assessment process), bias audit capability (CoE maintains bias testing infrastructure and expertise), policy library management (CoE maintains and updates policy library with regulatory tracking), training and certification (CoE develops and delivers AI governance training for ML engineers and product managers), regulatory intelligence (CoE monitors regulatory developments and translates implications for business units). CoE governance: advisory board of business unit representatives ensures CoE remains relevant and accessible. CoE metrics: AIAs completed per month, average AIA cycle time, incidents involving AI systems with completed AIAs vs. without (incident prevention), governance training completion rates, and regulatory compliance scores. Funding model: chargeback (business units fund CoE services through project budgets), central funding (executive office funds as shared infrastructure), or hybrid. Case study: Deloitte's Trustworthy AI CoE provides AI governance services to 500+ client organizations — their internal model has been commercialized as advisory services.", "order_index": 2 },
      { "title": "10.4 AI Governance Strategy: 3-Year Roadmap Development", "description": "Strategic AI governance programs require multi-year planning aligned with regulatory timelines and organizational maturity. Governance maturity assessment: baseline against a governance maturity model (Level 1: reactive, Level 3: systematic, Level 5: optimized). Gap analysis: identify gaps against current regulatory requirements, anticipated regulatory requirements (EU AI Act 2026, state laws 2024-2025), and best practice benchmarks (Microsoft, IBM standards). Roadmap structure: Year 1 (foundation) — governance policy library, AIA process, basic monitoring; Year 2 (systematization) — automated compliance workflows, bias audit program, GRC platform; Year 3 (optimization) — predictive governance (identify risks before they're regulatory requirements), advanced monitoring, external transparency reporting. Governance investment prioritization: risk-adjusted priority (regulatory requirements with enforcement × probability of violation × fine magnitude), business value (governance enabling new AI use cases), and stakeholder trust (governance investments with reputational value). The governance business case: for each investment, document the regulatory risk reduced, incidents prevented (with monetary value), and business value enabled (governance as competitive differentiator). Case study: Apple's Privacy Engineering team built a 5-year roadmap that made privacy a competitive differentiator — the governance investment became a product marketing advantage.", "order_index": 3 },
      { "title": "10.5 The Future of AI Governance: AGI, Autonomous Systems, and Governance at Scale", "description": "AI governance as a field is evolving rapidly to address increasingly capable AI systems. Near-term governance challenges (2025-2027): agentic AI oversight (how do you govern AI agents that take thousands of actions per day?), foundation model governance (regulating base models that power thousands of downstream applications), and AI-generated disinformation at scale. Medium-term challenges (2027-2030): governance for increasingly autonomous AI systems, multi-agent coordination governance (AI systems negotiating with each other), AI in high-stakes decision chains with minimal human involvement. The AGI governance question: what governance frameworks are needed for AI systems that match or exceed human performance across many domains? Frontier AI governance initiatives: Frontier Model Forum (Anthropic, Google, Microsoft, OpenAI safety research consortium), AI Safety Institute (UK and US), international AI governance discussions at UN level. The governance professional's opportunity: governance for increasingly capable AI is the highest-leverage role in the field — the governance architecture designed today shapes AI development trajectories for decades.", "order_index": 4 },
      { "title": "10.6 Certifications, Education, and Professional Development", "description": "AI governance is building its professional infrastructure. Current certifications: CIPP/E (IAPP Certified Information Privacy Professional — Europe, highly relevant for GDPR/EU AI Act compliance), CIPT (Certified Information Privacy Technologist — technical privacy for AI engineers), IEEE Certified Ethicist (early stage, limited recognition), ISACA CGEIT (Governance of Enterprise IT — applicable to AI governance with adaptation). Emerging certifications: IAPP is developing an AI governance certification expected in 2025, NIST is developing AI RMF practitioner credentials. Academic programs: CMU's AI Ethics and Policy program, Oxford Internet Institute AI governance programs, Georgetown University AI governance certificate. Professional associations: IAPP (International Association of Privacy Professionals — largest community), Partnership on AI (multi-stakeholder), Montreal AI Ethics Institute (research community). Building your governance portfolio: document AIAs you've conducted, bias audits you've led, policies you've authored, and governance incidents you've managed — the portfolio is more valuable than certifications for senior roles. Case study: the demand for CIPP/E certification holders grew 300% between 2018-2023 as GDPR enforcement accelerated — AI governance credentials are expected to show similar growth with EU AI Act enforcement.", "order_index": 5 },
      { "title": "10.7 Final Capstone: AI Governance Strategy Presentation", "description": "Design and present the 3-year AI governance strategy for a global technology company with 100 production AI systems, 5,000 employees in 20 countries, and upcoming EU AI Act compliance deadlines. Deliverable: executive presentation (10 slides) covering current governance maturity assessment, regulatory compliance gap analysis (EU AI Act, GDPR intersection, sector-specific regulations), proposed governance operating model, 3-year roadmap with quarterly milestones, budget with ROI justification, and first 90-day quick wins. Present as the incoming Chief AI Ethics Officer addressing the Board of Directors.", "order_index": 6 }
    ],
    "endQuizQuestions": [
      { "question_text": "What is the most effective framing for AI governance when presenting to product and engineering teams?", "scenario_context": "Building governance culture among ML engineers who see governance as a blocker.", "options": ["Emphasize regulatory compliance requirements", "Frame governance as quality engineering and risk reduction — governance identifies problems before they become incidents, prevents regulatory fines, and enables AI deployments that would otherwise be blocked by risk concerns. 'Ethical business, not business prevention' (Salesforce) creates partnership rather than adversarial relationship.", "Explain the ethical principles in detail", "Cite enforcement actions against competitors"], "correct_answer_index": 1, "explanation": "Engineers respond to quality and risk frameworks. Governance-as-quality positions the governance professional as a partner improving the product rather than a compliance officer blocking development. Regulatory citations alone create resentment; incident case studies create anxiety; quality framing creates alignment. The most effective governance professionals are seen as enabling faster, safer deployment." }
    ]
  }
]
};
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: existingCourse } = await supabase.from("courses").select("id").eq("title", courseData.title).maybeSingle();
    if (existingCourse) {
      await supabase.from("courses").delete().eq("id", existingCourse.id);
    }
    const { data: course, error: courseError } = await supabase.from("courses").insert({
      title: courseData.title, description: courseData.description, is_published: true, translations: courseData.translations,
    }).select().single();
    if (courseError) throw courseError;
    for (const chapterData of courseData.chapters) {
      const { data: chapter, error: chapterError } = await supabase.from("chapters").insert({
        course_id: course.id, title: chapterData.title, description: chapterData.description, order_index: chapterData.order_index, translations: {},
      }).select().single();
      if (chapterError) throw chapterError;
      for (const videoData of chapterData.videos) {
        const videoTranslations = { en: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") }, es: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") }, fr: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") }, de: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") }, zh: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") }, ar: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") }, ja: { title: videoData.title, transcript: videoData.lessonScript.mainPoints.join("\n\n") } };
        const { data: video, error: videoError } = await supabase.from("videos").insert({ chapter_id: chapter.id, title: videoData.title, description: videoData.description, order_index: videoData.order_index, translations: videoTranslations }).select().single();
        if (videoError) throw videoError;
        const { data: quiz, error: quizError } = await supabase.from("quizzes").insert({ video_id: video.id, chapter_id: chapter.id, quiz_type: "mini_video", passing_score: 85 }).select().single();
        if (quizError) throw quizError;
        for (let i = 0; i < videoData.questions.length; i++) {
          const q = videoData.questions[i];
          await supabase.from("quiz_questions").insert({ quiz_id: quiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
        }
      }
      const { data: endQuiz, error: endQuizError } = await supabase.from("quizzes").insert({ chapter_id: chapter.id, quiz_type: "chapter_end", passing_score: 85 }).select().single();
      if (endQuizError) throw endQuizError;
      for (let i = 0; i < chapterData.endQuizQuestions.length; i++) {
        const q = chapterData.endQuizQuestions[i];
        await supabase.from("quiz_questions").insert({ quiz_id: endQuiz.id, question_text: q.question_text, scenario_context: q.scenario_context, options: q.options, correct_answer_index: q.correct_answer_index, explanation: q.explanation, order_index: i });
      }
    }
    return new Response(JSON.stringify({ message: "AI Governance Professional — rich version seeded", courseId: course.id }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});

