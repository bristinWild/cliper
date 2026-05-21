# Cliper

> Give AI the full picture of your codebase — always fresh, always scoped, always honest about what it doesn't know.

**npm:** `@bristinwild/cliper` | **CLI command:** `cliper`

---

## What is Cliper?

Cliper is a CLI tool for developers that generates a rich, structured context document from your codebase — purpose-built to be passed into AI coding sessions (Claude, ChatGPT, Gemini, etc).

The problem it solves: every time you start an AI coding session, you waste time re-explaining your project structure, re-pasting file contents, warning the AI about legacy decisions, and hoping it doesn't miss something critical. Cliper eliminates that tax entirely.

One command. Your AI has full, accurate, scoped context. You go straight to building.

---

## Core Philosophy

- **Developer-first.** Built for the person writing code, not managers or stakeholders.
- **Scoped, not exhaustive.** Cliper doesn't dump your entire codebase. It sends what's relevant.
- **Living, not static.** Context stays fresh as your codebase evolves.
- **Honest about gaps.** Cliper surfaces what even you might have forgotten — before the AI runs with incomplete information.

---

## Features

### 1. Context Document Generation (`cliper init`)
Scans your project and produces a structured `.cliper/context.md` file containing:

- Annotated folder structure (scoped, not a raw tree dump)
- Key file contents within the active scope
- Dependency map (what imports what)
- README content with blocked/inaccessible URLs fetched and inlined as text
- Git context (current branch, recent commits, open changes)
- Detected gaps (undocumented patterns, implicit dependencies, missing comments)
- Freshness timestamps per section

This file is designed to be copy-pasted directly into any AI chat session as the first message.

---

### 2. Smart Scoping (`cliper scope`)
Cliper doesn't scan everything — it focuses on what matters.

**Auto-scope (default):**
- Detects recently modified files from git history
- Includes config files, entry points, and package manifests automatically
- Excludes `node_modules`, build artifacts, and `.gitignore`d paths

**Manual scope:**
- Developer can add specific files or directories to the active scope
- Developer can add files to a watch list (files kept in context even outside active work)
- Watch list is capped at ~15 additional files to keep context size manageable

```bash
cliper scope add src/payments/
cliper scope watch config/database.ts
cliper scope list
cliper scope remove src/payments/
```

---

### 3. Living Context (`cliper sync`)
Context goes stale the moment someone merges a PR. Cliper solves this with git-aware refresh.

- Watches for git events (commits, merges, branch switches)
- Diffs what changed against the existing context doc
- Updates only stale sections — not a full rescan
- Notifies: "Context updated — 2 modules changed, 1 new undocumented pattern detected"
- Adds freshness indicators per section so the AI knows what's recent vs old

```bash
cliper sync              # manual refresh
cliper sync --watch      # auto-refresh on git events
```

---

### 4. Gap Detection
The hardest problem in AI-assisted coding isn't what you tell the AI — it's what you forget to tell it.

Cliper scans for:
- **Undocumented decisions** — unusual logic with no comments, no linked tickets
- **Implicit dependencies** — modules that rely on runtime state or env vars not in config
- **Tribal knowledge** — patterns that only make sense if you know the project history
- **Stale references** — comments or docs that reference code that no longer exists

These are surfaced in the context doc as a dedicated `DETECTED GAPS` section so the developer can review before starting an AI session.

---

### 5. Blocked URL Resolution
READMEs and docs often reference external links that AI models can't access (robots.txt blocks, paywalled content, private internal docs).

Cliper handles this by:
- Scanning all URLs found in project markdown files
- Fetching inaccessible content locally at scan time
- Inlining the fetched content directly into the context doc as text
- Marking the source URL for reference

The AI gets the content, not a broken link.

---

## Context Document Format

The output is a structured markdown file stored at `.cliper/context.md`.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIPER CONTEXT DOCUMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROJECT:      payments-service
GENERATED:    2026-05-22T01:30:00Z
BRANCH:       feature/refund-flow
LAST COMMIT:  fix: handle edge case in refund processor (2h ago)
SCOPED TO:    src/payments/, src/shared/utils/, config/
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## FOLDER STRUCTURE

payments-service/
├── src/
│   ├── payments/              ← ACTIVE SCOPE
│   │   ├── refund.ts          ← modified 2h ago
│   │   ├── processor.ts       ← modified 3d ago
│   │   └── types.ts
│   ├── shared/
│   │   └── utils/             ← WATCHED
│   │       ├── currency.ts
│   │       └── validators.ts
│   └── auth/                  ← OUT OF SCOPE (3 files, last touched 3 weeks ago)
├── config/                    ← WATCHED
│   ├── env.example
│   └── database.ts
└── [14 other directories — out of scope]

## KEY FILES
[File contents of scoped files]

## DEPENDENCY MAP
[What imports what within scope]

## GIT CONTEXT
[Recent commits, open PRs, current branch state]

## BLOCKED REFERENCES (fetched locally)
[Inlined content from README links that were inaccessible to AI]

## DETECTED GAPS
[Undocumented patterns, implicit dependencies, missing context]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## CLI Reference

```bash
# Initialise Cliper in a project
cliper init

# Generate / refresh the context doc
cliper sync
cliper sync --watch          # auto-refresh on git events

# Manage scope
cliper scope add <path>      # add path to active scope
cliper scope watch <path>    # add path to persistent watch list
cliper scope remove <path>   # remove from scope
cliper scope list            # show current scope

# Inspect status
cliper status                # what's fresh, what's stale, what's in scope

# Output
cliper export                # print context doc to stdout (pipe to clipboard etc.)
cliper export --format txt   # plain text version for models that prefer it
```

---

## Installation

### Option A — npx (recommended, no install needed)

Run Cliper directly in any project without installing anything:

```bash
npx @bristinwild/cliper init
```

npx always pulls the latest version and leaves zero footprint in your project.

### Option B — Global install (use `cliper` everywhere)

Install once, use in any project without the `npx` prefix:

```bash
npm install -g @bristinwild/cliper
```

Then in any project:
```bash
cd your-project
cliper init
```

### Option C — Shell alias (best of both worlds)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
alias cliper="npx @bristinwild/cliper"
```

Then reload your shell:
```bash
source ~/.zshrc
```

Now `cliper init` works everywhere with no global install and always uses the latest version.

> **Never run `npm install @bristinwild/cliper` inside your project directory.** This installs Cliper as a project dependency and pollutes your `node_modules`. Always use npx or a global install.

---

## How to Use with AI Models

After running `cliper init` or `cliper sync`:

**Option 1 — Copy and paste**
```bash
cliper export | pbcopy     # macOS
cliper export | xclip      # Linux
```
Paste as the first message in your AI chat session.

**Option 2 — Reference the file directly**
Some AI tools (Cursor, Claude Projects, etc.) can reference files directly. Point them at `.cliper/context.md`.

**Option 3 — Pipe into a prompt**
```bash
echo "$(cliper export)\n\nNow help me implement the refund webhook handler." | your-ai-cli
```

---

## Project Architecture

```
cliper/
├── src/
│   ├── commands/
│   │   ├── init.ts          # cliper init — full project scan
│   │   ├── sync.ts          # cliper sync — incremental refresh
│   │   ├── scope.ts         # cliper scope — manage active scope
│   │   ├── status.ts        # cliper status — freshness report
│   │   └── export.ts        # cliper export — output context doc
│   ├── scanner/
│   │   ├── fileTree.ts      # folder structure generation + annotation
│   │   ├── fileContent.ts   # scoped file content extraction
│   │   ├── dependencies.ts  # import/dependency map generation
│   │   └── gitContext.ts    # branch, commits, recent changes
│   ├── resolver/
│   │   ├── urlDetector.ts   # find all URLs in markdown files
│   │   ├── urlFetcher.ts    # fetch and inline blocked content
│   │   └── cache.ts         # local cache of fetched content
│   ├── gaps/
│   │   ├── detector.ts      # undocumented pattern detection
│   │   ├── implicitDeps.ts  # implicit dependency surfacing
│   │   └── staleness.ts     # stale reference detection
│   ├── context/
│   │   ├── builder.ts       # assembles final context doc
│   │   ├── diff.ts          # diffs old vs new context for sync
│   │   └── formatter.ts     # markdown formatting and structure
│   ├── scope/
│   │   ├── autoScope.ts     # git-activity-based auto scoping
│   │   ├── manualScope.ts   # developer-defined scope management
│   │   └── config.ts        # persists scope config in .cliper/
│   └── utils/
│       ├── gitWatch.ts      # git event watcher for auto-sync
│       ├── ignore.ts        # respects .gitignore
│       └── tokenEstimate.ts # estimates context doc token size
├── .cliper/                 # generated, lives in the target project
│   ├── context.md           # the context document
│   ├── scope.json           # saved scope configuration
│   └── cache/               # locally fetched URL content
├── index.js                 # CLI entry point
└── package.json
```

---

## Key Technical Decisions

**Language: TypeScript/Node.js**
Developers already have Node installed. Same language as VS Code extensions, making the future extension a thin wrapper around this CLI.

**Storage: Local + git-native**
Context doc lives in `.cliper/context.md` inside the project repo. Committed to git — naturally versioned, naturally shared across the team. Sensitive content (fetched private URLs) stays in `.cliper/cache/` which is `.gitignore`d by default.

**Scoping strategy**
Auto-scope is derived from `git log --since="7 days ago" --name-only` to find recently touched files. This means Cliper's default scope always reflects what the developer is actively working on without any manual configuration.

**Gap detection approach**
Phase 1: Heuristic-based — files modified recently with no associated comments, functions with no JSDoc, env vars referenced but not in `.env.example`. Phase 2 (post-launch): Pattern-based learning from real codebases.

**Token awareness**
Cliper estimates the token size of the generated context doc and warns if it exceeds practical limits for common models (~100k tokens). Scope reduction suggestions are provided automatically.

---

## Roadmap

**Phase 1 — Core CLI (current)**
- `cliper init` with folder structure, file contents, git context
- Blocked URL resolution and inlining
- Basic scoping

**Phase 2 — Living Context**
- `cliper sync` with git-aware incremental refresh
- `cliper sync --watch` for auto-refresh
- Freshness indicators per section

**Phase 3 — Gap Detection**
- Undocumented pattern detection
- Implicit dependency surfacing
- Pre-session gap warnings

**Phase 4 — VS Code Extension**
- Thin wrapper around the CLI
- One-click context copy from the editor
- Scope management from the sidebar
- Auto-sync on file save

**Phase 5 — Team Layer**
- Shared context annotations committed to git
- Senior dev annotations ("this module is being deprecated")
- Per-developer scope profiles

---

## Contributing

Cliper is early. If you're a developer who feels the pain of re-explaining your project to AI every session, contributions are very welcome.

```bash
git clone https://github.com/bristinwild/cliper
cd cliper
npm install
npm run dev
```

Open an issue before submitting large PRs so we can align on direction.

---

## License

ISC © bristinwild