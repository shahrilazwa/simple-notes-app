/**
 * tests/notes-logic.test.js
 *
 * Unit tests for notes-logic.js.
 *
 * This file uses Jest. Run the tests with:
 *   npm test
 *
 * Each test follows the Arrange → Act → Assert pattern:
 *   1. Arrange — set up the input data
 *   2. Act     — call the function being tested
 *   3. Assert  — check the output matches what is expected
 *
 * The full test suite will be written in Task 5.
 * This file contains a minimal smoke test to confirm
 * Jest is wired up correctly and npm test runs without crashing.
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
// Smoke test — confirms Jest can import the module
// and run a basic assertion without errors.
// ─────────────────────────────────────────────

describe("notes-logic (smoke test)", function () {
  test("module loads and exports all expected functions", function () {
    expect(typeof generateId).toBe("function");
    expect(typeof createNote).toBe("function");
    expect(typeof isTitleValid).toBe("function");
    expect(typeof addNoteToList).toBe("function");
    expect(typeof updateNoteInList).toBe("function");
    expect(typeof deleteNoteFromList).toBe("function");
    expect(typeof filterNotes).toBe("function");
    expect(typeof serialiseNotes).toBe("function");
    expect(typeof deserialiseNotes).toBe("function");
  });
});
