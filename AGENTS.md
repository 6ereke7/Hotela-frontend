# AGENTS.md

Guidance for AI coding agents working in this React codebase. Follow these conventions when creating, moving, or editing code.

## Project status

This project was created with `npm create vite@latest` and is currently **UI design and implementation only**. There is no backend integration yet. It will scale later to talk to a backend, so structure code to make that transition easy, but do not build backend plumbing now.

- Use mock/static data (local constants or JSON files) for anything that will later come from an API.
- Do not add data-fetching, state, or testing libraries unless asked. Prefer plain React (`useState`, `useReducer`, Context) for now.

## Stack

- React + TypeScript
- Vite
- ESLint (from the Vite template)
- lucid-react

> If something here conflicts with `package.json`, trust `package.json`.

## Project structure

```
src/
├── app/                # App shell: providers, router, global styles
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── modules/            # One folder per business domain
│   ├── auth/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── data/       # Mock data for now
│   │   ├── types.ts
│   │   └── index.ts    # Public API of the module
│   └── orders/
├── components/         # Shared, generic UI (Button, Modal, Input)
├── hooks/              # Shared hooks (useDebounce, useMediaQuery)
├── lib/                # Configured libraries and clients (added later)
├── utils/              # Pure helper functions
├── types/              # Global types
└── assets/
```

Create folders only when you need them. Do not scaffold empty folders in advance.

## Dependency rules

Dependencies flow in one direction: **shared -> modules -> app**.

- `components/`, `hooks/`, `lib/`, `utils/`, `types/` (shared code) must **never** import from `modules/` or `app/`.
- A module may import from shared code, but **never from another module**.
- `app/` may import from modules and shared code.
- If two modules need the same code, move it to shared code. Do not import across modules.
- Import from a module only through its public API: `import { LoginForm } from "@/modules/auth"`. Never deep-import (`@/modules/auth/components/LoginForm`) from outside that module.

## Module conventions

- Each module has an `index.ts` that exports only what other code is allowed to use. Keep everything else internal.
- Create a new module only for a distinct business domain. Do not create a module for a single component.
- Put route-level screens in a module's `pages/` folder; keep supporting and reusable UI in `components/`. Create these folders only when needed.
- Colocate styles and types with the code they belong to (`Button.tsx` and `Button.module.css` side by side).
- Keep mock data inside the module's `data/` folder and access it through a small function (e.g., `getOrders()`), not by importing the constant everywhere. When the backend arrives, only that function changes.
- Route-level screens are composed in `app/router.tsx`. Keep them thin: they compose module components and contain no business logic.

## Code style

- Function components with hooks only. No class components.
- One component per file. File name matches the export: `OrderList.tsx` exports `OrderList`.
- When refactoring a page, first understand its responsibilities, data flow, and existing module patterns. Identify the smallest set of clear component boundaries that makes it easier to read and change.
- Extract a component when it has a distinct responsibility, meaningful internal complexity or state, or is reused. Keep simple, one-off markup together when extracting it would only add indirection.
- Do not split a page just to reduce line count or make every section a component. Prefer cohesive components with clear names and props, and keep page composition easy to follow.
- Put shared UI in shared code only when it is genuinely generic and used across modules; keep domain-specific UI within its module.
- Components and types use `PascalCase`, hooks start with `use`, variables and functions use `camelCase`, folders use `kebab-case`.
- Prefer named exports. Use default exports only where a tool requires them (e.g., lazy-loaded routes).
- Use the `@/` path alias for imports from `src/`. Use relative imports only within the same module or folder.
- Avoid `any`. Use `unknown` and narrow, or define a proper type.
- Define props with a named `type` or `interface` placed above the component.
- Keep components small. If a component is hard to read, extract hooks for logic and child components for markup.

## UI guidelines

- Build reusable, generic UI in `components/`; build domain-specific UI inside its module.
- Make layouts responsive by default.
- Use semantic HTML and keep basic accessibility in mind (labels, alt text, keyboard focus, sufficient contrast).
- Keep styling approach consistent with what the project already uses. Do not introduce a second styling system.

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Type-check and production build
npm run lint      # ESLint
npm run preview   # Preview the production build
```

Before considering a task done, run `npm run lint` and `npm run build` and fix any failures you introduced.

## Working rules for agents

- Make the smallest change that solves the task. Do not refactor unrelated code.
- Follow existing patterns in the surrounding code before introducing new ones.
- Do not add dependencies without asking. Check whether an existing dependency already covers the need.
- Do not edit generated files, lockfiles (by hand), or build output.
- Never commit secrets. Environment variables go in `.env.local` and are read via `import.meta.env`; only `VITE_`-prefixed values are exposed to the client.
- When adding a new module, create the folder with an `index.ts` first, then add internals behind it.
- If a request conflicts with the dependency rules above, say so and propose an alternative instead of breaking the rules.
