const db = require('../database/db');

class Doctor {
  static async create({ userId, specialization, qualifications, experienceYears, consultationFee, availability }) {
    const query = `
      INSERT INTO doctors (user_id, specialization, qualifications, experience_years, consultation_fee, availability)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [
      userId,
      specialization,
      qualifications || null,
      experienceYears || 0,
      consultationFee || 0,
      JSON.stringify(availability || [])
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT d.*, u.email, u.full_name, u.phone, u.is_active
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM doctors WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.specialization) {
      fields.push(`specialization = $${paramCount++}`);
      values.push(data.specialization);
    }
    if (data.qualifications !== undefined) {
      fields.push(`qualifications = $${paramCount++}`);
      values.push(data.qualifications);
    }
    if (data.experienceYears !== undefined) {
      fields.push(`experience_years = $${paramCount++}`);
      values.push(data.experienceYears);
    }
    if (data.consultationFee !== undefined) {
      fields.push(`consultation_fee = $${paramCount++}`);
      values.push(data.consultationFee);
    }
    if (data.availability !== undefined) {
      fields.push(`availability = $${paramCount++}`);
      values.push(JSON.stringify(data.availability));
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE doctors 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM doctors WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT d.*, u.email, u.full_name, u.phone, u.is_active
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.specialization) {
      query += ` AND d.specialization ILIKE $${paramCount++}`;
      values.push(`%${filters.specialization}%`);
    }

    if (filters.isActive !== undefined) {
      query += ` AND u.is_active = $${paramCount++}`;
      values.push(filters.isActive);
    }

    query += ' ORDER BY d.created_at DESC';

    if (filters.limit) {
      query += ` LIMIT $${paramCount++}`;
      values.push(filters.limit);
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount++}`;
      values.push(filters.offset);
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) 
      FROM doctors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.specialization) {
      query += ` AND d.specialization ILIKE $${paramCount++}`;
      values.push(`%${filters.specialization}%`);
    }

    if (filters.isActive !== undefined) {
      query += ` AND u.is_active = $${paramCount++}`;
      values.push(filters.isActive);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Doctor;
