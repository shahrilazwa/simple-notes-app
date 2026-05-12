# Requirements Document

## Introduction

A Simple Notes App built with plain HTML, CSS, and JavaScript — no frameworks, no backend.
Users can create, edit, delete, and search notes directly in the browser. All notes are
stored in the browser's localStorage so they persist between sessions. This project is
designed as a beginner-friendly learning exercise with clean, readable code split across
three files: `index.html`, `style.css`, and `app.js`.

## Glossary

- **App**: The Simple Notes App running in the browser.
- **Note**: A single piece of saved content consisting of a title and a body.
- **Title**: A short text label that identifies a Note.
- **Body**: The main text content of a Note.
- **Note_List**: The visible collection of all saved Notes displayed in the App.
- **Search_Bar**: The text input field used to filter Notes by keyword.
- **Storage**: The browser's localStorage used to persist Notes between sessions.
- **Editor**: The form area where the user writes or edits a Note's title and body.
- **Note ID**: A unique identifier used to find, edit, and delete a specific Note.

## Requirements

### Requirement 1: Create a Note

**User Story:** As a user, I want to create a new note with a title and body, so that I can
save information for later.

#### Acceptance Criteria

1. THE App SHALL display an Editor containing a title input field and a body text area.
2. WHEN the user fills in the title and body and clicks the Save button, THE App SHALL add
   the new Note to the Note_List.
3. WHEN a Note is saved, THE App SHALL store the Note in Storage so it persists after the
   page is refreshed.
4. IF the user clicks Save with an empty title, THEN THE App SHALL display an inline
   validation message asking the user to enter a title.
5. WHEN a Note is successfully saved, THE App SHALL clear the Editor fields and return
   them to their default empty state.
6. WHEN a Note is created, THE App SHALL assign a unique ID to the Note.
7. THE App SHALL allow the body field to be empty, but the title field SHALL be required.

---

### Requirement 2: Edit an Existing Note

**User Story:** As a user, I want to edit a note I already saved, so that I can update or
correct its content.

#### Acceptance Criteria

1. WHEN the user clicks on a Note in the Note_List, THE App SHALL load that Note's title
   and body into the Editor.
2. WHEN the user modifies the title or body in the Editor and clicks Save, THE App SHALL
   update the existing Note in the Note_List with the new content.
3. WHEN an edited Note is saved, THE App SHALL update the corresponding entry in Storage
   so the changes persist after the page is refreshed.
4. WHILE a Note is loaded in the Editor for editing, THE App SHALL visually highlight that
   Note in the Note_List to indicate it is being edited.
5. WHILE a Note is loaded for editing, THE App SHALL display a Cancel Edit button.
6. WHEN the user clicks Cancel Edit, THE App SHALL clear the Editor and remove the editing highlight from the Note_List.

---

### Requirement 3: Delete a Note

**User Story:** As a user, I want to delete a note I no longer need, so that my note list
stays tidy.

#### Acceptance Criteria

1. THE App SHALL display a Delete button on each Note in the Note_List.
2. WHEN the user clicks the Delete button on a Note, THE App SHALL remove that Note from
   the Note_List.
3. WHEN a Note is deleted, THE App SHALL remove that Note's entry from Storage.
4. IF the deleted Note is currently loaded in the Editor, THEN THE App SHALL clear the
   Editor fields after deletion.
5. WHEN the user clicks the Delete button, THE App SHALL delete the Note without loading it into the Editor.

---

### Requirement 4: Search Notes

**User Story:** As a user, I want to search my notes by keyword, so that I can quickly find
the note I'm looking for.

#### Acceptance Criteria

1. THE App SHALL display a Search_Bar above the Note_List.
2. WHEN the user types text into the Search_Bar, THE App SHALL filter the Note_List to
   show only Notes whose title or body contains the typed text.
3. WHEN the Search_Bar is cleared, THE App SHALL display all saved Notes in the Note_List.
4. IF no Notes match the search text, THEN THE App SHALL display a message such as
   "No notes found" in the Note_List area.
5. WHEN the user searches, THE App SHALL perform the filter without requiring a button
   click (real-time filtering on each keystroke).

---

### Requirement 5: Persist Notes in localStorage

**User Story:** As a user, I want my notes to still be there when I come back to the app,
so that I don't lose my work between sessions.

#### Acceptance Criteria

1. WHEN the App loads in the browser, THE App SHALL read all Notes from Storage and
   display them in the Note_List.
2. WHEN a Note is created, edited, or deleted, THE App SHALL write the updated full list
   of Notes to Storage as a JSON string.
3. IF Storage contains malformed or unreadable data, THEN THE App SHALL treat Storage as
   empty and start with an empty Note_List.

---

### Requirement 6: Work Without a Backend

**User Story:** As a user, I want the app to work entirely in my browser, so that I don't
need to set up a server or internet connection.

#### Acceptance Criteria

1. THE App SHALL run entirely in the browser using only HTML, CSS, and JavaScript with no
   server-side code or external API calls.
2. THE App SHALL function correctly when opened as a local file (via `file://` protocol)
   without a web server.
3. THE App SHALL use no third-party frameworks or libraries — only standard browser APIs.
