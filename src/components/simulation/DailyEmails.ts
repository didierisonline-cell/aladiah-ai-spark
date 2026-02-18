import { SimEmail } from './SimulationTypes';

// Pre-written risk scenario emails for each day (2-3 per day)
// The AI will add contextual twists based on student actions
export const DAILY_RISK_EMAILS: Record<number, Omit<SimEmail, 'id' | 'read' | 'timestamp'>[]> = {
  1: [
    {
      from: "Rachel Kim — Program Manager",
      subject: "Welcome to Sprint 21 — Key Expectations",
      body: `Hi Scrum Master,\n\nWelcome to Sprint 21 of Project Nebula. As we continue our AWS migration, I want to flag a few things:\n\n1. The VP of Engineering will observe our Sprint Review on Day 8. Make sure the demo is polished.\n2. Compliance team needs security scan results by end of next week.\n3. Budget approval for additional AWS resources is pending — avoid over-provisioning.\n\nPlease ensure the team stays focused on the sprint goal. Any blockers should be escalated to me within 24 hours.\n\nBest,\nRachel Kim\nProgram Manager`,
      priority: "high",
      day: 1,
    },
    {
      from: "IT Infrastructure — ServiceNow",
      subject: "⚠️ Network Change Window Scheduled — Impact on VPC Peering",
      body: `AUTOMATED ALERT\n\nA network maintenance window is scheduled for Thursday 2:00 AM - 6:00 AM EST.\n\nImpacted Services:\n- VPN Gateway connections\n- Cross-account VPC peering routes\n- DNS resolution for internal services\n\nAction Required: If your team has VPC provisioning tasks (NEB-101, NEB-112), coordinate with the Network Ops team to avoid conflicts.\n\nTicket: INFRA-4521\nPriority: Medium\n\n— IT Infrastructure Team`,
      priority: "normal",
      day: 1,
    },
  ],
  2: [
    {
      from: "David Chen — CTO",
      subject: "🔴 URGENT: Security Audit Finding — IAM Policy Gaps",
      body: `Team,\n\nOur internal security audit has flagged CRITICAL findings:\n\n1. Several IAM roles use wildcard (*) permissions — this violates our least-privilege policy\n2. Cross-account access roles lack MFA enforcement\n3. Service accounts have no rotation policy configured\n\nI need a remediation plan by EOD Thursday. Priya — please prioritize NEB-102.\n\nThis could delay our go-live if not addressed. Scrum Master, please ensure this gets proper attention in your sprint planning.\n\nDavid Chen\nChief Technology Officer`,
      priority: "high",
      day: 2,
    },
    {
      from: "Maya Chen — Cloud Engineer",
      subject: "Blocker: AWS Service Quota Limit Reached",
      body: `Hey SM,\n\nI hit an AWS service quota limit while provisioning the VPC. We've reached the maximum number of VPCs in us-east-1.\n\nOptions:\n1. Request a quota increase (takes 24-48 hours)\n2. Clean up unused VPCs from previous sprint\n3. Use a different region (not recommended — latency concerns)\n\nI can't proceed with NEB-101 until this is resolved. Can you help escalate?\n\nThanks,\nMaya`,
      priority: "high",
      day: 2,
    },
    {
      from: "Legal & Compliance",
      subject: "Data Residency Requirement — Updated Policy",
      body: `To: All Migration Teams\n\nEffective immediately, all customer data must comply with updated data residency requirements:\n\n- PII data must remain in us-east-1\n- Backup data in us-west-2 must be encrypted with customer-managed KMS keys\n- Cross-region replication requires explicit compliance sign-off\n\nPlease review your current architecture against these requirements.\n\nCompliance Team`,
      priority: "normal",
      day: 2,
    },
  ],
  3: [
    {
      from: "Carlos Ruiz — DevOps Engineer",
      subject: "CI/CD Pipeline Failure — Build Stage Broken",
      body: `Scrum Master,\n\nThe CI/CD pipeline (NEB-103) has been failing intermittently since this morning.\n\nRoot cause analysis:\n- CodeBuild is timing out on the authentication service build\n- Docker layer caching is not working properly\n- Build time increased from 4 min to 22 min\n\nThis is blocking James from deploying his containerized auth service (NEB-104).\n\nI'm investigating but may need to pair with James to optimize the Dockerfile.\n\nShould I pull this into today's standup as a blocker?\n\nCarlos`,
      priority: "high",
      day: 3,
    },
    {
      from: "External: AWS Support",
      subject: "Case #12847392 — VPC Peering Route Propagation Delay",
      body: `Hello,\n\nRegarding your support case about VPC peering route propagation:\n\nWe've identified a known issue affecting route table updates in us-east-1. The fix is being deployed and should resolve within 6-12 hours.\n\nWorkaround: Manually add static routes to your route tables for cross-VPC communication.\n\nCase Status: In Progress\nSeverity: High\nETA for resolution: 12 hours\n\nAWS Support Team`,
      priority: "normal",
      day: 3,
    },
  ],
  4: [
    {
      from: "James Park — Backend Developer",
      subject: "🤒 Calling in sick today",
      body: `Hi everyone,\n\nI'm not feeling well and won't be able to come in today. I was in the middle of containerizing the auth service (NEB-104).\n\nHere's my status:\n- Dockerfile is 80% done, pushed to feature branch\n- ECS task definition not started yet\n- Integration tests outline is in Confluence\n\nIf someone could review my PR #247, that would help. The remaining work is:\n1. Fix the health check endpoint configuration\n2. Add environment variable mapping\n3. Test locally with docker-compose\n\nSorry for the timing. Should be back tomorrow.\n\nJames`,
      priority: "high",
      day: 4,
    },
    {
      from: "Rachel Kim — Program Manager",
      subject: "Stakeholder Meeting Moved to Wednesday — Demo Prep Needed",
      body: `Hi Scrum Master,\n\nThe VP's schedule changed. Instead of observing Sprint Review on Friday, she wants a mid-sprint progress demo on Wednesday (Day 6).\n\nShe specifically wants to see:\n1. VPC infrastructure provisioned and accessible\n2. CI/CD pipeline running a successful build\n3. Auth service container running in dev environment\n\nPlease assess if these are demo-ready and let me know by EOD.\n\nRachel`,
      priority: "high",
      day: 4,
    },
    {
      from: "Sebastian Vega — QA Engineer",
      subject: "Test Environment Instability",
      body: `SM,\n\nThe QA test environment has been flaky today:\n- RDS instance is running low on storage (87% full)\n- CloudWatch alerts are firing for high CPU on the test ECS cluster\n- Two of my regression test suites are timing out\n\nI can't validate any completed stories until the environment stabilizes. This could create a QA bottleneck later in the sprint.\n\nCan we get this prioritized?\n\nSebastian`,
      priority: "normal",
      day: 4,
    },
  ],
  5: [
    {
      from: "Sean O'Brien — Product Owner",
      subject: "🚨 URGENT: New Compliance Requirement from Legal",
      body: `Scrum Master,\n\nLegal just dropped a bomb. There's a new regulatory requirement that MUST be in place before our production go-live:\n\n"All authentication tokens must implement PKCE (Proof Key for Code Exchange) flow for OAuth 2.0 compliance."\n\nThis wasn't in our original scope. I need the team to add this to the sprint immediately.\n\nEstimated effort: Unknown (James needs to assess)\nDeadline: Must be ready for Sprint Review\n\nI know this is mid-sprint scope change, but legal says it's non-negotiable. How should we handle this?\n\nSean`,
      priority: "high",
      day: 5,
    },
    {
      from: "Priya Sharma — Security Engineer",
      subject: "Vulnerability Scan Results — 3 Critical Findings",
      body: `Hi Team,\n\nI completed the SAST scan (NEB-106) and found the following:\n\n🔴 CRITICAL:\n1. Hardcoded API key in auth-service/config.js (line 47)\n2. SQL injection vulnerability in user lookup query\n3. Insecure TLS 1.0 configuration in legacy endpoint\n\n🟡 HIGH:\n4. Missing CORS configuration on auth API\n5. Session tokens don't expire on password change\n\nCritical findings must be remediated before we can proceed with penetration testing.\n\nFull report attached to NEB-106 in Jira.\n\nPriya`,
      priority: "high",
      day: 5,
    },
  ],
  6: [
    {
      from: "Rachel Kim — Program Manager",
      subject: "Mid-Sprint Demo Prep — Agenda & Expectations",
      body: `Team,\n\nReminder: VP demo is today at 3 PM.\n\nAgenda:\n1. Sprint Goal recap (2 min)\n2. VPC & Infrastructure demo — Maya (5 min)\n3. CI/CD Pipeline walkthrough — Carlos (5 min)\n4. Auth Service container demo — James (5 min)\n5. Security posture update — Priya (3 min)\n6. Q&A (5 min)\n\nScrum Master — please facilitate. Keep it to 25 minutes max.\n\nNote: VP will ask about timeline to production. Have a confident answer ready.\n\nRachel`,
      priority: "high",
      day: 6,
    },
    {
      from: "External: AWS Partner Solutions Architect",
      subject: "Architecture Review Feedback — Project Nebula",
      body: `Hi Team,\n\nI reviewed your architecture diagrams and have the following recommendations:\n\n1. Consider using AWS Transit Gateway instead of direct VPC peering — better scalability\n2. Your NAT Gateway setup should use multiple AZs for high availability\n3. ECS Fargate Spot can reduce costs by 50-70% for non-production workloads\n4. Consider implementing AWS Config rules for compliance monitoring\n\nHappy to schedule a deep-dive session if needed.\n\nBest regards,\nAWS Partner Solutions Architect`,
      priority: "normal",
      day: 6,
    },
  ],
  7: [
    {
      from: "Sebastian Vega — QA Engineer",
      subject: "🔴 CRITICAL: Security Vulnerability in Auth Module",
      body: `URGENT — Scrum Master,\n\nDuring regression testing I found a CRITICAL security vulnerability:\n\nThe authentication module allows session hijacking through predictable session token generation. An attacker can enumerate valid session tokens and impersonate any user.\n\nImpact: HIGH — All user accounts are at risk\nSeverity: P0 — Must fix before any production deployment\n\nSteps to reproduce:\n1. Login with valid credentials\n2. Observe session token pattern (sequential + timestamp)\n3. Generate predicted tokens for other time windows\n4. Use predicted token to access another user's session\n\nI've blocked NEB-104b from moving to "Ready for Release" until this is fixed.\n\nJames and Priya need to collaborate on this immediately.\n\nSebastian`,
      priority: "high",
      day: 7,
    },
    {
      from: "Carlos Ruiz — DevOps Engineer",
      subject: "Deployment Rollback Drill Results",
      body: `SM,\n\nI completed the rollback drill for NEB-103b:\n\n✅ Blue-green deployment switch: 45 seconds\n✅ Database rollback script: 2 minutes\n⚠️ DNS propagation: 8 minutes (exceeds our 5-min target)\n❌ Client-side cache invalidation: Not tested\n\nThe DNS propagation delay could be an issue during a real rollback. I recommend adding CloudFront invalidation to our rollback runbook.\n\nShould I create a follow-up ticket for Sprint 22?\n\nCarlos`,
      priority: "normal",
      day: 7,
    },
    {
      from: "Rachel Kim — Program Manager",
      subject: "Sprint Review Prep — Final Checklist",
      body: `Scrum Master,\n\nFinal day before Sprint Review. Please confirm:\n\n☐ All demo-ready stories are in "Done" or "Ready for Release"\n☐ Sprint metrics are updated (velocity, burndown)\n☐ Known risks are documented in the Risk Register\n☐ Retrospective is scheduled for after the Review\n☐ Team has rehearsed the demo flow\n\nAlso — the VP asked about our confidence level for the Q1 production go-live. Please have data-backed talking points.\n\nRachel`,
      priority: "normal",
      day: 7,
    },
  ],
  8: [
    {
      from: "Sean O'Brien — Product Owner",
      subject: "Sprint Review — What I Need to See",
      body: `Scrum Master,\n\nFor today's Sprint Review, I want the team to demonstrate:\n\n1. ✅ Sprint Goal achievement (how close are we?)\n2. ✅ Working infrastructure — not slides, actual AWS console\n3. ✅ Auth service running in containers with health checks\n4. ✅ Security validation — scan results and remediations\n5. ✅ Monitoring dashboard with real metrics\n\nI'll also be asking each team member what their biggest challenge was and what they learned.\n\nThe VP will be asking about velocity trends and our predictability score.\n\nLet's make this a great finish!\n\nSean`,
      priority: "high",
      day: 8,
    },
    {
      from: "Rachel Kim — Program Manager",
      subject: "Retrospective Focus Areas",
      body: `Hi SM,\n\nFor the retrospective, I'd like the team to reflect on:\n\n1. How well did we handle mid-sprint scope changes?\n2. Were our estimates accurate? Where did we miss?\n3. Communication effectiveness — did blockers get escalated fast enough?\n4. What tooling improvements would help next sprint?\n5. Team dynamics — any interpersonal friction to address?\n\nPlease document action items and share with me by EOD.\n\nRachel`,
      priority: "normal",
      day: 8,
    },
  ],
};

// YouTube video recommendations mapped to risk scenarios
export const RISK_YOUTUBE_RECOMMENDATIONS: Record<string, { title: string; searchQuery: string; reason: string }[]> = {
  'scope_creep': [
    { title: "How to Handle Scope Creep as a Scrum Master", searchQuery: "scrum master handle scope creep mid-sprint", reason: "Learn techniques for negotiating scope changes without derailing the sprint" },
    { title: "Sprint Goal Protection Strategies", searchQuery: "protecting sprint goal from scope changes agile", reason: "Understand how to protect the team while respecting PO needs" },
  ],
  'team_absence': [
    { title: "Managing Team Absences in Scrum", searchQuery: "scrum master team member absent sprint", reason: "Best practices for redistributing work when a team member is unavailable" },
    { title: "Cross-functional Team Skills Matrix", searchQuery: "agile team skills matrix cross training", reason: "Build team resilience through cross-training strategies" },
  ],
  'security_vulnerability': [
    { title: "Security Incidents in Agile Projects", searchQuery: "handling security vulnerability agile sprint", reason: "Learn the proper escalation and response process for critical security findings" },
    { title: "DevSecOps Best Practices", searchQuery: "DevSecOps security scrum integration", reason: "Integrate security into your sprint workflow to catch issues earlier" },
  ],
  'blocker': [
    { title: "Removing Impediments — Scrum Master Guide", searchQuery: "scrum master removing impediments blockers", reason: "Systematic approaches to unblocking your team" },
    { title: "Escalation Frameworks for Scrum Masters", searchQuery: "scrum master escalation framework when to escalate", reason: "Know when and how to escalate blockers effectively" },
  ],
  'stakeholder_pressure': [
    { title: "Stakeholder Management for Scrum Masters", searchQuery: "scrum master stakeholder management techniques", reason: "Navigate executive expectations while protecting the team" },
    { title: "Sprint Review Best Practices", searchQuery: "sprint review demo best practices stakeholders", reason: "Deliver impactful demos that build stakeholder confidence" },
  ],
  'environment_issues': [
    { title: "Managing Test Environment Issues", searchQuery: "test environment management agile devops", reason: "Stabilize testing environments to avoid QA bottlenecks" },
  ],
};
