import React from "react";
import PropTypes from "prop-types";
import NoteItem from "./NoteItem";
import LocaleContext from "../contexts/LocaleContext";

function NoteList({ notes, onDelete }) {
  const { locale } = React.useContext(LocaleContext);

  if (notes.length === 0) {
    return (
      <div className="notes-list-empty">
        <p>{locale === "id" ? "Tidak ada catatan" : "No notes"}</p>
      </div>
    );
  }

  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteItem key={note.id} {...note} onDelete={onDelete} />
      ))}
    </div>
  );
}

NoteList.propTypes = {
  notes: PropTypes.arrayOf(PropTypes.object).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NoteList;
