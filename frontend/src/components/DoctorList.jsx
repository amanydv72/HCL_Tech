import React, { useState } from 'react'

function DoctorCard({ doctor, onBook }) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
  })

  const handleBook = async (e) => {
    e.preventDefault()
    if (!formData.appointmentDate || !formData.appointmentTime) {
      return
    }
    setLoading(true)
    const success = await onBook(
      doctor.id || doctor.userId,
      formData.appointmentDate,
      formData.appointmentTime,
      formData.reason
    )
    if (success) {
      setShowModal(false)
      setFormData({ appointmentDate: '', appointmentTime: '', reason: '' })
    }
    setLoading(false)
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 mb-4 border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md">
              <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Name</div>
              <div className="font-semibold text-lg text-gray-900">
                {doctor.fullName || 
                 doctor.name || 
                 doctor.User?.fullName || 
                 doctor.user?.fullName ||
                 'Dr. Unknown'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Specialization</div>
              <div className="font-medium text-gray-800">
                {doctor.specialization || 
                 doctor.DoctorProfile?.specialization || 
                 doctor.speciality ||
                 'N/A'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Experience</div>
              <div className="font-medium text-gray-800">
                {doctor.experienceYears || 
                 doctor.DoctorProfile?.experienceYears || 
                 doctor.experience ||
                 0} years
              </div>
            </div>
            
            <div>
              <div className="text-sm text-gray-500 mb-1">Qualification</div>
              <div className="font-medium text-gray-800">
                {doctor.qualifications || 
                 doctor.DoctorProfile?.qualifications || 
                 doctor.qualification ||
                 'N/A'}
              </div>
            </div>
            
            {(doctor.consultationFee || doctor.DoctorProfile?.consultationFee) && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Consultation Fee</div>
                <div className="font-medium text-gray-800">
                  ₹{doctor.consultationFee || doctor.DoctorProfile?.consultationFee || 0}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0">
            <button
              className="px-6 py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              onClick={() => setShowModal(true)}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Appointment
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Book Appointment</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleBook} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full rounded-lg border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief reason for appointment"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default function DoctorList({ doctors, onBook }) {
  return (
    <div className="space-y-0">
      {doctors.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-gray-500 text-lg font-medium">No doctors available</div>
          <div className="text-gray-400 text-sm mt-2">Try adjusting your filters to see more results.</div>
        </div>
      ) : (
        doctors.map((doc) => <DoctorCard key={doc.id || doc.userId} doctor={doc} onBook={onBook} />)
      )}
    </div>
  )
}
