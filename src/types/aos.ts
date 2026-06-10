// =============================================================================
// Aladiah Agent Operating System (AOS) — shared types
// Mirrors migration 20260610130000_agent_operating_system.sql.
// Every agent in the workforce uses these types; do not fork them.
// =============================================================================

// ---- Permissions framework -------------------------------------------------
export type Capability = 'read' | 'write' | 'publish' | 'admin';

export interface AgentPermissions {
  read: boolean;
  write: boolean;
  publish: boolean;
  admin: boolean;
  /** When true, write/publish actions must be approved by a human before executing. */
  human_approval_required: boolean;
}

export const DEFAULT_PERMISSIONS: AgentPermissions = {
  read: true,
  write: true,
  publish: false,
  admin: false,
  human_approval_required: true,
};

// ---- 1. Registry -----------------------------------------------------------
export type AgentStatus = 'active' | 'paused' | 'disabled' | 'error';
export type Cadence = 'manual' | 'hourly' | 'daily' | 'weekly';

export interface AgentRecord {
  id: string;
  slug: string;
  name: string;
  role: string | null;
  description: string | null;
  status: AgentStatus;
  priority: number;
  cadence: Cadence;
  schedule_cron: string | null;
  system_prompt: string | null;
  permissions: AgentPermissions;
  config: Record<string, unknown>;
  last_run_at: string | null;
  next_run_at: string | null;
  last_success_at: string | null;
  last_error_at: string | null;
  last_error: string | null;
  run_count: number;
  error_count: number;
  consecutive_failures: number;
  performance_score: number;
  avg_duration_ms: number | null;
  created_at: string;
  updated_at: string;
}

export interface RegisterAgentInput {
  slug: string;
  name: string;
  role?: string;
  description?: string;
  status?: AgentStatus;
  priority?: number;
  cadence?: Cadence;
  schedule_cron?: string;
  system_prompt?: string;
  permissions?: Partial<AgentPermissions>;
  config?: Record<string, unknown>;
}

// ---- 2. Memory -------------------------------------------------------------
export type MemoryType = 'short_term' | 'long_term' | 'episodic';

export interface AgentMemory {
  id: string;
  agent_slug: string;
  memory_type: MemoryType;
  content: string;
  summary: string | null;
  importance: number; // 0.0 - 1.0
  tags: string[];
  source: string | null;
  metadata: Record<string, unknown>;
  embedding: number[] | null;
  expires_at: string | null;
  access_count: number;
  last_accessed_at: string | null;
  created_at: string;
}

export interface RememberInput {
  agentSlug: string;
  content: string;
  summary?: string;
  type?: MemoryType;
  importance?: number; // omit to auto-score
  tags?: string[];
  source?: string;
  metadata?: Record<string, unknown>;
  /** TTL in hours for short-term memory (default 72). */
  ttlHours?: number;
}

export interface RecallOptions {
  type?: MemoryType;
  tags?: string[];
  minImportance?: number;
  limit?: number;
}

// ---- 3. Tasks --------------------------------------------------------------
export type TaskStatus =
  | 'pending'
  | 'ready'
  | 'in_progress'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'cancelled';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface AgentTask {
  id: string;
  title: string;
  description: string | null;
  created_by_agent: string | null;
  assigned_agent: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  depends_on: string[];
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  due_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  source_report_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  createdByAgent?: string;
  assignedAgent?: string;
  priority?: TaskPriority;
  dependsOn?: string[];
  payload?: Record<string, unknown>;
  dueAt?: string;
  sourceReportId?: string;
}

// ---- 4. Orchestrator runs --------------------------------------------------
export type RunStatus = 'running' | 'success' | 'error' | 'retrying' | 'timeout';
export type TriggerSource = 'manual' | 'cron' | 'orchestrator' | 'message';

export interface AgentRun {
  id: string;
  agent_slug: string;
  trigger_source: TriggerSource;
  status: RunStatus;
  attempt: number;
  max_attempts: number;
  started_at: string;
  finished_at: string | null;
  duration_ms: number | null;
  error: string | null;
  output: Record<string, unknown> | null;
  created_at: string;
}

// ---- 5. Execution logs -----------------------------------------------------
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type ActionResult = 'success' | 'error' | 'skipped';

export interface ExecutionLog {
  id: string;
  run_id: string | null;
  agent_slug: string;
  action: string;
  level: LogLevel;
  result: ActionResult | null;
  message: string | null;
  detail: Record<string, unknown>;
  error: string | null;
  created_at: string;
}

// ---- 7. Health -------------------------------------------------------------
export interface AgentHealth {
  slug: string;
  name: string;
  status: AgentStatus;
  uptimePct: number; // success_rate over recorded runs
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  errorCount: number;
  consecutiveFailures: number;
  performanceScore: number;
  avgDurationMs: number | null;
  health: 'healthy' | 'degraded' | 'down' | 'idle';
}

// ---- 8. Communication ------------------------------------------------------
export type MessageType = 'message' | 'task_request' | 'report' | 'alert' | 'response';
export type MessageStatus = 'unread' | 'read' | 'processed' | 'archived';

export interface AgentMessage {
  id: string;
  from_agent: string;
  to_agent: string;
  message_type: MessageType;
  subject: string | null;
  body: string | null;
  payload: Record<string, unknown>;
  status: MessageStatus;
  related_task_id: string | null;
  related_report_id: string | null;
  requires_response: boolean;
  in_reply_to: string | null;
  created_at: string;
  read_at: string | null;
}

export interface SendMessageInput {
  fromAgent: string;
  toAgent: string;
  type?: MessageType;
  subject?: string;
  body?: string;
  payload?: Record<string, unknown>;
  relatedTaskId?: string;
  relatedReportId?: string;
  requiresResponse?: boolean;
  inReplyTo?: string;
}

// ---- Orchestrator runner contract ------------------------------------------
/** Context handed to an agent's runner during an orchestrated execution. */
export interface RunContext {
  agentSlug: string;
  runId: string | null;
  trigger: TriggerSource;
  /** Structured logging bound to this run. */
  log: (
    action: string,
    opts?: { level?: LogLevel; result?: ActionResult; message?: string; detail?: Record<string, unknown>; error?: string },
  ) => Promise<void>;
}

export interface AgentRunOutput {
  ok: boolean;
  output?: Record<string, unknown>;
  error?: string;
}

/** A runner is the executable body of an agent. Registered with the orchestrator. */
export type AgentRunner = (ctx: RunContext) => Promise<AgentRunOutput>;
