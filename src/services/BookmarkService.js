const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class BookmarkService {
  async addBookmark(userId, jobId) {
    const id = `bookmark-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookmarks VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, jobId],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan bookmark');
    }

    return result.rows[0].id;
  }

  async getBookmarks(userId) {
    const query = {
      text: `
        SELECT b.*, j.title as job_title 
        FROM bookmarks b
        JOIN jobs j ON b.job_id = j.id
        WHERE b.user_id = $1
      `,
      values: [userId],
    };

    const result = await db.query(query);
    return result.rows;
  }

  async getBookmarkById(id) {
    const query = {
      text: 'SELECT * FROM bookmarks WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Bookmark tidak ditemukan');
    }

    return result.rows[0];
  }

  async deleteBookmark(userId, jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE user_id = $1 AND job_id = $2 RETURNING id',
      values: [userId, jobId],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus bookmark. Bookmark tidak ditemukan');
    }
  }
}

module.exports = BookmarkService;
