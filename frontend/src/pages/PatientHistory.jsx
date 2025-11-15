import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { patientAPI } from '../services/api'
import { useToast } from '../components/Toast'

export default function PatientHistory({ currentRoute, onNavigate }) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setLoading(true)
    try {
      const response = await patientAPI.getAppointmentHistory({ page: 1, limit: 100 })
      setHistory(response.data?.appointments || response.data || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load appointment history')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentRoute={currentRoute || 'patientHistory'} onNavigate={onNavigate} />
      <main className="flex-1 ml-72 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment History</h1>
          <p className="text-gray-600">View your past appointments</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No appointment history found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((apt) => (
              <div key={apt.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {apt.Doctor?.fullName || apt.doctorName || 'Dr. Unknown'}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {apt.status || 'Completed'}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">Date:</span> {apt.appointmentDate || apt.date}
                  </div>
                  <div>
                    <span className="font-medium">Time:</span> {apt.appointmentTime || apt.time}
                  </div>
                  <div>
                    <span className="font-medium">Specialization:</span>{' '}
                    {apt.Doctor?.DoctorProfile?.specialization || apt.specialization || 'N/A'}
                  </div>
                  {apt.reason && (
                    <div>
                      <span className="font-medium">Reason:</span> {apt.reason}
                    </div>
                  )}
                </div>
                {apt.notes && (
                  <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                    <span className="font-medium text-sm text-blue-900">Doctor's Notes:</span>
                    <p className="text-sm text-blue-800 mt-1">{apt.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

