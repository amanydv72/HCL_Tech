import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { patientAPI } from '../services/api'
import { useToast } from '../components/Toast'
import StatusBadge from '../components/StatusBadge'
import SearchBar from '../components/SearchBar'
import { CardSkeleton } from '../components/LoadingSkeleton'

export default function PatientAppointments({ currentRoute, onNavigate }) {
  const [appointments, setAppointments] = useState([])
  const [allAppointments, setAllAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const toast = useToast()

  useEffect(() => {
    loadAppointments()
  }, [statusFilter])

  useEffect(() => {
    filterAppointments()
  }, [searchQuery, allAppointments])

  const loadAppointments = async () => {
    setLoading(true)
    try {
      const params = { page: 1, limit: 100, ...(statusFilter && { status: statusFilter }) }
      const response = await patientAPI.getAppointments(params)
      const apts = response.data?.appointments || response.data || []
      setAllAppointments(apts)
    } catch (error) {
      toast.error(error.message || 'Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    if (!searchQuery) {
      setAppointments(allAppointments)
      return
    }
    const filtered = allAppointments.filter(
      (apt) =>
        apt.Doctor?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.Doctor?.DoctorProfile?.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setAppointments(filtered)
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return
    try {
      await patientAPI.cancelAppointment(id)
      toast.success('Appointment cancelled successfully')
      loadAppointments()
    } catch (error) {
      toast.error(error.message || 'Failed to cancel appointment')
    }
  }


  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentRoute={currentRoute || 'patientAppointments'} onNavigate={onNavigate} />
      <main className="flex-1 ml-72 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">View and manage your appointments</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Appointments</label>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by doctor name or reason..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">No appointments found</p>
            <p className="text-gray-400 text-sm mt-2">
              {searchQuery || statusFilter ? 'Try adjusting your filters' : 'Book your first appointment to get started'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {apt.Doctor?.fullName || apt.doctorName || 'Dr. Unknown'}
                      </h3>
                      <StatusBadge status={apt.status} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
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
                  {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="ml-4 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

