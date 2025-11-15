const db = require('../database/db');

class User {
  static async create({ email, password, fullName, role, phone }) {
    const query = `
      INSERT INTO users (email, password, full_name, role, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, full_name, role, phone, is_active, created_at
    `;
    const result = await db.query(query, [email, password, fullName, role, phone]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, email, full_name, role, phone, is_active, created_at FROM users WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    const query = `
      UPDATE users 
      SET password = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2
      RETURNING id, email, full_name, role
    `;
    const result = await db.query(query, [hashedPassword, id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.fullName) {
      fields.push(`full_name = $${paramCount++}`);
      values.push(data.fullName);
    }
    if (data.phone) {
      fields.push(`phone = $${paramCount++}`);
      values.push(data.phone);
    }
    if (data.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(data.isActive);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, email, full_name, role, phone, is_active
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = 'SELECT id, email, full_name, role, phone, is_active, created_at FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.role) {
      query += ` AND role = $${paramCount++}`;
      values.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      query += ` AND is_active = $${paramCount++}`;
      values.push(filters.isActive);
    }

    query += ' ORDER BY created_at DESC';

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
    let query = 'SELECT COUNT(*) FROM users WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.role) {
      query += ` AND role = $${paramCount++}`;
      values.push(filters.role);
    }

    if (filters.isActive !== undefined) {
      query += ` AND is_active = $${paramCount++}`;
      values.push(filters.isActive);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

module.exports = User;
