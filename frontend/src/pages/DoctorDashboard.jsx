import React, { useState, useEffect } from 'react'
import { doctorAPI } from '../services/api'
import { useToast } from '../components/Toast'
import StatsCard from '../components/StatsCard'
import StatusBadge from '../components/StatusBadge'
import SearchBar from '../components/SearchBar'
import { StatsSkeleton, CardSkeleton } from '../components/LoadingSkeleton'

export default function DoctorDashboard({ currentRoute, onNavigate }) {
  const [stats, setStats] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const toast = useToast()

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    if (activeTab === 'appointments') {
      loadAppointments()
    } else if (activeTab === 'patients') {
      loadPatients()
    }
  }, [activeTab, statusFilter])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [statsData, appointmentsData] = await Promise.all([
        doctorAPI.getStats(),
        doctorAPI.getAppointments({ page: 1, limit: 5 }),
      ])
      setStats(statsData.data)
      setAppointments(appointmentsData.data?.appointments || appointmentsData.data || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const loadAppointments = async () => {
    setAppointmentsLoading(true)
    try {
      const params = { page: 1, limit: 50, ...(statusFilter && { status: statusFilter }) }
      const response = await doctorAPI.getAppointments(params)
      const apts = response.data?.appointments || response.data || []
      setAppointments(
        searchQuery
          ? apts.filter(
              (apt) =>
                apt.Patient?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                apt.reason?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          : apts
      )
    } catch (error) {
      toast.error(error.message || 'Failed to load appointments')
    } finally {
      setAppointmentsLoading(false)
    }
  }

  const loadPatients = async () => {
    setAppointmentsLoading(true)
    try {
      const response = await doctorAPI.getPatients({ page: 1, limit: 50 })
      const pats = response.data?.patients || response.data || []
      setPatients(
        searchQuery
          ? pats.filter((p) => p.fullName?.toLowerCase().includes(searchQuery.toLowerCase()))
          : pats
      )
    } catch (error) {
      toast.error(error.message || 'Failed to load patients')
    } finally {
      setAppointmentsLoading(false)
    }
  }

  const handleAppointmentAction = async (id, action, notes = '') => {
    try {
      switch (action) {
        case 'approve':
          await doctorAPI.approveAppointment(id)
          toast.success('Appointment approved successfully')
          break
        case 'cancel':
          await doctorAPI.cancelAppointment(id, notes)
          toast.success('Appointment cancelled')
          break
        case 'complete':
          await doctorAPI.completeAppointment(id, notes)
          toast.success('Appointment marked as completed')
          break
      }
      loadAppointments()
    } catch (error) {
      toast.error(error.message || `Failed to ${action} appointment`)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'patients', label: 'My Patients', icon: '👥' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-8 ml-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Manage your appointments and patients</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {loading ? (
              <StatsSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                  title="Total Appointments"
                  value={stats?.totalAppointments || 0}
                  icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  color="blue"
                />
                <StatsCard
                  title="Pending"
                  value={stats?.pendingAppointments || 0}
                  icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="yellow"
                />
                <StatsCard
                  title="Completed"
                  value={stats?.completedAppointments || 0}
                  icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  color="green"
                />
                <StatsCard
                  title="Total Patients"
                  value={stats?.totalPatients || 0}
                  icon={
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  }
                  color="purple"
                />
              </div>
            )}

            {/* Recent Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <CardSkeleton key={i} />
                  ))}
                </div>
              ) : appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent appointments</p>
              ) : (
                <div className="space-y-4">
                  {appointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {apt.Patient?.fullName || apt.patientName || 'Unknown Patient'}
                            </h3>
                            <StatusBadge status={apt.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Date:</span> {apt.appointmentDate || apt.date}
                            </div>
                            <div>
                              <span className="font-medium">Time:</span> {apt.appointmentTime || apt.time}
                            </div>
                            {apt.reason && (
                              <div className="col-span-2">
                                <span className="font-medium">Reason:</span> {apt.reason}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <SearchBar
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by patient name or reason..."
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onAction={handleAppointmentAction}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search patients by name..."
              />
            </div>

            {appointmentsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : patients.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No patients found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {patients.map((patient) => (
                  <div key={patient.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-semibold">
                          {patient.fullName?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{patient.fullName || 'Unknown'}</h3>
                        <p className="text-sm text-gray-600">{patient.email}</p>
                      </div>
                    </div>
                    {patient.phone && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Phone:</span> {patient.phone}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AppointmentCard({ appointment, onAction }) {
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState('')
  const [notes, setNotes] = useState('')

  const handleAction = (type) => {
    setActionType(type)
    setShowModal(true)
  }

  const confirmAction = () => {
    onAction(appointment.id, actionType, notes)
    setShowModal(false)
    setNotes('')
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {appointment.Patient?.fullName || appointment.patientName || 'Unknown Patient'}
              </h3>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
              <div>
                <span className="font-medium">Date:</span> {appointment.appointmentDate || appointment.date}
              </div>
              <div>
                <span className="font-medium">Time:</span> {appointment.appointmentTime || appointment.time}
              </div>
              {appointment.reason && (
                <div className="col-span-2">
                  <span className="font-medium">Reason:</span> {appointment.reason}
                </div>
              )}
            </div>
            {appointment.notes && (
              <div className="mt-3 p-3 bg-blue-50 rounded border border-blue-100">
                <span className="font-medium text-sm text-blue-900">Notes:</span>
                <p className="text-sm text-blue-800 mt-1">{appointment.notes}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 ml-4">
            {appointment.status === 'pending' && (
              <>
                <button
                  onClick={() => handleAction('approve')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction('cancel')}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </>
            )}
            {appointment.status === 'confirmed' && (
              <button
                onClick={() => handleAction('complete')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Complete
              </button>
            )}
            <button
              onClick={() => handleAction('notes')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Add Notes
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">
              {actionType === 'approve' && 'Approve Appointment'}
              {actionType === 'cancel' && 'Cancel Appointment'}
              {actionType === 'complete' && 'Complete Appointment'}
              {actionType === 'notes' && 'Add Notes'}
            </h3>
            {(actionType === 'cancel' || actionType === 'complete' || actionType === 'notes') && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter notes..."
                />
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false)
                  setNotes('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  actionType === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700'
                    : actionType === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

