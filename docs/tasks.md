# Implementation Tasks: Simple Notes App

## Overview

These tasks implement the Simple Notes App step by step. Each task has a short explanation
of what it does and why, so you can follow along as a learner. Tasks are ordered so that
each one builds on the previous — do not skip ahead.

A commit reminder appears at the end of each major task. Follow it before moving to the
next task — small, frequent commits make it easy to undo mistakes and show your progress
on GitHub.

---

- [x] 0. Set up Git and GitHub

  **What this does:** Initialises a local Git repository, connects it to a new GitHub
  repository, and pushes your first commit. This gives you a safe history from the very
  start of the project.

  **What you will learn:** What a Git repository is, what `.gitignore` does and why
  `node_modules/` must never be committed, how to link a local repo to a remote on GitHub,
  and how to push a branch.

  ### Acceptance Criteria
  - [x] 0.1 `git init` has been run in the project root — a `.git/` folder exists.
  - [x] 0.2 A `.gitignore` file exists at the project root.
  - [x] 0.3 `.gitignore` excludes `node_modules/`.
  - [x] 0.4 `.gitignore` excludes `coverage/`.
  - [x] 0.5 `.gitignore` excludes `.DS_Store`.
  - [x] 0.6 `.gitignore` excludes `Thumbs.db`.
  - [x] 0.7 An initial commit has been made containing only `.gitignore` (message: `chore: initial commit`).
  - [x] 0.8 A new empty repository has been created on GitHub at `https://github.com/shahrilazwa/simple-notes-app.git`.
  - [x] 0.9 The local repository has a remote named `origin` pointing to `https://github.com/shahrilazwa/simple-notes-app.git`.
  - [x] 0.10 The `main` branch has been pushed to GitHub and is visible at `https://github.com/shahrilazwa/simple-notes-app`.

  > **Commit reminder:** This task is the commit. The initial commit in 0.7 is the
  > deliverable. Verify it is visible on GitHub before continuing.

---

- [x] 1. Create the HTML skeleton (`index.html`)

  **What this does:** Sets up the page structure — the search bar, the note list area, and
  the editor form. This is the visual frame that all other code will plug into.

  **What you will learn:** How HTML elements are given `id` attributes so JavaScript can
  find them, and how two script files are loaded in the correct order.

  ### Acceptance Criteria
  - [x] 1.1 `index.html` exists at the project root.
  - [x] 1.2 The page contains a text input with `id="search-bar"`.
  - [x] 1.3 The page contains a `<div>` with `id="note-list"`.
  - [x] 1.4 The page contains a `<form>` with `id="note-form"`.
  - [x] 1.5 The form contains an `<input>` with `id="note-title"`.
  - [x] 1.6 The form contains a `<textarea>` with `id="note-body"`.
  - [x] 1.7 The form contains a `<button>` with `id="save-btn"` of type `submit`.
  - [x] 1.8 The form contains a `<button>` with `id="cancel-btn"` that has the `hidden` class applied by default.
  - [x] 1.9 The form contains a `<span>` with `id="title-error"` that has the `hidden` class applied by default.
  - [x] 1.10 `<link rel="stylesheet" href="style.css">` is present in `<head>`.
  - [x] 1.11 `<script src="notes-logic.js"></script>` is loaded before `<script src="app.js"></script>` at the bottom of `<body>`.

  > **Commit reminder:** Once `index.html` is complete, stage and commit it.
  > Suggested message: `feat: add HTML skeleton`

---

- [x] 2. Add basic styling (`style.css`)

  **What this does:** Makes the app look clean and usable. Styles the layout, note cards,
  buttons, and the editing highlight. Also defines the `.hidden` utility class that
  JavaScript uses to show and hide elements.

  **What you will learn:** How CSS classes are used as a communication channel between CSS
  and JavaScript — `app.js` never sets inline styles, it only adds or removes class names.

  ### Acceptance Criteria
  - [x] 2.1 `style.css` exists at the project root.
  - [x] 2.2 A `.hidden` class sets `display: none`.
  - [x] 2.3 Note cards have visible borders or background to distinguish them from the page.
  - [x] 2.4 An `.editing` class visually highlights a note card (e.g. different border color or background).
  - [x] 2.5 The Save and Delete buttons are styled and distinguishable from each other.
  - [x] 2.6 The layout is readable on a standard desktop viewport (min-width 600px).

  > **Commit reminder:** Once `style.css` is complete, stage and commit it.
  > Suggested message: `feat: add base styles`

---

- [x] 3. Create the pure logic file (`notes-logic.js`)

  **What this does:** Implements all the core logic of the app as pure functions — functions
  that take inputs and return outputs without touching the DOM or browser APIs. This is the
  file that Jest will test.

  **What you will learn:** What a pure function is, why separating logic from the DOM makes
  code easier to test, and how to use `module.exports` with a guard so the same file works
  in both the browser and Node.js.

  ### Acceptance Criteria
  - [x] 3.1 `notes-logic.js` exists at the project root.
  - [x] 3.2 `generateId()` returns a non-empty string each time it is called.
  - [x] 3.3 `createNote(title, body)` returns an object with `id`, `title` (trimmed), and `body` (preserved exactly as entered).
  - [x] 3.4 `isTitleValid(title)` returns `false` for an empty string and for a whitespace-only string.
  - [x] 3.5 `isTitleValid(title)` returns `true` for any string with at least one non-whitespace character.
  - [x] 3.6 `addNoteToList(notes, note)` returns a new array with the note appended and does not mutate the input array.
  - [x] 3.7 `updateNoteInList(notes, id, title, body)` returns a new array with the matching note updated and does not mutate the input array.
  - [x] 3.8 `updateNoteInList` returns the original array unchanged when no note matches the given id.
  - [x] 3.9 `deleteNoteFromList(notes, id)` returns a new array without the matching note and does not mutate the input array.
  - [x] 3.10 `deleteNoteFromList` returns the original array unchanged when no note matches the given id.
  - [x] 3.11 `filterNotes(notes, query)` returns only notes whose title or body contains the query string (case-insensitive).
  - [x] 3.12 `filterNotes` returns all notes when query is an empty string.
  - [x] 3.13 `serialiseNotes(notes)` returns a valid JSON string.
  - [x] 3.14 `deserialiseNotes(json)` returns the original array when given valid JSON.
  - [x] 3.15 `deserialiseNotes` returns `[]` for `null`, `undefined`, malformed JSON, or JSON that parses to a non-array.
  - [x] 3.16 The bottom of `notes-logic.js` contains `if (typeof module !== "undefined") { module.exports = { ... }; }` exporting all functions.

  > **Commit reminder:** Once `notes-logic.js` is complete, stage and commit it.
  > Suggested message: `feat: add pure notes logic functions`

---

- [x] 4. Set up Jest (`package.json` and `tests/notes-logic.test.js`)

  **What this does:** Installs Jest and creates the test file. After this task you can run
  `npm test` and see your first passing (or failing) tests.

  **What you will learn:** What `package.json` is, how to install a dev dependency with
  `npm install`, what a Jest test file looks like, and how to read test output in the
  terminal.

  ### Acceptance Criteria
  - [x] 4.1 `package.json` exists at the project root with `"jest"` listed under `"devDependencies"`.
  - [x] 4.2 `package.json` has a `"test"` script set to `"jest"`.
  - [x] 4.3 `tests/notes-logic.test.js` exists.
  - [x] 4.4 The test file imports all functions from `notes-logic.js` using `require`.
  - [x] 4.5 Running `npm test` executes without crashing.

  > **Commit reminder:** After running `npm install`, commit `package.json` and
  > `package-lock.json` together.
  > Suggested message: `chore: set up Jest (#2)`

---

- [x] 5. Write unit tests for `notes-logic.js`

  **What this does:** Writes one Jest test for each function in `notes-logic.js`. Each test
  follows the Arrange → Act → Assert pattern: set up inputs, call the function, check the
  output.

  **What you will learn:** How to write `describe` blocks and `test` (or `it`) blocks in
  Jest, how to use `expect` with matchers like `toBe`, `toEqual`, `toBeTruthy`, and
  `toHaveLength`, and how to read the pass/fail output.

  ### Acceptance Criteria
  - [x] 5.1 Tests for `isTitleValid`: empty string → `false`; whitespace-only → `false`; non-empty → `true`.
  - [x] 5.2 Tests for `createNote`: correct title on returned object; id is a non-empty string; title is trimmed; body is preserved exactly as entered (not trimmed).
  - [x] 5.3 Tests for `addNoteToList`: note is appended; original array is not mutated.
  - [x] 5.4 Tests for `updateNoteInList`: matching note is updated; original array is not mutated; unknown id returns original array.
  - [x] 5.5 Tests for `deleteNoteFromList`: matching note is removed; original array is not mutated; unknown id returns original array.
  - [x] 5.6 Tests for `filterNotes`: matches by title; matches by body; is case-insensitive; empty query returns all; no match returns empty array.
  - [x] 5.7 Tests for `serialiseNotes`: returns a string; the string is valid JSON.
  - [x] 5.8 Tests for `deserialiseNotes`: valid JSON returns original array; malformed JSON returns `[]`; `null` returns `[]`; non-array JSON returns `[]`.
  - [x] 5.9 Running `npm test` shows all tests passing with no failures.

  > **Commit reminder:** Once all tests are passing, stage and commit the test file.
  > Suggested message: `test: add unit tests for notes logic` / `Closes #2`

---

- [x] 6. Add GitHub Actions CI pipeline (`.github/workflows/ci.yml`)

  **What this does:** Creates an automated pipeline that runs your Jest tests on GitHub
  every time you push code or open a pull request.

  **What you will learn:** What CI (Continuous Integration) means, how a GitHub Actions
  workflow file is structured, what `npm ci` is and why it is preferred over `npm install`
  in automated pipelines, and how to read the results in the GitHub Actions tab.

  ### Acceptance Criteria
  - [x] 6.1 `.github/workflows/ci.yml` exists in the repository.
  - [x] 6.2 The workflow is named `CI`.
  - [x] 6.3 The workflow triggers on `push` to the `main` branch.
  - [x] 6.4 The workflow triggers on `pull_request` targeting the `main` branch.
  - [x] 6.5 The workflow runs on `ubuntu-latest`.
  - [x] 6.6 The workflow sets up Node.js version 20 using the `actions/setup-node` action.
  - [x] 6.7 The workflow caches npm dependencies using `cache: 'npm'`.
  - [x] 6.8 The workflow installs dependencies using `npm ci`.
  - [x] 6.9 The workflow runs tests using `npm test`.
  - [x] 6.10 After pushing, the Actions tab shows the workflow passing.

  > **Commit reminder:** `ci: add GitHub Actions workflow` / `Closes #3`

---

- [x] 7. Implement DOM wiring and event handling (`app.js`)

  **What this does:** Connects the HTML page to the logic in `notes-logic.js`. Handles user
  events (form submit, button clicks, search input), updates the `notes` array, saves to
  localStorage, and re-renders the note list.

  **What you will learn:** How event listeners work, what event delegation is and why it is
  useful for dynamically created elements, and how `localStorage.getItem` / `setItem` work.

  ### Acceptance Criteria
  - [x] 7.1 `app.js` exists at the project root.
  - [x] 7.2 On page load, notes are read from localStorage and rendered in `#note-list`.
  - [x] 7.3 Submitting `#note-form` with a valid title creates a new note, saves it, and renders it.
  - [x] 7.4 Submitting with an empty/whitespace title shows `#title-error` and does not create a note.
  - [x] 7.5 `#title-error` is hidden as soon as the user starts typing in `#note-title`.
  - [x] 7.6 After a note is saved, `#note-title` and `#note-body` are cleared.
  - [x] 7.7 Clicking a note card loads that note's title and body into the editor.
  - [x] 7.8 While editing, `#cancel-btn` is visible and the note card has the `.editing` class.
  - [x] 7.9 Clicking `#cancel-btn` clears the editor and removes `.editing` from all cards.
  - [x] 7.10 Submitting while editing updates the note in the list and in localStorage.
  - [x] 7.11 Each note card has a Delete button; clicking it removes the note.
  - [x] 7.12 Deleting a note that is currently in the editor also clears the editor.
  - [x] 7.13 Typing in `#search-bar` filters the note list in real time.
  - [x] 7.14 Clearing `#search-bar` shows all notes.
  - [x] 7.15 When no notes match, `#note-list` displays a "No notes found" message.

  > **Commit reminder:** `feat: implement DOM wiring and event handling` / `Closes #4`

---

- [x] 8. Manual smoke testing in the browser

  **What this does:** Verifies that the complete app works correctly when opened in a real
  browser. Automated tests cover the logic; smoke tests cover the full user experience.

  **What you will learn:** The difference between automated tests (fast, repeatable, run in
  Node.js) and manual smoke tests (slower, but verify real browser behavior).

  ### Acceptance Criteria
  - [x] 8.1 Opening `index.html` via `file://` in a browser shows no console errors.
  - [x] 8.2 All expected elements are visible on the page.
  - [x] 8.3 Creating a note adds it to the list immediately.
  - [x] 8.4 Refreshing the page keeps all saved notes.
  - [x] 8.5 Clicking a note loads it into the editor with the correct title and body.
  - [x] 8.6 Editing and saving a note updates it in the list.
  - [x] 8.7 Clicking Cancel Edit clears the editor and removes the highlight.
  - [x] 8.8 Deleting a note removes it from the list.
  - [x] 8.9 Typing in the search bar filters the list in real time.
  - [x] 8.10 Clearing the search bar shows all notes.
  - [x] 8.11 No external scripts or stylesheets are loaded from CDNs (check the Network tab).
