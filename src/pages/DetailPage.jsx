import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoteDetail from '../components/NoteDetail';
import PropTypes from 'prop-types';
import { getNote } from '../utils/local-data';
// Wait, wrapper component will fetch note from state passed down or use getNote? 
// Since 'notes' state is in App, it's better to find it from props or use the data helper directly if the state is synced.
// But we are storing state in App. If we refresh, state resets to initial data.
// If I use `getNote` from `local-data.js`, it reads from the variable in that file. 
// If App.jsx initializes state from `getAllNotes()`, then `App` state is separate from `local-data.js` variable unless we keep them synced.
// Given requirement: "Data catatan disimpan cukup pada memori saja".
// If I add a note, I should update App state. If I use `local-data.js` functions like `addNote`, they update the variable in that module.
// So I should probably use the helper functions in `App.jsx` to update the module variable AND update App state to trigger re-render, OR just use `local-data.js` as the source of truth and force update, OR just manage state in App and ignore the module's internal variable modification functions (just use it for initial data).
// The requirement says: "Kami sarankan untuk memanfaatkan fungsi menyimpan catatan yang disediakan."
// `addNote` in `local-data.js` modifies the `notes` array in that file.
// So I should use the exported functions to modify data, and then perhaps `getAllNotes()` to refresh the view?
// React components need state to re-render.
// Strategy:
// In App.jsx:
// state = { notes: getAllNotes(), initializing: true }

class DetailPage extends React.Component {
    render() {
        const { id, navigate } = this.props;
        const note = getNote(id);

        // Check if note exists
        if (!note) {
            // Render 404 or redirect?
            // Requirement: "Aplikasi menyediakan halaman khusus bila pengguna mengakses URL aplikasi dengan alamat yang tidak diketahui/diharapkan."
            // If note not found, it's effectively 404.
            // I should probably return a <NotFoundPage /> or similar.
            return <div className="detail-page"><p>Catatan tidak ditemukan</p></div>; // Or NotFoundPage
        }

        // We also need delete/archive functions here?
        // "Tombol hapus boleh diletakkan di mana saja...".
        // "Tombol arsip dan batal arsip bisa diletakkan di mana saja..."
        // I should add these buttons to DetailPage as well, or just rely on the list?
        // Requirement: "Menampilkan catatan tunggal... Halaman Detil Catatan harus dapat diakses langsung dengan menggunakan URL."
        // Opsional 1 says "Tombol arsip ... bisa ditampilkan pada halaman detail catatan".
        // So I should pass `onArchive`, `onDelete` to `DetailPage`.
        // But `DetailPage` is instantiated by Router.
        // I can pass props to `DetailPage wrapper`? No, Router.
        // I will implement `DetailPage` to accept `onDelete`, `onArchive` ... wait. 
        // How to pass props to `element` in Route? `<Route element={<DetailPage onDelete={...} />} />`
        // Yes. 

        return (
            <section className="detail-page">
                <NoteDetail {...note} />
                <div className="detail-page__action">
                    <button className="action" title={note.archived ? "Aktifkan" : "Arsipkan"} onClick={() => {
                        if (note.archived) {
                            this.props.onUnarchive(id);
                        } else {
                            this.props.onArchive(id);
                        }
                        navigate('/');
                    }}>
                        {/* Icon based on state */}
                        {note.archived ? (
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-4.41-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8 8 8zm-5-9h10v2H7z"></path></svg>
                        ) : (
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.17V10h2v3.17l1.59-1.59L16 13.5z"></path></svg>
                        )}
                    </button>
                    <button className="action" title="Hapus" onClick={() => {
                        this.props.onDelete(id);
                        navigate('/');
                    }}>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
                    </button>
                </div>
            </section>
        );
    }
}

DetailPage.propTypes = {
    id: PropTypes.string.isRequired,
    navigate: PropTypes.func.isRequired,
    onArchive: PropTypes.func.isRequired,
    onUnarchive: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

// Wrapper to inject params and navigate
export default function DetailPageWrapper(props) {
    const { id } = useParams();
    const navigate = useNavigate();
    return <DetailPage {...props} id={id} navigate={navigate} />;
}
