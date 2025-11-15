const db = require('../database/db');

class Appointment {
  static async create({ patientId, doctorId, appointmentDate, appointmentTime, reason, status }) {
    // Check for conflicting appointments
    const conflictCheck = await db.query(
      `SELECT id FROM appointments 
       WHERE doctor_id = $1 
       AND appointment_date = $2 
       AND appointment_time = $3 
       AND status NOT IN ('cancelled')`,
      [doctorId, appointmentDate, appointmentTime]
    );

    if (conflictCheck.rows.length > 0) {
      throw new Error('Doctor already has an appointment at this date and time');
    }

    const query = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await db.query(query, [
      patientId,
      doctorId,
      appointmentDate,
      appointmentTime,
      reason || null,
      status || 'pending'
    ]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = `
      SELECT 
        a.*,
        p.id as patient_id, pu.full_name as patient_name, pu.email as patient_email, pu.phone as patient_phone,
        d.id as doctor_id, d.specialization, du.full_name as doctor_name, du.email as doctor_email
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE a.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.appointmentDate !== undefined && data.appointmentTime !== undefined) {
      // Check for conflicts if date/time is being changed
      const appointment = await db.query('SELECT doctor_id FROM appointments WHERE id = $1', [id]);
      if (appointment.rows.length > 0) {
        const conflictCheck = await db.query(
          `SELECT id FROM appointments 
           WHERE doctor_id = $1 
           AND appointment_date = $2 
           AND appointment_time = $3 
           AND id != $4
           AND status NOT IN ('cancelled')`,
          [appointment.rows[0].doctor_id, data.appointmentDate, data.appointmentTime, id]
        );

        if (conflictCheck.rows.length > 0) {
          throw new Error('Doctor already has an appointment at this date and time');
        }
      }
    }

    if (data.appointmentDate !== undefined) {
      fields.push(`appointment_date = $${paramCount++}`);
      values.push(data.appointmentDate);
    }
    if (data.appointmentTime !== undefined) {
      fields.push(`appointment_time = $${paramCount++}`);
      values.push(data.appointmentTime);
    }
    if (data.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }
    if (data.reason !== undefined) {
      fields.push(`reason = $${paramCount++}`);
      values.push(data.reason);
    }
    if (data.notes !== undefined) {
      fields.push(`notes = $${paramCount++}`);
      values.push(data.notes);
    }

    if (fields.length === 0) return null;

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE appointments 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM appointments WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getAll(filters = {}) {
    let query = `
      SELECT 
        a.*,
        p.id as patient_id, pu.full_name as patient_name, pu.email as patient_email,
        d.id as doctor_id, d.specialization, du.full_name as doctor_name
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users pu ON p.user_id = pu.id
      JOIN doctors d ON a.doctor_id = d.id
      JOIN users du ON d.user_id = du.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (filters.patientId) {
      query += ` AND a.patient_id = $${paramCount++}`;
      values.push(filters.patientId);
    }

    if (filters.doctorId) {
      query += ` AND a.doctor_id = $${paramCount++}`;
      values.push(filters.doctorId);
    }

    if (filters.status) {
      query += ` AND a.status = $${paramCount++}`;
      values.push(filters.status);
    }

    if (filters.date) {
      query += ` AND a.appointment_date = $${paramCount++}`;
      values.push(filters.date);
    }

    query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';

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
    let query = 'SELECT COUNT(*) FROM appointments WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (filters.patientId) {
      query += ` AND patient_id = $${paramCount++}`;
      values.push(filters.patientId);
    }

    if (filters.doctorId) {
      query += ` AND doctor_id = $${paramCount++}`;
      values.push(filters.doctorId);
    }

    if (filters.status) {
      query += ` AND status = $${paramCount++}`;
      values.push(filters.status);
    }

    if (filters.date) {
      query += ` AND appointment_date = $${paramCount++}`;
      values.push(filters.date);
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Appointment;
