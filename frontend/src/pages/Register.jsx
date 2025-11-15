import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function FormSection({ title, fields, onSubmit, submitText, loading, isDoctor }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const data = Object.fromEntries(new FormData(e.target).entries())
          onSubmit(data)
        }}
      >
        {isDoctor ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.fullWidth ? 'md:col-span-2' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                {f.type === 'select' ? (
                  <select
                    name={f.name}
                    required={!!f.required}
                    disabled={loading}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 transition-colors disabled:opacity-50"
                  >
                    <option value="" disabled hidden>
                      {f.placeholder || `Select ${f.label}`}
                    </option>
                    {f.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    name={f.name}
                    required={!!f.required}
                    disabled={loading}
                    rows={3}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 transition-colors disabled:opacity-50"
                  />
                ) : (
                  <input
                    name={f.name}
                    type={f.type || 'text'}
                    required={!!f.required}
                    disabled={loading}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 transition-colors disabled:opacity-50"
                  />
                )}
              </div>
            ))}
            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  submitText
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {f.label} {f.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  name={f.name}
                  type={f.type || 'text'}
                  required={!!f.required}
                  disabled={loading}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 transition-colors disabled:opacity-50"
                />
              </div>
            ))}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registering...
                  </>
                ) : (
                  submitText
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default function Register({ onRegisterSuccess }) {
  const [tab, setTab] = useState('patient')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const toast = useToast()

  const handleRegister = (role) => async (data) => {
    setLoading(true)
    try {
      let payload = {}

      if (role === 'patient') {
        payload = {
          email: data.email,
          password: data.password,
          fullName: data.name || data.fullName,
          role: 'patient',
          phone: data.phone || '',
          dateOfBirth: data.dob || data.dateOfBirth || '',
          gender: data.gender || '',
          address: data.address || '',
          medicalHistory: data.medicalHistory || '',
        }
      } else if (role === 'doctor') {
        // Parse availability if provided
        let availability = []
        if (data.availability) {
          try {
            availability = JSON.parse(data.availability)
          } catch {
            // If not JSON, create default
            availability = [
              { day: 'Monday', slots: ['09:00-12:00', '14:00-17:00'] },
              { day: 'Wednesday', slots: ['10:00-13:00'] },
            ]
          }
        }

        payload = {
          email: data.email,
          password: data.password,
          fullName: data.name || data.fullName,
          role: 'doctor',
          phone: data.contact || data.phone || '',
          specialization: data.specialization || 'General Physician',
          qualifications: data.qualification || data.qualifications || 'MBBS',
          experienceYears: parseInt(data.experience || data.experienceYears || 0),
          consultationFee: parseInt(data.consultationFee || 500),
          availability: availability,
        }
      }

      const result = await register(payload)
      toast.success(`Registration successful! Welcome, ${data.name || data.fullName}! Auto-logging you in...`)
      
      // Auto-login after registration - redirect immediately
      if (onRegisterSuccess) {
        // Use the role from result, or fallback to the role from payload
        const userRole = result.role || payload.role || role
        console.log('Registration successful, redirecting with role:', userRole)
        setTimeout(() => {
          onRegisterSuccess(userRole)
        }, 300)
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setTab('patient')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            tab === 'patient'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Patient
        </button>
        <button
          onClick={() => setTab('doctor')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            tab === 'doctor'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Doctor
        </button>
      </div>

      {tab === 'patient' && (
        <FormSection
          title="Patient Registration"
          submitText="Register as Patient"
          onSubmit={handleRegister('patient')}
          isDoctor={false}
          fields={[
            { name: 'name', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
            { name: 'phone', label: 'Phone Number', type: 'tel' },
            { name: 'dob', label: 'Date of Birth', type: 'date' },
            { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
            { name: 'address', label: 'Address' },
            { name: 'medicalHistory', label: 'Medical History', type: 'textarea' },
          ]}
          loading={loading}
        />
      )}

      {tab === 'doctor' && (
        <FormSection
          title="Doctor Registration"
          submitText="Register as Doctor"
          onSubmit={handleRegister('doctor')}
          isDoctor={true}
          fields={[
            { name: 'name', label: 'Full Name', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
            {
              name: 'qualification',
              label: 'Qualification',
              type: 'select',
              required: true,
              placeholder: 'Select qualification',
              options: ['MBBS', 'MD', 'MS', 'DM', 'DNB', 'DO', 'PhD', 'BDS', 'MDS', 'Other'],
            },
            {
              name: 'specialization',
              label: 'Specialization',
              type: 'select',
              options: [
                'General Physician',
                'Cardiologist',
                'Dermatologist',
                'Pediatrician',
                'Orthopedic',
                'Gynecologist',
                'ENT Specialist',
                'Psychiatrist',
                'Radiologist',
                'Other',
              ],
            },
            { name: 'contact', label: 'Contact Number', type: 'tel' },
            { name: 'experience', label: 'Experience (years)', type: 'number' },
            { name: 'consultationFee', label: 'Consultation Fee (₹)', type: 'number' },
          ]}
          loading={loading}
        />
      )}
    </div>
  )
}
