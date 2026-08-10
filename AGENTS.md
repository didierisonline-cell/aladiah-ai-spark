# AGENTS.md

## Cursor Cloud specific instructions

**What this is:** `aladiah-ai-spark` is the main **Aladiah Academy** frontend
(React + TypeScript + Vite + Tailwind/shadcn). Standard commands live in
`README.md` and `package.json` `scripts`.

- **Dev server:** `npm run dev` → http://localhost:8080 (port pinned in
  `vite.config.ts`). The UI shell, landing page, and routing render without any
  local `.env`.
- **Backends:** talks to **hosted Supabase** (project `vgujnkxylipfwmkpwzvb`)
  and optionally to the `academy-backend` Express API (`VITE_API_URL`). There is
  no local database to start.
- **Lint / test / build:** `npm run lint` (eslint — the repo currently has many
  pre-existing lint errors, so a non-zero exit is expected), `npm test`
  (vitest — 116 tests pass), `npm run build` (esbuild; the >500 kB chunk-size
  warning is expected and not an error).

### Non-obvious caveats
- **Supabase config:** `src/integrations/supabase/client.ts` falls back to a
  hardcoded Supabase URL + anon key when `VITE_*` env vars are unset. That
  committed fallback anon key is **stale/rejected ("Invalid API key")**, so real
  Supabase flows (sign-up/login, courses, simulations, AI) need valid values in
  a local **`.env`** (gitignored; copy from `.env.example`): at minimum
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. The app still boots
  and renders without them. Verified working: sign-up creates a user and shows
  the "Check Your Email" confirmation.
- **`VITE_SUPABASE_URL` must be the bare project origin**
  `https://<project-ref>.supabase.co` with **no path**. A value containing an
  extra path segment (e.g. a trailing `/rest/v1`) makes `supabase-js` build
  `/auth/v1/*` URLs that get misrouted to PostgREST, which returns
  `PGRST125 "Invalid path specified in request URL"` (surfaces in the UI as
  "Invalid path specified in request").
- New-style publishable keys (`sb_publishable_…`) work with the installed
  `@supabase/supabase-js` (≥2.91).
- **Port collision:** `aladiah-talent-hub` also defaults to 8080. Run one at a
  time, or start the other with `npm run dev -- --port <n>`.
- Build uses esbuild only (no `tsc`); `tsconfig.app.json` has `strict: false`.
