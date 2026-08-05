import React from 'react';
import { useSearchParams } from 'react-router-dom';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import PropTypes from 'prop-types';

function ArchivePage({ notes, onDelete, onArchive }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const onKeywordChangeHandler = (keyword) => {
        setSearchParams({ keyword });
    }

    const filteredNotes = notes.filter((note) => {
        return note.title.toLowerCase().includes(keyword.toLowerCase());
    });

    return (
        <section className="archives-page">
            <h2>Catatan Arsip</h2>
            <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
            <NoteList notes={filteredNotes} onDelete={onDelete} onArchive={onArchive} />
        </section>
    );
}

ArchivePage.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDelete: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
};

export default ArchivePage;
