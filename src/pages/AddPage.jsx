import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoteInput from '../components/NoteInput';
import PropTypes from 'prop-types';

function AddPage({ addNote }) {
    const navigate = useNavigate();

    function onAddNoteHandler(note) {
        addNote(note);
        navigate('/');
    }

    return (
        <section className="add-new-page">
            <NoteInput addNote={onAddNoteHandler} />
        </section>
    );
}

AddPage.propTypes = {
    addNote: PropTypes.func.isRequired,
};

export default AddPage;
