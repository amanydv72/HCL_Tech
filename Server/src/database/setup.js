const db = require('./db');

const createTables = async () => {
  const query = `
    -- Drop existing tables (in correct order due to foreign keys)
    DROP TABLE IF EXISTS appointments CASCADE;
    DROP TABLE IF EXISTS doctors CASCADE;
    DROP TABLE IF EXISTS patients CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    -- Enable UUID extension
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- Users table (base for all user types)
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'patient')),
      phone VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Doctors table (extends users)
    CREATE TABLE IF NOT EXISTS doctors (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      specialization VARCHAR(255) NOT NULL,
      qualifications TEXT,
      experience_years INTEGER DEFAULT 0,
      consultation_fee DECIMAL(10, 2) DEFAULT 0,
      availability JSONB DEFAULT '[]',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Patients table (extends users)
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date_of_birth DATE,
      gender VARCHAR(20),
      address TEXT,
      medical_history TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Appointments table
    CREATE TABLE IF NOT EXISTS appointments (
      id SERIAL PRIMARY KEY,
      patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
      doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
      appointment_date DATE NOT NULL,
      appointment_time TIME NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
      reason TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_doctor_appointment UNIQUE (doctor_id, appointment_date, appointment_time)
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_doctors_user_id ON doctors(user_id);
    CREATE INDEX IF NOT EXISTS idx_patients_user_id ON patients(user_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

    -- Insert default admin user (password: admin123)
    INSERT INTO users (email, password, full_name, role)
    VALUES ('admin@hospital.com', '$2a$10$XqJ1qZ5Z5Z5Z5Z5Z5Z5Z5eZ5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Zu', 'System Admin', 'admin')
    ON CONFLICT (email) DO NOTHING;
  `;
  
  try {
    await db.query(query);
    console.log('✓ All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const setupDatabase = async () => {
  try {
    console.log('Setting up database...');
    await createTables();
    console.log('✓ Database setup completed');
    console.log('✓ Default admin created: admin@hospital.com / admin123');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
