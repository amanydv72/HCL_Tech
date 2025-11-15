const db = require('../database/db');

class Patient {
  static async create({ userId, dateOfBirth, gender, address, medicalHistory }) {
    const query = `
      INSERT INTO patients (user_id, date_of_birth, gender, address, medical_history)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await db.query(query, [
      userId,
      dateOfBirth || null,
      gender || null,
      address || null,
      medicalHistory || null
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT p.*, u.email, u.full_name, u.phone, u.is_active
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = 'SELECT * FROM patients WHERE user_id = $1';
    const result = await db.query(query, [userId]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.dateOfBirth !== undefined) {
      fields.push(`date_of_birth = $${paramCount++}`);
      values.push(data.dateOfBirth);
    }
    if (data.gender !== undefined) {
      fields.push(`gender = $${paramCount++}`);
      values.push(data.gender);
    }
    if (data.address !== undefined) {
      fields.push(`address = $${paramCount++}`);
      values.push(data.address);
    }
    if (data.medicalHistory !== undefined) {
      fields.push(`medical_history = $${paramCount++}`);
      values.push(data.medicalHistory);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE patients 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM patients WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT p.*, u.email, u.full_name, u.phone, u.is_active
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.isActive !== undefined) {
      query += ` AND u.is_active = $${paramCount++}`;
      values.push(filters.isActive);
    }

    query += ' ORDER BY p.created_at DESC';

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
      FROM patients p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.isActive !== undefined) {
      query += ` AND u.is_active = $${paramCount++}`;
      values.push(filters.isActive);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  }

  static async getByDoctorId(doctorId, filters = {}) {
    let query = `
      SELECT DISTINCT p.*, u.email, u.full_name, u.phone
      FROM patients p
      JOIN users u ON p.user_id = u.id
      JOIN appointments a ON p.id = a.patient_id
      WHERE a.doctor_id = $1
    `;
    const values = [doctorId];
    let paramCount = 2;

    query += ' ORDER BY p.created_at DESC';

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
}

module.exports = Patient;
