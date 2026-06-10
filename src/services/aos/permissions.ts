// =============================================================================
// AOS Subsystem 6 — Permissions Framework
// Capabilities: read · write · publish · admin · human_approval_required.
// Enforced in the service layer (and structurally by RLS, which never lets an
// agent reach beyond the admin session it runs under).
// =============================================================================
import { AgentPermissions, Capability, DEFAULT_PERMISSIONS } from '@/types/aos';
import { getAgent } from './registry';

export class PermissionError extends Error {
  constructor(public agentSlug: string, public capability: Capability) {
    super(`Agent "${agentSlug}" is not permitted to ${capability}.`);
    this.name = 'PermissionError';
  }
}

/** Approval is required when a sensitive action is gated for a human to confirm. */
export class ApprovalRequiredError extends Error {
  constructor(public agentSlug: string, public action: string) {
    super(`Action "${action}" by "${agentSlug}" requires human approval.`);
    this.name = 'ApprovalRequiredError';
  }
}

export async function getPermissions(agentSlug: string): Promise<AgentPermissions> {
  const agent = await getAgent(agentSlug);
  return { ...DEFAULT_PERMISSIONS, ...(agent?.permissions ?? {}) };
}

export async function can(agentSlug: string, capability: Capability): Promise<boolean> {
  const perms = await getPermissions(agentSlug);
  return Boolean(perms[capability]);
}

export async function requiresHumanApproval(agentSlug: string): Promise<boolean> {
  const perms = await getPermissions(agentSlug);
  return Boolean(perms.human_approval_required);
}

/**
 * Guard a capability. Throws PermissionError when the agent lacks it.
 * For write/publish, also throws ApprovalRequiredError when the agent is gated —
 * unless the caller passes { approved: true } (i.e. a human has approved it).
 */
export async function guard(
  agentSlug: string,
  capability: Capability,
  opts: { action?: string; approved?: boolean } = {},
): Promise<void> {
  const perms = await getPermissions(agentSlug);
  if (!perms[capability]) throw new PermissionError(agentSlug, capability);

  const sensitive = capability === 'write' || capability === 'publish';
  if (sensitive && perms.human_approval_required && !opts.approved) {
    throw new ApprovalRequiredError(agentSlug, opts.action ?? capability);
  }
}
