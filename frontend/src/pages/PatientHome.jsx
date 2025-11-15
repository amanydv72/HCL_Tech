import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import DoctorList from '../components/DoctorList'
import { patientAPI } from '../services/api'
import { useToast } from '../components/Toast'
import StatsCard from '../components/StatsCard'
import SearchBar from '../components/SearchBar'
import { StatsSkeleton } from '../components/LoadingSkeleton'

export default function PatientHome({ currentRoute, onNavigate }) {
  const [doctors, setDoctors] = useState([])
  const [allDoctors, setAllDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [selectedSpecialization, setSelectedSpecialization] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const toast = useToast()

  useEffect(() => {
    loadDoctors()
    loadStats()
  }, [selectedSpecialization, page])

  useEffect(() => {
    filterDoctors()
  }, [searchQuery, allDoctors])

  const loadDoctors = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: 50,
        ...(selectedSpecialization && { specialization: selectedSpecialization }),
      }
      const response = await patientAPI.getDoctors(params)
      const docs = response.data?.doctors || response.data || []
      setAllDoctors(docs)
      if (response.pagination) {
        setTotalPages(response.pagination.totalPages || 1)
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load doctors')
      setAllDoctors([])
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await patientAPI.getStats()
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const filterDoctors = () => {
    if (!searchQuery) {
      setDoctors(allDoctors)
      return
    }
    const filtered = allDoctors.filter(
      (doc) =>
        doc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.DoctorProfile?.specialization?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setDoctors(filtered)
  }

  const handleBookAppointment = async (doctorId, appointmentDate, appointmentTime, reason) => {
    try {
      await patientAPI.bookAppointment({
        doctorId,
        appointmentDate,
        appointmentTime,
        reason: reason || 'General consultation',
      })
      toast.success('Appointment booked successfully!')
      return true
    } catch (error) {
      toast.error(error.message || 'Failed to book appointment')
      return false
    }
  }

  const specializations = [
    '',
    'Cardiologist',
    'Dermatologist',
    'General Physician',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'ENT Specialist',
    'Psychiatrist',
    'Radiologist',
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentRoute={currentRoute || 'patientHome'} onNavigate={onNavigate} />
      <main className="flex-1 ml-72 p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Find and book appointments with the best doctors</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              title="Total Appointments"
              value={stats.totalAppointments || 0}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              color="blue"
            />
            <StatsCard
              title="Upcoming"
              value={stats.upcomingAppointments || 0}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="yellow"
            />
            <StatsCard
              title="Completed"
              value={stats.completedAppointments || 0}
              icon={
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              color="green"
            />
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Find Doctors</h2>
            {(selectedSpecialization || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedSpecialization('')
                  setSearchQuery('')
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search Doctors
                </span>
              </label>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name or specialization..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  Specialization
                </span>
              </label>
              <select
                value={selectedSpecialization}
                onChange={(e) => {
                  setSelectedSpecialization(e.target.value)
                  setPage(1)
                }}
                className="w-full rounded-lg border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
              >
                <option value="">All Specializations</option>
                {specializations.slice(1).map((spec) => (
                  <option key={spec} value={spec}>
                    {spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{doctors.length}</span> doctor{doctors.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <DoctorList doctors={doctors} onBook={handleBookAppointment} />
            {!searchQuery && totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
