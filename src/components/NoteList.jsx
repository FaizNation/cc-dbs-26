import React from 'react';
import PropTypes from 'prop-types';
import NoteItem from './NoteItem';

function NoteList({ notes, onDelete, onArchive }) {
    if (notes.length === 0) {
        return (
            <div className="notes-list-empty">
                <p>Tidak ada catatan</p>
            </div>
        );
    }

    return (
        <div className="notes-list">
            {notes.map((note) => (
                <NoteItem
                    key={note.id}
                    {...note}
                    onDelete={onDelete}
                    onArchive={onArchive}
                />
            ))}
        </div>
    );
}

NoteList.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDelete: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
};

export default NoteList;
