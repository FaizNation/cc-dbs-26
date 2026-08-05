const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class ApplicationService {
  async addApplication({ user_id, job_id, status }) {
    const id = `application-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO applications VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, status || 'pending'],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengirim lamaran');
    }

    return result.rows[0].id;
  }

  async getApplications() {
    const query = `
      SELECT a.*, u.name as user_name, j.title as job_title 
      FROM applications a
      JOIN users u ON a.user_id = u.id
      JOIN jobs j ON a.job_id = j.id
    `;
    const result = await db.query(query);
    return result.rows;
  }

  async getApplicationById(id) {
    const query = {
      text: `
        SELECT a.*, u.name as user_name, j.title as job_title 
        FROM applications a
        JOIN users u ON a.user_id = u.id
        JOIN jobs j ON a.job_id = j.id
        WHERE a.id = $1
      `,
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lamaran tidak ditemukan');
    }

    return result.rows[0];
  }

  async getApplicationsByUser(userId) {
    const query = {
      text: `
        SELECT a.*, j.title as job_title 
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.user_id = $1
      `,
      values: [userId],
    };

    const result = await db.query(query);
    return result.rows;
  }

  async getApplicationsByJob(jobId) {
    const query = {
      text: `
        SELECT a.*, u.name as user_name 
        FROM applications a
        JOIN users u ON a.user_id = u.id
        WHERE a.job_id = $1
      `,
      values: [jobId],
    };

    const result = await db.query(query);
    return result.rows;
  }

  async updateApplicationStatus(id, status) {
    const query = {
      text: 'UPDATE applications SET status = $1 WHERE id = $2 RETURNING id',
      values: [status, id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui status lamaran. Id tidak ditemukan');
    }
  }

  async deleteApplication(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lamaran. Id tidak ditemukan');
    }
  }
}

module.exports = ApplicationService;
