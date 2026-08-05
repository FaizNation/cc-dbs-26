const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class CategoryService {
  async addCategory({ name }) {
    const id = `category-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO categories (id, name, created_at, updated_at) VALUES($1, $2, current_timestamp, current_timestamp) RETURNING id',
      values: [id, name],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan kategori');
    }

    return result.rows[0].id;
  }

  async getCategories() {
    const result = await db.query('SELECT * FROM categories');
    return result.rows;
  }

  async getCategoryById(id) {
    const query = {
      text: 'SELECT * FROM categories WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Kategori tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCategoryById(id, { name }) {
    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = current_timestamp WHERE id = $2 RETURNING id',
      values: [name, id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui kategori. Id tidak ditemukan');
    }
  }

  async deleteCategoryById(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus kategori. Id tidak ditemukan');
    }
  }
}

module.exports = CategoryService;
