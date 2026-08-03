-- ===========================================================================
-- Wholesale Real Estate Platform — database schema
-- ===========================================================================
-- REVIEWABLE FILE — DO NOT AUTO-APPLY.
-- Per repo working rules, a human applies this by hand in Supabase, then runs
-- the verification SELECTs at the bottom. "Success / no rows" means it RAN,
-- not that it's correct — always verify.
--
-- Phase 0 delivers the app on mock data; this schema is what Phase 1 persists to.
-- ===========================================================================

-- --- Properties ------------------------------------------------------------
create table if not exists wholesale_properties (
  id            uuid primary key default gen_random_uuid(),
  line1         text not null,
  city          text not null,
  state         char(2) not null,
  zip           text not null,
  property_type text not null default 'single_family',
  beds          int,
  baths         numeric(3,1),
  sqft          int,
  lot_sqft      int,
  year_built    int,
  estimated_value numeric(12,2),
  last_sale_price numeric(12,2),
  last_sale_date  date,
  mortgage_balance numeric(12,2),
  signals       jsonb not null default '{}'::jsonb,  -- DistressSignals
  created_at    timestamptz not null default now()
);

-- --- Owner contacts (skip-trace output) ------------------------------------
create table if not exists wholesale_owners (
  id           uuid primary key default gen_random_uuid(),
  property_id  uuid references wholesale_properties(id) on delete cascade,
  full_name    text,
  phones       jsonb not null default '[]'::jsonb,   -- [{number,type,dnc}]
  emails       jsonb not null default '[]'::jsonb,
  mailing_address jsonb,
  skip_traced  boolean not null default false,
  created_at   timestamptz not null default now()
);

-- --- Leads (pipeline) ------------------------------------------------------
create table if not exists wholesale_leads (
  id               uuid primary key default gen_random_uuid(),
  property_id      uuid not null references wholesale_properties(id) on delete cascade,
  owner_id         uuid references wholesale_owners(id) on delete set null,
  stage            text not null default 'new',
  motivation_score int not null default 0,
  temperature      text not null default 'cold',
  source           text,
  assigned_to      uuid,               -- acquisitions rep (human or AI agent)
  -- Underwriting is snapshotted here at analysis time (evidence, not backfilled).
  analysis         jsonb,              -- DealAnalysis
  notes            text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_wholesale_leads_stage on wholesale_leads(stage);
create index if not exists idx_wholesale_leads_score on wholesale_leads(motivation_score desc);

-- --- Cash buyers -----------------------------------------------------------
create table if not exists wholesale_buyers (
  id                 uuid primary key default gen_random_uuid(),
  name               text not null,
  company            text,
  phone              text,
  email              text,
  buy_box            jsonb not null default '{}'::jsonb,
  proof_of_funds     boolean not null default false,
  deals_closed_with_us int not null default 0,
  reliability_score  int not null default 50,
  created_at         timestamptz not null default now()
);

-- --- Outreach log (TCPA / A2P audit trail) ---------------------------------
create table if not exists wholesale_outreach (
  id             uuid primary key default gen_random_uuid(),
  lead_id        uuid references wholesale_leads(id) on delete cascade,
  channel        text not null,        -- sms | call | mail
  direction      text not null default 'outbound',
  body           text,
  consent        boolean,
  blocked_reason text,                 -- dnc | no_consent | quiet_hours | a2p_unregistered
  provider_message_id text,
  created_at     timestamptz not null default now()
);
create index if not exists idx_wholesale_outreach_lead on wholesale_outreach(lead_id);

-- --- Row Level Security (enable; add policies to match your auth model) -----
alter table wholesale_properties enable row level security;
alter table wholesale_owners     enable row level security;
alter table wholesale_leads      enable row level security;
alter table wholesale_buyers     enable row level security;
alter table wholesale_outreach   enable row level security;
-- NOTE: add explicit policies before exposing to the client. Example:
-- create policy "authenticated read leads" on wholesale_leads
--   for select using (auth.role() = 'authenticated');

-- ===========================================================================
-- VERIFICATION — run after applying:
--   select table_name from information_schema.tables
--     where table_name like 'wholesale_%' order by 1;   -- expect 5 rows
--   select count(*) from wholesale_leads;               -- expect 0 (fresh)
-- ===========================================================================
