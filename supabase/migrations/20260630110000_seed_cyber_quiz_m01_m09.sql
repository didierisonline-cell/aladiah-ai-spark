-- =============================================================
-- Aladiah Academy — AI Cybersecurity, Governance & Enterprise Compliance
-- Quiz questions: Modules 01–09  (15 questions × 9 modules = 135 total)
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
  -- MODULE 01 — Cybersecurity Foundations: CIA Triad & Zero Trust
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 0;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'Which CIA Triad property ensures that sensitive data is accessible only to authorized individuals?',
   '["Availability","Integrity","Confidentiality","Authentication"]'::jsonb, 2,
   'Confidentiality prevents unauthorized disclosure of information. It is enforced through encryption, access controls, and data classification policies.'),

  (v_qid, 'An attacker intercepts payroll data in transit and changes salary figures before they reach HR. Which CIA property is violated?',
   '["Confidentiality","Integrity","Availability","Non-repudiation"]'::jsonb, 1,
   'Integrity ensures data is accurate and unmodified. Tampering with data in transit violates integrity, which is protected by hashing, digital signatures, and TLS.'),

  (v_qid, 'A ransomware attack encrypts all files on a hospital''s systems, making patient records inaccessible for 72 hours. Which CIA property is primarily impacted?',
   '["Confidentiality","Integrity","Availability","Authentication"]'::jsonb, 2,
   'Availability ensures systems and data are accessible when needed. Ransomware is a direct availability attack; the CIA impact is loss of access, not data disclosure or modification.'),

  (v_qid, 'What is the foundational principle of Zero Trust Architecture?',
   '["All internal traffic is trusted by default","Never trust, always verify — regardless of network location","VPN access grants implicit trust","Perimeter firewalls eliminate the need for internal controls"]'::jsonb, 1,
   'Zero Trust rejects the traditional castle-and-moat model. Every request — regardless of origin — must be authenticated, authorized, and continuously validated before access is granted.'),

  (v_qid, 'NIST SP 800-207 defines Zero Trust across several pillars. Which of the following is NOT one of the core Zero Trust pillars?',
   '["Identity","Device","Network / Environment","Incident Response"]'::jsonb, 3,
   'NIST 800-207 identifies pillars including Identity, Devices, Networks, Applications & Workloads, and Data. Incident Response is a process discipline, not a Zero Trust architectural pillar.'),

  (v_qid, 'Microsegmentation is a key Zero Trust network control. What does it primarily achieve?',
   '["It replaces VPN for remote access","It limits lateral movement by dividing the network into granular zones","It performs deep-packet inspection at the perimeter","It automates patch management across endpoints"]'::jsonb, 1,
   'Microsegmentation creates fine-grained network zones so that a compromised workload cannot freely communicate with other systems. This directly limits attacker lateral movement after initial compromise.'),

  (v_qid, 'NIST Cybersecurity Framework 2.0 added a sixth function to the original five (Identify, Protect, Detect, Respond, Recover). What is it?',
   '["Audit","Govern","Monitor","Comply"]'::jsonb, 1,
   'CSF 2.0 (released February 2024) added Govern as the sixth function, elevating cybersecurity governance — roles, policies, strategy — to a first-class framework concern alongside the original five operational functions.'),

  (v_qid, 'What does the FAIR (Factor Analysis of Information Risk) model primarily provide?',
   '["A qualitative heat-map scale for risk scoring","A quantitative financial model for calculating cyber risk in monetary terms","A checklist of security controls for compliance","A penetration testing methodology"]'::jsonb, 1,
   'FAIR enables organizations to express cyber risk as a financial figure (expected loss in dollars). It decomposes risk into Loss Event Frequency and Loss Magnitude, enabling ROI-based security investment decisions.'),

  (v_qid, 'Annual Loss Expectancy (ALE) is calculated as:',
   '["Asset Value × Threat Frequency","Single Loss Expectancy × Annualized Rate of Occurrence","Impact × Likelihood on a 5×5 scale","Total Cost of Ownership ÷ Control Effectiveness"]'::jsonb, 1,
   'ALE = SLE × ARO. Single Loss Expectancy (SLE) is the dollar loss per incident; Annualized Rate of Occurrence (ARO) is how often the event is expected per year. Together they give the expected annual financial exposure.'),

  (v_qid, 'The MITRE ATT&CK framework organizes adversary knowledge into Tactics, Techniques, and Procedures. What does a Tactic represent?',
   '["A specific exploit code targeting a CVE","The adversary''s high-level goal during an attack phase","A vendor product that detects the attack","A policy control mapped to a compliance standard"]'::jsonb, 1,
   'ATT&CK Tactics represent the why — the adversary''s high-level objective (e.g., Initial Access, Lateral Movement, Exfiltration). Techniques represent how the tactic is achieved; Procedures are specific real-world implementations.'),

  (v_qid, 'Defense in Depth (DiD) is best described as:',
   '["Relying on a single best-of-breed firewall for comprehensive protection","Layering multiple independent security controls so that failure of one does not compromise the whole","Encrypting data at rest as the primary security strategy","Running penetration tests quarterly to find vulnerabilities"]'::jsonb, 1,
   'DiD applies multiple overlapping controls across physical, network, host, application, and data layers. An attacker defeating one layer still faces additional barriers, reducing breach probability and impact.'),

  (v_qid, 'The Principle of Least Privilege (PoLP) states that users and processes should:',
   '["Have administrative rights to maximize productivity","Receive only the minimum permissions required to perform their specific job function","Share credentials across teams to improve collaboration","Have access to all systems they may potentially need in the future"]'::jsonb, 1,
   'PoLP minimizes the blast radius of credential compromise or insider threats. If a compromised account has only the permissions needed for its role, the attacker''s ability to escalate or pivot is significantly constrained.'),

  (v_qid, 'In the Cyber Kill Chain model, which phase occurs BEFORE weaponization?',
   '["Exploitation","Delivery","Reconnaissance","Installation"]'::jsonb, 2,
   'The Kill Chain phases are: Reconnaissance → Weaponization → Delivery → Exploitation → Installation → C2 → Actions on Objectives. Reconnaissance (gathering target intelligence) always precedes weaponization (building the exploit).'),

  (v_qid, 'A security control that detects and prevents an attack from succeeding — such as an IPS blocking a SQL injection attempt in real time — is classified as:',
   '["Compensating control","Corrective control","Preventive control","Detective control"]'::jsonb, 2,
   'Preventive controls stop an attack before it succeeds. Detective controls identify attacks after they occur. Corrective controls restore systems post-attack. Compensating controls substitute for a primary control that cannot be implemented.'),

  (v_qid, 'Which threat actor type is most associated with state-sponsored Advanced Persistent Threats (APTs) that maintain long-term, stealthy access to target networks?',
   '["Script kiddies using commodity malware","Hacktivists protesting corporate policies","Nation-state actors conducting cyber espionage","Organized crime groups focused on ransomware payouts"]'::jsonb, 2,
   'Nation-state APT groups (e.g., APT29/Cozy Bear, APT41) operate with significant resources, custom tooling, and objectives like intelligence gathering or pre-positioning for conflict. Their TTPs emphasize persistence and evasion over speed.');

  -- ============================================================
  -- MODULE 02 — Enterprise Security Operations: SOC, SIEM & XDR
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 1;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'In a tiered SOC model, what is the primary function of Tier 1 (L1) analysts?',
   '["Conducting advanced malware reverse engineering","Monitoring alert queues and triaging low-severity events for escalation","Performing threat hunting for unknown threats","Managing SIEM infrastructure and tuning detection rules"]'::jsonb, 1,
   'L1 analysts handle the highest volume of work: monitoring dashboards, triaging incoming alerts, performing initial investigation, and escalating confirmed or ambiguous incidents to L2. Speed and coverage are their primary metrics.'),

  (v_qid, 'A SIEM (Security Information and Event Management) system provides which two core capabilities?',
   '["Patch management and vulnerability scanning","Log aggregation & correlation plus real-time alerting","Endpoint detection and network firewalling","Identity governance and access certification"]'::jsonb, 1,
   'SIEM ingests logs from diverse sources (firewalls, endpoints, cloud, applications), normalizes and correlates events using detection rules, and generates alerts when suspicious patterns are identified. It is the nerve center of visibility in a SOC.'),

  (v_qid, 'XDR (Extended Detection and Response) improves upon traditional EDR primarily by:',
   '["Replacing SIEM with a simpler log management tool","Correlating telemetry across endpoints, network, cloud, and identity into unified detections","Focusing exclusively on email-based threat vectors","Automating patch deployment across the enterprise"]'::jsonb, 1,
   'EDR focuses on endpoint telemetry. XDR breaks those silos by correlating signals from endpoint, network, cloud workloads, email, and identity sources, surfacing multi-stage attacks that individual tools would miss in isolation.'),

  (v_qid, 'Mean Time to Detect (MTTD) measures:',
   '["How long it takes to fully remediate an incident after containment","The average time between the start of a malicious activity and its discovery by security teams","How frequently the SOC experiences alert fatigue","The number of false positives generated per day"]'::jsonb, 1,
   'MTTD tracks detection latency. A low MTTD means the SOC spots threats quickly, limiting dwell time. IBM''s Cost of a Data Breach report consistently shows that organizations with lower MTTD suffer significantly lower breach costs.'),

  (v_qid, 'What is Mean Time to Respond (MTTR) in a SOC context?',
   '["Time from initial alert to full system recovery and lessons-learned closure","Average time from incident detection to containment and remediation","Time required to write a post-incident report","Duration of a single analyst''s investigation workflow"]'::jsonb, 1,
   'MTTR measures response efficiency: from the moment an incident is detected, how long does it take to contain, eradicate, and recover? MTTR is the primary measure of SOC operational effectiveness alongside MTTD.'),

  (v_qid, 'Which SIEM query language is natively used in Microsoft Sentinel?',
   '["SPL (Search Processing Language)","SQL (Structured Query Language)","KQL (Kusto Query Language)","YARA rule syntax"]'::jsonb, 2,
   'Microsoft Sentinel uses KQL (Kusto Query Language). Splunk uses SPL. Elastic uses EQL/Lucene. Understanding the native query language of your SIEM is fundamental to writing effective detection rules and hunting queries.'),

  (v_qid, 'Alert fatigue in a SOC is best addressed by:',
   '["Hiring more L1 analysts to handle the volume","Tuning detection rules to reduce false positives and prioritizing high-fidelity alerts","Disabling low-severity alert categories entirely","Switching to a manual log review process instead of automated alerting"]'::jsonb, 1,
   'Alert fatigue occurs when analysts are overwhelmed by high-volume, low-quality alerts. The solution is SIEM tuning: suppressing known-good activity, refining detection logic, and using risk scoring to prioritize. Simply adding headcount does not fix a signal quality problem.'),

  (v_qid, 'Behavioral detection rules in a SIEM detect threats by:',
   '["Matching traffic against known malware hash signatures","Identifying deviations from established baselines of normal user or system activity","Blocking all traffic that does not match an allow-list","Scanning files for known exploit code patterns"]'::jsonb, 1,
   'Behavioral (anomaly-based) detection identifies unusual patterns — a user logging in at 3am, a process spawning an unexpected child, data transfer volumes spiking. Unlike signature-based rules, behavioral rules can detect novel attacks without a known fingerprint.'),

  (v_qid, 'What is "dwell time" in the context of threat detection?',
   '["The time an analyst spends on a single alert ticket","The duration an attacker remains undetected inside a network after initial compromise","The lag between a log being generated and ingested by the SIEM","The window during which a vulnerability is unpatched"]'::jsonb, 1,
   'Dwell time (also called "time to discovery") is the period between initial compromise and detection. Long dwell times give attackers more opportunity to escalate privileges, move laterally, and exfiltrate data. Reducing dwell time is a primary SOC objective.'),

  (v_qid, 'Which EDR capability is most critical for detecting fileless malware attacks that operate entirely in memory?',
   '["File integrity monitoring of system directories","Process behavior monitoring and memory scanning for suspicious in-memory code execution","Network traffic analysis at the perimeter firewall","Log shipping to a centralized SIEM"]'::jsonb, 1,
   'Fileless malware (e.g., PowerShell-based attacks, process injection) never writes to disk, defeating traditional AV signature scanning. EDR tools monitor process behavior, parent-child relationships, and memory regions to detect these techniques.'),

  (v_qid, 'SOAR (Security Orchestration, Automation and Response) integrates with SIEM primarily to:',
   '["Replace the SIEM''s log aggregation function","Automate repetitive response actions such as IP blocking, ticket creation, and alert enrichment","Provide long-term log retention for forensic investigations","Train L1 analysts through simulated incident scenarios"]'::jsonb, 1,
   'SOAR platforms (e.g., Palo Alto XSOAR, Splunk SOAR) connect to SIEM alerts and execute automated playbooks: enriching indicators via threat intel feeds, isolating endpoints via EDR APIs, creating JIRA/ServiceNow tickets, and notifying teams — all without analyst intervention.'),

  (v_qid, 'A SOC receives 10,000 alerts per day but only 50 are true positives. What is the false positive rate?',
   '["0.5%","5%","99.5%","50%"]'::jsonb, 2,
   'False positive rate = false positives / total alerts = 9,950 / 10,000 = 99.5%. This extreme ratio is common in enterprise SOCs and is why alert tuning and prioritization are critical. Each false positive wastes analyst time and contributes to alert fatigue.'),

  (v_qid, 'Which SOC metric measures the percentage of incidents that were detected by the SOC''s own monitoring versus reported by external parties?',
   '["Mean Time to Detect (MTTD)","Self-detection rate","Escalation efficiency ratio","Alert-to-incident conversion rate"]'::jsonb, 1,
   'Self-detection rate measures SOC effectiveness: what fraction of real incidents did the SOC find itself? A low self-detection rate indicates detection gaps — the team learns about breaches from customers, law enforcement, or vendors rather than its own tooling.'),

  (v_qid, 'In Splunk, the command that counts events grouped by a field (e.g., counting events per source IP) is:',
   '["| stats count by src_ip","SELECT COUNT(*) GROUP BY src_ip","| fields + src_ip | count","GET /events?group=src_ip"]'::jsonb, 0,
   'Splunk''s SPL uses the pipe-based stats command: "| stats count by src_ip" aggregates log events and returns a count per unique source IP. This is one of the most common SPL patterns for investigation and detection rule building.'),

  (v_qid, 'What does a Tier 3 (L3) SOC analyst primarily contribute that L1/L2 analysts do not?',
   '["Higher-volume alert triage coverage during peak hours","Advanced threat hunting, custom detection engineering, and incident command for major breaches","Managing SIEM vendor contracts and license renewals","Writing compliance reports for external auditors"]'::jsonb, 1,
   'L3 analysts are the elite tier: they hunt for undetected threats using hypotheses and custom tooling, engineer new detection content from ATT&CK techniques, lead response during major incidents, and feed intelligence back into the detection pipeline. They spend minimal time on routine triage.');

  -- ============================================================
  -- MODULE 03 — Cloud Security: AWS, Azure, GCP & Container Security
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 2;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'Under the AWS Shared Responsibility Model, which security domain is ALWAYS the customer''s responsibility regardless of which service model (IaaS/PaaS/SaaS) is used?',
   '["Patching the hypervisor","Physical data center security","Customer data and access management (IAM)","Network infrastructure between availability zones"]'::jsonb, 2,
   'AWS is always responsible for security OF the cloud (hardware, facilities, global network). Customers are always responsible for security IN the cloud — their data, their IAM policies, their encryption choices, and their application logic, regardless of service model.'),

  (v_qid, 'AWS GuardDuty is best described as:',
   '["A web application firewall for API Gateway","A managed threat detection service that analyzes CloudTrail, VPC Flow Logs, and DNS logs for malicious activity","A vulnerability scanner that patches EC2 instances automatically","A CSPM tool that enforces security baselines across AWS accounts"]'::jsonb, 1,
   'GuardDuty is AWS''s managed threat detection service. It uses ML and threat intelligence to analyze CloudTrail API calls, VPC Flow Logs, and DNS query logs to identify threats like compromised instances, credential exfiltration, and unauthorized access patterns.'),

  (v_qid, 'Which AWS service provides an immutable audit trail of all API calls made within an AWS account?',
   '["AWS Config","AWS CloudTrail","AWS Security Hub","Amazon Macie"]'::jsonb, 1,
   'CloudTrail logs every API call (who, what, when, from where) across all AWS services. It is the foundational forensic and audit trail for AWS environments and is the primary log source for incident investigation and compliance evidence.'),

  (v_qid, 'Cloud Security Posture Management (CSPM) tools primarily address which cloud security challenge?',
   '["Runtime threat detection for containerized workloads","Identifying misconfigurations in cloud services that violate security best practices or compliance standards","Managing encryption keys for data at rest","Monitoring network egress for data exfiltration"]'::jsonb, 1,
   'CSPM tools (e.g., Prisma Cloud, Wiz, Orca) continuously scan cloud configurations — S3 bucket permissions, security group rules, IAM policies — against CIS Benchmarks and compliance frameworks, alerting on dangerous misconfigurations before attackers exploit them.'),

  (v_qid, 'Microsoft Defender for Cloud provides which capability specific to multi-cloud environments?',
   '["It replaces Azure Active Directory with a zero-trust identity provider","It provides CSPM and workload protection across Azure, AWS, and GCP from a single pane of glass","It is an endpoint detection tool limited to Windows Server workloads","It automates SOC 2 Type II audit evidence collection"]'::jsonb, 1,
   'Defender for Cloud (formerly Azure Security Center + Azure Defender) provides unified security management across Azure natively and connects to AWS and GCP via connectors, giving security teams a single view of posture and threat protection across multi-cloud estates.'),

  (v_qid, 'A public-facing S3 bucket containing customer PII is discovered. What combination of controls should be applied immediately?',
   '["Enable versioning and cross-region replication","Make the bucket private, enable S3 Block Public Access at the account level, enable server-side encryption, and rotate IAM credentials that had access","Delete the bucket and recreate it with a new name","Enable AWS WAF in front of the S3 bucket"]'::jsonb, 1,
   'The immediate response is: (1) revoke public access, (2) enable account-level Block Public Access to prevent future mistakes, (3) verify encryption, and (4) rotate credentials that accessed the bucket while it was public in case they were harvested. WAF does not protect S3 directly.'),

  (v_qid, 'In Kubernetes, what is the primary security function of Role-Based Access Control (RBAC)?',
   '["Encrypting etcd data at rest","Defining which Kubernetes API actions each service account or user is permitted to perform","Isolating Pod network traffic using network policies","Scanning container images for vulnerabilities before deployment"]'::jsonb, 1,
   'Kubernetes RBAC controls who can do what to which Kubernetes resources. Roles define permissions (get, list, create, delete) on specific API resources; RoleBindings and ClusterRoleBindings assign those roles to users, groups, or service accounts.'),

  (v_qid, 'A container security scan finds a critical CVE in a base image used across 200 production containers. What is the correct remediation sequence?',
   '["Restart all containers to clear the vulnerability from memory","Rebuild images with a patched base image, push to registry, redeploy containers, and verify with a post-deployment scan","Apply a virtual patch using a WAF rule","Accept the risk since containers are ephemeral and short-lived"]'::jsonb, 1,
   'Container vulnerabilities live in the image layer. The fix is always to update the base image, rebuild all images that inherit from it, push to the registry, and trigger redeployment. WAF virtual patching does not address OS-level CVEs inside container images.'),

  (v_qid, 'What does GCP Chronicle provide that traditional SIEM solutions lack at scale?',
   '["A GUI-based policy editor for firewall rules","Petabyte-scale security telemetry storage and search at a flat cost with sub-second query performance across years of data","Automatic vulnerability remediation for GCE instances","A managed Kubernetes service for containerized security tools"]'::jsonb, 1,
   'Chronicle (Google''s security analytics platform) is built on the same infrastructure as Google Search. It ingests and retains massive security telemetry volumes at a flat annual cost — unlike traditional SIEM per-GB pricing — and provides near-instant searches across years of historical data.'),

  (v_qid, 'Pod Security Admission (PSA) in Kubernetes replaces the deprecated Pod Security Policies. It enforces security at three levels. Which level PREVENTS pods from running if they violate the policy?',
   '["Privileged","Baseline","Restricted","Enforce"]'::jsonb, 3,
   'PSA has three modes: warn (logs a warning but allows), audit (records to audit log), and enforce (rejects the pod if it violates the policy). The three security profiles are Privileged, Baseline, and Restricted — Enforce is the mode, not the profile.'),

  (v_qid, 'Which attack targets container orchestration environments by escaping the container boundary and gaining access to the underlying host?',
   '["SQL injection via the application layer","Container escape exploiting kernel vulnerabilities or privileged container misconfigurations","Cross-site scripting in the Kubernetes dashboard","DNS poisoning of the CoreDNS service"]'::jsonb, 1,
   'Container escape occurs when an attacker exploits a vulnerability or misconfiguration (running as root, privileged mode, host path mounts, runc CVEs) to break out of the container namespace and execute code on the host OS, potentially compromising the entire Kubernetes node.'),

  (v_qid, 'The principle of immutable infrastructure in cloud security means:',
   '["Encrypting all data so it cannot be modified","Never patching running instances — instead replace them with freshly built images from a secure pipeline","Preventing all changes to IAM policies without dual approval","Using read-only database replicas for production workloads"]'::jsonb, 1,
   'Immutable infrastructure treats servers and containers as disposable. Instead of patching in place, you rebuild the artifact from a hardened, version-controlled base image and redeploy. This eliminates configuration drift and ensures every running instance matches a known-good state.'),

  (v_qid, 'AWS Security Hub aggregates findings from GuardDuty, Inspector, Macie, and third-party tools. Its primary value for a security team is:',
   '["It automatically remediates high-severity findings without human intervention","It provides a single prioritized view of security findings across services and accounts with CIS/PCI compliance scoring","It replaces the need for a separate SIEM by storing all raw log data","It provides DDoS protection for internet-facing applications"]'::jsonb, 1,
   'Security Hub is an aggregation and normalization layer. It collects findings from AWS-native and third-party security tools, normalizes them to ASFF (Amazon Security Finding Format), scores them against compliance standards, and provides prioritized dashboards — reducing tool-switching overhead.'),

  (v_qid, 'A cloud-native application stores encryption keys in the application source code. What is the security risk and correct alternative?',
   '["No risk — compiled code conceals the keys","Hardcoded keys are exposed if the code repository is breached; use a managed secrets service like AWS Secrets Manager or HashiCorp Vault","The risk is performance degradation from key rotation","The risk is losing keys if the application is redeployed"]'::jsonb, 1,
   'Hardcoded secrets are the #1 cloud credential exposure vector. Any repository breach, accidental public commit, or container image inspection exposes them. Managed secrets services (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager, HashiCorp Vault) inject secrets at runtime and support automatic rotation.'),

  (v_qid, 'Which GCP security control provides workload identity for GCE instances and GKE pods, eliminating the need to manage service account keys?',
   '["Cloud Armor WAF rules","Workload Identity Federation and Workload Identity for GKE","VPC Service Controls","BeyondCorp Enterprise access proxy"]'::jsonb, 1,
   'Workload Identity Federation allows GCP workloads to authenticate to Google APIs using their runtime identity (instance identity token, Kubernetes service account) instead of service account key files. This eliminates key management overhead and removes long-lived credentials from the environment.');

  -- ============================================================
  -- MODULE 04 — Network Security & Penetration Testing
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 3;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'What is the primary security benefit of network segmentation?',
   '["It eliminates the need for endpoint antivirus","It contains the blast radius of a breach by preventing attackers from freely moving between network zones","It removes the requirement for network-level encryption","It speeds up application performance by reducing network congestion"]'::jsonb, 1,
   'Segmentation divides networks into isolated zones (VLANs, subnets, security zones) so that compromising one segment does not grant access to others. An attacker in the guest Wi-Fi network cannot reach production databases if proper segmentation is in place.'),

  (v_qid, 'What is the key operational difference between an IDS (Intrusion Detection System) and an IPS (Intrusion Prevention System)?',
   '["IDS is cloud-based; IPS is on-premises","IDS detects and alerts but does not block; IPS actively blocks malicious traffic in-line","IDS operates at the application layer; IPS operates at the network layer","IDS requires agents on endpoints; IPS is agentless"]'::jsonb, 1,
   'IDS is passive: it mirrors traffic, analyzes it, and generates alerts. IPS is inline: it sits in the traffic path and can drop packets, reset connections, or block IP addresses in real time. IPS failure can cause legitimate traffic disruption, hence the operational tradeoff.'),

  (v_qid, 'In the PTES (Penetration Testing Execution Standard) methodology, which phase involves mapping the target''s attack surface by gathering OSINT, enumerating services, and identifying vulnerabilities WITHOUT active exploitation?',
   '["Exploitation","Post-exploitation","Intelligence Gathering and Scanning","Reporting"]'::jsonb, 2,
   'PTES phases: Pre-engagement → Intelligence Gathering → Threat Modeling → Vulnerability Analysis → Exploitation → Post-Exploitation → Reporting. Intelligence Gathering and Vulnerability Analysis map the attack surface; actual exploitation happens in a later, separate phase.'),

  (v_qid, 'During a penetration test, a tester runs "nmap -sV -O 192.168.1.0/24". What information does this command collect?',
   '["It brute-forces SSH credentials on all hosts","It identifies open ports, service versions, and operating system fingerprints across the subnet","It performs a man-in-the-middle attack on all hosts","It scans for SQL injection vulnerabilities in web applications"]'::jsonb, 1,
   '-sV enables service version detection; -O enables OS fingerprinting. This command discovers what''s running where across the target subnet — foundational information for identifying exploitable services and planning the attack path.'),

  (v_qid, 'A demilitarized zone (DMZ) in network architecture serves which purpose?',
   '["It encrypts all data in transit between the internal network and the internet","It places public-facing services (web servers, mail servers) in a semi-trusted zone isolated from the internal corporate network","It provides a VPN endpoint for remote workers","It stores backup data isolated from production systems"]'::jsonb, 1,
   'The DMZ sits between the internet and the internal network, typically bounded by two firewalls. Public-facing services live there so that even if they are compromised, the attacker cannot directly pivot to internal systems — they must defeat a second firewall or control.'),

  (v_qid, 'The OWASP API Security Top 10 was created separately from the OWASP Web Application Top 10 because:',
   '["APIs are always more secure than web applications","APIs have unique attack surfaces — broken object-level authorization, lack of rate limiting, excessive data exposure — that the web app list does not fully address","APIs use different programming languages that require separate guidance","The web application list is only applicable to PHP applications"]'::jsonb, 1,
   'API vulnerabilities have distinct patterns: BOLA (Broken Object Level Authorization) affects 90%+ of APIs, mass assignment and excessive data exposure are API-specific, and lack of rate limiting enables enumeration attacks. The API Top 10 provides targeted guidance the general web app list cannot.'),

  (v_qid, 'A penetration tester gains low-privilege access to a Windows host and runs "whoami /priv" to see SeImpersonatePrivilege is enabled. This most likely enables which privilege escalation technique?',
   '["Pass-the-Hash to authenticate to other domain systems","Potato exploits (e.g., PrintSpoofer) to escalate to SYSTEM-level privileges","Directory traversal to read administrator files","SQL injection against the local SQL Server instance"]'::jsonb, 1,
   'SeImpersonatePrivilege, common on service accounts, allows a process to impersonate another user''s token. Potato-family exploits (JuicyPotato, PrintSpoofer, GodPotato) abuse this privilege to coerce the SYSTEM account to authenticate to a local listener, capturing and impersonating the SYSTEM token.'),

  (v_qid, 'An Evil Twin attack in wireless security works by:',
   '["Jamming the legitimate Wi-Fi signal to cause a denial of service","Creating a rogue access point with the same SSID as a legitimate network to intercept client connections","Exploiting WPS PIN vulnerabilities to extract the WPA2 passphrase","Flooding DHCP to exhaust address pools and cause network unavailability"]'::jsonb, 1,
   'Evil Twin attacks create a fraudulent AP broadcasting a familiar SSID. Clients that auto-connect to known networks may join the rogue AP instead, allowing the attacker to perform MitM attacks, capture credentials, and inspect decrypted traffic.'),

  (v_qid, 'VLAN hopping attacks exploit which network misconfiguration?',
   '["Unencrypted Telnet access to managed switches","Trunk ports that accept DTP (Dynamic Trunking Protocol) negotiation, allowing an attacker to send tagged frames and jump between VLANs","Guest Wi-Fi networks that share the same DHCP scope as corporate devices","ARP cache poisoning on Layer 3 switches"]'::jsonb, 1,
   'VLAN hopping (double-tagging or switch spoofing) exploits DTP auto-negotiation on trunk ports. The fix: disable DTP on all access ports (switchport nonegotiate), set native VLANs to an unused VLAN, and explicitly configure trunk/access mode on every port.'),

  (v_qid, 'CVSS (Common Vulnerability Scoring System) scores vulnerabilities on a scale of 0–10. A CVSS base score of 9.8 indicates:',
   '["A low-severity vulnerability requiring monitoring only","A critical vulnerability — typically unauthenticated, remotely exploitable, with high impact to CIA","A medium-severity vulnerability requiring patching within 30 days","An informational finding with no exploitability"]'::jsonb, 1,
   'CVSS 9.0–10.0 is Critical. A score of 9.8 typically reflects network-accessible attack vector, no authentication required, no user interaction, and high impact across all three CIA properties. These vulnerabilities should be treated as emergency patches.'),

  (v_qid, 'ARP poisoning (ARP spoofing) enables which type of attack?',
   '["DNS-based phishing by redirecting domain lookups","Man-in-the-Middle attack by linking the attacker''s MAC address to a legitimate IP address in ARP caches","SQL injection by manipulating application-layer database queries","Session fixation by forging HTTP session cookies"]'::jsonb, 1,
   'ARP has no authentication. An attacker sends gratuitous ARP replies claiming their MAC address maps to the gateway IP. Other hosts update their ARP caches, sending all traffic through the attacker''s machine — enabling interception, modification, or denial of communications.'),

  (v_qid, 'A buffer overflow attack exploits which underlying vulnerability?',
   '["Weak password policies allowing brute-force attacks","Insufficient input length validation allowing an attacker to overwrite adjacent memory, including the return address on the stack","SQL injection in database-connected applications","Missing TLS certificate validation in API clients"]'::jsonb, 1,
   'Buffer overflows occur when a program writes more data to a buffer than it can hold. The excess data overwrites adjacent memory — classically the return address on the stack — allowing an attacker to redirect execution flow to shellcode or existing code (ROP chains).'),

  (v_qid, 'A stateful firewall differs from a stateless (packet-filtering) firewall in that it:',
   '["Performs deep-packet inspection of application-layer content","Tracks the state of network connections and allows return traffic for established sessions without explicit rules","Operates exclusively at the DNS layer","Requires agents installed on each endpoint to inspect traffic"]'::jsonb, 1,
   'Stateless firewalls evaluate each packet independently against rules. Stateful firewalls maintain a connection state table, allowing return traffic for established TCP sessions without needing explicit inbound rules — significantly simplifying rule sets and improving security.'),

  (v_qid, 'What is the primary purpose of a Rules of Engagement (RoE) document in a penetration test?',
   '["To document all vulnerabilities found during the engagement","To define the legal authorization, scope boundaries, allowed techniques, and communication protocols for the test","To provide remediation guidance to the development team","To satisfy compliance requirements for annual risk assessments"]'::jsonb, 1,
   'Rules of Engagement legally authorize the penetration test and define its boundaries: IP ranges in scope, prohibited techniques (e.g., no DoS), hours of testing, emergency contacts, data handling rules, and escalation procedures if critical systems are unintentionally impacted.'),

  (v_qid, 'During post-exploitation in a red team engagement, an attacker uses Mimikatz on a Windows Domain Controller. What is the primary objective of this tool?',
   '["Scanning for open ports across the domain","Extracting credential hashes and Kerberos tickets from LSASS memory for lateral movement and persistence","Encrypting the DC''s file system for ransomware simulation","Modifying firewall rules to establish a persistent backdoor"]'::jsonb, 1,
   'Mimikatz extracts plaintext passwords, NTLM hashes, and Kerberos tickets (including golden/silver ticket material) from Windows LSASS memory. On a Domain Controller, these credentials enable attackers to authenticate as any domain user, achieving complete domain compromise.');

  -- ============================================================
  -- MODULE 05 — Application Security & DevSecOps
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 4;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'The OWASP Top 10 2021 lists Broken Access Control as the #1 web application risk. A real-world example is:',
   '["A user providing a weak password that is brute-forced","A user changing the "id" parameter in an API URL to access another user''s account data","An attacker injecting SQL commands through a login form","An application serving JavaScript from an unvalidated CDN"]'::jsonb, 1,
   'Broken Access Control (IDOR — Insecure Direct Object Reference) occurs when an application uses a user-controlled identifier to access objects without verifying the requesting user is authorized. Changing ?id=123 to ?id=124 to access another user''s data is a classic IDOR.'),

  (v_qid, 'DevSecOps "shifts security left." What does this mean in practice?',
   '["Moving the security team to the left side of the org chart","Integrating security testing and checks into the earliest phases of the development pipeline — design, coding, and CI — rather than testing only before release","Prioritizing security patches over feature development","Requiring security approval before any code is committed"]'::jsonb, 1,
   'Shift-left means catching security defects early, when they are cheapest to fix. This includes threat modeling in design, SAST scanning in the IDE and CI pipeline, and security unit tests — rather than waiting for a manual pen test gate just before release.'),

  (v_qid, 'What is a Software Bill of Materials (SBOM) and why is it a security control?',
   '["A list of security requirements from the CISO for the development team","An inventory of all open-source and third-party components in a software product, enabling rapid identification of vulnerable dependencies","A checklist of OWASP controls implemented in the application","A financial budget allocation document for security tooling"]'::jsonb, 1,
   'An SBOM (mandated by US Executive Order 14028) is a machine-readable inventory of every library, package, and component in software. When a new CVE drops (e.g., Log4Shell), organizations with SBOMs can instantly identify which products are affected, reducing response time from weeks to hours.'),

  (v_qid, 'SAST (Static Application Security Testing) differs from DAST (Dynamic Application Security Testing) in that:',
   '["SAST scans running applications; DAST analyzes source code","SAST analyzes source code, bytecode, or binaries without execution; DAST tests a running application by sending crafted requests","SAST is only applicable to Java; DAST works with all languages","SAST is performed by penetration testers; DAST is automated"]'::jsonb, 1,
   'SAST (e.g., Semgrep, Checkmarx, SonarQube) analyzes code statically to find vulnerabilities like SQL injection, hardcoded secrets, and insecure deserialization. DAST (e.g., OWASP ZAP, Burp Suite) attacks a running application from the outside, finding vulnerabilities SAST misses like auth flaws and business logic errors.'),

  (v_qid, 'A dependency confusion attack exploits which supply chain vulnerability?',
   '["A developer committing secrets to a public GitHub repository","A package manager fetching a malicious public package with the same name as a private internal package, due to resolution precedence","An attacker injecting code into a CI/CD pipeline through a compromised build server","A typosquatting attack using a package name one character different from a popular library"]'::jsonb, 1,
   'Dependency confusion (discovered by Alex Birsan in 2021) exploits package managers that prefer public registries over private ones when a name exists in both. Attackers publish malicious packages with internal-only names to public registries (npm, PyPI), causing build systems to download and execute the attacker''s code.'),

  (v_qid, 'In OAuth 2.0, what is the purpose of the "state" parameter?',
   '["It stores the user''s authentication session token","It is a random value that prevents CSRF attacks by ensuring the authorization response correlates with the original authorization request","It specifies the OAuth scopes being requested","It contains the encrypted user identity for the resource server"]'::jsonb, 1,
   'The OAuth state parameter is a client-generated random value included in the authorization request and returned unchanged in the callback. The client verifies it matches, ensuring the callback is a legitimate response to its own request and not a CSRF-forged redirect from an attacker.'),

  (v_qid, 'A JWT (JSON Web Token) with "alg": "none" in its header is a security vulnerability because:',
   '["The token cannot be parsed by standard JWT libraries","It instructs JWT libraries that do not properly validate algorithm to skip signature verification entirely, accepting forged tokens","The token expires immediately when the alg field is absent","It forces the token to use RSA instead of HMAC, breaking backward compatibility"]'::jsonb, 1,
   'Some JWT libraries, when encountering alg:none, accept unsigned tokens — allowing attackers to craft arbitrary claims (change user ID, role, etc.) without a valid signature. Libraries must explicitly reject alg:none; servers must enforce allowed algorithm lists.'),

  (v_qid, 'Container image signing (e.g., using Sigstore/Cosign) in a DevSecOps pipeline achieves which security goal?',
   '["It encrypts the container image contents to prevent unauthorized access","It creates a cryptographic proof that an image was built from a trusted pipeline and has not been tampered with — and Kubernetes admission controllers can enforce that only signed images are deployable","It scans the image for vulnerabilities using CVE databases","It compresses the image to reduce registry storage costs"]'::jsonb, 1,
   'Image signing establishes supply chain trust: CI signs the image after build and scanning; the signature is stored in a registry (OCI artifact). Kubernetes admission controllers (e.g., Connaisseur, policy-controller) verify signatures at deploy time, blocking unsigned or tampered images from running.'),

  (v_qid, 'Secret scanning in a CI/CD pipeline is triggered when:',
   '["A developer deploys to production without a CAB approval","Code is pushed to the repository, and the pipeline scans for patterns matching API keys, passwords, and tokens before the code is merged","A container image fails a vulnerability scan threshold gate","A SAST tool finds a high-severity injection vulnerability"]'::jsonb, 1,
   'Secret scanning (GitHub Advanced Security, GitGuardian, truffleHog) runs on every push/PR, using regex and ML to detect credential patterns. Early detection at commit time prevents secrets from being embedded in repository history, which is permanent without a full history rewrite.'),

  (v_qid, 'The SolarWinds supply chain attack (2020) demonstrated which attack vector that traditional AppSec programs did not adequately address?',
   '["SQL injection in the SolarWinds Orion web interface","Compromise of the build and signing infrastructure to inject malicious code into legitimate software updates before delivery to customers","Brute-force attacks on SolarWinds customer credentials","Exploitation of an unpatched OS vulnerability on SolarWinds servers"]'::jsonb, 1,
   'SolarWinds attackers compromised the build pipeline to inject the SUNBURST backdoor into Orion updates, which were digitally signed and distributed to ~18,000 customers. This demonstrated that trusted software from reputable vendors can be weaponized — driving adoption of build provenance, SBOM, and supply chain security frameworks like SLSA.'),

  (v_qid, 'OWASP Cryptographic Failures (formerly Sensitive Data Exposure, #2 in 2021) most commonly occurs when:',
   '["An application uses TLS 1.3 for all data in transit","Sensitive data is stored or transmitted using weak or deprecated algorithms (MD5, SHA-1, DES), or without encryption at all","An application implements OAuth 2.0 instead of SAML for SSO","Strong encryption keys are rotated more frequently than annually"]'::jsonb, 1,
   'Cryptographic failures encompass: storing passwords in plaintext or with MD5/SHA-1 without salt, transmitting sensitive data over HTTP, using weak cipher suites, and storing encryption keys alongside encrypted data. All result in sensitive data being exposed to attackers who access the storage medium or traffic.'),

  (v_qid, 'A Web Application Firewall (WAF) provides which primary protection capability?',
   '["It replaces the need for secure coding practices by filtering all attacks at the perimeter","It inspects HTTP/S traffic and blocks requests matching attack signatures (SQLi, XSS, OWASP rules) before they reach the application — providing a compensating control layer","It encrypts data stored in the application database","It performs static code analysis of application source code"]'::jsonb, 1,
   'A WAF (AWS WAF, Cloudflare WAF, ModSecurity) is a compensating control that filters malicious HTTP requests. It does not replace secure coding — it buys time and reduces noise — but it protects legacy applications where source code fixes are not immediately feasible.'),

  (v_qid, 'Threat modeling during the design phase of the SDLC most commonly uses which methodology?',
   '["CVSS scoring of identified vulnerabilities","STRIDE (Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege) to systematically identify threats against system components","OWASP ZAP automated scanning of the application design document","Penetration testing of the application architecture diagrams"]'::jsonb, 1,
   'STRIDE, developed at Microsoft, provides a category-based approach to threat identification. Each component in a data flow diagram is evaluated against all six STRIDE categories to surface threats before code is written — when architectural changes are cheapest to implement.'),

  (v_qid, 'Input validation as a security control is correctly applied when:',
   '["Input is sanitized only before display in the HTML output","Input is validated against a strict allowlist of expected characters, length, and format on the SERVER SIDE before any processing or storage","Input validation is handled exclusively by the client-side JavaScript form checks","All user input is escaped with HTML entities regardless of context"]'::jsonb, 1,
   'Input validation must happen server-side — client-side checks are trivially bypassed. Allowlist validation (only accept what is expected) is stronger than denylist (block known-bad). Proper validation prevents injection attacks, buffer overflows, and business logic abuse at the point of entry.'),

  (v_qid, 'A secure Software Development Lifecycle (SSDLC) mandates that security requirements are defined in which phase?',
   '["Testing, after the feature is implemented","Requirements/Design phase, before any code is written, as part of user story acceptance criteria","Deployment, as a final security checklist","Maintenance, after the first production security incident"]'::jsonb, 1,
   'Security requirements should be first-class requirements alongside functional requirements: "the system shall enforce authentication before accessing any user data" written in the design phase becomes a testable acceptance criterion. Retrofitting security requirements after development is exponentially more expensive and error-prone.');

  -- ============================================================
  -- MODULE 06 — Digital Forensics & Incident Response (DFIR)
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 5;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'NIST SP 800-61 defines the Incident Response Lifecycle in four phases. What is the correct order?',
   '["Detect → Contain → Eradicate → Recover","Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity","Identify → Protect → Detect → Respond → Recover","Triage → Investigate → Remediate → Report"]'::jsonb, 1,
   'NIST 800-61''s four phases: (1) Preparation — building IR capability before incidents occur; (2) Detection & Analysis — identifying and scoping the incident; (3) Containment, Eradication & Recovery — stopping the attack and restoring systems; (4) Post-Incident Activity — lessons learned and process improvement.'),

  (v_qid, 'Chain of custody in digital forensics is critical because:',
   '["It speeds up the forensic investigation process","It documents who collected, handled, transferred, and analyzed evidence, ensuring its integrity and admissibility in legal or regulatory proceedings","It encrypts forensic evidence to prevent unauthorized access during investigation","It enables forensic tools to automatically reconstruct attack timelines"]'::jsonb, 1,
   'Chain of custody is the documented, unbroken record of evidence handling. Courts require proof that evidence was not altered between collection and presentation. Gaps in custody documentation can render evidence inadmissible, allowing criminals to escape accountability despite technical proof of wrongdoing.'),

  (v_qid, 'Volatility is a leading open-source tool for which forensic discipline?',
   '["Network packet capture analysis","Memory (RAM) forensics — extracting running processes, network connections, encryption keys, and malware artifacts from memory dumps","Hard disk imaging and file system analysis","Log aggregation and SIEM correlation"]'::jsonb, 1,
   'Volatility analyzes physical memory dumps (Windows, Linux, macOS) to extract forensic artifacts invisible on disk: running processes and their parent relationships, active network connections, loaded DLLs, injected code regions, encryption keys held in RAM, and command history — critical for malware analysis.'),

  (v_qid, 'The forensic order of volatility specifies which evidence should be collected FIRST. What is the most volatile data source?',
   '["Hard disk drive contents","Archived backup tapes","CPU registers, CPU cache, and running system RAM","Network device configuration files"]'::jsonb, 2,
   'Order of volatility (most → least volatile): CPU registers/cache → RAM → Swap/virtual memory → Network state → Running processes → Disk → Remote logs → Archive/backups. RAM is lost the moment a system powers off, so memory acquisition must happen before anything else — even before rebooting to image the disk.'),

  (v_qid, 'During incident containment, an organization must choose between network isolation and monitoring continued attacker activity. The decision to monitor rather than isolate is justified when:',
   '["The attacker has achieved domain admin privileges","Intelligence gathering about attacker TTPs, tools, and targets outweighs the risk of additional damage — typically only in well-controlled environments with legal authorization","The organization lacks the technical capability to isolate systems","The incident affects a non-critical development environment"]'::jsonb, 1,
   'Continued monitoring (controlled burn) can yield valuable intelligence about attacker infrastructure, additional targets, and TTPs. However, it requires careful risk management: the organization must be confident it can prevent additional damage and must have legal authorization. Most organizations should default to isolation.'),

  (v_qid, 'An IR playbook is a pre-defined, step-by-step response procedure for a specific incident type. Its primary benefit during an active incident is:',
   '["It eliminates the need for security analysts during incidents","It reduces cognitive load under pressure by providing a tested decision tree, ensuring consistent, complete response and preventing steps from being skipped in crisis conditions","It automatically contains the incident without human intervention","It satisfies audit requirements for documented security procedures"]'::jsonb, 1,
   'Playbooks capture institutional knowledge: what to contain first, who to notify, what evidence to collect, how to communicate. Under the stress of a major incident, responders follow the playbook rather than improvising — reducing errors, ensuring legal/compliance steps are not missed, and speeding resolution.'),

  (v_qid, 'A forensic disk image differs from a standard file copy (e.g., copy-paste) in that:',
   '["A forensic image is faster to create","A forensic image is a bit-for-bit sector-level copy including unallocated space, deleted files, slack space, and metadata — all of which a file copy omits","A forensic image is compressed to save storage space","A forensic image can only be created from SSDs, not traditional HDDs"]'::jsonb, 1,
   'Standard file copies only capture allocated, visible files. Forensic images (created with dd, FTK Imager, or Guymager) capture every bit — including deleted files in unallocated space, file slack, partition tables, and boot sectors. This completeness is essential for recovering deleted evidence and proving nothing was altered.'),

  (v_qid, 'A Post-Incident Review (PIR) or "lessons learned" meeting should occur:',
   '["Only after criminal charges are filed","Within two weeks of incident closure, while details are fresh, to identify root causes and preventive improvements","Annually during security program reviews regardless of incident timing","Immediately during the incident to decide containment strategies"]'::jsonb, 1,
   'The PIR is the quality-improvement mechanism of incident response. Waiting too long means details fade and team members move on. Two weeks post-closure is the recommended window — close enough for accurate recollection, far enough that the immediate crisis stress has passed and people can reflect objectively.'),

  (v_qid, 'When acquiring a forensic image, which measure ensures that the acquired image is an exact, unmodified copy of the original?',
   '["Using a write blocker and verifying matching SHA-256 hashes of source and image","Compressing the image before hashing","Acquiring the image while the system is running to capture live state","Using the operating system''s built-in backup utility"]'::jsonb, 0,
   'Write blockers prevent any data from being written to the source media during acquisition. SHA-256 hashing of both source and image confirms they are bit-identical. A hash mismatch indicates acquisition error or tampering — both legally and forensically disqualifying the evidence.'),

  (v_qid, 'Malware sandboxing in DFIR provides which capability that static analysis alone cannot?',
   '["Identifying malware family by MD5 hash lookup","Observing actual malware behavior at runtime — network connections, registry changes, file system modifications, API calls — without risking production systems","Extracting the source code of compiled executables","Decrypting encrypted communications between malware and C2 servers"]'::jsonb, 1,
   'Static analysis (hashes, strings, disassembly) reveals code structure. Dynamic analysis in a sandbox (Cuckoo, Any.run, Joe Sandbox) executes the malware in a controlled environment to capture behavioral indicators — dropped files, C2 IP/domain, persistence mechanisms, data staging — which are essential for detection rule creation and IOC sharing.'),

  (v_qid, 'What forensic artifact is most useful for reconstructing a timeline of file access on a Windows system?',
   '["Windows Registry SAM hive","NTFS $MFT (Master File Table) and $LogFile, which contain file creation, modification, and access timestamps","Windows event log 4624 (successful logon)","Prefetch files (.pf) in C:\\Windows\\Prefetch"]'::jsonb, 1,
   'The NTFS MFT records timestamps (Created, Modified, Changed, Accessed — MACE) for every file and directory. Combined with $LogFile (NTFS journal) and $UsnJrnl, forensic analysts can reconstruct exact file activity sequences — including attacker tool execution and data staging — across the attack timeline.'),

  (v_qid, 'During eradication phase of an incident response, the primary objectives are:',
   '["Collecting forensic evidence and interviewing witnesses","Removing all attacker presence — malware, backdoors, compromised accounts, persistence mechanisms — and hardening systems before restoration","Notifying regulators and customers about the breach","Writing the executive incident summary report"]'::jsonb, 1,
   'Eradication must be thorough before recovery begins. Restoring from backup or rebuilding systems without eradication simply reinstates a compromised environment. Eradication includes: removing malware, revoking compromised credentials, patching exploited vulnerabilities, and eliminating attacker persistence mechanisms.'),

  (v_qid, 'An Indicators of Compromise (IoC) list generated from a DFIR investigation is most valuable when shared via:',
   '["An internal email to the security team only","A structured threat intelligence format (STIX/TAXII) distributed through an ISAC or threat intel platform for community-wide defensive use","A public blog post describing the malware in general terms","A password-protected PDF shared with law enforcement only"]'::jsonb, 1,
   'STIX (Structured Threat Information eXpression) provides machine-readable IoC format; TAXII provides the transport protocol. Sharing via an ISAC (Information Sharing and Analysis Center) or platforms like MISP enables other organizations to programmatically ingest IoCs into their security controls within minutes of your discovery.'),

  (v_qid, 'Network forensics using packet capture (pcap) analysis is most critical for:',
   '["Recovering deleted files from a compromised server''s hard drive","Reconstructing attacker communications, data exfiltration volumes, lateral movement paths, and command-and-control traffic that occurred during the attack window","Analyzing malware code to identify the author''s programming patterns","Examining Windows event logs for authentication failures"]'::jsonb, 1,
   'Pcap analysis (Wireshark, NetworkMiner, Zeek) provides ground truth about what actually traversed the network: which hosts communicated, what data was transmitted, which protocols were used. It can reveal C2 beaconing patterns, data exfiltration to external IPs, and attacker lateral movement — often the only way to scope a breach fully.'),

  (v_qid, 'The executive summary section of an incident report should:',
   '["List every technical IOC, malware hash, and registry key modified during the incident","Provide a 1–2 page non-technical overview of what happened, business impact, containment status, and recommended strategic improvements — written for C-suite and board audiences","Reproduce the entire forensic timeline with all technical evidence","Detail every command executed by analysts during the investigation"]'::jsonb, 1,
   'The executive summary communicates impact and decisions needed — not technical depth. Boards and C-suite readers need: what happened in plain language, what business operations were affected, how was it contained, what is the regulatory exposure, and what investments are needed to prevent recurrence. Technical appendices serve the security audience separately.');

  -- ============================================================
  -- MODULE 07 — GRC Foundations
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 6;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'GRC stands for Governance, Risk, and Compliance. Which statement best describes the relationship between these three disciplines?',
   '["They are independent programs that operate in separate silos","Governance sets organizational direction and accountability; Risk identifies and manages threats to objectives; Compliance verifies adherence to laws and standards — together they form an integrated management system","Governance is a technical function; Risk is a legal function; Compliance is a finance function","GRC is exclusively a regulatory requirement with no operational value"]'::jsonb, 1,
   'GRC is an integrated framework: Governance provides strategic direction and accountability structures; Risk Management identifies, assesses, and treats threats to objectives; Compliance ensures obligations are met. Integrated GRC prevents silos where security, legal, and business operate with conflicting priorities.'),

  (v_qid, 'The NIST Risk Management Framework (RMF) consists of how many steps, and what is the first step?',
   '["5 steps; first step is Implement","7 steps; first step is Prepare","6 steps; first step is Categorize","4 steps; first step is Assess"]'::jsonb, 1,
   'NIST RMF has 7 steps: Prepare → Categorize → Select → Implement → Assess → Authorize → Monitor. "Prepare" (added in RMF 2.0) establishes context and organizational-level risk management strategy before system-level activities begin.'),

  (v_qid, 'Residual risk is defined as:',
   '["The risk that exists before any controls are applied","The risk that remains AFTER applying security controls to an inherent risk","The maximum possible risk exposure an organization could face","The financial cost of implementing a security control"]'::jsonb, 1,
   'Inherent risk is the baseline risk before controls. After controls are applied, residual risk is what remains. Risk treatment decisions — accept, avoid, transfer, or further mitigate — are made against residual risk, not inherent risk.'),

  (v_qid, 'What is the difference between risk appetite and risk tolerance?',
   '["They are synonymous terms used interchangeably in risk management","Risk appetite is the board-level strategic statement of how much risk the organization is willing to accept in pursuit of objectives; risk tolerance is the operational boundary around specific risk types or business units","Risk appetite applies only to financial risks; risk tolerance applies to operational risks","Risk tolerance is set by regulators; risk appetite is set internally"]'::jsonb, 1,
   'Risk appetite is the high-level strategic intent: "we accept moderate risk in pursuit of innovation." Risk tolerance translates that into operational limits: "no single system may have more than 4 hours of downtime per year." Appetite is directional; tolerance is measurable.'),

  (v_qid, 'In a control framework, what is the correct hierarchical relationship between Policies, Standards, and Procedures?',
   '["Procedures → Standards → Policies (most granular to most strategic)","Policies → Standards → Procedures (most strategic to most specific) — policies set the why, standards define the what, procedures define the how","Standards → Policies → Procedures (regulatory requirements drive all documents)","All three are equivalent in authority and can be used interchangeably"]'::jsonb, 1,
   'Policies: board/executive-level mandatory intent (e.g., "all data must be classified"). Standards: mandatory technical or operational requirements that implement the policy (e.g., "AES-256 for all data at rest"). Procedures: step-by-step instructions for implementing standards (e.g., "how to configure disk encryption on macOS").'),

  (v_qid, 'Preventive, Detective, and Corrective are the three primary security control types. Which type is an intrusion detection system (IDS)?',
   '["Preventive","Detective","Corrective","Deterrent"]'::jsonb, 1,
   'An IDS detects and alerts on suspicious activity — it does not prevent the attack. Preventive controls (firewalls, access controls) stop attacks. Corrective controls (system restore, patch deployment) fix damage after detection. IDS is detective: it tells you something happened, but does not stop it.'),

  (v_qid, 'A Unified Compliance Framework (UCF) or Secure Controls Framework (SCF) approach provides which GRC benefit?',
   '["It replaces the need for formal security certifications","It maps security controls to multiple regulatory requirements simultaneously (SOC 2, ISO 27001, NIST CSF, HIPAA) so a single control implementation satisfies multiple compliance obligations — eliminating redundant audits","It eliminates the need for risk assessments by standardizing control baselines","It automates remediation of control gaps without human intervention"]'::jsonb, 1,
   'Framework mapping (cross-walking) is foundational to efficient compliance: one Access Control policy and its implementation can satisfy NIST CSF PR.AC, ISO 27001 A.9, SOC 2 CC6.1, and HIPAA 164.312(a)(1) simultaneously. Without mapping, organizations reimplement the same controls multiple times for each framework.'),

  (v_qid, 'A risk register is a GRC tool that records:',
   '["All security incidents that have occurred in the past year","Each identified risk with its owner, likelihood, impact, inherent and residual scores, treatment decision, and treatment status — serving as the single source of truth for risk management","The complete inventory of IT assets and their vulnerabilities","All audit findings from external assessments"]'::jsonb, 1,
   'The risk register is the operational backbone of risk management. It tracks the full lifecycle of each risk: when identified, who owns it, its scoring, what treatment was chosen, implementation status, and target residual risk date. It enables risk tracking, reporting, and board communication.'),

  (v_qid, 'Which GRC technology category provides continuous, automated control testing against compliance frameworks?',
   '["SIEM (Security Information and Event Management)","Continuous Controls Monitoring (CCM) platforms such as Vanta, Drata, Secureframe, or Hyperproof","Vulnerability scanners such as Nessus or Qualys","GRC workflow tools such as ServiceNow IRM"]'::jsonb, 1,
   'CCM platforms connect via API to cloud infrastructure, identity providers, MDM systems, and HR tools to continuously verify that controls are operating effectively. Instead of point-in-time audit evidence collection, they provide real-time compliance posture — reducing audit prep from months to days.'),

  (v_qid, 'Third-party risk management (TPRM) in a GRC program addresses which scenario?',
   '["Managing the risk of employees violating internal security policies","Assessing and managing the security posture of vendors, suppliers, and partners who access organizational data or systems — because their breach can become your breach","Evaluating the risk of new technology investments before approval","Managing regulatory risk from changes in applicable law"]'::jsonb, 1,
   'Supply chain and vendor risk is a top driver of data breaches. TPRM establishes vendor onboarding risk tiers, due diligence questionnaires (VSAs), contract security clauses, SOC 2 report reviews, and continuous monitoring — because granting a vendor access to your systems extends your security boundary to their security posture.'),

  (v_qid, 'ISO 31000:2018 provides a risk management framework distinct from NIST RMF primarily because:',
   '["ISO 31000 is mandatory for US federal agencies; NIST RMF is voluntary","ISO 31000 is a high-level universal risk management standard applicable to any organization or risk type; NIST RMF is specifically designed for federal IT systems and cybersecurity risk","ISO 31000 requires third-party certification; NIST RMF does not","ISO 31000 focuses exclusively on financial risk; NIST RMF covers all technology risks"]'::jsonb, 1,
   'ISO 31000 is a generic management standard applicable to any organization and any risk type (financial, operational, strategic, reputational). NIST RMF was designed specifically for US federal agencies managing IT system risk. Many enterprises use both: ISO 31000 for enterprise risk governance and NIST CSF/RMF for cybersecurity-specific implementation.'),

  (v_qid, 'The GRC steering committee''s primary responsibility is:',
   '["Implementing technical security controls on IT systems","Providing executive oversight of the GRC program — approving risk appetite, reviewing risk register, overseeing compliance status, and ensuring GRC is aligned with business strategy","Conducting annual penetration tests","Responding to security incidents as the decision-making authority"]'::jsonb, 1,
   'The GRC steering committee (typically including CISO, CRO, CLO, CFO, and business unit leaders) provides governance: they set appetite and tolerance, approve major risk treatment decisions, review audit findings, and ensure accountability. Without executive governance, GRC devolves into a compliance checkbox exercise.'),

  (v_qid, 'What is continuous compliance, and why is it replacing point-in-time audit approaches?',
   '["Compliance activities performed daily by the compliance team manually","Automated, real-time verification that security controls are operating effectively throughout the year, rather than evidence collection only during audit windows — supported by CCM platforms and integration with cloud APIs","Compliance reporting generated weekly by GRC workflow systems","Annual compliance training delivered continuously via e-learning modules"]'::jsonb, 1,
   'Traditional audits create a perverse incentive: organizations appear compliant during the audit window but drift between audits. Continuous compliance uses API integrations to monitor control operation year-round, surfacing gaps in real time rather than discovering them during annual audit prep — reducing risk and audit cost simultaneously.'),

  (v_qid, 'In a risk treatment decision, "risk transfer" most commonly involves:',
   '["Moving the risk to a lower-risk business unit","Purchasing cyber insurance or contractually transferring liability to a vendor — shifting the financial consequences of the risk to a third party","Eliminating the activity that generates the risk","Implementing additional controls to reduce residual risk below appetite"]'::jsonb, 1,
   'Risk transfer does not eliminate the risk but shifts its financial impact. Cyber insurance transfers financial loss from data breaches, ransomware, and business interruption. Vendor contracts with indemnification clauses transfer liability for the vendor''s failures. Note: regulatory liability (fines, penalties) generally cannot be transferred.'),

  (v_qid, 'A GRC program must establish Key Risk Indicators (KRIs). What distinguishes a KRI from a security metric?',
   '["KRIs measure past performance; security metrics measure future projections","KRIs are leading indicators that signal increasing risk exposure BEFORE an adverse event occurs, while standard security metrics often measure lagging outcomes such as incident counts","KRIs are used only for financial risk; security metrics cover operational risk","KRIs require board approval; security metrics are internal tools only"]'::jsonb, 1,
   'Leading KRIs predict risk materialization: rising patch lag rate signals increasing vulnerability exposure before a breach. Lagging metrics (number of incidents, MTTD) measure after-the-fact outcomes. Effective GRC programs monitor both: KRIs for early warning, lagging metrics for performance measurement and trend analysis.');

  -- ============================================================
  -- MODULE 08 — SOC 2 Mastery  (pass threshold: 85%)
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 7;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'SOC 2 is governed by which organization, and what framework does it use to define security requirements?',
   '["ISO — International Organization for Standardization, using ISO 27002 controls","AICPA — American Institute of Certified Public Accountants, using the Trust Services Criteria (TSC)","NIST — National Institute of Standards and Technology, using NIST CSF functions","PCI SSC — Payment Card Industry Security Standards Council, using the PCI DSS requirements"]'::jsonb, 1,
   'SOC 2 is an AICPA attestation standard. The Trust Services Criteria (TSC), defined in the AICPA''s AT-C Section 205, specify the control requirements. The five TSC categories are Security, Availability, Processing Integrity, Confidentiality, and Privacy. Security is mandatory; the others are selected based on service commitments.'),

  (v_qid, 'What is the fundamental difference between a SOC 2 Type I and SOC 2 Type II report?',
   '["Type I covers all five Trust Services Criteria; Type II covers only Security","Type I provides an opinion on whether controls are suitably designed at a POINT IN TIME; Type II provides an opinion on design AND operating effectiveness over a PERIOD of time (typically 6–12 months)","Type I is for SaaS companies; Type II is for infrastructure providers","Type I requires a Big Four auditor; Type II can use any CPA firm"]'::jsonb, 1,
   'Type I is a design assessment: the auditor reviews whether controls exist and are designed appropriately as of a single date. Type II tests whether those controls actually worked throughout the audit period. Customers and enterprise buyers almost universally require Type II because it proves operational effectiveness, not just design intent.'),

  (v_qid, 'CC6 — Logical and Physical Access Controls — is part of which Trust Services Criteria category?',
   '["Availability","Processing Integrity","Privacy","Security (Common Criteria)"]'::jsonb, 3,
   'CC6 is in the Security (Common Criteria) section, which is required for every SOC 2. CC6 covers logical access (CC6.1–CC6.3: access provisioning, authentication, authorization) and physical access controls (CC6.4–CC6.5). It is typically the most heavily tested section in SOC 2 audits.'),

  (v_qid, 'In SOC 2, Complementary User Entity Controls (CUECs) are:',
   '["Controls implemented by the service organization that complement customer controls","Controls that the user entity (customer) must implement for the service organization''s controls to be effective — identified in the SOC 2 report so customers know their responsibilities","Controls shared between the service provider and a subservice organization","Optional controls that enhance but are not required for the TSC criteria"]'::jsonb, 1,
   'CUECs define what customers must do to complete the control environment. Example: a SaaS provider''s SOC 2 may state "the user entity is responsible for provisioning and deprovisioning user access." If the customer fails to offboard departed employees, the provider''s controls cannot compensate. Customers must review CUECs and verify they have implemented them.'),

  (v_qid, 'The standard audit period for a SOC 2 Type II report that will satisfy most enterprise customer procurement requirements is:',
   '["30 days","3 months","6 months or more","Exactly 12 months"]'::jsonb, 2,
   'Most enterprise security questionnaires and procurement processes accept a SOC 2 Type II with a minimum 6-month observation period. The first report for a new organization often covers 6 months to accelerate time-to-report; subsequent reports typically cover 12 months for the maximum evidentiary value.'),

  (v_qid, 'The Availability Trust Services Criterion in SOC 2 covers:',
   '["Whether data is encrypted at rest and in transit","Whether the system is available for operation and use as committed or agreed — including uptime commitments, capacity planning, and incident response","Whether the organization processes data accurately and completely","Whether personal information is collected and used only in accordance with privacy commitments"]'::jsonb, 1,
   'Availability TSC covers: system capacity monitoring, performance monitoring, environmental protections (redundant power, cooling), backup and recovery, and incident response for availability-impacting events. Service organizations select this criterion when customers have contractual uptime SLAs.'),

  (v_qid, 'What type of evidence is most commonly collected to satisfy SOC 2 CC6.1 (Logical Access Controls — Registration and Authorization)?',
   '["Penetration test reports","Screenshots of access request tickets, provisioning approval records, and quarterly user access review completion reports","Network diagrams showing firewall rules","Background check completion records for new employees"]'::jsonb, 1,
   'CC6.1 requires evidence of how access is requested, approved, and granted. Auditors look for: access request tickets, approval by data owner or manager, provisioning system screenshots showing granted access, and periodic recertification/access review evidence proving access is reviewed and revoked when no longer needed.'),

  (v_qid, 'A SOC 2 bridge letter serves which purpose?',
   '["It provides a legal opinion on the service organization''s compliance with applicable laws","It extends the coverage of an existing SOC 2 report to cover a gap period between the report''s end date and the current date, confirming that no significant changes occurred","It bridges the requirements of SOC 2 with ISO 27001 for mutual recognition","It summarizes the report for non-technical stakeholders such as procurement teams"]'::jsonb, 1,
   'Bridge letters (also called comfort letters or gap letters) address report staleness. If a customer requires SOC 2 coverage through Q4 but the current report only covers through Q2, the service organization''s management signs a bridge letter confirming no material changes in the control environment during the gap period.'),

  (v_qid, 'Vanta, Drata, and Secureframe are SOC 2 automation platforms that reduce audit preparation time by:',
   '["Automatically passing SOC 2 audits without external auditor involvement","Continuously monitoring technical controls via API integrations (AWS, GitHub, Okta, Jira) and automatically collecting evidence screenshots, reducing manual evidence gathering by 70–90%","Replacing the AICPA Trust Services Criteria with their own control frameworks","Providing AI-generated control responses that eliminate the need for actual control implementation"]'::jsonb, 1,
   'These platforms integrate with your tech stack to automate evidence collection: they pull AWS Config compliance checks, GitHub access logs, Okta MFA enforcement, Jira change tickets — continuously. When the auditor requests evidence, it''s already collected and organized, transforming audit prep from months of manual work to days of review.'),

  (v_qid, 'Processing Integrity as a Trust Services Criterion ensures:',
   '["That the system processes data without unauthorized disclosure","That system processing is complete, valid, accurate, timely, and authorized — important for organizations that process financial transactions or perform data transformation services","That the organization has implemented encryption for all data","That personal information is handled in accordance with privacy laws"]'::jsonb, 1,
   'Processing Integrity is selected by organizations where data accuracy is a core service promise: payment processors, payroll providers, data analytics platforms. It requires controls ensuring transactions are not lost, duplicated, or incorrectly processed — input controls, processing validations, output reconciliation, and error handling.'),

  (v_qid, 'The SOC 2 Privacy Trust Services Criterion differs from the Confidentiality criterion in that:',
   '["They are identical; the terms are used interchangeably","Privacy covers personal information (PII) and requires adherence to the AICPA''s Privacy Management Framework and applicable privacy laws; Confidentiality covers any sensitive business information that must be protected from unauthorized disclosure","Confidentiality applies to cloud providers; Privacy applies to SaaS providers","Privacy is mandatory for all SOC 2 reports; Confidentiality is optional"]'::jsonb, 1,
   'Confidentiality applies to any sensitive data (trade secrets, financial data, health records) designated as confidential. Privacy specifically addresses personal information of individuals — notice, consent, data subject rights, retention, and disposal — and aligns with regulations like GDPR and CCPA. Both can be selected if applicable.'),

  (v_qid, 'A service auditor issues a SOC 2 qualified opinion. What does this indicate?',
   '["The audit was completed with the highest level of assurance","One or more control deficiencies were found that are material enough that the auditor cannot provide an unqualified (clean) opinion — specific criteria were not met","The organization achieved SOC 2 certification with minor observations","The organization''s controls exceeded the minimum Trust Services Criteria requirements"]'::jsonb, 1,
   'A qualified opinion means the auditor found material deficiencies in one or more criteria. An unqualified (clean) opinion confirms all criteria were met. Qualifications are serious: they signal to customers that specific controls failed. Organizations receiving qualified opinions must communicate them transparently and remediate before the next audit.'),

  (v_qid, 'During a SOC 2 audit, the auditor performs walkthrough testing. This means:',
   '["The auditor physically walks through the data center to verify physical security controls","The auditor selects a sample transaction and traces it through the control process end-to-end — from initiation through authorization, processing, and recording — to verify the control works as described","The auditor reviews all policies and procedures in a single meeting with management","The auditor performs a penetration test against the production environment"]'::jsonb, 1,
   'Walkthrough testing validates that controls work as designed by tracing a sample transaction through the process. For an access provisioning control, the auditor might select a specific new hire, trace their access request through approval, provisioning, and verification — confirming each control step actually occurred.'),

  (v_qid, 'What is the Security (Common Criteria) section''s CC9 category about in SOC 2?',
   '["Cryptographic key management","Risk Mitigation — specifically managing risks related to vendors and business partners (complementary subservice organization controls)","Change management controls for system modifications","Monitoring activities and remediation of identified deficiencies"]'::jsonb, 1,
   'CC9 covers risk mitigation, focusing on vendor/subservice organization risk. CC9.1 addresses identifying, selecting, and managing vendors; CC9.2 covers complementary subservice organization controls (CSOCs) — what subservice providers must implement for the primary service organization''s controls to function. Think of it as vendor risk management baked into SOC 2.'),

  (v_qid, 'Which description best captures what makes SOC 2 a competitive differentiator rather than merely a compliance requirement?',
   '["SOC 2 provides a tax benefit for certified organizations","SOC 2 is a signal of mature security operations that satisfies enterprise security questionnaires, accelerates procurement cycles, and enables sales into regulated industries that require vendor attestation as a prerequisite for purchasing","SOC 2 guarantees the organization has never experienced a data breach","SOC 2 is required by law for all US companies handling customer data"]'::jsonb, 1,
   'Enterprise buyers in regulated industries (financial services, healthcare, government) often require SOC 2 as a vendor onboarding prerequisite. Sales teams report that SOC 2 Type II shortens deal cycles by eliminating weeks of security questionnaire back-and-forth. The trust signal it provides — reviewed by a third-party auditor — differentiates compliant vendors from those making unverified security claims.');

  -- ============================================================
  -- MODULE 09 — ISO 27001  (pass threshold: 85%)
  -- ============================================================
  SELECT id INTO v_ch FROM public.chapters
    WHERE course_id = v_cid ORDER BY order_index LIMIT 1 OFFSET 8;
  SELECT id INTO v_qid FROM public.quizzes
    WHERE chapter_id = v_ch AND quiz_type = 'chapter_end';

  INSERT INTO public.quiz_questions (quiz_id, question_text, options, correct_answer_index, explanation) VALUES

  (v_qid, 'The ISO/IEC 27001:2022 update reduced the Annex A control count compared to 2013. How many controls does the 2022 edition contain, and how many Annex A themes?',
   '["114 controls across 14 domains","93 controls across 4 themes (Organizational, People, Physical, Technological)","138 controls across 18 categories","77 controls across 10 sections"]'::jsonb, 1,
   'ISO 27001:2022 reorganized Annex A from 114 controls in 14 domains (2013 edition) to 93 controls across 4 themes: Organizational (37 controls), People (8 controls), Physical (14 controls), and Technological (34 controls). Eleven new controls were added; others were merged or reworded.'),

  (v_qid, 'ISMS stands for Information Security Management System. An ISMS is best described as:',
   '["A software platform for managing security incidents","A systematic framework of policies, processes, people, and technology that an organization implements to manage information security risks holistically","A technical standard for encrypting sensitive data","A government certification program for critical infrastructure providers"]'::jsonb, 1,
   'An ISMS is not a product — it is a management system. It encompasses: scope definition, risk assessment methodology, risk treatment, policy framework, control implementation, performance measurement, internal audit, management review, and continual improvement. ISO 27001 specifies the requirements for establishing, implementing, and maintaining an ISMS.'),

  (v_qid, 'ISO 27001 certification is issued by:',
   '["ISO (the International Organization for Standardization) directly","An accredited Certification Body (CB) — a third-party auditing organization accredited by a national accreditation body (e.g., UKAS in the UK, ANAB in the US)","The organization itself through a self-declaration process","A government regulatory agency in the organization''s country of operation"]'::jsonb, 1,
   'ISO does not issue certifications. Certificates are issued by accredited CBs (BSI, Bureau Veritas, DNV, Intertek, etc.) after successful Stage 1 (documentation review) and Stage 2 (implementation assessment) audits. Accreditation of the CB by a national body (like UKAS or ANAB) validates the CB''s competency and the certificate''s global recognition.'),

  (v_qid, 'ISO 27001 is structured using the High-Level Structure (HLS) and follows the PDCA cycle. In PDCA terms, "Check" corresponds to:',
   '["Establishing the ISMS scope and risk treatment plan","Implementing controls and security measures","Measuring ISMS performance, conducting internal audits, and performing management reviews","Taking corrective actions and continuous improvement activities"]'::jsonb, 2,
   'PDCA applied to ISMS: Plan = establish ISMS (scope, policy, risk assessment, risk treatment); Do = implement controls; Check = monitor and measure (KPIs, internal audits, management reviews, incident tracking); Act = improve (correct nonconformities, implement improvements). "Check" is clauses 9.1, 9.2, 9.3 in the standard.'),

  (v_qid, 'The Statement of Applicability (SoA) is a required ISO 27001 document that:',
   '["Lists all assets in scope for the ISMS","Documents which of the 93 Annex A controls are applicable, whether each is implemented, and justification for any exclusions — serving as the definitive link between risk treatment and control selection","Provides a list of all identified information security risks with their scores","Defines the ISMS scope statement and organizational boundaries"]'::jsonb, 1,
   'The SoA is often described as the "heart" of the ISMS. For each Annex A control: Is it applicable? Why or why not? If applicable, is it currently implemented? What is the implementation status? Auditors use the SoA to verify that risk treatment decisions are reflected in actual control implementation.'),

  (v_qid, 'ISO 27001 Clause 6.1.3 requires risk treatment options to be selected. The four ISO 31000-aligned risk treatment options are:',
   '["Identify, Assess, Treat, Monitor","Accept, Avoid, Transfer, Modify (mitigate)","Prevent, Detect, Respond, Recover","Eliminate, Reduce, Share, Retain"]'::jsonb, 1,
   'ISO 27001 aligns with ISO 31000 for risk treatment: Accept (acknowledge and live with the residual risk), Avoid (stop the activity generating the risk), Transfer (share risk via insurance or contract), and Modify/Mitigate (implement controls to reduce likelihood or impact). All four can be applied to a single risk.'),

  (v_qid, 'ISO 27001 clause 9.2 requires internal audits. What is the primary purpose of the internal audit in an ISMS?',
   '["To replace the need for external certification audits","To independently verify that the ISMS conforms to the standard''s requirements and is effectively implemented and maintained — providing management with objective evidence of ISMS performance","To satisfy customer requests for security assurance","To identify vulnerabilities in IT systems through penetration testing"]'::jsonb, 1,
   'Internal audits (clause 9.2) are a clause requirement, not optional. They provide the organization''s own assessment of ISMS conformity and effectiveness. Findings feed into management review and the corrective action process. External CBs review internal audit records as evidence of the ISMS''s ongoing operation and improvement culture.'),

  (v_qid, 'Management Review (ISO 27001 clause 9.3) must be conducted at what frequency?',
   '["Daily by the CISO","Weekly by the security operations team","At planned intervals — the standard does not specify a fixed frequency, but most organizations conduct them annually or semi-annually to meet the spirit of continual improvement","Every three years coinciding with the certification renewal audit"]'::jsonb, 2,
   'Clause 9.3 requires management reviews at "planned intervals." The standard is intentionally flexible on frequency — what matters is that reviews are conducted with sufficient regularity to assess ISMS performance, consider changes, and make improvement decisions. Annual or semi-annual is the most common practice.'),

  (v_qid, 'ISO 27001 certification has a 3-year lifecycle. What happens during Years 2 and 3?',
   '["The organization recertifies with a full Stage 1 and Stage 2 audit each year","Surveillance audits are conducted (typically annually) to verify the ISMS continues to operate effectively — less extensive than the initial certification audit","No audit activity occurs; the certificate is valid for 3 years without verification","The organization self-certifies using internal audit evidence"]'::jsonb, 1,
   'The certification cycle: Year 1 — full Stage 1 + Stage 2 certification audit. Year 2 — surveillance audit (1st). Year 3 — surveillance audit (2nd). After Year 3, a full recertification audit is required to renew the certificate for another 3-year cycle. Surveillance audits verify continued conformity without a full reassessment.'),

  (v_qid, 'The difference between a Corrective Action and a Preventive Action in ISO 27001 is:',
   '["They are the same concept described differently in the 2013 vs 2022 editions","Corrective Action addresses the root cause of an existing nonconformity to prevent recurrence; Preventive Action (removed from ISO 27001:2015+ as a separate clause) is now embedded in risk management — identifying and treating potential nonconformities before they occur","Corrective Action is internal; Preventive Action involves external parties","Corrective Action requires board approval; Preventive Action is handled by the security team"]'::jsonb, 1,
   'ISO 27001:2015 (and 2022) removed "preventive action" as a standalone clause, recognizing that risk assessment itself IS preventive action. Corrective Action (clause 10.1) addresses actual nonconformities through root cause analysis and systemic fixes. The risk treatment process serves the preventive function by addressing potential issues proactively.'),

  (v_qid, 'ISO 27002 is related to ISO 27001 in which way?',
   '["ISO 27002 is the certification standard; ISO 27001 provides implementation guidance","ISO 27001 specifies ISMS requirements (what must be done); ISO 27002 provides guidance on implementing the Annex A controls (how to do it) — it is a code of practice, not a certification standard","They are identical standards published by different bodies","ISO 27002 replaces ISO 27001 for organizations with mature security programs"]'::jsonb, 1,
   'Organizations certify against ISO 27001. ISO 27002 (Information Security Controls) provides detailed implementation guidance for each of the 93 Annex A controls — explaining objectives, attributes, and implementation considerations. ISO 27002 is a reference guide; ISO 27001 is the auditable standard.'),

  (v_qid, 'New to ISO 27001:2022 Annex A, control 5.7 requires:',
   '["Multi-factor authentication for all privileged accounts","Threat intelligence — the collection, analysis, and use of information about threats to support informed security decisions","Supply chain security for software and services","Web filtering and protection against malware from web-based sources"]'::jsonb, 1,
   'Control 5.7 (Threat intelligence) is one of eleven new controls added in 2022. It requires organizations to collect and analyze threat intelligence relevant to their sector and risk profile, and use it to inform security controls and risk management decisions — integrating intelligence into the ISMS''s risk treatment process.'),

  (v_qid, 'ISO 27001 requires organizations to define the ISMS scope. What is the most common scope definition error that leads to audit nonconformities?',
   '["Defining the scope too broadly to include all organizational assets","Excluding key business processes, locations, or systems that process sensitive information in order to make certification easier — creating artificial scope exclusions that undermine the ISMS''s protective value","Defining the scope in a language other than English","Not including subcontractors and cloud service providers in the scope statement"]'::jsonb, 1,
   'Scope gaming — excluding high-risk or difficult-to-control systems to make certification easier — is a common problem. Auditors scrutinize scope statements against business context. Excluding, for example, a payment processing system from an ISMS scope while it handles customer financial data creates a scope that doesn''t reflect actual risk, potentially invalidating the certificate''s meaning.'),

  (v_qid, 'ISO 27001 Annex A control A.8.8 (2022) addresses vulnerability management. The key requirement is:',
   '["All vulnerabilities must be patched within 24 hours of discovery","Technical vulnerabilities in systems in scope must be identified, evaluated against the organization''s exposure, and treated in a timely manner according to a defined remediation timeline based on risk","Vulnerability scanning must be performed by an external provider annually","Zero-day vulnerabilities must be reported to national cybersecurity authorities within 72 hours"]'::jsonb, 1,
   'A.8.8 requires a systematic vulnerability management process: identify (scan, subscribe to advisories), evaluate (CVSS scoring, exploitation likelihood in your context), prioritize, and remediate within risk-based timelines. Most mature programs define: Critical → 15 days, High → 30 days, Medium → 90 days, Low → 180 days. The specific timelines must be documented and followed.'),

  (v_qid, 'An asset inventory is a foundational ISO 27001 requirement. What information must be documented for each asset?',
   '["Manufacturer, model number, and purchase date only","Asset owner, asset classification (confidentiality level), location, and associated risk treatment — the owner is accountable for appropriate protection throughout the asset lifecycle","IP address, MAC address, and operating system version","Cost, depreciation schedule, and replacement value"]'::jsonb, 1,
   'ISO 27001 clause 8.1 and Annex A 5.9 require an asset inventory covering: asset identification, classification (what sensitivity level does the information have), ownership (who is accountable), location, and status. The asset owner is responsible for ensuring appropriate controls are applied — without ownership, accountability is diffused and controls drift.');

  -- Set competency by module (chapter order_index 0–8)
  UPDATE public.quiz_questions qq
  SET competency = CASE ch.order_index
    WHEN 0 THEN 'cyber:foundations'
    WHEN 1 THEN 'cyber:roles-operations'
    WHEN 2 THEN 'cyber:appsec-cloud'
    WHEN 3 THEN 'cyber:network-infrastructure'
    WHEN 4 THEN 'cyber:appsec-cloud'
    WHEN 5 THEN 'cyber:incident-response'
    WHEN 6 THEN 'cyber:governance-risk'
    WHEN 7 THEN 'cyber:stakeholder-trust'
    WHEN 8 THEN 'cyber:governance-risk'
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
      WHERE ch.course_id = v_cid AND ch.order_index BETWEEN 0 AND 8
    ) AND order_index = 0
  )
  UPDATE public.quiz_questions SET order_index = _ord.rn
  FROM _ord WHERE quiz_questions.id = _ord.id;

  RAISE NOTICE 'M01–M09 quiz questions inserted and tagged.';

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
--   AND ch.order_index BETWEEN 0 AND 8
-- GROUP BY ch.order_index, ch.title
-- ORDER BY ch.order_index;
-- Expected: 9 rows, each with 15 questions
-- =================================================================
