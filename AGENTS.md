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
- **Supabase key gotcha:** `src/integrations/supabase/client.ts` falls back to a
  hardcoded Supabase URL + anon key when `VITE_*` env vars are unset. That
  committed fallback key is **currently rejected by Supabase ("Invalid API
  key")**, so anything that hits Supabase (sign-up/login, courses, simulations,
  AI features) fails until you supply a valid `VITE_SUPABASE_URL` +
  `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env` (see `.env.example`). The app still
  boots and renders without them.
- **Port collision:** `aladiah-talent-hub` also defaults to 8080. Run one at a
  time, or start the other with `npm run dev -- --port <n>`.
- Build uses esbuild only (no `tsc`); `tsconfig.app.json` has `strict: false`.
