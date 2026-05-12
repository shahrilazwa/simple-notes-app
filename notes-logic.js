/**
 * notes-logic.js
 *
 * Pure functions for the Simple Notes App.
 *
 * "Pure" means every function here:
 *   - Takes plain values as inputs
 *   - Returns a plain value as output
 *   - Never touches the DOM, window, or localStorage
 *
 * Because there are no side effects, Jest can import and test
 * these functions directly in Node.js without needing a browser.
 *
 * The guard at the bottom of this file makes it work in both
 * environments:
 *   - Browser: functions are plain globals (module is undefined)
 *   - Jest/Node.js: functions are exported via module.exports
 */

// ─────────────────────────────────────────────
// ID generation
// ─────────────────────────────────────────────

/**
 * Generates a unique string ID for a new note.
 * Uses Date.now() (milliseconds since epoch).
 * Sufficient for a single-user, single-tab app.
 *
 * @returns {string} e.g. "note-1718000000000"
 */
function generateId() {
  return "note-" + Date.now();
}

// ─────────────────────────────────────────────
// Note creation
// ─────────────────────────────────────────────

/**
 * Builds a new note object.
 * The title is trimmed (leading/trailing whitespace removed).
 * The body is preserved exactly as entered — users may
 * intentionally include spacing or line breaks.
 *
 * Does NOT validate — call isTitleValid() before calling this.
 *
 * @param {string} title
 * @param {string} body
 * @returns {{ id: string, title: string, body: string }}
 */
function createNote(title, body) {
  return {
    id: generateId(),
    title: title.trim(),
    body: body,
  };
}

// ─────────────────────────────────────────────
// Title validation
// ─────────────────────────────────────────────

/**
 * Returns true if the title contains at least one
 * non-whitespace character, false otherwise.
 *
 * @param {string} title
 * @returns {boolean}
 */
function isTitleValid(title) {
  return title.trim().length > 0;
}

// ─────────────────────────────────────────────
// Note list operations
 // All three functions return NEW arrays and never
// mutate the array that was passed in.
// ─────────────────────────────────────────────

/**
 * Returns a new array with the given note appended.
 *
 * @param {Array} notes  - existing notes array
 * @param {Object} note  - note object to add
 * @returns {Array}
 */
function addNoteToList(notes, note) {
  return [...notes, note];
}

/**
 * Returns a new array where the note matching `id`
 * has its title and body replaced with the new values.
 * If no note matches `id`, returns the original array unchanged.
 *
 * @param {Array}  notes
 * @param {string} id
 * @param {string} title
 * @param {string} body
 * @returns {Array}
 */
function updateNoteInList(notes, id, title, body) {
  return notes.map(function (note) {
    if (note.id === id) {
      return { id: note.id, title: title.trim(), body: body };
    }
    return note;
  });
}

/**
 * Returns a new array with the note matching `id` removed.
 * If no note matches `id`, returns the original array unchanged.
 *
 * @param {Array}  notes
 * @param {string} id
 * @returns {Array}
 */
function deleteNoteFromList(notes, id) {
  return notes.filter(function (note) {
    return note.id !== id;
  });
}

// ─────────────────────────────────────────────
// Search / filter
// ─────────────────────────────────────────────

/**
 * Returns a new array containing only notes whose title
 * or body includes the query string (case-insensitive).
 *
 * If query is empty or whitespace-only, all notes are returned.
 *
 * @param {Array}  notes
 * @param {string} query
 * @returns {Array}
 */
function filterNotes(notes, query) {
  var trimmed = query.trim();
  if (trimmed === "") {
    return notes;
  }
  var lower = trimmed.toLowerCase();
  return notes.filter(function (note) {
    return (
      note.title.toLowerCase().includes(lower) ||
      note.body.toLowerCase().includes(lower)
    );
  });
}

// ─────────────────────────────────────────────
// localStorage serialisation
// ─────────────────────────────────────────────

/**
 * Converts the notes array to a JSON string for storage.
 *
 * @param {Array} notes
 * @returns {string}
 */
function serialiseNotes(notes) {
  return JSON.stringify(notes);
}

/**
 * Parses a JSON string back into an array of note objects.
 *
 * Returns [] (empty array) if:
 *   - json is null or undefined
 *   - json is not valid JSON
 *   - json parses to something that is not an array
 *
 * This means the app always starts with a clean state
 * rather than crashing on bad localStorage data.
 *
 * @param {string|null|undefined} json
 * @returns {Array}
 */
function deserialiseNotes(json) {
  if (json === null || json === undefined) {
    return [];
  }
  try {
    var parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed;
  } catch (e) {
    return [];
  }
}

// ─────────────────────────────────────────────
// Module export guard
//
// typeof module !== "undefined" is true in Node.js (Jest)
// and false in the browser, so this line is safely skipped
// when the file is loaded as a plain <script> tag.
// ─────────────────────────────────────────────
if (typeof module !== "undefined") {
  module.exports = {
    generateId,
    createNote,
    isTitleValid,
    addNoteToList,
    updateNoteInList,
    deleteNoteFromList,
    filterNotes,
    serialiseNotes,
    deserialiseNotes,
  };
}
