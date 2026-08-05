const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class BookmarkService {
  async addBookmark(userId, jobId) {
    const id = `bookmark-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO bookmarks (id, user_id, job_id, created_at, updated_at) VALUES($1, $2, $3, current_timestamp, current_timestamp) RETURNING id',
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
        SELECT b.id, b.user_id, b.job_id, b.created_at, b.updated_at,
               j.company_id, j.category_id, j.title, j.description, 
               j.job_type, j.experience_level, j.location_type, j.location_city, 
               j.salary_min, j.salary_max, j.is_salary_visible, j.status,
               c.name as company_name
        FROM bookmarks b
        JOIN jobs j ON b.job_id = j.id
        JOIN companies c ON j.company_id = c.id
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
