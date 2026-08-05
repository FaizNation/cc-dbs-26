import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AddPage from './pages/AddPage';
import ArchivePage from './pages/ArchivePage';
import DetailPageWrapper from './pages/DetailPage'; // Import the wrapper
import NotFoundPage from './pages/NotFoundPage';
import { getAllNotes, addNote, deleteNote, archiveNote, unarchiveNote } from './utils/local-data';

function App() {
  const [notes, setNotes] = React.useState(getAllNotes());

  const onAddNoteHandler = (contact) => {
    addNote(contact);
    setNotes(getAllNotes());
  }

  const onDeleteHandler = (id) => {
    deleteNote(id);
    setNotes(getAllNotes());
  }

  const onArchiveHandler = (id) => {
    archiveNote(id);
    setNotes(getAllNotes());
  }

  const onUnarchiveHandler = (id) => {
    unarchiveNote(id);
    setNotes(getAllNotes());
  }

  // Filter notes for Home and Archive pages
  const activeNotes = notes.filter((note) => !note.archived);
  const archivedNotes = notes.filter((note) => note.archived);

  return (
    <div className="app-container">
      <header>
        <h1>Aplikasi Catatan</h1>
        <Navigation />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage notes={activeNotes} onDelete={onDeleteHandler} onArchive={onArchiveHandler} />} />
          <Route path="/archives" element={<ArchivePage notes={archivedNotes} onDelete={onDeleteHandler} onArchive={onUnarchiveHandler} />} />
          <Route path="/notes/new" element={<AddPage addNote={onAddNoteHandler} />} />
          <Route path="/notes/:id" element={<DetailPageWrapper onDelete={onDeleteHandler} onArchive={onArchiveHandler} />} />
          {/* Note: DetailPageWrapper needs onArchive. Since we don't know if the note is archived or not inside the wrapper (it fetches it), 
              we might need a smarter handler. 
              The DetailPageWrapper uses getNote(id) to find the note.
              And when we click archive, we call `onArchive`. 
              Wait, if `note` is archived, we should call `unarchiveNote`. 
              But `DetailPage` receives `onArchive`. 
              I logic-ed in `DetailPage` to call `this.props.onArchive(id)`.
              So `App` typically passes a handler that toggles? Or two handlers?
              `local-data` has separate functions.
              If I pass `onArchiveHandler` to `DetailPage`, it calls `archiveNote`.
              If the note is ALREADY archived, `archiveNote` logic: `return { ...note, archived: true };`. It stays archived.
              So I need a `toggleArchive` or pass both?
              Or `App` passes a generic `onToggleArchive`?
              The requirements say "Tombol arsip dan batal arsip".
              My `DetailPage` checks `note.archived` to decide label "Arsipkan" or "Aktifkan".
              But the button onClick calls `this.props.onArchive(id)`.
              I should probably change `DetailPage` to accept `onUnarchive` as well?
              OR check `note.archived` inside the click handler and call the appropriate prop?
              Yes. `DetailPage` needs access to both or a toggle.
              
              Let's update `DetailPage.jsx` to be smarter or receive both?
              Actually `HomePage` and `ArchivePage` receive specific handlers (`onArchive` vs `onUnarchive`).
              `DetailPage` can view ANY note. So it needs both.
              
              I will update `App.jsx` to pass `onUnarchive={onUnarchiveHandler}` to `DetailPageWrapper`.
              And I need to update `DetailPage.jsx` to use it.
          */}
          <Route path="/notes/:id" element={<DetailPageWrapper onDelete={onDeleteHandler} onArchive={onArchiveHandler} onUnarchive={onUnarchiveHandler} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
