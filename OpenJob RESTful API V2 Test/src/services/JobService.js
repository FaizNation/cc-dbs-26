const { nanoid } = require('nanoid');
const db = require('../database');
const NotFoundError = require('../utils/NotFoundError');
const InvariantError = require('../utils/InvariantError');

class JobService {
  async addJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status,
    owner_id,
  }) {
    const id = `job-${nanoid(16)}`;

    const query = {
      text: `INSERT INTO jobs (
        id, company_id, category_id, title, description, job_type, 
        experience_level, location_type, location_city, salary_min, 
        salary_max, is_salary_visible, status, owner_id, created_at, updated_at
      ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, current_timestamp, current_timestamp) RETURNING id`,
      values: [
        id, company_id, category_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min,
        salary_max, is_salary_visible, status, owner_id,
      ],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan lowongan');
    }

    return result.rows[0].id;
  }

  async getJobs({ title, companyName }) {
    let queryText = `
      SELECT j.id, j.company_id, j.category_id, j.title, j.description, 
             j.job_type, j.experience_level, j.location_type, j.location_city, 
             j.salary_min, j.salary_max, j.is_salary_visible, j.status
      FROM jobs j 
      JOIN companies c ON j.company_id = c.id
      WHERE 1=1
    `;
    const values = [];

    if (title) {
      values.push(`%${title}%`);
      queryText += ` AND j.title ILIKE $${values.length}`;
    }

    if (companyName) {
      values.push(`%${companyName}%`);
      queryText += ` AND c.name ILIKE $${values.length}`;
    }

    const result = await db.query(queryText, values);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: `
        SELECT j.*, c.name as company_name, cat.name as category_name
        FROM jobs j
        JOIN companies c ON j.company_id = c.id
        JOIN categories cat ON j.category_id = cat.id
        WHERE j.id = $1
      `,
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lowongan tidak ditemukan');
    }

    return result.rows[0];
  }

  async getJobsByCompany(companyId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE company_id = $1',
      values: [companyId],
    };

    const result = await db.query(query);
    return result.rows;
  }

  async getJobsByCategory(categoryId) {
    const query = {
      text: 'SELECT * FROM jobs WHERE category_id = $1',
      values: [categoryId],
    };

    const result = await db.query(query);
    return result.rows;
  }

  async editJobById(id, {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city,
    salary_min,
    salary_max,
    is_salary_visible,
    status,
  }) {
    const query = {
      text: `UPDATE jobs SET 
        company_id = $1, category_id = $2, title = $3, description = $4, 
        job_type = $5, experience_level = $6, location_type = $7, 
        location_city = $8, salary_min = $9, salary_max = $10, 
        is_salary_visible = $11, status = $12, updated_at = current_timestamp
        WHERE id = $13 RETURNING id`,
      values: [
        company_id, category_id, title, description, job_type,
        experience_level, location_type, location_city, salary_min,
        salary_max, is_salary_visible, status, id,
      ],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lowongan. Id tidak ditemukan');
    }
  }

  async deleteJobById(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await db.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus lowongan. Id tidak ditemukan');
    }
  }
}

module.exports = JobService;
