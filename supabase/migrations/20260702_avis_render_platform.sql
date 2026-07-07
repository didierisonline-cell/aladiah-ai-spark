-- =============================================================================
-- AVIS Visual Render Platform (Phase IV step 3, WO-0014, FEO-2026-001)
-- Founder-applied by hand in the Supabase SQL editor — never auto-applied.
-- Creates: the avis-assets storage bucket (private), draft quarantine,
-- asset registry, render cache, cost ledger, and founder-set budgets.
-- Verify after running: the SELECTs at the bottom of this file.
-- =============================================================================

-- 1) Storage: one private bucket; drafts and approved assets are prefixes.
--    (Private by default — approved-asset delivery goes through signed URLs
--    or a later per-class policy decision; nothing is public by accident.)
insert into storage.buckets (id, name, public)
values ('avis-assets', 'avis-assets', false)
on conflict (id) do nothing;

-- Only service-role (the edge function) touches avis-assets objects; no
-- client policy is created. Admins read via the dashboard or signed URLs.

-- 2) Draft quarantine (Integration Architecture §3) — drafts are never
--    publishable, never public; unreviewed drafts expire (30-day rule).
create table if not exists public.avis_drafts (
  candidate_id     text primary key,            -- content hash (fingerprint)
  visual_class     text not null,
  spec_id          text not null,
  prompt_version   text not null,
  state            text not null default 'draft'
                   check (state in ('draft','in-review','approved','rejected','expired')),
  verdicts         jsonb not null default '[]'::jsonb,
  rejection        jsonb,
  founder_approved boolean not null default false,
  renderer_id      text not null,
  renderer_version text not null,
  requested_by     text not null,
  storage_path     text not null,
  created_at       timestamptz not null default now()
);
alter table public.avis_drafts enable row level security;
-- Admin-only, both directions (students never see quarantine):
create policy "avis_drafts_admin_select" on public.avis_drafts for select
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
create policy "avis_drafts_admin_write" on public.avis_drafts for all
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'))
  with check (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 3) The asset registry (§5) — approved assets are immutable (no UPDATE
--    policy except supersession's replaced_by backlink, done by the function).
create table if not exists public.avis_assets (
  asset_id         text primary key,            -- = the approved candidate_id
  visual_class     text not null,
  spec_id          text not null,
  prompt_version   text not null,
  renderer_id      text not null,
  renderer_version text not null,
  requested_by     text not null,
  approved_by      text not null,
  approved_on      timestamptz not null,
  alt_text         text not null check (length(trim(alt_text)) > 0),   -- the textual twin
  license          text not null check (length(trim(license)) > 0),    -- nothing unlicensed
  usage_sites      jsonb not null default '[]'::jsonb,
  supersedes       text,
  replaced_by      text,
  storage_path     text not null,
  brain_marker     text not null unique
);
alter table public.avis_assets enable row level security;
create policy "avis_assets_read_authenticated" on public.avis_assets for select
  using (auth.role() = 'authenticated');
-- No INSERT/UPDATE/DELETE policies: only the service-role edge function writes.

-- 4) Render cache (§8) — reuse-before-regenerate; a hit spends nothing.
create table if not exists public.avis_render_cache (
  cache_key     text primary key,                -- render:<adapter>:<promptVersion>:<size>:<format>
  candidate_set jsonb not null,
  created_at    timestamptz not null default now()
);
alter table public.avis_render_cache enable row level security;
create policy "avis_cache_admin_select" on public.avis_render_cache for select
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 5) Cost ledger (§12) — one row per call; spend is COMPUTED from here,
--    never asserted. unit_cost_usd null = unmeasured (honest), never estimated.
create table if not exists public.avis_cost_ledger (
  id               bigint generated always as identity primary key,
  caller           text not null,
  budget_key       text not null,
  visual_class     text not null,
  renderer_id      text not null,
  renderer_version text not null,
  prompt_version   text not null,
  size             text not null,
  candidates       int  not null,
  unit_cost_usd    numeric,
  total_usd        numeric,
  cache_hit        boolean not null default false,
  rendered_at      timestamptz not null default now()
);
create index if not exists avis_ledger_budget on public.avis_cost_ledger (budget_key);
create index if not exists avis_ledger_caller_time on public.avis_cost_ledger (caller, rendered_at);
alter table public.avis_cost_ledger enable row level security;
create policy "avis_ledger_admin_select" on public.avis_cost_ledger for select
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));

-- 6) Budgets (§12/§13) — founder-set at enablement. No row = generation
--    disabled for that budget_key (the platform fails closed).
create table if not exists public.avis_budgets (
  budget_key text primary key,                   -- e.g. department:curriculum-excellence
  cap_usd    numeric not null check (cap_usd >= 0),
  set_by     text not null default 'founder',
  set_on     timestamptz not null default now()
);
alter table public.avis_budgets enable row level security;
create policy "avis_budgets_admin_select" on public.avis_budgets for select
  using (exists (select 1 from public.user_roles r where r.user_id = auth.uid() and r.role = 'admin'));
-- Budgets are written by the founder in the dashboard/SQL editor only.

-- =============================================================================
-- VERIFICATION (run after the block above; "success/no rows" is not enough)
-- =============================================================================
-- select id, public from storage.buckets where id = 'avis-assets';
-- select table_name, row_security_active('public.'||table_name) as rls
--   from information_schema.tables
--  where table_name in ('avis_drafts','avis_assets','avis_render_cache','avis_cost_ledger','avis_budgets');
-- select polname, tablename from pg_policies where tablename like 'avis_%' order by tablename;
