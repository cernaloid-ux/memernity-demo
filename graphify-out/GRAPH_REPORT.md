# Graph Report - /Users/user/Desktop/memernity-app  (2026-07-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 101 nodes · 96 edges · 12 communities (9 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cd4b291f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- devDependencies
- compilerOptions
- page.tsx
- dependencies
- include
- page.tsx
- package.json
- layout.tsx
- lib
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `include` - 7 edges
3. `scripts` - 5 edges
4. `lib` - 4 edges
5. `supabase` - 3 edges
6. `@supabase/supabase-js` - 2 edges
7. `browser-image-compression` - 2 edges
8. `lucide-react` - 2 edges
9. `next` - 2 edges
10. `react` - 2 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Import Cycles
- None detected.

## Communities (12 total, 3 thin omitted)

### Community 0 - "devDependencies"
Cohesion: 0.12
Nodes (17): eslint, eslint-config-next, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node (+9 more)

### Community 1 - "compilerOptions"
Cohesion: 0.13
Nodes (15): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, module, moduleResolution (+7 more)

### Community 2 - "page.tsx"
Cohesion: 0.15
Nodes (7): BIO_SECTIONS, FACTS, INITIAL_COMMENTS, MEDIA_DATA, NAV, TAG_DETAILS, TAGS

### Community 3 - "dependencies"
Cohesion: 0.15
Nodes (13): browser-image-compression, lucide-react, next, dependencies, browser-image-compression, lucide-react, next, react (+5 more)

### Community 4 - "include"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 5 - "page.tsx"
Cohesion: 0.25
Nodes (3): ICON_LIBRARY, ROLES_DATA, supabase

### Community 6 - "package.json"
Cohesion: 0.22
Nodes (8): name, private, scripts, build, dev, lint, start, version

### Community 7 - "layout.tsx"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

### Community 8 - "lib"
Cohesion: 0.50
Nodes (4): dom, dom.iterable, esnext, lib

## Knowledge Gaps
- **60 isolated node(s):** `ICON_LIBRARY`, `ROLES_DATA`, `geistSans`, `geistMono`, `metadata` (+55 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `dependencies` connect `dependencies` to `package.json`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `compilerOptions` to `lib`, `include`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `ICON_LIBRARY`, `ROLES_DATA`, `geistSans` to the rest of the system?**
  _60 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._