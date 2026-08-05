import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNote, deleteNote, archiveNote, unarchiveNote } from '../utils/network-data';
import { showFormattedDate } from '../utils';
import Loading from '../components/Loading';
import LocaleContext from '../contexts/LocaleContext';

function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const { locale } = React.useContext(LocaleContext);

  React.useEffect(() => {
    getNote(id).then(({ error, data }) => {
      if (!error) {
        setNote(data);
      }
      setLoading(false);
    });
  }, [id]);

  async function onDeleteHandler() {
    const { error } = await deleteNote(id);
    if (!error) {
      navigate('/');
    }
  }

  async function onArchiveHandler() {
    const { error } = await archiveNote(id);
    if (!error) {
      navigate('/');
    }
  }

  async function onUnarchiveHandler() {
    const { error } = await unarchiveNote(id);
    if (!error) {
      navigate('/');
    }
  }

  if (loading) {
    return <Loading />;
  }

  if (!note) {
    return <p>Note not found</p>;
  }

  return (
    <section className="detail-page">
      <h3 className="detail-page__title">{note.title}</h3>
      <p className="detail-page__createdAt">{showFormattedDate(note.createdAt)}</p>
      <div className="detail-page__body" dangerouslySetInnerHTML={{ __html: note.body }} />
      <div className="detail-page__action">
        {note.archived ? (
          <button className="action" title={locale === 'id' ? 'Aktifkan' : 'Unarchive'} onClick={onUnarchiveHandler}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.55 5.22l-1.39-1.35a2.42 2.42 0 0 0-3.41 0L4.53 15.07a4.91 4.91 0 0 0-1.29 2.22l-.24 1.13a1.43 1.43 0 0 0 1.4 1.73l1.1-.21a5 5 0 0 0 2.22-1.3l11.83-11.53a2.38 2.38 0 0 0 0-3.41zM7.59 17.41a3.07 3.07 0 0 1-1.38.81l-.1.02-.03-.12a3.13 3.13 0 0 1 .81-1.38l9.02-8.78 1.46 1.42zM18.85 8.05l-1.46-1.42 1.26-1.23a.4.4 0 0 1 .57 0l.86.84a.42.42 0 0 1 0 .58z"></path></svg>
          </button>
        ) : (
          <button className="action" title={locale === 'id' ? 'Arsipkan' : 'Archive'} onClick={onArchiveHandler}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.41l.83-1zM19 19H5V8h14v11zm-11-3h8v-2H8v2z"></path></svg>
          </button>
        )}
        <button className="action" title={locale === 'id' ? 'Hapus' : 'Delete'} onClick={onDeleteHandler}>
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        </button>
      </div>
    </section>
  );
}

export default DetailPage;
