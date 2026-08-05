const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class CompanyService {
  async addCompany({ name, location, description }) {
    const id = `company-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO companies VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, name, location, description],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan perusahaan');
    }

    return result.rows[0].id;
  }

  async getCompanies() {
    const result = await db.query('SELECT * FROM companies');
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Perusahaan tidak ditemukan');
    }

    return result.rows[0];
  }

  async editCompanyById(id, { name, location, description }) {
    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3 WHERE id = $4 RETURNING id',
      values: [name, location, description, id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui perusahaan. Id tidak ditemukan');
    }
  }

  async deleteCompanyById(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus perusahaan. Id tidak ditemukan');
    }
  }
}

module.exports = CompanyService;
