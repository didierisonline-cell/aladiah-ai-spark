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

export interface BoardStory {
  id: string;
  title: string;
  points: number;
  epic: string;
  priority: string;
  assignee: string;
  status: string;
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

export const INITIAL_BACKLOG: BoardStory[] = [
  { id: "NEB-101", title: "Provision AWS VPC with private/public subnets", points: 8, epic: "Infrastructure", priority: "Critical", assignee: "Maya", status: "Backlog" },
  { id: "NEB-102", title: "Configure IAM roles and policies for migration", points: 5, epic: "Security", priority: "Critical", assignee: "Priya", status: "Backlog" },
  { id: "NEB-103", title: "Set up CI/CD pipeline with CodePipeline", points: 8, epic: "DevOps", priority: "High", assignee: "Carlos", status: "Backlog" },
  { id: "NEB-104", title: "Migrate Authentication Service to AWS ECS", points: 13, epic: "Migration", priority: "Critical", assignee: "James", status: "Backlog" },
  { id: "NEB-105", title: "Configure CloudWatch monitoring & alerts", points: 5, epic: "Observability", priority: "High", assignee: "Carlos", status: "Backlog" },
  { id: "NEB-106", title: "Security scan and penetration testing", points: 8, epic: "Security", priority: "High", assignee: "Priya", status: "Backlog" },
  { id: "NEB-107", title: "Set up AWS WAF and Shield for DDoS protection", points: 5, epic: "Security", priority: "Medium", assignee: "Maya", status: "Backlog" },
  { id: "NEB-108", title: "Database migration plan for RDS PostgreSQL", points: 8, epic: "Migration", priority: "High", assignee: "James", status: "Backlog" },
  { id: "NEB-109", title: "Load testing and performance benchmarking", points: 5, epic: "QA", priority: "Medium", assignee: "Sebastian", status: "Backlog" },
  { id: "NEB-110", title: "Disaster recovery and failover configuration", points: 8, epic: "Infrastructure", priority: "Medium", assignee: "Maya", status: "Backlog" },
  { id: "NEB-111", title: "Write acceptance criteria for auth migration", points: 3, epic: "Analysis", priority: "High", assignee: "Aisha", status: "Backlog" },
  { id: "NEB-112", title: "Network peering and firewall rules", points: 5, epic: "Infrastructure", priority: "Critical", assignee: "Maya", status: "Backlog" },
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
