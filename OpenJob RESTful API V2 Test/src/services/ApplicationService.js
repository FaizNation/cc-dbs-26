const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class ApplicationService {
  async addApplication({ user_id, job_id, status }) {
    await this.verifyDuplicateApplication(user_id, job_id);
    const id = `application-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO applications (id, user_id, job_id, status, created_at, updated_at) VALUES($1, $2, $3, $4, current_timestamp, current_timestamp) RETURNING id, user_id, job_id, status',
      values: [id, user_id, job_id, status || 'pending'],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal mengirim lamaran');
    }

    return result.rows[0];
  }

  async getApplications() {
    const query = `
      SELECT a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
             u.name as user_name, u.email as user_email, 
             j.title as job_title, j.job_type, j.experience_level, j.location_type, j.location_city
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
        SELECT a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
               u.name as user_name, u.email as user_email, 
               j.title as job_title, j.job_type, j.experience_level, j.location_type, j.location_city
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
        SELECT a.id, a.user_id, a.job_id, a.status, a.created_at, a.updated_at,
               j.company_id, j.category_id, j.title, j.description, 
               j.job_type, j.experience_level, j.location_type, j.location_city,
               c.name as company_name
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        JOIN companies c ON j.company_id = c.id
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
      text: 'UPDATE applications SET status = $1, updated_at = current_timestamp WHERE id = $2 RETURNING id',
      values: [status, id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui status lamaran. Id tidak ditemukan');
    }
    
    return result.rows[0];
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

  async verifyDuplicateApplication(userId, jobId) {
    const query = {
      text: 'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      values: [userId, jobId],
    };

    const result = await db.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError('Gagal mengirim lamaran. Anda sudah melamar pada lowongan ini.');
    }
  }
}

module.exports = ApplicationService;