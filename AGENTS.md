# Agent Instructions

## Package Manager
- Use **npm**: `npm install`, `npm run dev`, `npm run lint`

## File-Scoped Commands
| Task | Command |
|------|---------|
| Lint file | `npx eslint path/to/file.ts` |
| Lint file | `npx eslint path/to/file.tsx` |
| Typecheck app | `npx tsc --noEmit -p tsconfig.app.json` |
| Typecheck node config | `npx tsc --noEmit -p tsconfig.node.json` |

## Commit Attribution
- AI commits MUST include:
```text
Co-Authored-By: Codex <codex@openai.com>
```

## Git Workflow
- After completing a code change, automatically create a git commit unless the user says not to commit
- Keep commits focused to the requested task; avoid bundling unrelated files
- Use concise conventional-style commit messages when possible
- Do not push automatically

## Project Structure
- `src/App.tsx` owns top-level loading, hash routing, and date selection flow
- `src/components/` contains UI pieces such as `DatePicker` and `Timeline`
- `src/lib/parser.ts` contains CSV parsing, domain filtering, and session grouping
- `src/lib/types.ts` is the shared type surface; update it before reshaping parsed data
- Static assets live in `public/` and `src/assets/`

## Key Conventions
- Preserve the current split between parsing logic in `src/lib/` and presentation in `src/components/`
- Keep browser-history parsing changes aligned with the `HistoryRow` and `DayActivity` types
- Treat URL hash state as part of the app behavior when changing date navigation
- Prefer targeted validation on touched files or relevant TypeScript config
- Do not run `npm run build` in this repository
- Assume the user may already have `npm run dev` running for live verification
- Do not add style guidance already enforced by `eslint.config.js` or TypeScript config
