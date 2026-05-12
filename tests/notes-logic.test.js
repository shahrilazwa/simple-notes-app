/**
 * tests/notes-logic.test.js
 *
 * Full unit test suite for notes-logic.js.
 *
 * Run with:  npm test
 *
 * Each test follows the Arrange → Act → Assert pattern:
 *   1. Arrange — set up the input data
 *   2. Act     — call the function being tested
 *   3. Assert  — check the output matches what is expected
 *
 * Tests are grouped by function using describe() blocks.
 */

const {
  generateId,
  createNote,
  isTitleValid,
  addNoteToList,
  updateNoteInList,
  deleteNoteFromList,
  filterNotes,
  serialiseNotes,
  deserialiseNotes,
} = require("../notes-logic");

// ─────────────────────────────────────────────
// generateId
// ─────────────────────────────────────────────

describe("generateId", function () {
  test("returns a non-empty string", function () {
    // Act
    var id = generateId();

    // Assert
    expect(typeof id).toBe("string");
    expect(id.length).toBeGreaterThan(0);
  });

  test("starts with the prefix 'note-'", function () {
    var id = generateId();
    expect(id.startsWith("note-")).toBe(true);
  });

  test("returns a different value on each call", function () {
    // Two IDs generated at different moments should not be equal.
    // We use a small delay via a busy-wait to ensure Date.now() advances.
    var id1 = generateId();
    // Spin until Date.now() changes (usually < 1 ms)
    var start = Date.now();
    while (Date.now() === start) { /* wait */ }
    var id2 = generateId();

    expect(id1).not.toBe(id2);
  });
});

// ─────────────────────────────────────────────
// createNote
// ─────────────────────────────────────────────

describe("createNote", function () {
  test("returns an object with id, title, and body properties", function () {
    // Arrange
    var title = "My Note";
    var body = "Some content";

    // Act
    var note = createNote(title, body);

    // Assert
    expect(note).toHaveProperty("id");
    expect(note).toHaveProperty("title");
    expect(note).toHaveProperty("body");
  });

  test("id is a non-empty string", function () {
    var note = createNote("Title", "Body");
    expect(typeof note.id).toBe("string");
    expect(note.id.length).toBeGreaterThan(0);
  });

  test("trims leading and trailing whitespace from the title", function () {
    // Arrange
    var title = "  Hello World  ";

    // Act
    var note = createNote(title, "body");

    // Assert
    expect(note.title).toBe("Hello World");
  });

  test("preserves the body exactly as entered — does not trim it", function () {
    // Users may intentionally include leading spaces or line breaks in the body.
    // Arrange
    var body = "  line one\n  line two  ";

    // Act
    var note = createNote("Title", body);

    // Assert — body must be identical to what was passed in
    expect(note.body).toBe("  line one\n  line two  ");
  });

  test("allows an empty body", function () {
    var note = createNote("Title", "");
    expect(note.body).toBe("");
  });
});

// ─────────────────────────────────────────────
// isTitleValid
// ─────────────────────────────────────────────

describe("isTitleValid", function () {
  test("returns false for an empty string", function () {
    expect(isTitleValid("")).toBe(false);
  });

  test("returns false for a whitespace-only string", function () {
    expect(isTitleValid("   ")).toBe(false);
  });

  test("returns false for a tab-only string", function () {
    expect(isTitleValid("\t")).toBe(false);
  });

  test("returns true for a normal title", function () {
    expect(isTitleValid("My Note")).toBe(true);
  });

  test("returns true for a title that is a single character", function () {
    expect(isTitleValid("A")).toBe(true);
  });

  test("returns true for a title with surrounding whitespace", function () {
    // The title '  Hello  ' is valid — createNote will trim it,
    // but isTitleValid should still return true.
    expect(isTitleValid("  Hello  ")).toBe(true);
  });
});

// ─────────────────────────────────────────────
// addNoteToList
// ─────────────────────────────────────────────

describe("addNoteToList", function () {
  test("returns a new array with the note appended", function () {
    // Arrange
    var existing = [{ id: "note-1", title: "First", body: "" }];
    var newNote  = { id: "note-2", title: "Second", body: "" };

    // Act
    var result = addNoteToList(existing, newNote);

    // Assert
    expect(result).toHaveLength(2);
    expect(result[1]).toEqual(newNote);
  });

  test("works when the existing list is empty", function () {
    var newNote = { id: "note-1", title: "First", body: "" };
    var result  = addNoteToList([], newNote);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(newNote);
  });

  test("does not mutate the original array", function () {
    // Arrange
    var original = [{ id: "note-1", title: "First", body: "" }];
    var snapshot = original.length;

    // Act
    addNoteToList(original, { id: "note-2", title: "Second", body: "" });

    // Assert — original is unchanged
    expect(original).toHaveLength(snapshot);
  });
});

// ─────────────────────────────────────────────
// updateNoteInList
// ─────────────────────────────────────────────

describe("updateNoteInList", function () {
  test("returns a new array with the matching note updated", function () {
    // Arrange
    var notes = [
      { id: "note-1", title: "Old Title", body: "Old body" },
      { id: "note-2", title: "Other",     body: "Other body" },
    ];

    // Act
    var result = updateNoteInList(notes, "note-1", "New Title", "New body");

    // Assert
    expect(result[0].title).toBe("New Title");
    expect(result[0].body).toBe("New body");
  });

  test("trims the updated title", function () {
    var notes  = [{ id: "note-1", title: "Old", body: "" }];
    var result = updateNoteInList(notes, "note-1", "  Trimmed  ", "body");
    expect(result[0].title).toBe("Trimmed");
  });

  test("preserves the updated body exactly as entered", function () {
    var notes  = [{ id: "note-1", title: "Title", body: "" }];
    var body   = "  spaced body\n";
    var result = updateNoteInList(notes, "note-1", "Title", body);
    expect(result[0].body).toBe("  spaced body\n");
  });

  test("leaves other notes unchanged", function () {
    // Arrange
    var notes = [
      { id: "note-1", title: "First",  body: "body1" },
      { id: "note-2", title: "Second", body: "body2" },
    ];

    // Act
    var result = updateNoteInList(notes, "note-1", "Updated", "new body");

    // Assert — note-2 is untouched
    expect(result[1].title).toBe("Second");
    expect(result[1].body).toBe("body2");
  });

  test("returns the original array unchanged when id is not found", function () {
    // Arrange
    var notes = [{ id: "note-1", title: "Title", body: "body" }];

    // Act
    var result = updateNoteInList(notes, "note-999", "X", "Y");

    // Assert — content is unchanged
    expect(result[0].title).toBe("Title");
    expect(result[0].body).toBe("body");
  });

  test("does not mutate the original array", function () {
    var notes    = [{ id: "note-1", title: "Original", body: "" }];
    updateNoteInList(notes, "note-1", "Changed", "");
    expect(notes[0].title).toBe("Original");
  });
});

// ─────────────────────────────────────────────
// deleteNoteFromList
// ─────────────────────────────────────────────

describe("deleteNoteFromList", function () {
  test("returns a new array without the deleted note", function () {
    // Arrange
    var notes = [
      { id: "note-1", title: "Keep",   body: "" },
      { id: "note-2", title: "Delete", body: "" },
    ];

    // Act
    var result = deleteNoteFromList(notes, "note-2");

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("note-1");
  });

  test("returns an empty array when the only note is deleted", function () {
    var notes  = [{ id: "note-1", title: "Only", body: "" }];
    var result = deleteNoteFromList(notes, "note-1");
    expect(result).toHaveLength(0);
  });

  test("returns the original array unchanged when id is not found", function () {
    var notes  = [{ id: "note-1", title: "Title", body: "" }];
    var result = deleteNoteFromList(notes, "note-999");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("note-1");
  });

  test("does not mutate the original array", function () {
    var notes = [
      { id: "note-1", title: "A", body: "" },
      { id: "note-2", title: "B", body: "" },
    ];
    deleteNoteFromList(notes, "note-1");
    expect(notes).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────
// filterNotes
// ─────────────────────────────────────────────

describe("filterNotes", function () {
  // Shared test data
  var notes = [
    { id: "note-1", title: "Shopping list", body: "Milk, eggs, bread" },
    { id: "note-2", title: "Meeting notes", body: "Discuss the project plan" },
    { id: "note-3", title: "Recipe",        body: "Add milk and stir" },
  ];

  test("returns only notes whose title matches the query", function () {
    var result = filterNotes(notes, "Meeting");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("note-2");
  });

  test("returns only notes whose body matches the query", function () {
    var result = filterNotes(notes, "project plan");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("note-2");
  });

  test("matches notes by both title and body (returns all matches)", function () {
    // "milk" appears in the body of note-1 and note-3
    var result = filterNotes(notes, "milk");
    expect(result).toHaveLength(2);
  });

  test("is case-insensitive", function () {
    var result = filterNotes(notes, "SHOPPING");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("note-1");
  });

  test("returns all notes when query is an empty string", function () {
    var result = filterNotes(notes, "");
    expect(result).toHaveLength(notes.length);
  });

  test("returns all notes when query is whitespace only", function () {
    var result = filterNotes(notes, "   ");
    expect(result).toHaveLength(notes.length);
  });

  test("returns an empty array when no notes match", function () {
    var result = filterNotes(notes, "xyzzy");
    expect(result).toHaveLength(0);
  });

  test("does not mutate the original array", function () {
    filterNotes(notes, "milk");
    expect(notes).toHaveLength(3);
  });
});

// ─────────────────────────────────────────────
// serialiseNotes
// ─────────────────────────────────────────────

describe("serialiseNotes", function () {
  test("returns a string", function () {
    var result = serialiseNotes([]);
    expect(typeof result).toBe("string");
  });

  test("returns a valid JSON string", function () {
    // Arrange
    var notes = [{ id: "note-1", title: "Hello", body: "World" }];

    // Act
    var json = serialiseNotes(notes);

    // Assert — JSON.parse should not throw
    expect(function () { JSON.parse(json); }).not.toThrow();
  });

  test("round-trips correctly with deserialiseNotes", function () {
    // Arrange
    var notes = [
      { id: "note-1", title: "First",  body: "body one" },
      { id: "note-2", title: "Second", body: "body two" },
    ];

    // Act
    var json   = serialiseNotes(notes);
    var result = deserialiseNotes(json);

    // Assert
    expect(result).toEqual(notes);
  });

  test("serialises an empty array to '[]'", function () {
    expect(serialiseNotes([])).toBe("[]");
  });
});

// ─────────────────────────────────────────────
// deserialiseNotes
// ─────────────────────────────────────────────

describe("deserialiseNotes", function () {
  test("returns the original array when given valid JSON", function () {
    // Arrange
    var notes = [{ id: "note-1", title: "Hello", body: "World" }];
    var json  = JSON.stringify(notes);

    // Act
    var result = deserialiseNotes(json);

    // Assert
    expect(result).toEqual(notes);
  });

  test("returns [] for null", function () {
    expect(deserialiseNotes(null)).toEqual([]);
  });

  test("returns [] for undefined", function () {
    expect(deserialiseNotes(undefined)).toEqual([]);
  });

  test("returns [] for malformed JSON", function () {
    expect(deserialiseNotes("not valid json {{{")).toEqual([]);
  });

  test("returns [] when JSON parses to a non-array (object)", function () {
    expect(deserialiseNotes('{"key":"value"}')).toEqual([]);
  });

  test("returns [] when JSON parses to a non-array (number)", function () {
    expect(deserialiseNotes("42")).toEqual([]);
  });

  test("returns [] when JSON parses to a non-array (string)", function () {
    expect(deserialiseNotes('"just a string"')).toEqual([]);
  });

  test("returns [] for an empty string", function () {
    expect(deserialiseNotes("")).toEqual([]);
  });

  test("returns [] for a JSON null value", function () {
    // JSON.parse("null") returns null, which is not an array
    expect(deserialiseNotes("null")).toEqual([]);
  });
});
