# IndexedDB Image Storage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move image payloads out of `localStorage` into `IndexedDB` so saving problems with screenshots no longer whitescreens the app.

**Architecture:** Keep problem metadata in `localStorage`, but store image blobs in a browser `IndexedDB` object store and reference them from blocks via a stable `idb://image/<id>` token. On startup, detect legacy base64 image blocks, migrate them into `IndexedDB`, then persist the lighter problem payload back to `localStorage`.

**Tech Stack:** React 19, TypeScript/TSX, Vite, browser `IndexedDB`, Node built-in test runner

---

### Task 1: Add regression coverage for image reference conversion

**Files:**
- Create: `tests/imageStorage.test.mjs`
- Create: `services/imageStorage.js`

- [ ] **Step 1: Write the failing test**
- [ ] **Step 2: Run `node --test tests/imageStorage.test.mjs` and verify it fails**
- [ ] **Step 3: Implement the minimal helper functions needed for the test**
- [ ] **Step 4: Run `node --test tests/imageStorage.test.mjs` and verify it passes**

### Task 2: Implement IndexedDB-backed image storage helpers

**Files:**
- Modify: `services/imageStorage.js`
- Create: `services/imageStorage.d.ts`

- [ ] **Step 1: Add image reference helpers and IndexedDB persistence helpers**
- [ ] **Step 2: Add legacy data migration helpers that convert inline data URLs into image refs**
- [ ] **Step 3: Keep the API small enough to use from editor, renderer, and app bootstrap**

### Task 3: Wire the app to the new storage path

**Files:**
- Modify: `components/BlockEditor.tsx`
- Modify: `components/BlockRenderer.tsx`
- Modify: `App.tsx`

- [ ] **Step 1: Update paste handling so screenshots are stored in `IndexedDB` before block content is updated**
- [ ] **Step 2: Update image rendering so `idb://image/<id>` references resolve to object URLs**
- [ ] **Step 3: Skip `localStorage` writes while legacy inline images are waiting to be migrated**
- [ ] **Step 4: Run the migration on startup and persist the migrated problem list**

### Task 4: Verify behavior

**Files:**
- Verify: `tests/imageStorage.test.mjs`
- Verify: `App.tsx`
- Verify: `components/BlockEditor.tsx`
- Verify: `components/BlockRenderer.tsx`

- [ ] **Step 1: Run `node --test tests/imageStorage.test.mjs`**
- [ ] **Step 2: Run `npm run build` or an equivalent project verification command**
- [ ] **Step 3: If sandbox blocks the build, re-run with escalation and record that limitation**
