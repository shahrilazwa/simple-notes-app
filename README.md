# Simple Notes App

A browser-based notes app built with plain HTML, CSS, and JavaScript.
Notes are stored in the browser's `localStorage` so they persist between sessions —
no server, no database, no internet connection required.

This project was built as a hands-on learning exercise covering spec-driven development,
Git and GitHub workflow, unit testing with Jest, and automated CI with GitHub Actions.

---

## Features

- **Create notes** — add a note with a title and optional body
- **Edit notes** — click any note to load it into the editor and update it
- **Delete notes** — remove a note with the Delete button
- **Search notes in real time** — filter by title or body as you type
- **Empty title validation** — the app prevents saving a note without a title
- **localStorage persistence** — notes survive page refreshes
- **Cancel edit mode** — discard changes and return to the new-note state

---

## Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML |
| Styling | CSS |
| App logic | JavaScript (no frameworks) |
| Unit testing | [Jest](https://jestjs.io/) |
| CI pipeline | [GitHub Actions](https://docs.github.com/en/actions) |

---

## Project Structure

```
simple-notes-app/
├── index.html                    # Page structure — search bar, note list, editor form
├── style.css                     # All visual styling, including .hidden and .editing classes
├── notes-logic.js                # Pure functions: create, update, delete, filter, serialise
├── app.js                        # DOM wiring: event listeners, rendering, localStorage
├── package.json                  # Jest configuration and dev dependencies
├── tests/
│   └── notes-logic.test.js       # Jest unit tests for notes-logic.js
└── .github/
    └── workflows/
        └── ci.yml                # GitHub Actions CI pipeline
```

**Why two JavaScript files?**

`notes-logic.js` contains only pure functions — no DOM, no browser APIs.
This makes them easy to test with Jest in Node.js without needing a browser.
`app.js` handles everything that touches the browser: the DOM, events, and localStorage.

---

## How to Run the App

No installation needed. Open `index.html` directly in any modern browser.

**Option 1 — Double-click** `index.html` in File Explorer.

**Option 2 — PowerShell:**

```powershell
start .\index.html
```

The address bar will show `file:///...` — that is expected and correct.

---

## How to Run the Tests

Jest is the only dependency. Node.js must be installed.

**Install dependencies** (first time only — creates `node_modules/`):

```bash
npm install
```

**Run the test suite:**

```bash
npm test
```

Expected output:

```
PASS  tests/notes-logic.test.js
  generateId
    ✓ returns a non-empty string
    ✓ starts with the prefix 'note-'
    ✓ returns a different value on each call
  createNote
    ✓ returns an object with id, title, and body properties
    ...

Test Suites: 1 passed, 1 total
Tests:       38 passed, 38 total
```

---

## CI Pipeline

Every push to `main` and every pull request targeting `main` automatically triggers
the GitHub Actions CI pipeline defined in `.github/workflows/ci.yml`.

The pipeline:
1. Checks out the repository on `ubuntu-latest`
2. Sets up Node.js 20 with npm dependency caching
3. Installs dependencies using `npm ci` (reproducible — uses exact versions from `package-lock.json`)
4. Runs `npm test`

If any test fails, the pipeline goes red and the push is flagged.
You can see the results in the **Actions** tab on GitHub.

---

## What I Learned

- **Spec-driven development** — writing requirements and a design document before writing code
- **Breaking work into tasks** — each task had a clear scope, acceptance criteria, and commit message
- **Git and GitHub workflow** — initialising a repo, branching, committing with meaningful messages, and linking commits to issues
- **Unit testing with Jest** — writing Arrange → Act → Assert tests for pure functions, understanding what makes code testable
- **CI pipeline with GitHub Actions** — automating test runs on every push so regressions are caught immediately
- **Manual smoke testing** — verifying real browser behaviour that automated tests cannot cover

---

## Project Planning Documents

This project was built using spec-driven development with [Kiro](https://kiro.dev).
The planning documents are stored in the `docs/` folder:

- [Requirements](docs/requirements.md) — functional and non-functional requirements with acceptance criteria
- [Design](docs/design.md) — architecture, component breakdown, data models, and testing strategy
- [Tasks](docs/tasks.md) — step-by-step implementation tasks with commit reminders

---

## Future Improvements

- Add timestamps (created at / last edited)
- Add categories or tags to organise notes
- Add browser-based end-to-end tests (e.g. with Playwright)
- Improve responsive design for mobile viewports
- Add export / import notes as a JSON file
