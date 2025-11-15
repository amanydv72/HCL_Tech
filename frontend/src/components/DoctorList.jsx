import React, { useState } from 'react'

function DoctorCard({ doctor, onBook }) {
  const [booked, setBooked] = useState(false)
  const handleBook = () => {
    setBooked(true)
    onBook(doctor)
  }
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 mb-4 border border-gray-100">
      <div className="flex items-center gap-6">
        {/* Doctor Icon */}
        <div className="flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center shadow-md">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <div className="text-sm text-gray-500 mb-1">Name</div>
            <div className="font-semibold text-lg text-gray-900">{doctor.name}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Specialization</div>
            <div className="font-medium text-gray-800">{doctor.specialization}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Experience</div>
            <div className="font-medium text-gray-800">{doctor.exp} years</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">Qualification</div>
            <div className="font-medium text-gray-800">{doctor.qualification || 'MBBS, MD'}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">College</div>
            <div className="font-medium text-gray-800">{doctor.college || 'Medical College'}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-500 mb-1">City</div>
            <div className="font-medium text-gray-800">{doctor.city || 'Delhi'}</div>
          </div>
        </div>

        {/* Book Appointment Button */}
        <div className="flex-shrink-0">
          <button
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
              booked 
                ? 'bg-green-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md active:scale-95'
            }`}
            onClick={handleBook}
            disabled={booked}
          >
            {booked ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirmed
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Book Appointment
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DoctorList({ doctors }) {
  const [lastBooked, setLastBooked] = useState(null)
  const handleBook = (doctor) => {
    setLastBooked(doctor)
    setTimeout(() => setLastBooked(null), 3000)
  }
  return (
    <div>
      {lastBooked && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center gap-3 shadow-sm">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="font-semibold">Appointment Confirmed!</div>
            <div className="text-sm">Your appointment with {lastBooked.name} has been booked successfully.</div>
          </div>
        </div>
      )}
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
          doctors.map(doc => (
            <DoctorCard key={doc.id} doctor={doc} onBook={handleBook} />
          ))
        )}
      </div>
    </div>
  )
}
