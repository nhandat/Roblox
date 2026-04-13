# Roblox-TS
This contains all the files that I dumped from the source-map files on roblox.com which contains the same as the Webpack in the browser.

👉 Vietnamese quick start: see `START.vi.md`.

## Is this a website project?
Partly. This repo contains dumped **web frontend source files** from Roblox, but it is **not** a complete standalone website project.

- ✅ It is web-related code (browser/client-side modules).
- ❌ It does not include the full private backend/runtime/build system needed to run roblox.com as-is.

## Last dump (M/D/Y)
04/02/2026

## Dump location
https://roblox.com/home

## TODO
- [ ] grab the JS map files using github actions

## Running this dump locally
This repository is a source-map dump and not a standalone runnable app.

### Why it does not start directly
- There is no root `package.json`, so commands like `npm start` fail with `ENOENT`.
- Entrypoints import internal Roblox packages such as `@rbx/externals`.
- Those private packages and Roblox runtime globals are not included here.

### If you ran `npm start` and got `ENOENT`
That error is expected for this dump. It means npm cannot find a project manifest at the repository root.

### How to inspect it
1. Open files directly (for example `entry.js`, `src/`, and `modules/`) to study implementation details.
2. Use search tools (e.g. `rg "keyword" src modules`) to trace symbols.
3. If you want to execute code, copy specific modules into your own project and mock missing `@rbx/*` dependencies.

### Practical "start" options
Choose one of these depending on your goal:

1. **Analyze only (recommended)**
   - Start by reading `entry.js` and `entry.ts`.
   - Then trace imports through `src/` and `modules/`.

2. **Run isolated code in your own app**
   - Create a new Node/TS project with your own `package.json`.
   - Copy only the module(s) you want to test from this dump.
   - Stub internal imports such as `@rbx/externals` and any `window.Roblox` globals.

3. **Rebuild-like workflow (advanced)**
   - Build your own bundler config and aliases for missing `@rbx/*` packages.
   - This requires recreating private Roblox runtime dependencies manually.

## Quick start (copy/paste)
If your goal is to run this repo with a local mock runtime:

```bash
# 1) Clone and open
git clone https://github.com/nhandat/Roblox.git
cd Roblox

# 2) Install dependencies
# no install needed for the mock runtime

# 3) Start local mock runtime
npm start
```

You should see:
- `✅ Playground started`
- `window.Roblox ready: true`

If your goal is to execute more code, use the local playground modules:

```bash
# edit these files and restart
playground/entry.local.js
playground/xsrfTokenHeaderInjector.local.js
playground/xsrfTokenFormInjector.local.js
mocks/externals.js
mocks/xsrfToken.js
```

This startup path is intentionally mocked to make the dump runnable for local analysis.
