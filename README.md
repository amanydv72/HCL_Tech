# Hospital Management System - Backend

Full-stack hospital management system with role-based access control (RBAC), JWT authentication, and PostgreSQL database.

## 🎯 Features

### Core Features
- ✅ **Role-Based Access Control** - Admin, Doctor, Patient roles with specific permissions
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **PostgreSQL Database** - Relational database with Docker support
- ✅ **Double-Booking Prevention** - Automatic conflict detection for appointments
- ✅ **Pagination** - All list endpoints support pagination
- ✅ **Input Validation** - Comprehensive validation using express-validator
- ✅ **Security** - Rate limiting, CORS, Helmet, bcrypt password hashing

### Role Capabilities

#### 👨‍💼 Admin
- Full system access and management
- CRUD operations for users, doctors, patients
- Complete appointment management
- System-wide dashboard statistics

#### 👨‍⚕️ Doctor
- Profile and availability management
- View and manage own appointments
- Approve/cancel/complete appointments
- Add medical notes
- View assigned patients

#### 👤 Patient
- Profile management
- Browse all active doctors
- Book appointments (with validation)
- Cancel own appointments
- View appointment history with pagination

## 📁 Project Structure

```
server/
├── src/
│   ├── config/              # App configuration
│   ├── controllers/         # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── doctorController.js
│   │   └── patientController.js
│   ├── database/            # DB connection & migrations
│   ├── middleware/          # Auth, role-based access, error handling
│   ├── models/              # User, Doctor, Patient, Appointment
│   ├── routes/              # API route definitions
│   ├── utils/               # Helper functions (pagination)
│   ├── validators/          # Input validation schemas
│   ├── app.js               # Express setup
│   └── server.js            # Entry point
├── .env                     # Environment variables
├── docker-compose.yml       # PostgreSQL container
├── API_DOCUMENTATION.md     # Complete API docs
└── package.json
```

## 🚀 Quick Start

### 1. Start PostgreSQL with Docker

```bash
cd server
docker-compose up -d
```

Verify container is running:
```bash
docker ps
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

Run the migration to create tables and seed admin:

```bash
npm run db:setup
```

This creates:
- `users` table (base for all roles)
- `doctors` table (doctor-specific data)
- `patients` table (patient-specific data)
- `appointments` table (with double-booking prevention)
- Default admin account: `admin@hospital.com` / `admin123`

### 4. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server runs on `http://localhost:5000`

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |

Use admin credentials to log in and manage the system.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user (doctor/patient)
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get current user profile

### Admin Routes (require admin role)
- `GET /api/admin/dashboard` - System statistics
- `GET /api/admin/users` - List all users (paginated)
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/doctors` - List doctors (paginated)
- `PUT /api/admin/doctors/:id` - Update doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor
- `GET /api/admin/patients` - List patients (paginated)
- `PUT /api/admin/patients/:id` - Update patient
- `DELETE /api/admin/patients/:id` - Delete patient
- `GET /api/admin/appointments` - List all appointments (paginated)
- `POST /api/admin/appointments` - Create appointment
- `PUT /api/admin/appointments/:id` - Update appointment
- `DELETE /api/admin/appointments/:id` - Delete appointment

### Doctor Routes (require doctor role)
- `GET /api/doctor/profile` - Get own profile
- `PUT /api/doctor/profile` - Update profile
- `PUT /api/doctor/availability` - Update availability schedule
- `GET /api/doctor/stats` - Personal statistics
- `GET /api/doctor/appointments` - List own appointments (paginated)
- `GET /api/doctor/appointments/:id` - Get appointment details
- `PUT /api/doctor/appointments/:id/approve` - Approve appointment
- `PUT /api/doctor/appointments/:id/cancel` - Cancel appointment
- `PUT /api/doctor/appointments/:id/complete` - Mark as completed
- `PUT /api/doctor/appointments/:id/notes` - Add notes
- `GET /api/doctor/patients` - List assigned patients

### Patient Routes (require patient role)
- `GET /api/patient/profile` - Get own profile
- `PUT /api/patient/profile` - Update profile
- `GET /api/patient/stats` - Personal statistics
- `GET /api/patient/doctors` - Browse doctors (paginated)
- `GET /api/patient/doctors/:id` - Get doctor details
- `POST /api/patient/appointments` - Book appointment
- `GET /api/patient/appointments` - List own appointments (paginated)
- `GET /api/patient/appointments/:id` - Get appointment details
- `PUT /api/patient/appointments/:id/cancel` - Cancel appointment
- `GET /api/patient/appointment-history` - Full history

## 📖 Complete Documentation

See **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** for:
- Detailed request/response examples
- All query parameters
- Error responses
- cURL examples
- Authentication flow
- Validation rules

## 🧪 Testing Examples

### Register Doctor
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"doctor@test.com\",\"password\":\"doctor123\",\"fullName\":\"Dr. John\",\"role\":\"doctor\",\"specialization\":\"Cardiology\"}"
```

### Register Patient
```bash
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"patient@test.com\",\"password\":\"patient123\",\"fullName\":\"Jane Doe\",\"role\":\"patient\"}"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"patient@test.com\",\"password\":\"patient123\"}"
```

### Book Appointment (Patient)
```bash
curl -X POST http://localhost:5000/api/patient/appointments ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"doctorId\":1,\"appointmentDate\":\"2025-11-20\",\"appointmentTime\":\"10:30\",\"reason\":\"Checkup\"}"
```

### Get Appointments (Doctor)
```bash
curl -X GET "http://localhost:5000/api/doctor/appointments?page=1&limit=10&status=pending" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐳 Docker Commands

**Start PostgreSQL:**
```bash
docker-compose up -d
```

**View logs:**
```bash
docker-compose logs -f postgres
```

**Stop PostgreSQL:**
```bash
docker-compose down
```

**Reset database (remove all data):**
```bash
docker-compose down -v
```

**Access PostgreSQL shell:**
```bash
docker exec -it hcl_tech_postgres psql -U postgres -d hcl_tech_db
```

## 🗄️ Database Schema

### Tables
- **users** - Base table for all users (email, password, role, phone)
- **doctors** - Doctor-specific data (specialization, fees, availability)
- **patients** - Patient-specific data (DOB, gender, medical history)
- **appointments** - Appointment records with double-booking prevention

### Key Constraints
- `users.email` - UNIQUE
- `doctors.user_id` - FOREIGN KEY to users
- `patients.user_id` - FOREIGN KEY to users
- `appointments.(doctor_id, appointment_date, appointment_time)` - UNIQUE (prevents double-booking)

### Indexes
- Email, role, user_id, appointment dates, status

## 🔒 Security Features

- **JWT Tokens** - Secure, stateless authentication
- **bcrypt** - Password hashing with salt (10 rounds)
- **Helmet** - Security HTTP headers
- **CORS** - Configurable cross-origin protection
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Input Validation** - express-validator for all inputs
- **Role-Based Authorization** - Middleware enforces access control
- **SQL Injection Protection** - Parameterized queries

## 📊 Pagination

All list endpoints support:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

Response includes metadata:
```json
{
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```


