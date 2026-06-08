# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md
@.claude/rules/general.mdc
@.claude/rules/typescript.mdc
@.claude/rules/react.mdc
@.claude/rules/api.mdc

## Commands

```bash
pnpm dev       # start dev server
pnpm build     # production build
pnpm start     # serve production build
pnpm lint      # run ESLint
```

No test suite is configured yet.

## Architecture

**Next.js App Router** — routes live under `app/`. No `src/` directory; all source is at the repo root.

**Path alias** — `@/*` resolves to the repo root (e.g. `@/lib/utils`, `@/components/ui/button`).

**Auth** — `better-auth` is the auth library. The client is initialized in `app/_lib/auth-client.ts` using `NEXT_PUBLIC_API_URL`. The login page lives at `/auth`. Protected pages redirect to `/auth` when the user has no session; `/auth` redirects to `/` when a session exists. Session checks use `authClient.useSession()` — never middleware.

**UI components** — shadcn/ui components live in `components/ui/`. They wrap **`@base-ui/react`** primitives (not Radix UI). When adding new shadcn components via `pnpm shadcn add <component>`, expect the generated code to use `@base-ui/react` imports.

**Styling** — Tailwind CSS v4 with `tw-animate-css`. Design tokens are CSS custom properties defined in `app/globals.css` using `oklch` colors. The `cn()` helper (`lib/utils.ts`) merges Tailwind classes via `clsx` + `tailwind-merge`. Never use hardcoded Tailwind color values — always use theme tokens.
