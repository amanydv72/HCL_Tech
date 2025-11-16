# Hospital Management System - API Documentation

## Overview

Comprehensive REST API for a full-featured Hospital Management System with role-based access control (RBAC). The system supports three user roles: **Admin**, **Doctor**, and **Patient**, each with specific permissions and capabilities.

### Key Features
- ✅ **JWT Authentication** - Secure token-based authentication with 24-hour expiry
- ✅ **Role-Based Access Control** - Three distinct user roles with granular permissions
- ✅ **Double-Booking Prevention** - Automatic conflict detection for appointments
- ✅ **Comprehensive Validation** - Input validation on all endpoints
- ✅ **Pagination Support** - Efficient data retrieval for large datasets
- ✅ **Security Best Practices** - Rate limiting, CORS, Helmet, bcrypt hashing

### Base Information

**Base URL:** `http://localhost:5000/api`  
**Authentication:** JWT Bearer token required for protected endpoints  
**Content-Type:** `application/json`  
**Rate Limit:** 100 requests per 15 minutes per IP

**Default Admin Credentials:**
- Email: `admin@hospital.com`
- Password: `admin123`

### Authentication Header Format
```
Authorization: Bearer <your_jwt_token>
```

## Table of Contents
1. [Authentication](#authentication)
2. [Admin Endpoints](#admin-endpoints)
3. [Doctor Endpoints](#doctor-endpoints)
4. [Patient Endpoints](#patient-endpoints)
5. [Error Responses](#error-responses)
6. [Common Workflows](#common-workflows)
7. [Database Schema](#database-schema)

---

## Authentication

### Register User
**POST** `/auth/register`

Register a new doctor or patient account. Admin accounts can only be created by existing admins through the admin panel.

**Access:** Public (no authentication required)

**Request Body (Doctor):**
```json
{
  "email": "doctor@example.com",
  "password": "securepass123",
  "fullName": "Dr. Sarah Johnson",
  "role": "doctor",
  "phone": "1234567890",
  "specialization": "Cardiology",
  "qualifications": "MD, MBBS, FACC",
  "experienceYears": 10,
  "consultationFee": 500,
  "availability": [
    {
      "day": "Monday",
      "slots": ["09:00-12:00", "14:00-17:00"]
    },
    {
      "day": "Wednesday",
      "slots": ["10:00-13:00", "15:00-18:00"]
    }
  ]
}
```

**Request Body (Patient):**
```json
{
  "email": "patient@example.com",
  "password": "securepass123",
  "fullName": "John Doe",
  "role": "patient",
  "phone": "0987654321",
  "dateOfBirth": "1990-05-15",
  "gender": "Male",
  "address": "123 Main Street, City, State 12345",
  "medicalHistory": "No known allergies. Previous surgery: Appendectomy (2015)"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "email": "doctor@example.com",
      "fullName": "Dr. Sarah Johnson",
      "role": "doctor",
      "phone": "1234567890",
      "isActive": true,
      "createdAt": "2025-11-16T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE2MzE3ODQwMDB9.abc123..."
  }
}
```

**Validation Notes:**
- Email must be unique and valid format
- Password minimum 6 characters
- Phone must be exactly 10 digits
- All role-specific fields are required based on the chosen role
- Availability is optional during registration for doctors
- Token is automatically generated and returned upon successful registration

**Error Response (409 - Duplicate Email):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "doctor123",
    "fullName": "Dr. Sarah Johnson",
    "role": "doctor",
    "phone": "1234567890",
    "specialization": "Cardiology",
    "qualifications": "MD, MBBS",
    "experienceYears": 10,
    "consultationFee": 500
  }'
```

---

### Login
**POST** `/auth/login`

Authenticate with email and password to receive a JWT token. The token is valid for 24 hours and must be included in the Authorization header for all protected endpoints.

**Access:** Public (no authentication required)

**Request Body:**
```json
{
  "email": "doctor@example.com",
  "password": "securepass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "doctor@example.com",
      "fullName": "Dr. Sarah Johnson",
      "role": "doctor",
      "phone": "1234567890",
      "isActive": true,
      "createdAt": "2025-11-16T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE2MzE3ODQwMDAsImV4cCI6MTYzMTg3MDQwMH0.signature..."
  }
}
```

**Token Payload (decoded):**
```json
{
  "userId": 1,
  "role": "doctor",
  "iat": 1631784000,
  "exp": 1631870400
}
```

**Error Responses:**

*Invalid Credentials (401):*
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

*Inactive Account (403):*
```json
{
  "success": false,
  "message": "Account is inactive. Please contact administrator."
}
```

**Usage Notes:**
- Store the token securely (localStorage/sessionStorage for web, secure storage for mobile)
- Include token in all subsequent requests: `Authorization: Bearer <token>`
- Token expires after 24 hours - implement refresh logic or re-login
- Failed login attempts are logged for security monitoring

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "admin123"
  }'
```

---

### Get Profile
**GET** `/auth/profile`

Retrieve the complete profile of the currently authenticated user. Response includes role-specific information.

**Access:** Authenticated users (all roles)

**Headers:**
```
Authorization: Bearer <your_token>
```

**Success Response - Doctor (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 2,
    "email": "doctor@example.com",
    "fullName": "Dr. Sarah Johnson",
    "role": "doctor",
    "phone": "1234567890",
    "isActive": true,
    "createdAt": "2025-11-16T10:30:00.000Z",
    "specialization": "Cardiology",
    "qualifications": "MD, MBBS, FACC",
    "experienceYears": 10,
    "consultationFee": 500,
    "availability": [
      {
        "day": "Monday",
        "slots": ["09:00-12:00", "14:00-17:00"]
      },
      {
        "day": "Wednesday",
        "slots": ["10:00-13:00", "15:00-18:00"]
      }
    ]
  }
}
```

**Success Response - Patient (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 3,
    "email": "patient@example.com",
    "fullName": "John Doe",
    "role": "patient",
    "phone": "0987654321",
    "isActive": true,
    "createdAt": "2025-11-16T10:30:00.000Z",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "address": "123 Main Street, City, State 12345",
    "medicalHistory": "No known allergies. Previous surgery: Appendectomy (2015)"
  }
}
```

**Success Response - Admin (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@hospital.com",
    "fullName": "System Administrator",
    "role": "admin",
    "phone": "5555555555",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Admin Endpoints

**Access:** All admin endpoints require authentication with admin role

### Dashboard Statistics
**GET** `/admin/dashboard`

Get comprehensive system-wide statistics including user counts, appointment metrics, and recent activity.

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "totalDoctors": 25,
    "totalPatients": 120,
    "activeUsers": 145,
    "inactiveUsers": 5,
    "totalAppointments": 450,
    "pendingAppointments": 12,
    "confirmedAppointments": 8,
    "completedAppointments": 420,
    "cancelledAppointments": 10,
    "todayAppointments": 5,
    "upcomingAppointments": 15,
    "recentAppointments": [
      {
        "id": 1,
        "patientName": "John Doe",
        "doctorName": "Dr. Sarah Johnson",
        "specialization": "Cardiology",
        "appointmentDate": "2025-11-20",
        "appointmentTime": "10:30",
        "status": "pending",
        "createdAt": "2025-11-16T10:30:00.000Z"
      },
      {
        "id": 2,
        "patientName": "Jane Smith",
        "doctorName": "Dr. Michael Chen",
        "specialization": "Neurology",
        "appointmentDate": "2025-11-21",
        "appointmentTime": "14:00",
        "status": "confirmed",
        "createdAt": "2025-11-16T11:00:00.000Z"
      }
    ],
    "specializations": [
      { "name": "Cardiology", "count": 5 },
      { "name": "Neurology", "count": 4 },
      { "name": "Orthopedics", "count": 6 }
    ]
  }
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Users Management

#### List All Users
**GET** `/admin/users`

Retrieve paginated list of all users with optional filtering by role.

**Query Parameters:**
- `page` (optional): Page number, default: 1
- `limit` (optional): Items per page, default: 10, max: 100
- `role` (optional): Filter by role (`admin`, `doctor`, `patient`)

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "email": "doctor@example.com",
      "fullName": "Dr. Sarah Johnson",
      "role": "doctor",
      "phone": "1234567890",
      "isActive": true,
      "createdAt": "2025-11-16T10:30:00.000Z"
    },
    {
      "id": 2,
      "email": "patient@example.com",
      "fullName": "John Doe",
      "role": "patient",
      "phone": "0987654321",
      "isActive": true,
      "createdAt": "2025-11-15T09:20:00.000Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**cURL Example:**
```bash
curl -X GET "http://localhost:5000/api/admin/users?page=1&limit=10&role=doctor" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

#### Create User
**POST** `/admin/users`

Create a new user account (admin, doctor, or patient). Only admins can create admin accounts.

**Request Body:**
```json
{
  "email": "newadmin@hospital.com",
  "password": "securepass123",
  "fullName": "Admin User",
  "role": "admin",
  "phone": "5555555555"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 151,
    "email": "newadmin@hospital.com",
    "fullName": "Admin User",
    "role": "admin",
    "phone": "5555555555",
    "isActive": true,
    "createdAt": "2025-11-16T12:00:00.000Z"
  }
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newadmin@hospital.com",
    "password": "admin123",
    "fullName": "Admin User",
    "role": "admin",
    "phone": "5555555555"
  }'
```

---

#### Update User
**PUT** `/admin/users/:id`

Update user information including activation status.

**Request Body:**
```json
{
  "fullName": "Updated Name",
  "phone": "9999999999",
  "isActive": false
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "fullName": "Updated Name",
    "role": "doctor",
    "phone": "9999999999",
    "isActive": false,
    "updatedAt": "2025-11-16T13:00:00.000Z"
  }
}
```

**Note:** Deactivating a user (`isActive: false`) prevents them from logging in.

---

#### Delete User
**DELETE** `/admin/users/:id`

Permanently delete a user account and all associated data.

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Warning:** This action cascades to delete associated doctor/patient profiles and appointments.

---

### Doctors Management

**GET** `/admin/doctors?page=1&limit=10&specialization=Cardiology` - List doctors (paginated)

**PUT** `/admin/doctors/:id` - Update doctor
```json
{ "specialization": "Neurology", "consultationFee": 600, "experienceYears": 12 }
```

**DELETE** `/admin/doctors/:id` - Delete doctor

---

### Patients Management

**GET** `/admin/patients?page=1&limit=10` - List patients (paginated)

**PUT** `/admin/patients/:id` - Update patient
```json
{ "address": "456 New Street", "medicalHistory": "Updated history" }
```

**DELETE** `/admin/patients/:id` - Delete patient

---

### Appointments Management

**GET** `/admin/appointments?page=1&limit=10&status=pending&doctorId=1&patientId=1` - List appointments

**POST** `/admin/appointments` - Create appointment
```json
{
  "patientId": 1, "doctorId": 1,
  "appointmentDate": "2025-11-25", "appointmentTime": "10:30",
  "reason": "Routine checkup", "status": "confirmed"
}
```

**PUT** `/admin/appointments/:id` - Update appointment
```json
{ "status": "completed", "notes": "Completed successfully" }
```

**DELETE** `/admin/appointments/:id` - Delete appointment

---

## Doctor Endpoints

**Access:** All doctor endpoints require doctor role

### Profile Management

**GET** `/doctor/profile` - Get own profile

**PUT** `/doctor/profile` - Update profile
```json
{ "specialization": "Cardiology", "qualifications": "MD, MBBS, PhD", "experienceYears": 12, "consultationFee": 550 }
```

**PUT** `/doctor/availability` - Update availability
```json
{
  "availability": [
    { "day": "Monday", "slots": ["09:00-12:00", "14:00-17:00"] },
    { "day": "Friday", "slots": ["09:00-11:00"] }
  ]
}
```

---

### Statistics & Appointments

**GET** `/doctor/stats` - Personal statistics (total/pending/confirmed/completed appointments, patients count)

**GET** `/doctor/appointments?page=1&limit=10&status=pending` - List own appointments

**GET** `/doctor/appointments/:id` - Get appointment details

**PUT** `/doctor/appointments/:id/approve` - Approve pending appointment

**PUT** `/doctor/appointments/:id/cancel` - Cancel appointment (optional notes)
```json
{ "notes": "Emergency surgery scheduled" }
```

**PUT** `/doctor/appointments/:id/complete` - Mark as completed (optional notes)
```json
{ "notes": "Patient examined. Prescribed medication for 7 days." }
```

**PUT** `/doctor/appointments/:id/notes` - Add/update notes
```json
{ "notes": "Follow-up required in 2 weeks." }
```

---

### Patients

**GET** `/doctor/patients?page=1&limit=10` - List assigned patients

---

## Patient Endpoints

**Access:** All patient endpoints require patient role

### Profile Management

**GET** `/patient/profile` - Get own profile

**PUT** `/patient/profile` - Update profile
```json
{
  "dateOfBirth": "1990-05-15", "gender": "Male",
  "address": "456 New Street", "medicalHistory": "Allergic to penicillin"
}
```

---

### Statistics & Doctors

**GET** `/patient/stats` - Personal statistics (appointments by status, upcoming count)

**GET** `/patient/doctors?page=1&limit=10&specialization=Cardiology` - Browse doctors

**GET** `/patient/doctors/:id` - Get doctor details

---

### Appointments

**POST** `/patient/appointments` - Book new appointment

**Request Body:**
```json
{
  "doctorId": 1,
  "appointmentDate": "2025-11-25",
  "appointmentTime": "10:30",
  "reason": "Chest pain consultation and checkup"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "id": 451,
    "patientId": 1,
    "doctorId": 1,
    "doctorName": "Dr. Sarah Johnson",
    "specialization": "Cardiology",
    "appointmentDate": "2025-11-25",
    "appointmentTime": "10:30",
    "reason": "Chest pain consultation and checkup",
    "status": "pending",
    "consultationFee": 500,
    "createdAt": "2025-11-16T14:00:00.000Z"
  }
}
```

**Validation Rules:**
- Cannot book appointments in the past
- Cannot double-book a doctor (same date + time)
- Doctor must be active (`isActive: true`)
- Reason must be at least 5 characters
- Date format: `YYYY-MM-DD`
- Time format: `HH:MM` (24-hour)

**Error Response (409 - Double Booking):**
```json
{
  "success": false,
  "message": "Doctor already has an appointment at this time"
}
```

**Error Response (400 - Past Date):**
```json
{
  "success": false,
  "message": "Cannot book appointments in the past"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:5000/api/patient/appointments \
  -H "Authorization: Bearer PATIENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "appointmentDate": "2025-11-25",
    "appointmentTime": "10:30",
    "reason": "Chest pain consultation"
  }'
```

---

**GET** `/patient/appointments?page=1&limit=10&status=pending` - List own appointments

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctorName": "Dr. Sarah Johnson",
      "specialization": "Cardiology",
      "appointmentDate": "2025-11-20",
      "appointmentTime": "10:30",
      "reason": "Routine checkup",
      "status": "pending",
      "notes": null,
      "consultationFee": 500,
      "createdAt": "2025-11-16T10:30:00.000Z"
    }
  ],
  "meta": {
    "total": 12,
    "page": 1,
    "limit": 10,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

**GET** `/patient/appointments/:id` - Get appointment details

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "doctorId": 1,
    "doctorName": "Dr. Sarah Johnson",
    "doctorEmail": "doctor@example.com",
    "doctorPhone": "1234567890",
    "specialization": "Cardiology",
    "appointmentDate": "2025-11-20",
    "appointmentTime": "10:30",
    "reason": "Routine checkup",
    "status": "confirmed",
    "notes": "Patient vitals checked. All normal.",
    "consultationFee": 500,
    "createdAt": "2025-11-16T10:30:00.000Z",
    "updatedAt": "2025-11-17T09:00:00.000Z"
  }
}
```

---

**PUT** `/patient/appointments/:id/cancel` - Cancel appointment

**Success Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "id": 1,
    "status": "cancelled",
    "updatedAt": "2025-11-16T15:00:00.000Z"
  }
}
```

**Note:** Can only cancel `pending` or `confirmed` appointments, not `completed` ones.

---

**GET** `/patient/appointment-history?page=1&limit=10` - Full appointment history

---

## Common Workflows

### Workflow 1: Patient Books an Appointment

**Step 1:** Patient registers or logs in
```bash
# Register
POST /api/auth/register
# or Login
POST /api/auth/login
```

**Step 2:** Browse available doctors
```bash
GET /api/patient/doctors?specialization=Cardiology&page=1&limit=10
```

**Step 3:** View specific doctor details and availability
```bash
GET /api/patient/doctors/:id
```

**Step 4:** Book an appointment
```bash
POST /api/patient/appointments
Body: {
  "doctorId": 1,
  "appointmentDate": "2025-11-25",
  "appointmentTime": "10:30",
  "reason": "Chest pain consultation"
}
```

**Step 5:** Check appointment status
```bash
GET /api/patient/appointments/:id
```

---

### Workflow 2: Doctor Manages Appointments

**Step 1:** Doctor logs in
```bash
POST /api/auth/login
```

**Step 2:** View dashboard statistics
```bash
GET /api/doctor/stats
```

**Step 3:** List pending appointments
```bash
GET /api/doctor/appointments?status=pending&page=1
```

**Step 4:** Review appointment details with patient info
```bash
GET /api/doctor/appointments/:id
```

**Step 5:** Approve the appointment
```bash
PUT /api/doctor/appointments/:id/approve
```

**Step 6:** After consultation, mark as completed with notes
```bash
PUT /api/doctor/appointments/:id/complete
Body: {
  "notes": "Patient examined. Prescribed medication for 7 days. Follow-up in 2 weeks."
}
```

---

### Workflow 3: Admin System Management

**Step 1:** Admin logs in
```bash
POST /api/auth/login
```

**Step 2:** View system dashboard
```bash
GET /api/admin/dashboard
```

**Step 3:** Create a new doctor
```bash
POST /api/admin/users
Body: {
  "email": "newdoctor@hospital.com",
  "password": "doctor123",
  "fullName": "Dr. John Smith",
  "role": "doctor",
  "phone": "1234567890"
}
```

**Step 4:** Update doctor profile with specialization
```bash
PUT /api/admin/doctors/:id
Body: {
  "specialization": "Neurology",
  "qualifications": "MD, PhD",
  "experienceYears": 15,
  "consultationFee": 750
}
```

**Step 5:** Monitor appointments
```bash
GET /api/admin/appointments?status=pending&page=1
```

**Step 6:** Create appointment on behalf of patient
```bash
POST /api/admin/appointments
Body: {
  "patientId": 1,
  "doctorId": 2,
  "appointmentDate": "2025-11-26",
  "appointmentTime": "11:00",
  "reason": "Follow-up consultation",
  "status": "confirmed"
}
```

---

### Workflow 4: Update Doctor Availability

**Step 1:** Doctor logs in
```bash
POST /api/auth/login
```

**Step 2:** View current profile
```bash
GET /api/doctor/profile
```

**Step 3:** Update availability schedule
```bash
PUT /api/doctor/availability
Body: {
  "availability": [
    { "day": "Monday", "slots": ["09:00-12:00", "14:00-17:00"] },
    { "day": "Wednesday", "slots": ["10:00-13:00", "15:00-18:00"] },
    { "day": "Friday", "slots": ["09:00-11:00", "14:00-16:00"] }
  ]
}
```

---

### Workflow 5: Patient Views Medical History

**Step 1:** Patient logs in
```bash
POST /api/auth/login
```

**Step 2:** View statistics
```bash
GET /api/patient/stats
```

**Step 3:** Get complete appointment history
```bash
GET /api/patient/appointment-history?page=1&limit=20
```

**Step 4:** View specific appointment with doctor's notes
```bash
GET /api/patient/appointments/:id
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Doctors Table
```sql
CREATE TABLE doctors (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(255) NOT NULL,
  qualifications TEXT,
  experience_years INTEGER,
  consultation_fee DECIMAL(10, 2),
  availability JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Patients Table
```sql
CREATE TABLE patients (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender VARCHAR(20),
  address TEXT,
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Appointments Table
```sql
CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, appointment_date, appointment_time)
);
```

**Key Constraints:**
- `UNIQUE(doctor_id, appointment_date, appointment_time)` - Prevents double-booking
- `ON DELETE CASCADE` - Automatically removes related records
- `is_active` - Allows soft deactivation of users

**Indexes:**
```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_doctors_specialization ON doctors(specialization);
```

---

## Error Responses

All error responses follow a consistent structure with appropriate HTTP status codes.

### Standard Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": [  // Optional, for validation errors
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Status Codes Reference

#### 400 Bad Request
Invalid input, validation errors, or malformed request.

**Example - Validation Errors:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password must be at least 6 characters" },
    { "field": "phone", "message": "Phone must be exactly 10 digits" }
  ]
}
```

**Example - Past Date:**
```json
{
  "success": false,
  "message": "Cannot book appointments in the past"
}
```

---

#### 401 Unauthorized
Missing, expired, or invalid authentication token.

**Example - Missing Token:**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

**Example - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Example - Token Expired:**
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

---

#### 403 Forbidden
Authenticated but insufficient permissions.

**Example - Role Restriction:**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

**Example - Inactive Account:**
```json
{
  "success": false,
  "message": "Account is inactive. Please contact administrator."
}
```

**Example - Resource Ownership:**
```json
{
  "success": false,
  "message": "You can only access your own appointments"
}
```

---

#### 404 Not Found
Requested resource does not exist.

**Example - User Not Found:**
```json
{
  "success": false,
  "message": "User not found"
}
```

**Example - Appointment Not Found:**
```json
{
  "success": false,
  "message": "Appointment not found"
}
```

---

#### 409 Conflict
Resource conflict with existing data.

**Example - Duplicate Email:**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Example - Double Booking:**
```json
{
  "success": false,
  "message": "Doctor already has an appointment at this time"
}
```

**Example - Invalid Status Transition:**
```json
{
  "success": false,
  "message": "Cannot cancel a completed appointment"
}
```

---

#### 429 Too Many Requests
Rate limit exceeded.

```json
{
  "success": false,
  "message": "Too many requests. Please try again in 15 minutes.",
  "retryAfter": 900
}
```

**Rate Limit:** 100 requests per 15 minutes per IP address

---

#### 500 Internal Server Error
Unexpected server error.

```json
{
  "success": false,
  "message": "Internal server error. Please try again later."
}
```

**Note:** These errors are logged automatically for debugging.

---

## Validation Rules

### User Fields (All Roles)

| Field | Requirements | Notes |
|-------|-------------|-------|
| **email** | Valid email format, unique, required | Case-insensitive, must not already exist |
| **password** | Min 6 characters, required | Hashed with bcrypt (10 rounds) before storage |
| **fullName** | Min 2 characters, max 255, required | Full name as it should appear |
| **phone** | Exactly 10 digits, required | Numeric only, no spaces or special chars |
| **role** | `admin` \| `doctor` \| `patient`, required | Determines access permissions |
| **isActive** | Boolean, default: `true` | Admins can deactivate users |

---

### Doctor-Specific Fields

Required when `role === "doctor"`

| Field | Requirements | Notes |
|-------|-------------|-------|
| **specialization** | Min 2 chars, max 255, required | e.g., "Cardiology", "Neurology" |
| **qualifications** | Min 2 chars, text, required | e.g., "MD, MBBS, FACC" |
| **experienceYears** | Positive integer, required | Years of practice experience |
| **consultationFee** | Positive decimal, required | Fee in local currency (e.g., 500.00) |
| **availability** | Array of objects, optional | Can be set/updated later |

**Availability Structure:**
```json
[
  {
    "day": "Monday",  // Valid weekday name
    "slots": ["09:00-12:00", "14:00-17:00"]  // Time ranges in HH:MM format
  }
]
```

**Valid Day Names:** Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday

---

### Patient-Specific Fields

Required when `role === "patient"`

| Field | Requirements | Notes |
|-------|-------------|-------|
| **dateOfBirth** | Valid date (YYYY-MM-DD), required | Used for age calculation |
| **gender** | `Male` \| `Female` \| `Other`, required | Predefined values only |
| **address** | Min 5 chars, text, required | Full residential address |
| **medicalHistory** | Text, optional | Allergies, previous conditions, surgeries |

---

### Appointment Fields

| Field | Requirements | Validation Notes |
|-------|-------------|------------------|
| **doctorId** | Valid doctor ID, required | Must reference active doctor |
| **patientId** | Valid patient ID, required | Admin only (auto-set for patients) |
| **appointmentDate** | Valid date (YYYY-MM-DD), required | Cannot be in the past |
| **appointmentTime** | Valid time (HH:MM), required | 24-hour format (e.g., "14:30") |
| **reason** | Min 5 chars, max 500, required | Purpose of visit |
| **status** | `pending` \| `confirmed` \| `completed` \| `cancelled` | Default: `pending` |
| **notes** | Text, optional | Doctor's notes after consultation |

**Business Rules:**
- Unique constraint: `(doctor_id, appointment_date, appointment_time)` - prevents double-booking
- Patients can only cancel `pending` or `confirmed` appointments
- Only doctors can add notes to appointments
- Appointments in the past cannot be created

---

### Field Length Limits

| Field Type | Min Length | Max Length |
|-----------|-----------|------------|
| Email | - | 255 chars |
| Password | 6 chars | - |
| Full Name | 2 chars | 255 chars |
| Phone | 10 digits | 10 digits |
| Specialization | 2 chars | 255 chars |
| Address | 5 chars | 1000 chars |
| Reason | 5 chars | 500 chars |
| Notes | - | 2000 chars |
| Medical History | - | 5000 chars |

---

### Common Validation Patterns

**Email Regex:**
```regex
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$
```

**Phone Pattern:**
```regex
^\d{10}$
```

**Date Format:**
```
YYYY-MM-DD (e.g., 2025-11-25)
```

**Time Format:**
```
HH:MM (24-hour, e.g., 14:30)
```

---

## Pagination

All list endpoints support consistent pagination with metadata.

### Query Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| `page` | integer | 1 | - | Current page number (1-indexed) |
| `limit` | integer | 10 | 100 | Number of items per page |

### Response Structure

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "meta": {
    "total": 150,           // Total items across all pages
    "page": 1,              // Current page number
    "limit": 10,            // Items per page
    "totalPages": 15,       // Total number of pages
    "hasNextPage": true,    // Whether next page exists
    "hasPrevPage": false    // Whether previous page exists
  }
}
```

### Pagination Examples

**First Page:**
```bash
GET /api/admin/users?page=1&limit=10
```

**Navigate to Page 5:**
```bash
GET /api/admin/users?page=5&limit=10
```

**Large Page Size:**
```bash
GET /api/admin/users?page=1&limit=50
```

**Using Metadata for Navigation:**
```javascript
// Frontend example
if (response.meta.hasNextPage) {
  const nextPage = response.meta.page + 1;
  fetchUsers(nextPage, response.meta.limit);
}
```

### Paginated Endpoints

All these endpoints support pagination:

**Admin:**
- `GET /admin/users`
- `GET /admin/doctors`
- `GET /admin/patients`
- `GET /admin/appointments`

**Doctor:**
- `GET /doctor/appointments`
- `GET /doctor/patients`

**Patient:**
- `GET /patient/doctors`
- `GET /patient/appointments`
- `GET /patient/appointment-history`

---

## Security Features

### 1. JWT Authentication
- **Algorithm:** HMAC SHA256 (HS256)
- **Token Expiry:** 24 hours from issue time
- **Payload:** `{ userId, role, iat, exp }`
- **Storage:** Client-side (localStorage, sessionStorage, or secure cookie)
- **Validation:** Every protected endpoint validates token and extracts user context

**Token Structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.  // Header
eyJ1c2VySWQiOjEsInJvbGUiOiJkb2N0b3Ii...  // Payload (base64)
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV...   // Signature
```

---

### 2. Password Security
- **Hashing Algorithm:** bcrypt
- **Salt Rounds:** 10
- **Storage:** Only hashed passwords stored in database
- **Validation:** Automatic comparison during login
- **Reset:** (Not yet implemented - planned feature)

**Example Hash:**
```
$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

---

### 3. Role-Based Access Control (RBAC)

| Endpoint Pattern | Admin | Doctor | Patient |
|-----------------|-------|--------|---------|
| `/api/auth/*` | ✅ | ✅ | ✅ |
| `/api/admin/*` | ✅ | ❌ | ❌ |
| `/api/doctor/*` | ❌ | ✅ | ❌ |
| `/api/patient/*` | ❌ | ❌ | ✅ |

**Implementation:**
- Middleware extracts role from JWT token
- Each route protected with role verification
- Unauthorized access returns `403 Forbidden`

---

### 4. Rate Limiting
- **Limit:** 100 requests per 15 minutes
- **Scope:** Per IP address
- **Response:** `429 Too Many Requests` when exceeded
- **Headers:** `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

### 5. Input Validation
- **Library:** express-validator
- **Scope:** All POST/PUT endpoints
- **Validation:** Type checking, length limits, format validation
- **Sanitization:** Email normalization, trimming whitespace
- **Response:** `400 Bad Request` with detailed error messages

---

### 6. SQL Injection Protection
- **Method:** Parameterized queries using pg library
- **Example:**
```javascript
// Safe
db.query('SELECT * FROM users WHERE email = $1', [email]);

// Unsafe (not used)
db.query(`SELECT * FROM users WHERE email = '${email}'`);
```

---

### 7. CORS Configuration
```javascript
{
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

---

### 8. HTTP Security Headers (Helmet)
- **X-Content-Type-Options:** nosniff
- **X-Frame-Options:** DENY
- **X-XSS-Protection:** 1; mode=block
- **Strict-Transport-Security:** max-age=31536000
- **Content-Security-Policy:** Configured

---

### 9. Double-Booking Prevention
- **Database Constraint:** `UNIQUE(doctor_id, appointment_date, appointment_time)`
- **Validation:** Pre-insert check in application layer
- **Error:** `409 Conflict` if duplicate detected

---

### 10. Logging & Monitoring
- **Access Logs:** All API requests logged with timestamp, IP, endpoint
- **Error Logs:** Server errors logged with stack traces
- **Audit Trail:** User actions (create, update, delete) tracked
- **Format:** Winston logger with file rotation

---

## Quick Start Examples

### Complete Patient Journey

**1. Register as Patient:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "patient123",
    "fullName": "John Doe",
    "role": "patient",
    "phone": "1234567890",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "address": "123 Main St",
    "medicalHistory": "No allergies"
  }'
```

**2. Browse Doctors:**
```bash
curl -X GET "http://localhost:5000/api/patient/doctors?specialization=Cardiology" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**3. Book Appointment:**
```bash
curl -X POST http://localhost:5000/api/patient/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctorId": 1,
    "appointmentDate": "2025-11-25",
    "appointmentTime": "10:30",
    "reason": "Routine checkup"
  }'
```

**4. Check Appointment Status:**
```bash
curl -X GET http://localhost:5000/api/patient/appointments/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### Complete Doctor Workflow

**1. Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@test.com",
    "password": "doctor123"
  }'
```

**2. View Pending Appointments:**
```bash
curl -X GET "http://localhost:5000/api/doctor/appointments?status=pending" \
  -H "Authorization: Bearer DOCTOR_TOKEN"
```

**3. Approve Appointment:**
```bash
curl -X PUT http://localhost:5000/api/doctor/appointments/1/approve \
  -H "Authorization: Bearer DOCTOR_TOKEN"
```

**4. Complete with Notes:**
```bash
curl -X PUT http://localhost:5000/api/doctor/appointments/1/complete \
  -H "Authorization: Bearer DOCTOR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Patient examined. Blood pressure normal. Prescribed medication."
  }'
```

---

### Admin Operations

**1. Login as Admin:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@hospital.com",
    "password": "admin123"
  }'
```

**2. View Dashboard:**
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

**3. Create New Doctor:**
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newdoctor@hospital.com",
    "password": "doctor123",
    "fullName": "Dr. Jane Smith",
    "role": "doctor",
    "phone": "9876543210"
  }'
```

---

## Testing with Postman

### Setup

1. Import `Hospital_Management_System.postman_collection.json`
2. Create environment with variables:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be auto-set by login scripts)
   - `admin_token`: (will be auto-set)
   - `doctor_token`: (will be auto-set)
   - `patient_token`: (will be auto-set)

### Features

✅ **Pre-request Scripts:** Automatically include auth tokens  
✅ **Test Scripts:** Auto-save tokens after login  
✅ **Environment Variables:** Reusable across requests  
✅ **Organized Folders:** Grouped by role (Admin, Doctor, Patient)  
✅ **Example Requests:** Pre-filled with sample data

### Postman Test Script Example

```javascript
// Auto-save token after login
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.data.token);
  pm.environment.set("doctor_token", jsonData.data.token);
}
```
---

## API Versioning

**Current Version:** v1 (implicit in base URL)


---


