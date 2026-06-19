# Security Migrations — Apply Package (#25)

> **Reviewable apply package — Claude Code does not auto-apply SQL.**
> The founder applies each block by hand in the Supabase SQL editor, in order,
> and runs the verification `SELECT`s after each. "Success / no rows" means the
> statement *ran*, not that it was *correct* — always confirm with the SELECTs.

## Status (verified 2026-06-19)

The three security migration **files are already in `main`** (they landed with
PR #25) and are byte-identical to the working branch. This package does **not**
add new SQL — it is the controlled guidance to **apply** that already-canonical
SQL to the **live database**, which has not yet been done.

| Migration file (in `main`) | Applied to live DB? |
| --- | --- |
| `20260619030000_profiles_pii_rls_lockdown.sql` | ❌ pending founder apply |
| `20260619040000_email_send_log.sql` | ❌ pending founder apply |
| `20260619050000_founder_admin_alignment.sql` | ❌ pending founder apply |

The CEO Truth Dashboard (`/founder/truth`) probes for the `public_profiles`
view + `email_send_log` table to report whether these are applied — use it to
verify after applying.

## Dependencies confirmed in `main` (apply is safe)

- `public.aos_is_admin()` exists (migration `20260610110000_aos_is_admin_helper.sql`).
- App reads the **safe** surfaces, so the `profiles` lockdown will **not** blank
  author names or break referral pages:
  - `public_profiles` view → `src/pages/Community.tsx`, `src/pages/Feedback.tsx`
  - `get_referral_profile()` RPC → `src/pages/ReferralProfile.tsx`
- Email rate limiting reads/writes `email_send_log` via
  `supabase/functions/_shared/emailGuard.ts`.

## Recommended apply order

1. **`20260619050000` — founder admin alignment** *(apply FIRST, optional but recommended)*
   Guarantees the founder holds `admin` **before** the `profiles` lockdown, so
   there is zero window where the founder cannot see all profiles. (Even without
   this, the founder can always read their **own** profile — only the admin
   "view all" surfaces wait — so timestamp order also works.)
2. **`20260619030000` — profiles PII RLS lockdown**
3. **`20260619040000` — email send log** *(apply BEFORE deploying/redeploying the
   `send-email` / `send-welcome-email` edge functions, which expect this table)*

> Reordering is a manual choice only — the founder applies by hand, so apply
> order is not bound to the filename timestamps. If you prefer strict timestamp
> order (030000 → 040000 → 050000), that is also safe.

---

## ⚠️ Founder approval points (decide BEFORE applying)

1. **`050000` revokes admin from every non-aligned account.** Step 3 runs a
   `DELETE FROM public.user_roles WHERE role='admin' AND user_id NOT IN (aligned founders)`.
   This removes `admin` from the legacy `didiermbok@yahoo.com` account **and any
   other manually-granted/staff admin**. 
   - ✅ If the only admins should be `didier@aladiahacademy.com` and
     `didierisonline@gmail.com` → apply as-is.
   - ⚠️ If you have other staff admins to keep → **comment out Step 3** before
     applying, or add their emails to the aligned set in both the SQL and
     `src/lib/roles.ts`.
2. **Aligned founder set** must match `FOUNDER_EMAILS` in `src/lib/roles.ts`:
   `didier@aladiahacademy.com`, `didierisonline@gmail.com`.

---

## 1) `20260619030000_profiles_pii_rls_lockdown.sql`

- **Purpose:** close a launch-blocking PII leak. A prior migration made
  `public.profiles` world-readable (`USING (true)`) and exposed
  `referral_codes` (code→user_id) to anyone. This restores least privilege.
- **Objects affected:**
  - `public.profiles` — RLS policies (SELECT)
  - `public.referral_codes` — RLS policies (SELECT)
  - `public.get_referral_profile(text)` — new `SECURITY DEFINER` RPC (safe display fields only)
  - `public.public_profiles` — new view (`security_invoker=false`), `name + avatar` only, `authenticated`-only
- **RLS policies after apply:**
  - `profiles`: "Users can view own profile" (`auth.uid() = user_id`) + "Admins can view all profiles" (`aos_is_admin()`); **no** public policy.
  - `referral_codes`: owner-only SELECT; **no** `USING(true)`.
- **Risks:** if the app did *not* read `public_profiles`/`get_referral_profile`,
  author names would blank and referral pages would break. **Verified aligned in
  `main`** (see Dependencies). The `public_profiles` view runs as owner
  (bypasses RLS) but exposes only `user_id, full_name, avatar_url` to
  `authenticated` — no email/phone/language/login-time/course data.
- **Rollback:** do **not** roll back to the world-readable state. Fix-forward
  only. If a policy is wrong, `DROP POLICY` the offending one and re-create the
  corrected version; keep `profiles` RLS enabled at all times.

**Paste-ready:** apply the full contents of
`supabase/migrations/20260619030000_profiles_pii_rls_lockdown.sql` (BEGIN…COMMIT block).

**Verification (run after COMMIT):**
```sql
-- (a) profiles no longer world-readable — only owner + admin SELECT remain:
SELECT policyname, cmd, qual
FROM pg_policies WHERE schemaname='public' AND tablename='profiles' ORDER BY policyname;
-- expect: "Users can view own profile", "Admins can view all profiles"; NO public policy.

-- (b) referral_codes has no USING(true) policy:
SELECT policyname, cmd, qual FROM pg_policies
WHERE schemaname='public' AND tablename='referral_codes';

-- (c) safe RPC exists and is SECURITY DEFINER:
SELECT proname, prosecdef FROM pg_proc WHERE proname='get_referral_profile';  -- prosecdef = true

-- (d) functional: anonymous referral read still works through the RPC:
SELECT * FROM public.get_referral_profile('<an existing referral code>');

-- (e) the safe view exists and is authenticated-only:
SELECT table_name FROM information_schema.views WHERE table_schema='public' AND table_name='public_profiles';
```

---

## 2) `20260619040000_email_send_log.sql`

- **Purpose:** backs per-recipient rate limiting in the email edge functions so
  the Resend domain can't be used to blast arbitrary addresses.
- **Objects affected:** new table `public.email_send_log` (+ index
  `email_send_log_key_time_idx`); RLS **enabled with no policies** (service-role
  / edge functions only — no anon/authenticated access).
- **Risks:** low. Apply **before** deploying the updated `send-email` /
  `send-welcome-email` functions (they expect this table). If absent, sends
  could error or skip throttling.
- **Rollback:** `DROP TABLE public.email_send_log;` (first disable the
  rate-limit read/write in `emailGuard.ts` to avoid errors).

**Paste-ready:** apply the full contents of
`supabase/migrations/20260619040000_email_send_log.sql`.

**Verification:**
```sql
SELECT relrowsecurity FROM pg_class WHERE relname = 'email_send_log';  -- expect true
SELECT count(*) FROM pg_policies WHERE tablename = 'email_send_log';   -- expect 0
```

---

## 3) `20260619050000_founder_admin_alignment.sql`

- **Purpose:** make the founder's DB `admin` grant authoritative and consistent
  with `src/lib/roles.ts`. The old `auto_assign` trigger fired only on signup,
  so pre-existing founder accounts were never granted `admin` and would be
  locked out of admin surfaces under the new RLS. This backfills them and
  re-asserts the trigger.
- **Objects affected:**
  - `public.auto_assign_admin()` — `CREATE OR REPLACE` trigger function (aligned set)
  - `public.user_roles` — INSERT (backfill founders), DELETE (revoke non-aligned admins)
- **Risks:** **Step 3 DELETE is the destructive one** — see Approval Point #1.
  Misalignment between this SQL's email set and `roles.ts` would grant/deny the
  wrong people; keep them in sync.
- **Rollback:** re-grant any removed admin manually:
  `INSERT INTO public.user_roles(user_id, role) SELECT id,'admin' FROM auth.users WHERE lower(email)='<email>' ON CONFLICT DO NOTHING;`

**Paste-ready:** apply the full contents of
`supabase/migrations/20260619050000_founder_admin_alignment.sql`
(after deciding on Approval Point #1).

**Verification:**
```sql
-- exactly the founder accounts hold 'admin':
SELECT u.email, ur.role
FROM public.user_roles ur JOIN auth.users u ON u.id = ur.user_id
WHERE ur.role = 'admin' ORDER BY u.email;

-- founder passes aos_is_admin() (sign in as founder first):
SELECT public.aos_is_admin();  -- expect true
```

---

## After all three are applied

1. Open **`/founder/truth`** → the "Security migrations applied? (#25)" probe
   should flip to **present** for both `public_profiles` and `email_send_log`.
2. Smoke-test the safe surfaces: a referral page (`/refer/<code>`), the
   community/feedback author names, and a founder login (admin surfaces load).
3. Only **then** proceed to the Scrum flagship migration apply package
   (`20260619000000`, corrected description already in `main`).
