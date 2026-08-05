import React from "react";
import { addNote } from "../utils/network-data";
import { useNavigate } from "react-router-dom";
import useInput from "../utils/useInput";
import LocaleContext from "../contexts/LocaleContext";

function AddPage() {
  const navigate = useNavigate();
  const [title, onTitleChange] = useInput("");
  const [body, setBody] = React.useState("");
  const { locale } = React.useContext(LocaleContext);

  const onBodyChangeHandler = (event) => {
    setBody(event.target.innerHTML);
  };

  async function onAddNoteHandler() {
    const { error } = await addNote({ title, body });
    if (!error) {
      navigate("/");
    }
  }

  return (
    <section className="add-new-page">
      <h2>{locale === "id" ? "Tambah Catatan Baru" : "Add New Note"}</h2>
      <div className="add-new-page__input">
        <input
          className="add-new-page__input__title"
          placeholder={locale === "id" ? "Catatan rahasia" : "Secret note"}
          value={title}
          onChange={onTitleChange}
        />
        <div
          className="add-new-page__input__body"
          contentEditable
          data-placeholder={
            locale === "id" ? "Sebenarnya saya adalah..." : "Actually I am..."
          }
          onInput={onBodyChangeHandler}
        />
      </div>
      <div className="add-new-page__action">
        <button
          className="action"
          title={locale === "id" ? "Simpan" : "Save"}
          onClick={onAddNoteHandler}
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
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
          </svg>
        </button>
      </div>
    </section>
  );
}

export default AddPage;
