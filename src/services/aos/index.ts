// =============================================================================
// Aladiah Agent Operating System (AOS) — public facade
// Import from '@/services/aos' everywhere. The eight subsystems are grouped
// under a single `aos` object; named exports are also available for tree-shaking.
// =============================================================================
import * as registry from './registry';
import * as memory from './memory';
import * as tasks from './tasks';
import * as orchestrator from './orchestrator';
import * as logs from './logs';
import * as permissions from './permissions';
import * as health from './health';
import * as comms from './communication';
import { ensureAOS } from './bootstrap';

export const aos = {
  ensure: ensureAOS,
  registry,       // 1. Agent Registry
  memory,         // 2. Agent Memory
  tasks,          // 3. Agent Task Manager
  orchestrator,   // 4. Agent Orchestrator
  logs,           // 5. Execution Logs (+ runs)
  permissions,    // 6. Permissions Framework
  health,         // 7. Health Monitoring
  comms,          // 8. Communication Layer
};

export { ensureAOS };
export * from './registry';
export * from './memory';
export * from './tasks';
export * from './orchestrator';
export * from './logs';
export * from './permissions';
export * from './health';
export * from './communication';
export * from '@/types/aos';
