import React from "react";
import { useSearchParams } from "react-router-dom";
import NoteList from "../components/NoteList";
import SearchBar from "../components/SearchBar";
import { getActiveNotes, deleteNote } from "../utils/network-data";
import LocaleContext from "../contexts/LocaleContext";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { locale } = React.useContext(LocaleContext);

  const keyword = searchParams.get("keyword") || "";

  React.useEffect(() => {
    getActiveNotes().then(({ data }) => {
      setNotes(data);
      setLoading(false);
    });
  }, []);

  const onKeywordChangeHandler = (keyword) => {
    setSearchParams({ keyword });
  };

  const onDeleteHandler = async (id) => {
    const { error } = await deleteNote(id);
    if (!error) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const filteredNotes = notes.filter((note) => {
    return note.title.toLowerCase().includes(keyword.toLowerCase());
  });

  return (
    <section className="homepage">
      <h2>{locale === "id" ? "Catatan Aktif" : "Active Notes"}</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      {loading ? (
        <Loading />
      ) : (
        <NoteList notes={filteredNotes} onDelete={onDeleteHandler} />
      )}
      <div className="homepage__action">
        <Link
          to="/notes/new"
          className="action"
          title={locale === "id" ? "Tambah" : "Add"}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
