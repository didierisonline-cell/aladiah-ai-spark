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

