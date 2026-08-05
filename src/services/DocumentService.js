const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class DocumentService {
  async addDocument(userId, path, originalName) {
    const id = `document-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO documents VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, path, originalName],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengunggah dokumen');
    }

    return result.rows[0].id;
  }

  async getDocuments() {
    const result = await db.query('SELECT * FROM documents');
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: 'SELECT * FROM documents WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Dokumen tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteDocument(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus dokumen. Id tidak ditemukan');
    }
  }
}

module.exports = DocumentService;
