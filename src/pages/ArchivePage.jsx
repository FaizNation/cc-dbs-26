import React from "react";
import { useSearchParams } from "react-router-dom";
import NoteList from "../components/NoteList";
import SearchBar from "../components/SearchBar";
import { getArchivedNotes, deleteNote } from "../utils/network-data";
import LocaleContext from "../contexts/LocaleContext";
import Loading from "../components/Loading";

function ArchivePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notes, setNotes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const { locale } = React.useContext(LocaleContext);

  const keyword = searchParams.get("keyword") || "";

  React.useEffect(() => {
    getArchivedNotes().then(({ data }) => {
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
    <section className="archives-page">
      <h2>{locale === "id" ? "Catatan Terarsip" : "Archived Notes"}</h2>
      <SearchBar keyword={keyword} keywordChange={onKeywordChangeHandler} />
      {loading ? (
        <Loading />
      ) : (
        <NoteList notes={filteredNotes} onDelete={onDeleteHandler} />
      )}
    </section>
  );
}

export default ArchivePage;
