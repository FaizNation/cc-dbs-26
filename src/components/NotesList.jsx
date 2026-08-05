import React from 'react';
import NoteItem from './NoteItem';

function NotesList({ notes, onDelete, onArchive, searchKeyword, dataTestId = 'notes-list' }) {
  // TODO [Basic] validasi notes agar tidak kosong.
  const hasNotes = notes && notes.length > 0;

  if (!hasNotes) {
    return (
      <div className="notes-list" data-testid={dataTestId}>
        {/* TODO [Basic] tampilkan pesan kosong yang informatif ketika tidak ada catatan. */}
        <p
          className="notes-list__empty-message"
          data-testid={`${dataTestId}-empty`}
        >Tidak ada catatan</p>
      </div>
    );
  }

  const groupedNotes = notes.reduce((acc, note) => {
    const date = new Date(note.createdAt);
    const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(note);
    return acc;
  }, {});

  return (
    <div className="notes-list" data-testid={dataTestId}>
      {/* TODO [Basic] gunakan array.map untuk merender NoteItem untuk setiap catatan. */}
      {/* TODO [Skilled] ekstrak tombol aksi menjadi komponen reusable agar dipakai NoteItem. */}
      {/* TODO [Advanced] kelompokkan catatan per bulan-tahun dan render tiap grup dalam <section className="notes-group">. */}
      {Object.keys(groupedNotes).map(monthYear => (
        <section className="notes-group" key={monthYear} data-testid={`${monthYear}-group`}>
          <h3 className="notes-group__title">
            {monthYear} <span data-testid={`${monthYear}-group-count`}>({groupedNotes[monthYear].length})</span>
          </h3>
          {groupedNotes[monthYear].map(note => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={onDelete}
              onArchive={onArchive}
              searchKeyword={searchKeyword}
            />
          ))}
        </section>
      ))}
    </div>
  );
}

export default NotesList;
