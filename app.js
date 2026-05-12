/**
 * app.js
 *
 * DOM wiring for the Simple Notes App.
 *
 * This file is responsible for everything that touches the browser:
 *   - Reading from and writing to the DOM
 *   - Listening for user events (clicks, form submits, typing)
 *   - Reading from and writing to localStorage
 *   - Rendering note cards into #note-list
 *
 * All data logic (creating, updating, deleting, filtering notes)
 * is delegated to the pure functions in notes-logic.js, which is
 * loaded before this file in index.html.
 *
 * Rule: this file never sets inline styles. It only adds or removes
 * CSS class names (.hidden, .editing) defined in style.css.
 */

// ─────────────────────────────────────────────
// localStorage key
// ─────────────────────────────────────────────

var STORAGE_KEY = "simple-notes-app-notes";

// ─────────────────────────────────────────────
// In-memory state
//
// notes     — the single source of truth at runtime.
//             Every change updates this array, saves it to
//             localStorage, and re-renders the note list.
//
// editingId — the id of the note currently loaded in the
//             editor, or null when the editor is in "new note" mode.
// ─────────────────────────────────────────────

var notes     = [];
var editingId = null;

// ─────────────────────────────────────────────
// DOM references
// Grabbed once at startup so we don't query the DOM repeatedly.
// ─────────────────────────────────────────────

var searchBar  = document.getElementById("search-bar");
var noteList   = document.getElementById("note-list");
var noteForm   = document.getElementById("note-form");
var noteTitle  = document.getElementById("note-title");
var noteBody   = document.getElementById("note-body");
var saveBtn    = document.getElementById("save-btn");
var cancelBtn  = document.getElementById("cancel-btn");
var titleError = document.getElementById("title-error");

// ─────────────────────────────────────────────
// localStorage helpers
// These live in app.js (not notes-logic.js) because they
// touch a browser API (localStorage).
// ─────────────────────────────────────────────

/**
 * Reads the notes JSON string from localStorage and returns
 * a parsed array. Falls back to [] on any error.
 */
function loadNotes() {
  var json = localStorage.getItem(STORAGE_KEY);
  return deserialiseNotes(json);
}

/**
 * Serialises the current notes array and writes it to localStorage.
 * Wraps setItem in a try/catch so a quota error doesn't crash the app.
 */
function saveNotes() {
  try {
    localStorage.setItem(STORAGE_KEY, serialiseNotes(notes));
  } catch (e) {
    console.error("Could not save notes to localStorage:", e);
  }
}

// ─────────────────────────────────────────────
// Rendering
// ─────────────────────────────────────────────

/**
 * Clears #note-list and re-renders it from the current notes array.
 * If a search query is active, only matching notes are shown.
 * If no notes match (or the list is empty), shows a message.
 *
 * @param {string} [query] - optional search string from #search-bar
 */
function renderNoteList(query) {
  // Default to the current value of the search bar if no query passed
  var searchQuery = (query !== undefined) ? query : searchBar.value;

  // Filter using the pure function from notes-logic.js
  var visible = filterNotes(notes, searchQuery);

  // Clear the list
  noteList.innerHTML = "";

  if (visible.length === 0) {
    // Show "No notes found" message
    var msg = document.createElement("p");
    msg.className = "empty-message";
    msg.textContent = notes.length === 0
      ? "No notes yet. Create your first note above."
      : "No notes found.";
    noteList.appendChild(msg);
    return;
  }

  // Render one card per visible note
  visible.forEach(function (note) {
    noteList.appendChild(createNoteCard(note));
  });
}

/**
 * Builds and returns a DOM element representing one note card.
 * The card contains:
 *   - The note title
 *   - A short snippet of the body (first line, truncated by CSS)
 *   - A Delete button
 *
 * If this note is currently being edited, the .editing class is added.
 *
 * @param {Object} note
 * @returns {HTMLElement}
 */
function createNoteCard(note) {
  var card = document.createElement("div");
  card.className = "note-card";
  card.dataset.id = note.id;

  // Highlight the card if it is currently loaded in the editor
  if (note.id === editingId) {
    card.classList.add("editing");
  }

  // Title
  var titleEl = document.createElement("p");
  titleEl.className = "note-card-title";
  titleEl.textContent = note.title;

  // Body snippet (first line only; CSS truncates with ellipsis)
  var snippetEl = document.createElement("p");
  snippetEl.className = "note-card-snippet";
  snippetEl.textContent = note.body.split("\n")[0] || "";

  // Delete button
  var deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.dataset.id = note.id;
  // aria-label makes the button accessible to screen readers
  deleteButton.setAttribute("aria-label", "Delete note: " + note.title);

  card.appendChild(titleEl);
  card.appendChild(snippetEl);
  card.appendChild(deleteButton);

  return card;
}

// ─────────────────────────────────────────────
// Editor / UI state helpers
// ─────────────────────────────────────────────

/**
 * Loads a note into the editor for editing.
 * - Populates #note-title and #note-body with the note's content
 * - Sets editingId so the form submit handler knows to update, not create
 * - Shows the Cancel button
 * - Re-renders the list so the .editing highlight appears on the card
 *
 * @param {string} id - the id of the note to load
 */
function loadNoteIntoEditor(id) {
  var note = notes.find(function (n) { return n.id === id; });
  if (!note) { return; }

  editingId = id;
  noteTitle.value = note.title;
  noteBody.value  = note.body;

  // Show the Cancel button
  cancelBtn.classList.remove("hidden");

  // Hide any leftover validation error
  hideTitleError();

  // Re-render so the .editing class appears on the correct card
  renderNoteList();

  // Move focus to the title field so the user can start editing immediately
  noteTitle.focus();
}

/**
 * Resets the editor to its default "new note" state:
 * - Clears #note-title and #note-body
 * - Sets editingId back to null
 * - Hides the Cancel button
 * - Hides any validation error
 * - Re-renders the list to remove the .editing highlight
 */
function clearEditor() {
  editingId = null;
  noteTitle.value = "";
  noteBody.value  = "";
  cancelBtn.classList.add("hidden");
  hideTitleError();
  renderNoteList();
}

/**
 * Shows the inline title validation error message.
 */
function showTitleError() {
  titleError.classList.remove("hidden");
}

/**
 * Hides the inline title validation error message.
 */
function hideTitleError() {
  titleError.classList.add("hidden");
}

// ─────────────────────────────────────────────
// Event handlers
// ─────────────────────────────────────────────

/**
 * Handles form submission (Save button).
 *
 * If editingId is set  → update the existing note.
 * If editingId is null → create a new note.
 *
 * Validates the title first; shows an error and aborts if invalid.
 */
noteForm.addEventListener("submit", function (event) {
  // Prevent the browser from reloading the page on form submit
  event.preventDefault();

  var title = noteTitle.value;
  var body  = noteBody.value;

  // Validate — title must not be empty or whitespace-only
  if (!isTitleValid(title)) {
    showTitleError();
    noteTitle.focus();
    return;
  }

  if (editingId !== null) {
    // ── Update existing note ──────────────────
    notes = updateNoteInList(notes, editingId, title, body);
  } else {
    // ── Create new note ───────────────────────
    var newNote = createNote(title, body);
    notes = addNoteToList(notes, newNote);
  }

  saveNotes();
  clearEditor(); // also calls renderNoteList()
});

/**
 * Hides the title error as soon as the user starts typing in the
 * title field, so the error doesn't linger unnecessarily.
 */
noteTitle.addEventListener("input", function () {
  hideTitleError();
});

/**
 * Handles the Cancel Edit button.
 * Clears the editor and returns to "new note" mode.
 */
cancelBtn.addEventListener("click", function () {
  clearEditor();
});

/**
 * Handles real-time search.
 * Filters the note list on every keystroke — no button click needed.
 */
searchBar.addEventListener("input", function () {
  renderNoteList(searchBar.value);
});

/**
 * Handles clicks inside #note-list using event delegation.
 *
 * Event delegation means we attach ONE listener to the parent
 * container (#note-list) instead of attaching a listener to every
 * card. This works because click events "bubble up" from the element
 * that was clicked to its ancestors.
 *
 * Two cases:
 *   1. Click on a Delete button → delete the note (do NOT open editor)
 *   2. Click anywhere else on a card → load the note into the editor
 */
noteList.addEventListener("click", function (event) {
  var target = event.target;

  // ── Case 1: Delete button clicked ────────────────────────────
  if (target.classList.contains("delete-btn")) {
    // Stop the click from bubbling up to the card, which would
    // otherwise trigger the edit handler below.
    event.stopPropagation();

    var idToDelete = target.dataset.id;

    // If the note being deleted is currently in the editor, clear it
    if (idToDelete === editingId) {
      editingId = null;
      noteTitle.value = "";
      noteBody.value  = "";
      cancelBtn.classList.add("hidden");
      hideTitleError();
    }

    notes = deleteNoteFromList(notes, idToDelete);
    saveNotes();
    renderNoteList();
    return;
  }

  // ── Case 2: Card body clicked (edit) ─────────────────────────
  // Walk up the DOM from the clicked element to find the note card.
  // This handles clicks on the title <p> or snippet <p> inside the card.
  var card = target.closest(".note-card");
  if (card) {
    loadNoteIntoEditor(card.dataset.id);
  }
});

// ─────────────────────────────────────────────
// Initialisation
// Runs once when the page loads.
// ─────────────────────────────────────────────

notes = loadNotes();
renderNoteList();
