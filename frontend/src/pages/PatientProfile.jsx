import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { patientAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import StatsCard from '../components/StatsCard'
import { StatsSkeleton } from '../components/LoadingSkeleton'

export default function PatientProfile({ currentRoute, onNavigate }) {
  const { user, updateUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const toast = useToast()

  useEffect(() => {
    loadProfile()
    loadStats()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await patientAPI.getProfile()
      setProfile(response.data)
      setFormData(response.data)
    } catch (error) {
      toast.error(error.message || 'Failed to load profile')
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

  const handleSave = async () => {
    try {
      const response = await patientAPI.updateProfile(formData)
      setProfile(response.data)
      updateUser(response.data)
      setEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar currentRoute={currentRoute || 'patientProfile'} onNavigate={onNavigate} />
        <main className="flex-1 ml-72 p-8">
          <StatsSkeleton />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentRoute={currentRoute || 'patientProfile'} onNavigate={onNavigate} />
      <main className="flex-1 ml-72 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
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

        {/* Profile Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Personal Information</h2>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditing(false)
                    setFormData(profile)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.fullName || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <p className="text-gray-900">{profile?.email || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.phone || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
              {editing ? (
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.dateOfBirth || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              {editing ? (
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile?.gender || 'N/A'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              {editing ? (
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profile?.address || 'N/A'}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
              {editing ? (
                <textarea
                  value={formData.medicalHistory || ''}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your medical history..."
                />
              ) : (
                <p className="text-gray-900 whitespace-pre-wrap">{profile?.medicalHistory || 'No medical history recorded'}</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

