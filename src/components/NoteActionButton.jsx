import React from 'react';

function NoteActionButton({ variant, onClick, dataTestId }) {
  const isDelete = variant === 'delete';
  const label = isDelete ? 'Delete' : (variant === 'archive' ? 'Arsipkan' : 'Pindahkan');
  const className = `note-item__${isDelete ? 'delete' : 'archive'}-button`;

  return (
    <button
      className={className}
      type="button"
      onClick={onClick}
      data-testid={dataTestId}
    >
      {label}
    </button>
  );
}

export default NoteActionButton;
