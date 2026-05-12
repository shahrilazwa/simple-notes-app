# Design Document: Simple Notes App

## Overview

The Simple Notes App is a client-side-only web application built with plain HTML, CSS, and
JavaScript. It lets users create, edit, delete, and search notes that are stored in the
browser's `localStorage`. There is no server, no build step, and no external dependencies
for the app itself — just files opened directly in a browser.

This design is intentionally beginner-friendly. Logic is split into two JavaScript files:
`notes-logic.js` holds pure functions that are easy to read and test in isolation, and
`app.js` handles the DOM and user events. This separation is the foundation for learning
automated unit testing with Jest.

### Goals

- Provide full CRUD (Create, Read, Update, Delete) functionality for notes.
- Persist notes across page refreshes using `localStorage`.
- Support real-time keyword search across note titles and bodies.
- Keep the codebase readable: no bundlers, no transpilers, no frameworks.
- Introduce automated unit testing in a beginner-friendly way using Jest.

### Non-Goals

- No user accounts or authentication.
- No server-side storage or sync.
- No rich-text / markdown rendering.
- No drag-and-drop reordering.
- No DOM testing or property-based testing at this stage.

---

## Architecture

The app follows a simple **data → render** cycle:

```
User Action
    │
    ▼
app.js (event handler)
    │
    ├─► Call pure function from notes-logic.js
    │       (createNote, updateNote, deleteNote, filterNotes, etc.)
    │
    ├─► Update in-memory notes array
    │
    ├─► Save notes array to localStorage (JSON)
    │
    └─► Re-render the Note_List from the current array
```

All state lives in a single JavaScript array called `notes` inside `app.js`. Every time the
array changes, the entire Note_List is re-rendered from scratch. This keeps the logic simple
and avoids tricky partial-update bugs.

The key architectural decision is the **separation of pure logic from DOM code**:

- `notes-logic.js` — pure functions only. No `document`, no `window`, no `localStorage`.
  These functions take inputs and return outputs. They are easy to test with Jest.
- `app.js` — wires the DOM to the logic. Reads from the DOM, calls logic functions, writes
  results back to the DOM and localStorage.

### File Structure

```
project/
├── index.html              — HTML skeleton: Search_Bar, Note_List, Editor form
├── style.css               — Visual styling: layout, cards, buttons, highlight state
├── notes-logic.js          — Pure functions: createNote, updateNote, deleteNote, filterNotes, etc.
├── app.js                  — DOM wiring: event listeners, rendering, localStorage, UI state
├── package.json            — Jest configuration and dev dependencies
├── docs/                   — Planning documents
│   ├── requirements.md
│   ├── design.md
│   └── tasks.md
└── tests/
    └── notes-logic.test.js — Jest unit tests for notes-logic.js
```

`index.html` loads `notes-logic.js` first, then `app.js`, so that `app.js` can call the
functions defined in `notes-logic.js`.

---

## Components and Interfaces

### 1. `index.html` — Page Structure

The HTML file defines the static skeleton. JavaScript never writes raw HTML strings into
`index.html`; instead, `app.js` targets specific container elements by `id`.

Key elements:

| Element ID / selector | Purpose |
|---|---|
| `#search-bar` | Text input for real-time search |
| `#note-list` | Container `<div>` where note cards are rendered |
| `#note-form` | The `<form>` wrapping the Editor |
| `#note-title` | `<input>` for the note title |
| `#note-body` | `<textarea>` for the note body |
| `#save-btn` | Submit button that saves the note |
| `#cancel-btn` | Button shown only while editing; cancels edit mode |
| `#title-error` | Inline `<span>` for the empty-title validation message |

`index.html` includes both script files at the bottom of `<body>`:

```html
<script src="notes-logic.js"></script>
<script src="app.js"></script>
```

### 2. `style.css` — Visual Styling

Responsibilities:
- Page layout (two-column or stacked, depending on viewport).
- Note card appearance (border, padding, hover state).
- `.editing` class applied to the active note card (highlight).
- `.hidden` utility class (`display: none`) used to show/hide the Cancel button and error
  message.
- Button styles (Save, Cancel, Delete).

`app.js` communicates with CSS only by adding/removing class names — it never sets inline
styles directly.

### 3. `notes-logic.js` — Pure Functions

This file contains all logic that does not touch the DOM or browser APIs. Every function
takes plain values as arguments and returns a plain value. This makes them straightforward
to test with Jest.

```js
// ID generation
function generateId()
// Returns a unique string ID, e.g. "note-1718000000000"
// Uses Date.now() — sufficient for a single-user, single-tab app.

// Note creation
function createNote(title, body)
// Returns a new note object: { id, title: title.trim(), body }
// Does NOT validate — validation is the caller's responsibility.

// Title validation
function isTitleValid(title)
// Returns true if title.trim() is non-empty, false otherwise.

// Note list operations
function addNoteToList(notes, note)
// Returns a new array with note appended. Does not mutate the original array.

function updateNoteInList(notes, id, title, body)
// Returns a new array where the note matching id has updated title and body.
// If no note matches id, returns the original array unchanged.

function deleteNoteFromList(notes, id)
// Returns a new array with the note matching id removed.
// If no note matches id, returns the original array unchanged.

// Search / filter
function filterNotes(notes, query)
// Returns a new array containing only notes where title or body includes
// query (case-insensitive). If query is empty or whitespace, returns all notes.

// localStorage serialisation
function serialiseNotes(notes)
// Returns a JSON string representing the notes array.

function deserialiseNotes(json)
// Parses a JSON string and returns an array of note objects.
// Returns [] if json is null, undefined, not valid JSON, or not an array.
```

The `if (typeof module !== "undefined")` guard at the bottom of the file means it works in
both environments:
- **Browser**: `module` is not defined, so the `module.exports` line is skipped. Functions
  are available as plain globals.
- **Jest (Node.js)**: `module` is defined, so Jest can `require` the file and import the
  functions for testing.

### 4. `app.js` — DOM Wiring

`app.js` is responsible for everything that touches the browser. It calls functions from
`notes-logic.js` and uses the results to update the DOM and localStorage.

#### State variables

```js
var notes     = [];   // in-memory array of note objects; source of truth at runtime
var editingId = null; // id of the note currently in the Editor, or null
```

#### Storage helpers (in app.js, because they touch localStorage)

```js
function loadNotes()
// Reads the JSON string from localStorage, calls deserialiseNotes,
// and assigns the result to the notes array.

function saveNotes()
// Calls serialiseNotes(notes) and writes the result to localStorage.
// Wraps localStorage.setItem in a try/catch and logs errors to the console.
```

#### Rendering

```js
function renderNoteList(query)
// Clears #note-list, filters notes using filterNotes,
// and renders a card element for each matching note.
// If no notes match, displays a "No notes found" message.

function createNoteCard(note)
// Returns a <div> DOM element representing one note card.
// The card contains the note title, a snippet of the body, and a Delete button.
```

#### Editor / UI state

```js
function loadNoteIntoEditor(id)
// Finds the note by id, populates #note-title and #note-body,
// sets editingId, shows the Cancel button, and adds .editing to the note card.

function clearEditor()
// Resets #note-title and #note-body to empty, sets editingId to null,
// hides the Cancel button, and removes .editing from all note cards.

function showTitleError()
// Removes .hidden from #title-error.

function hideTitleError()
// Adds .hidden to #title-error.
```

#### Event listeners (wired up at the bottom of `app.js`)

| Event | Element | Handler behaviour |
|---|---|---|
| `submit` | `#note-form` | Validate title with `isTitleValid`; add or update note |
| `click` | `#cancel-btn` | Call `clearEditor()` |
| `input` | `#search-bar` | Call `renderNoteList` with current search text |
| `click` (delegated) | `#note-list` | Edit note (card click) or delete note (Delete button) |

Event delegation is used on `#note-list` so that dynamically created note cards do not need
individual listeners attached each time they are rendered.

### 5. `package.json` — Jest Configuration

`package.json` is the only file that requires Node.js. It is used solely to install and run
Jest. The app itself still runs in the browser without Node.js.

```json
{
  "name": "simple-notes-app",
  "version": "1.0.0",
  "scripts": {
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

To install Jest: `npm install`
To run tests:    `npm test`

### 6. `tests/notes-logic.test.js` — Unit Tests

This file imports functions from `notes-logic.js` and tests them with Jest. Each test is
small, focused, and named to describe what it checks.

---

## Data Models

### Note Object

Each note is a plain JavaScript object:

```js
{
  id:    string,   // unique identifier, e.g. "note-1718000000000"
  title: string,   // required; non-empty after trimming
  body:  string    // optional; may be empty string; preserved exactly as entered
}
```

### In-Memory State (in `app.js`)

```js
var notes     = [];   // array of Note objects; source of truth at runtime
var editingId = null; // id of the note currently loaded in the Editor, or null
```

### localStorage Schema

Notes are stored under a single key:

```
Key:   "simple-notes-app-notes"
Value: JSON string — an array of Note objects, e.g.:
       '[{"id":"note-1","title":"Hello","body":"World"}]'
```

On load, `JSON.parse` is wrapped in a `try/catch` inside `deserialiseNotes`. If parsing
fails (malformed data), the function returns `[]` and the app starts with an empty list.
The bad data is overwritten on the next save.

### ID Generation

```js
function generateId() {
  return "note-" + Date.now();
}
```

`Date.now()` returns milliseconds since epoch. For a single-user, single-tab app this is
sufficient to guarantee uniqueness between note creations.

---

## Error Handling

### Empty Title Validation

- `isTitleValid(title)` in `notes-logic.js` checks whether `title.trim()` is non-empty.
- `app.js` calls `isTitleValid` before creating or updating a note.
- If invalid, `showTitleError()` makes `#title-error` visible.
- `hideTitleError()` is called on every `input` event on `#note-title` so the error clears
  as soon as the user starts typing.
- No note is created or updated when validation fails.

### localStorage Read Errors

- `deserialiseNotes(json)` in `notes-logic.js` wraps `JSON.parse` in a `try/catch`.
- On any error (malformed JSON, unexpected type), it returns `[]`.
- `loadNotes()` in `app.js` calls `deserialiseNotes` and assigns the result to `notes`.

### localStorage Write Errors

- `saveNotes()` in `app.js` wraps `localStorage.setItem` in a `try/catch`.
- If the write fails (e.g., storage quota exceeded), a console error is logged.
- The in-memory `notes` array remains valid; the user can continue working in the current
  session.

### Delete While Editing

- If the note being deleted is currently loaded in the Editor, `clearEditor()` is called
  first to prevent stale editor state.

### Event Delegation Safety

- The delegated click handler on `#note-list` checks `event.target` before acting.
- A click on the Delete button stops propagation so the card-click (edit) handler does not
  also fire.

---

## Testing Strategy

### Overview

The testing strategy for this project is intentionally minimal and beginner-friendly. The
goal is to learn the basics of automated unit testing without introducing complexity.

**What is tested automatically:** Pure functions in `notes-logic.js` using Jest.
**What is tested manually:** Browser behavior (rendering, events, localStorage) using smoke
tests.

This split works because `notes-logic.js` contains no DOM or browser API calls — it is
plain JavaScript that runs identically in Node.js (where Jest runs) and in the browser.

### Why Jest?

Jest is the most widely used JavaScript testing framework. It requires minimal configuration,
has clear error messages, and is well-documented. Running `npm test` is all that is needed
to execute the test suite.

### Unit Tests — `tests/notes-logic.test.js`

Each test follows the **Arrange → Act → Assert** pattern:
1. **Arrange** — set up the input data.
2. **Act** — call the function being tested.
3. **Assert** — check that the output matches what is expected.

### Smoke Tests (Manual)

These are verified by opening `index.html` directly in a browser. See `docs/tasks.md`
Task 8 for the full smoke test checklist.
