# Split App.tsx Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `App.tsx` into focused hooks and UI components while preserving existing behavior.

**Architecture:** Keep `App.tsx` as the page-level orchestrator, move pure/derivable logic into hooks, and move large render sections into leaf components with explicit props. Avoid behavioral changes during the refactor; each extraction should keep the current data flow and event handlers intact.

**Tech Stack:** React 19, TypeScript, Vite, Node test scripts

---

## File Structure

**Keep:**
- `App.tsx` — top-level app orchestration, cross-section state, high-level handlers

**Create:**
- `hooks/useTheme.ts` — theme state, persistence, root class synchronization
- `hooks/useTableOfContents.ts` — derive right-side TOC items from the selected problem
- `hooks/useProblemFilters.ts` — search, sort, favorites filtering, tag grouping/sorting
- `components/dashboard/PersonalDashboard.tsx` — extracted dashboard UI
- `components/sidebar/ProblemSidebar.tsx` — extracted left sidebar UI
- `components/sidebar/TableOfContents.tsx` — extracted right sidebar UI
- `components/problem/ProblemView.tsx` — extracted read-only center problem content
- `components/problem/ProblemEditorView.tsx` — extracted editing UI
- `components/modals/SettingsModal.tsx` — extracted settings modal
- `components/modals/BatchTagModal.tsx` — extracted batch tag modal
- `components/app/theme.ts` — shared `Theme` type and theme class map
- `tests/app-split-check.mjs` — structural regression check for extracted modules

**Modify:**
- `App.tsx` — remove extracted render blocks and wire hooks/components together
- `types.ts` — add shared UI/helper types if needed

### Task 1: Extract Theme Logic

**Files:**
- Create: `hooks/useTheme.ts`
- Create: `components/app/theme.ts`
- Modify: `App.tsx`
- Test: `tests/app-split-check.mjs`

- [ ] **Step 1: Write the failing structural test**

```js
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('App.tsx', 'utf8');
assert.match(app, /useTheme\(/);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app-split-check.mjs`
Expected: FAIL because `useTheme` is not yet imported/used

- [ ] **Step 3: Write minimal implementation**

Create `hooks/useTheme.ts` to own:
- `theme` state
- localStorage read/write for `leetnotes-theme`
- `document.documentElement` class sync for `dark`, `theme-light`, `theme-dark`, `theme-eyecare`

Move the shared theme class map into `components/app/theme.ts`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app-split-check.mjs`
Expected: PASS for the `useTheme` extraction assertions

- [ ] **Step 5: Commit**

```bash
git add App.tsx hooks/useTheme.ts components/app/theme.ts tests/app-split-check.mjs
git commit -m "refactor: extract theme logic from app"
```

### Task 2: Extract Derived Data Hooks

**Files:**
- Create: `hooks/useTableOfContents.ts`
- Create: `hooks/useProblemFilters.ts`
- Modify: `App.tsx`
- Test: `tests/app-split-check.mjs`

- [ ] **Step 1: Extend the failing structural test**

Add assertions for:
- `useTableOfContents(`
- `useProblemFilters(`
- absence of the inlined `const tableOfContents = React.useMemo`

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app-split-check.mjs`
Expected: FAIL because derived-data hooks are not extracted yet

- [ ] **Step 3: Write minimal implementation**

Create:
- `useTableOfContents(selectedProblem)` returning TOC items
- `useProblemFilters(...)` returning filtered problems, grouped tags, sorted tags

Replace the corresponding `useMemo` and inline list derivation in `App.tsx`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app-split-check.mjs`
Expected: PASS for derived hook extraction assertions

- [ ] **Step 5: Commit**

```bash
git add App.tsx hooks/useTableOfContents.ts hooks/useProblemFilters.ts tests/app-split-check.mjs
git commit -m "refactor: extract app derived data hooks"
```

### Task 3: Extract Dashboard and Sidebars

**Files:**
- Create: `components/dashboard/PersonalDashboard.tsx`
- Create: `components/sidebar/ProblemSidebar.tsx`
- Create: `components/sidebar/TableOfContents.tsx`
- Modify: `App.tsx`
- Test: `tests/app-split-check.mjs`

- [ ] **Step 1: Extend the failing structural test**

Add assertions that `App.tsx` imports and renders:
- `PersonalDashboard`
- `ProblemSidebar`
- `TableOfContents`

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app-split-check.mjs`
Expected: FAIL because those components do not exist yet

- [ ] **Step 3: Write minimal implementation**

Extract the existing JSX with current handlers/props unchanged:
- dashboard card layout
- left sidebar list/tag modes
- right TOC sidebar

Keep event handlers in `App.tsx`; pass them through props.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app-split-check.mjs`
Expected: PASS for sidebar/dashboard extraction assertions

- [ ] **Step 5: Commit**

```bash
git add App.tsx components/dashboard/PersonalDashboard.tsx components/sidebar/ProblemSidebar.tsx components/sidebar/TableOfContents.tsx tests/app-split-check.mjs
git commit -m "refactor: extract dashboard and sidebar components"
```

### Task 4: Extract Problem Read/Edit Views

**Files:**
- Create: `components/problem/ProblemView.tsx`
- Create: `components/problem/ProblemEditorView.tsx`
- Modify: `App.tsx`
- Test: `tests/app-split-check.mjs`

- [ ] **Step 1: Extend the failing structural test**

Add assertions that `App.tsx` imports and renders:
- `ProblemView`
- `ProblemEditorView`

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app-split-check.mjs`
Expected: FAIL because read/edit panes are still inline

- [ ] **Step 3: Write minimal implementation**

Extract:
- read-mode header/content section into `ProblemView`
- edit-mode form/import section into `ProblemEditorView`

Keep mutations and state ownership in `App.tsx`; pass props down explicitly.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app-split-check.mjs`
Expected: PASS for read/edit view extraction assertions

- [ ] **Step 5: Commit**

```bash
git add App.tsx components/problem/ProblemView.tsx components/problem/ProblemEditorView.tsx tests/app-split-check.mjs
git commit -m "refactor: extract problem content views"
```

### Task 5: Extract Modal Components

**Files:**
- Create: `components/modals/SettingsModal.tsx`
- Create: `components/modals/BatchTagModal.tsx`
- Modify: `App.tsx`
- Test: `tests/app-split-check.mjs`

- [ ] **Step 1: Extend the failing structural test**

Add assertions that `App.tsx` imports and renders:
- `SettingsModal`
- `BatchTagModal`

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/app-split-check.mjs`
Expected: FAIL because modal markup is still inline

- [ ] **Step 3: Write minimal implementation**

Extract both modals as controlled components with explicit props for:
- open/close state
- theme classes
- callbacks such as backup/restore/apply tags

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/app-split-check.mjs`
Expected: PASS for modal extraction assertions

- [ ] **Step 5: Commit**

```bash
git add App.tsx components/modals/SettingsModal.tsx components/modals/BatchTagModal.tsx tests/app-split-check.mjs
git commit -m "refactor: extract modal components"
```

### Task 6: Final Integration Verification

**Files:**
- Modify: `tests/app-split-check.mjs`
- Verify: `App.tsx`, extracted hooks/components

- [ ] **Step 1: Finalize the structural test**

Ensure it asserts:
- `App.tsx` uses the extracted hooks/components
- `App.tsx` no longer contains the old large inline component declarations for dashboard and TOC logic

- [ ] **Step 2: Run structural verification**

Run: `node tests/app-split-check.mjs`
Expected: PASS

- [ ] **Step 3: Run targeted existing checks**

Run:
- `node tests/geminiService.no-top-level-client-check.mjs`
- `node tests/geminiService.parse-check.mjs`
- `node tests/toc-headings-only-check.mjs`
- `node tests/theme-scrollbar-check.mjs`
- `node tests/main-scrollbar-check.mjs`

Expected: all PASS

- [ ] **Step 4: Run app-level TypeScript/build verification when environment allows**

Run:
- `npm run build`

Expected: PASS if the local environment permits `esbuild` child process spawning. If it fails with sandbox `EPERM`, document that the failure is environmental rather than code-level.

- [ ] **Step 5: Commit**

```bash
git add App.tsx components hooks tests
git commit -m "refactor: split app into focused hooks and components"
```
