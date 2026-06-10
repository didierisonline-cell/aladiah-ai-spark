// =============================================================================
// Aladiah Marketing Content Agent — shared types
// Mirrors migration 20260610140000_marketing_content_agent.sql.
// =============================================================================

export const MARKETING_AGENT_SLUG = 'marketing-content';

export type Platform =
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'blog'
  | 'email'
  | 'youtube'
  | 'webinar'
  | 'lead_magnet';

export type ContentStatus =
  | 'draft'
  | 'queued'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'scheduled'
  | 'published';

export type CampaignStatus = 'planning' | 'active' | 'paused' | 'completed';
export type CalendarScope = 'daily' | 'weekly' | 'monthly';

export interface MarketingContent {
  id: string;
  agent_slug: string;
  platform: Platform;
  content_type: string;
  title: string | null;
  hook: string | null;
  body: string | null;
  cta: string | null;
  hashtags: string[];
  theme: string | null;
  audience: string | null;
  status: ContentStatus;
  campaign_id: string | null;
  calendar_id: string | null;
  source_idea: string | null;
  repurposed_from: string | null;
  performance: Record<string, number>;
  metadata: Record<string, unknown>;
  scheduled_for: string | null;
  created_by_agent: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  objective: string | null;
  goal: string | null;
  theme: string | null;
  status: CampaignStatus;
  channels: Platform[];
  start_date: string | null;
  end_date: string | null;
  summary: string | null;
  created_by_agent: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CalendarSlot {
  date: string;
  platform: Platform;
  content_type: string;
  title: string;
  theme: string;
  status: 'planned' | 'generated';
  content_id?: string | null;
}

export interface ContentCalendar {
  id: string;
  scope: CalendarScope;
  period_start: string;
  period_end: string | null;
  theme: string | null;
  status: string;
  plan: CalendarSlot[];
  created_by_agent: string | null;
  created_at: string;
}

export interface MarketingApproval {
  id: string;
  content_id: string;
  decision: 'approved' | 'rejected' | 'edited';
  notes: string | null;
  decided_by: string | null;
  decided_at: string;
}

// ---- generation inputs -----------------------------------------------------

/** A single piece of content to generate. */
export interface GenerateContentInput {
  idea: string;
  platform: Platform;
  contentType?: string;
  theme?: string;
  audience?: string;
  campaignId?: string;
  /** Default 'pending_approval' — nothing skips the approval queue. */
  status?: ContentStatus;
  sourceIdea?: string;
  repurposedFrom?: string;
}

export interface GenerateCampaignInput {
  name: string;
  objective: string;
  theme?: string;
  channels?: Platform[];
  audience?: string;
}

export interface GenerateWebinarInput {
  topic: string;
  audience?: string;
  date?: string;
}

export type LeadMagnetKind = 'checklist' | 'pdf_guide' | 'career_roadmap' | 'interview_guide';
export interface GenerateLeadMagnetInput {
  kind: LeadMagnetKind;
  topic: string;
  audience?: string;
}

export interface GenerateCalendarInput {
  scope: CalendarScope;
  theme?: string;
  startDate?: string;
}

/** Shape of a generated asset before persistence. */
export interface DraftAsset {
  platform: Platform;
  content_type: string;
  title: string;
  hook: string;
  body: string;
  cta: string;
  hashtags: string[];
  theme?: string;
  audience?: string;
}

// ---- dashboard rollups -----------------------------------------------------
export interface MarketingStats {
  totalGenerated: number;
  queued: number;
  pendingApproval: number;
  approved: number;
  published: number;
  campaigns: number;
  topThemes: { theme: string; count: number }[];
  byPlatform: { platform: Platform; count: number }[];
}
