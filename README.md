# Cliper

> Generate rich, AI-ready context documents from your codebase — always fresh, always scoped, always honest about what it doesn't know.

**npm:** `@cliperhq/cliper` | **CLI:** `cliper` | **Version:** 1.0.0

---

## What is Cliper?

Every time you start an AI coding session, you waste time re-explaining your project — pasting file contents, describing structure, warning the AI about legacy decisions, and hoping it doesn't miss something critical.

Cliper eliminates that tax entirely.

One command. Your AI has full, accurate, scoped context. You go straight to building.

---

## Installation

### Option A — npx (recommended, no install needed)

```bash
npx @cliperhq/cliper init
```

npx always pulls the latest version and leaves zero footprint in your project.

### Option B — Global install

Install once, use in any project:

```bash
npm install -g @cliperhq/cliper
```

### Option C — Shell alias (best of both worlds)

Add to your `~/.zshrc` or `~/.bashrc`:

```bash
alias cliper="npx @cliperhq/cliper"
```

Then reload:
```bash
source ~/.zshrc
```

> **Never run `npm install @cliperhq/cliper` inside your project directory.** This installs Cliper as a project dependency and pollutes your `node_modules`. Always use npx or a global install.

---

## Quick Start

```bash
# Go into any project
cd your-project

# Generate your first context document
cliper init

# Copy to clipboard and paste into Claude or ChatGPT
cliper export | pbcopy        # macOS
cliper export | xclip         # Linux

# Generate an AI-optimized prompt (requires API key)
export ANTHROPIC_API_KEY=your_key
cliper analyze --model claude

# Or for ChatGPT
export OPENAI_API_KEY=your_key
cliper analyze --model chatgpt
```

---

## What Gets Generated

Cliper scans your project and produces `.cliper/context.md` containing:

### Annotated Folder Structure
Not a raw `tree` dump — an annotated, scoped view showing what's active, what's watched, and when files were last modified.

```
your-project/
├── src/
│   ├── payments/              ← ACTIVE SCOPE
│   │   ├── refund.ts          ← modified 2h ago
│   │   └── processor.ts       ← modified 3d ago
│   └── auth/                  ← out of scope (3 files, last touched 3 weeks ago)
├── config/                    ← WATCHED
└── [14 other directories — out of scope]
```

### Git Context
Branch, recent commits, uncommitted changes — so the AI knows exactly where you are in the development timeline.

### Dependency Map
What imports what across your scoped files, entry points, and all external packages used. Supports TypeScript, JavaScript, Rust, and Python.

### Key File Contents
Full source of scoped files, prioritized by language and recency, with a configurable size limit.

### Blocked Reference Resolution
READMEs often link to external docs the AI can't access (robots.txt blocks, private pages). Cliper fetches them locally and inlines the content directly into the context doc. No broken links, no missing context.

### Gap Detection
What you forgot to tell the AI — undocumented functions, missing `.env` vars, TODO/FIXME comments, implicit dependencies. Surfaced before your session starts.

### AI-Optimized Prompts
`cliper analyze` takes the raw context doc and uses AI to reformat it into a model-specific prompt — tuned for how Claude reasons vs how ChatGPT processes structured input.

---

## CLI Reference

```bash
# Initialize — scan project and generate context document
cliper init
cliper init --max-file-size 200    # increase file size limit (default: 50KB)

# Sync — refresh stale sections after changes
cliper sync
cliper sync --watch                # auto-refresh on every git commit

# Scope — control what gets included
cliper scope add src/payments/     # add directory to active scope
cliper scope watch config/db.ts    # add file to persistent watch list
cliper scope remove src/payments/  # remove from scope
cliper scope list                  # show current scope

# Status — check freshness and current state
cliper status

# Export — print context doc to stdout
cliper export                      # markdown format
cliper export --format txt         # plain text

# Analyze — generate AI-optimized prompt from context doc
cliper analyze --model claude      # optimized for Claude
cliper analyze --model chatgpt     # optimized for ChatGPT
```

---

## Language Support

Cliper auto-detects your project type and scopes intelligently:

| Language | Auto-detected from | Source dirs included |
|---|---|---|
| **Rust** | `Cargo.toml` | All workspace member `src/` dirs |
| **TypeScript / JavaScript** | `package.json` | `src/`, `packages/`, `apps/`, `libs/` |
| **Python** | `pyproject.toml` / `requirements.txt` | `src/`, dirs with `__init__.py` |
| **Go** | `go.mod` | `internal/`, `pkg/`, `cmd/` |

---

## How to Use with AI Models

After running `cliper init`:

**Option 1 — Copy and paste**
```bash
cliper export | pbcopy     # macOS — then paste as first message
cliper export | xclip      # Linux
```

**Option 2 — Use the optimized prompt**
```bash
cliper analyze --model claude
cat .cliper/prompt-claude.md | pbcopy
```

**Option 3 — Reference the file directly**
Some tools (Cursor, Claude Projects) can reference files directly. Point them at `.cliper/context.md`.

---

## Project Architecture

```
src/
├── commands/
│   ├── init.ts          # cliper init — full project scan
│   ├── sync.ts          # cliper sync — incremental refresh
│   ├── scope.ts         # cliper scope — manage active scope
│   ├── status.ts        # cliper status — freshness report
│   ├── export.ts        # cliper export — output context doc
│   └── analyze.ts       # cliper analyze — AI-optimized prompt generation
├── scanner/
│   ├── fileTree.ts      # annotated folder structure
│   ├── fileContent.ts   # scoped file extraction with token cap
│   ├── gitContext.ts    # branch, commits, uncommitted changes
│   └── dependencies.ts  # import/dependency map (TS, JS, Rust, Python)
├── resolver/
│   └── urlFetcher.ts    # fetch and inline blocked external references
├── gaps/
│   └── detector.ts      # undocumented patterns, missing env vars, TODOs
├── context/
│   └── builder.ts       # assembles the final context.md
└── scope/
    ├── config.ts         # persists scope config in .cliper/
    └── autoScope.ts      # language-aware auto-scoping from git activity
```

---

## What Cliper Creates in Your Project

Running `cliper init` adds the following to your project:

```
.cliper/
├── context.md          # the context document — commit this
├── scope.json          # your scope config — commit this
├── prompt-claude.md    # generated prompt (cliper analyze) — gitignored
├── prompt-gpt.md       # generated prompt (cliper analyze) — gitignored
└── cache/              # locally fetched URL content — gitignored
```

Cliper also automatically adds `node_modules/`, `package-lock.json`, and `.cliper/cache/` to your `.gitignore` — and removes them from git tracking if they were accidentally staged.

---

## Roadmap

**Shipped**
- ✅ Language-aware auto-scoping (Rust, Node, Python, Go)
- ✅ Annotated folder structure with freshness timestamps
- ✅ Git-aware context (branch, commits, uncommitted changes)
- ✅ Dependency map (TS/JS/Rust/Python)
- ✅ Blocked URL resolution and inlining
- ✅ Gap detection (TODOs, missing env vars, undocumented functions)
- ✅ AI-optimized prompt generation (Claude + ChatGPT)
- ✅ `--max-file-size` flag for large files
- ✅ Auto-managed `.gitignore`

**Coming Soon**
- ⬜ `cliper push` — sync context to the Cliper web dashboard
- ⬜ Web dashboard — visual representation of your codebase context
- ⬜ Project history — track how your codebase evolves over time
- ⬜ Team sharing — shared context annotations committed to git
- ⬜ VS Code extension — one-click context copy from the editor

---

## Contributing

Cliper is early and actively developed. If you're a developer who feels the pain of re-explaining your project to AI every session, contributions are very welcome.

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