export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
}

export interface Message {
  id?: string;
  speaker: string;
  content: string;
  role: string;
}

export interface DayScore {
  facilitation_score: number;
  communication_score: number;
  artifact_score: number;
  decision_score: number;
  total_score: number;
  feedback: string;
}

export interface StoryTicketData {
  fixVersion: string;
  platform: string;
  team: string;
  sprint: string;
  dueDate: string;
  tags: string[];
  comments: StoryComment[];
  notes: string;
  acceptanceCriteria: string[];
  figmaUrl: string;
}

export interface UserStory {
  asA: string;
  iWantTo: string;
  soThatICan: string;
}

export interface StoryComment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface BoardStory {
  id: string;
  title: string;
  points: number;
  epic: string;
  priority: string;
  assignee: string;
  status: string;
  description?: string;
  userStory?: UserStory;
  ticketData?: StoryTicketData;
}

export interface SimEmail {
  id: string;
  from: string;
  subject: string;
  body: string;
  priority: string;
  day: number;
  read: boolean;
  timestamp: string;
}

export interface RiskItem {
  id: string;
  risk: string;
  impact: string;
  owner: string;
  mitigation: string;
  day: number;
  status: 'open' | 'mitigated' | 'closed';
}

export interface ExecutiveReport {
  health: string;
  summary: string;
  risks: string;
  next_focus: string;
  day: number;
}

export const TEAM_MEMBERS: Record<string, { role: string; avatar: string }> = {
  "Sean": { role: "Product Owner", avatar: "👔" },
  "Aisha": { role: "Business Analyst", avatar: "📋" },
  "Maya": { role: "Cloud Engineer", avatar: "☁️" },
  "Carlos": { role: "DevOps Engineer", avatar: "⚙️" },
  "James": { role: "Backend Developer", avatar: "💻" },
  "Priya": { role: "Security Engineer", avatar: "🔒" },
  "Sebastian": { role: "QA Engineer", avatar: "🔍" },
  "Narrator": { role: "System", avatar: "📢" },
  "Scrum Master (You)": { role: "You", avatar: "🎯" },
};

export const SPRINT_SCHEDULE = [
  { day: 1, weekday: "Wednesday", ceremonies: ["Sprint Planning"], description: "Sprint Planning — No Daily StandUp", week: 1 },
  { day: 2, weekday: "Thursday", ceremonies: ["Daily StandUp", "Scrum of Scrums"], description: "StandUp → Development", week: 1 },
  { day: 3, weekday: "Friday", ceremonies: ["Daily StandUp", "Backlog Refinement"], description: "StandUp → Dev + Refinement", week: 1 },
  { day: 4, weekday: "Monday", ceremonies: ["Daily StandUp", "Scrum of Scrums"], description: "Week 2 — StandUp → Dev", week: 2 },
  { day: 5, weekday: "Tuesday", ceremonies: ["Daily StandUp"], description: "Mid-Sprint — Board Audit", week: 2 },
  { day: 6, weekday: "Wednesday", ceremonies: ["Daily StandUp", "Backlog Refinement"], description: "StandUp → Refinement + Pre-Demo", week: 2 },
  { day: 7, weekday: "Thursday", ceremonies: ["Daily StandUp"], description: "Stabilization — No new stories", week: 2 },
  { day: 8, weekday: "Friday", ceremonies: ["Daily StandUp", "Sprint Review", "Retrospective"], description: "Sprint Close Day", week: 2 },
];

const defaultTicket = (): StoryTicketData => ({
  fixVersion: 'v2.1.0',
  platform: 'AWS',
  team: 'Nebula Core',
  sprint: 'Sprint 21',
  dueDate: '',
  tags: [],
  comments: [],
  notes: '',
  acceptanceCriteria: [],
  figmaUrl: '',
});

export const INITIAL_BACKLOG: BoardStory[] = [
  { id: "NEB-101", title: "Provision AWS VPC — public subnets", points: 5, epic: "Infrastructure", priority: "Critical", assignee: "Maya", status: "Backlog", description: "Set up VPC with public subnets, internet gateway, and route tables for web-facing services.", userStory: { asA: "Cloud Engineer", iWantTo: "provision a VPC with public subnets and internet gateway", soThatICan: "host web-facing services with proper network isolation" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["VPC created with CIDR 10.0.0.0/16", "At least 2 public subnets across AZs", "Internet gateway attached and routes configured", "Security groups allow HTTP/HTTPS inbound"], figmaUrl: "" } },
  { id: "NEB-101b", title: "Provision AWS VPC — private subnets & NAT", points: 3, epic: "Infrastructure", priority: "Critical", assignee: "Maya", status: "Backlog", description: "Configure private subnets with NAT gateway for internal services.", userStory: { asA: "Cloud Engineer", iWantTo: "configure private subnets with NAT gateway", soThatICan: "allow internal services to access the internet securely without public exposure" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Private subnets created in 2+ AZs", "NAT gateway provisioned in public subnet", "Route tables updated for private subnets"], figmaUrl: "" } },
  { id: "NEB-102", title: "Configure IAM roles and policies for migration", points: 5, epic: "Security", priority: "Critical", assignee: "Priya", status: "Backlog", description: "Create least-privilege IAM roles for each service team and cross-account access policies.", userStory: { asA: "Security Engineer", iWantTo: "create least-privilege IAM roles and policies", soThatICan: "ensure each team has only the permissions needed for migration tasks" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["IAM roles created per service team", "Policies follow least-privilege principle", "Cross-account access tested and documented"], figmaUrl: "" } },
  { id: "NEB-103", title: "Set up CI/CD pipeline — build stage", points: 3, epic: "DevOps", priority: "High", assignee: "Carlos", status: "Backlog", description: "Configure CodePipeline source and build stages with CodeBuild.", userStory: { asA: "DevOps Engineer", iWantTo: "set up the build stage of our CI/CD pipeline", soThatICan: "automate code compilation and artifact generation on every commit" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["CodePipeline triggers on main branch push", "CodeBuild project compiles successfully", "Build artifacts stored in S3"], figmaUrl: "" } },
  { id: "NEB-103b", title: "Set up CI/CD pipeline — deploy & approval", points: 5, epic: "DevOps", priority: "High", assignee: "Carlos", status: "Backlog", description: "Add deployment stage with manual approval gate and rollback strategy.", userStory: { asA: "DevOps Engineer", iWantTo: "add deployment stages with approval gates", soThatICan: "safely deploy to production with rollback capability" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Manual approval gate before prod deploy", "Rollback mechanism tested", "Deployment notifications via SNS"], figmaUrl: "" } },
  { id: "NEB-104", title: "Migrate Auth Service — containerize", points: 5, epic: "Migration", priority: "Critical", assignee: "James", status: "Backlog", description: "Dockerize the authentication service and create ECS task definitions.", userStory: { asA: "Backend Developer", iWantTo: "containerize the auth service with Docker", soThatICan: "deploy it consistently across environments using ECS" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Dockerfile created and optimized", "ECS task definition configured", "Container passes health check locally"], figmaUrl: "" } },
  { id: "NEB-104b", title: "Migrate Auth Service — deploy to ECS", points: 5, epic: "Migration", priority: "Critical", assignee: "James", status: "Backlog", description: "Deploy containerized auth service to ECS Fargate with load balancer.", userStory: { asA: "Backend Developer", iWantTo: "deploy the auth container to ECS Fargate", soThatICan: "serve authentication requests through a scalable, managed infrastructure" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["ECS service running on Fargate", "ALB configured with health checks", "Auto-scaling policy defined"], figmaUrl: "" } },
  { id: "NEB-104c", title: "Migrate Auth Service — integration tests", points: 3, epic: "Migration", priority: "High", assignee: "James", status: "Backlog", description: "Write and run integration tests against the deployed ECS service.", userStory: { asA: "Backend Developer", iWantTo: "run integration tests against the deployed auth service", soThatICan: "verify end-to-end authentication flows work in the cloud environment" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Login/logout flows tested", "Token refresh verified", "Error scenarios covered"], figmaUrl: "" } },
  { id: "NEB-105", title: "Configure CloudWatch monitoring & alerts", points: 5, epic: "Observability", priority: "High", assignee: "Carlos", status: "Backlog", description: "Set up CloudWatch dashboards, custom metrics, and SNS alerting.", userStory: { asA: "DevOps Engineer", iWantTo: "set up CloudWatch monitoring with custom dashboards", soThatICan: "detect and respond to infrastructure issues in real-time" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Dashboard shows CPU, memory, request metrics", "SNS alerts for >80% resource usage", "Custom metrics for auth service latency"], figmaUrl: "" } },
  { id: "NEB-106", title: "Security scan — static analysis", points: 3, epic: "Security", priority: "High", assignee: "Priya", status: "Backlog", description: "Run SAST tools on all migration artifacts and remediate findings.", userStory: { asA: "Security Engineer", iWantTo: "run static analysis on all migration code", soThatICan: "identify and fix security vulnerabilities before deployment" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["SAST scan completed on all repos", "Critical/High findings remediated", "Scan report documented"], figmaUrl: "" } },
  { id: "NEB-106b", title: "Security scan — penetration testing", points: 5, epic: "Security", priority: "High", assignee: "Priya", status: "Backlog", description: "Conduct pen testing on deployed infrastructure and document results.", userStory: { asA: "Security Engineer", iWantTo: "conduct penetration testing on the deployed infrastructure", soThatICan: "validate our defenses against real-world attack vectors" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["External pen test completed", "All critical vulnerabilities patched", "Remediation report shared with team"], figmaUrl: "" } },
  { id: "NEB-107", title: "Set up AWS WAF and Shield for DDoS protection", points: 5, epic: "Security", priority: "Medium", assignee: "Maya", status: "Backlog", description: "Configure WAF rules and enable Shield Advanced for DDoS protection.", userStory: { asA: "Cloud Engineer", iWantTo: "configure WAF rules and DDoS protection", soThatICan: "protect our public endpoints from malicious traffic and attacks" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["WAF rules block SQL injection & XSS", "Shield Advanced enabled", "Rate limiting configured"], figmaUrl: "" } },
  { id: "NEB-108", title: "Database migration plan — schema mapping", points: 3, epic: "Migration", priority: "High", assignee: "James", status: "Backlog", description: "Map existing DB schema to RDS PostgreSQL and plan migration steps.", userStory: { asA: "Backend Developer", iWantTo: "map our existing database schema to RDS PostgreSQL", soThatICan: "ensure data integrity and compatibility during the migration" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Schema mapping document complete", "Data type conversions identified", "Migration sequence defined"], figmaUrl: "" } },
  { id: "NEB-108b", title: "Database migration plan — DMS setup", points: 5, epic: "Migration", priority: "High", assignee: "James", status: "Backlog", description: "Configure AWS DMS for continuous replication during migration.", userStory: { asA: "Backend Developer", iWantTo: "set up AWS DMS for continuous data replication", soThatICan: "migrate the database with zero downtime using live replication" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["DMS replication instance created", "Source and target endpoints configured", "Full load + CDC replication tested"], figmaUrl: "" } },
  { id: "NEB-109", title: "Load testing and performance benchmarking", points: 5, epic: "QA", priority: "Medium", assignee: "Sebastian", status: "Backlog", description: "Run load tests with k6/Locust and document baseline performance.", userStory: { asA: "QA Engineer", iWantTo: "run load tests and benchmark performance", soThatICan: "establish baseline metrics and identify bottlenecks before go-live" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Load test scripts created for key endpoints", "Baseline metrics documented (p50, p95, p99)", "Bottlenecks identified and reported"], figmaUrl: "" } },
  { id: "NEB-110", title: "Disaster recovery — backup config", points: 3, epic: "Infrastructure", priority: "Medium", assignee: "Maya", status: "Backlog", description: "Configure automated RDS snapshots and S3 cross-region backup.", userStory: { asA: "Cloud Engineer", iWantTo: "configure automated backups and cross-region replication", soThatICan: "ensure data durability and quick recovery in case of failure" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Automated RDS snapshots every 6 hours", "S3 cross-region replication enabled", "Backup retention policy set to 30 days"], figmaUrl: "" } },
  { id: "NEB-110b", title: "Disaster recovery — failover testing", points: 5, epic: "Infrastructure", priority: "Medium", assignee: "Maya", status: "Backlog", description: "Test multi-AZ failover and document recovery time objectives.", userStory: { asA: "Cloud Engineer", iWantTo: "test multi-AZ failover scenarios", soThatICan: "verify our RTO/RPO targets are met and document the recovery process" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["Multi-AZ failover tested successfully", "RTO < 15 minutes verified", "Runbook documented for DR procedures"], figmaUrl: "" } },
  { id: "NEB-111", title: "Write acceptance criteria for auth migration", points: 3, epic: "Analysis", priority: "High", assignee: "Aisha", status: "Backlog", description: "Define acceptance criteria with PO for auth service migration stories.", userStory: { asA: "Business Analyst", iWantTo: "define clear acceptance criteria for the auth migration", soThatICan: "ensure the team delivers exactly what the business needs" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["AC written for all auth migration stories", "PO sign-off obtained", "Edge cases documented"], figmaUrl: "" } },
  { id: "NEB-112", title: "Network peering and firewall rules", points: 5, epic: "Infrastructure", priority: "Critical", assignee: "Maya", status: "Backlog", description: "Set up VPC peering, security groups, and NACLs for cross-service communication.", userStory: { asA: "Cloud Engineer", iWantTo: "configure VPC peering and firewall rules", soThatICan: "enable secure cross-service communication between our microservices" }, ticketData: { ...defaultTicket(), acceptanceCriteria: ["VPC peering connection established", "Security groups restrict traffic to needed ports", "NACLs configured as additional defense layer"], figmaUrl: "" } },
];

export const BOARD_COLUMNS = ["Backlog", "Ready", "In Progress", "Code Review", "QA", "Ready for Release", "Done"];

export const PRIORITY_COLORS: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/30",
  High: "bg-secondary/10 text-secondary border-secondary/30",
  Medium: "bg-accent/10 text-accent-foreground border-accent/30",
  Low: "bg-muted text-muted-foreground border-border",
};

export const EPIC_COLORS: Record<string, string> = {
  Infrastructure: "bg-primary/10 text-primary",
  Security: "bg-destructive/10 text-destructive",
  DevOps: "bg-accent/10 text-accent-foreground",
  Migration: "bg-secondary/10 text-secondary",
  Observability: "bg-primary/10 text-primary",
  QA: "bg-muted text-muted-foreground",
  Analysis: "bg-accent/10 text-accent-foreground",
};
