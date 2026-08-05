import React from 'react';
import PropTypes from 'prop-types';
import { showFormattedDate } from '../utils';
import { Link } from 'react-router-dom';

function NoteItem({ id, title, createdAt, body, archived, onDelete, onArchive }) {
    return (
        <article className="note-item">
            <h3 className="note-item__title">
                <Link to={`/notes/${id}`}>{title}</Link>
            </h3>
            <p className="note-item__createdAt">{showFormattedDate(createdAt)}</p>
            <p className="note-item__body">{body}</p>
            <div className="note-item__action">
                <button className="note-item__delete-button" onClick={() => onDelete(id)}>Delete</button>
                <button className="note-item__archive-button" onClick={() => onArchive(id)}>{archived ? 'Pindahkan' : 'Arsipkan'}</button>
            </div>
        </article>
    );
}

NoteItem.propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    archived: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
};

export default NoteItem;
