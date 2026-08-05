import React from 'react';
import { useSearchParams } from 'react-router-dom';
import NoteList from '../components/NoteList';
import SearchBar from '../components/SearchBar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function HomePage({ notes, onDelete, onArchive }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || '';

    const onKeywordChangeHandler = (keyword) => {
        setSearchParams({ keyword });
    }

    const filteredNotes = notes.filter((note) => {
        return note.title.toLowerCase().includes(keyword.toLowerCase());
    });

    return (
        <section className="homepage">
            <h2>Catatan Aktif</h2>
            <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
            <NoteList notes={filteredNotes} onDelete={onDelete} onArchive={onArchive} />
            <div className="homepage__action">
                <Link to="/notes/new" className="action" title="Tambah">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>
                </Link>
            </div>
        </section>
    );
}

HomePage.propTypes = {
    notes: PropTypes.arrayOf(PropTypes.object).isRequired,
    onDelete: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
};

export default HomePage;
