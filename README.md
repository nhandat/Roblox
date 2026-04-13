# Roblox-TS
This contains all the files that I dumped from the source-map files on roblox.com which contains the same as the Webpack in the browser.

## Last dump (M/D/Y)
04/02/2026

## Dump location
https://roblox.com/home

## TODO
- [ ] grab the JS map files using github actions

## Running this dump locally
This repository is a source-map dump and not a standalone runnable app.

### Why it does not start directly
- There is no root `package.json` with scripts.
- Entrypoints import internal Roblox packages such as `@rbx/externals`.
- Those private packages and Roblox runtime globals are not included here.

### How to inspect it
1. Open files directly (for example `entry.js`, `src/`, and `modules/`) to study implementation details.
2. Use search tools (e.g. `rg "keyword" src modules`) to trace symbols.
3. If you want to execute code, copy specific modules into your own project and mock missing `@rbx/*` dependencies.
