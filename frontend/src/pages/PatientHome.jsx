import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import DoctorList from '../components/DoctorList'

export default function PatientHome() {
  const specializations = [
    'All Specializations', 'Cardiologist', 'Dermatologist', 'General Physician', 'Pediatrician', 
    'Orthopedic', 'Gynecologist', 'ENT Specialist', 'Psychiatrist', 'Radiologist'
  ];
  
  const cities = [
    'All Cities', 'Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune'
  ];

  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations')
  const [selectedCity, setSelectedCity] = useState('All Cities')

  // Example doctor data with more details
  const allDoctors = [
    { 
      id: 1, 
      name: 'Dr. A Sharma', 
      specialization: 'Cardiologist', 
      exp: 12, 
      qualification: 'MBBS, MD',
      college: 'AIIMS Delhi',
      city: 'Delhi'
    },
    { 
      id: 2, 
      name: 'Dr. B Singh', 
      specialization: 'Dermatologist', 
      exp: 8,
      qualification: 'MBBS, MD',
      college: 'PGI Chandigarh',
      city: 'Delhi'
    },
    { 
      id: 3, 
      name: 'Dr. C Gupta', 
      specialization: 'General Physician', 
      exp: 15,
      qualification: 'MBBS, MD',
      college: 'Safdarjung Hospital',
      city: 'Delhi'
    },
    { 
      id: 4, 
      name: 'Dr. D Verma', 
      specialization: 'Pediatrician', 
      exp: 6,
      qualification: 'MBBS, DCH',
      college: 'Lady Hardinge Medical College',
      city: 'Delhi'
    },
    { 
      id: 5, 
      name: 'Dr. E Patel', 
      specialization: 'Orthopedic', 
      exp: 10,
      qualification: 'MBBS, MS',
      college: 'Maulana Azad Medical College',
      city: 'Delhi'
    },
    { 
      id: 6, 
      name: 'Dr. F Kumar', 
      specialization: 'Cardiologist', 
      exp: 14,
      qualification: 'MBBS, MD, DM',
      college: 'AIIMS Delhi',
      city: 'Mumbai'
    },
    { 
      id: 7, 
      name: 'Dr. G Reddy', 
      specialization: 'Dermatologist', 
      exp: 9,
      qualification: 'MBBS, MD',
      college: 'NIMS Hyderabad',
      city: 'Hyderabad'
    },
  ];

  // Filter doctors based on selected filters
  const filteredDoctors = allDoctors.filter(doc => {
    const matchSpecialization = selectedSpecialization === 'All Specializations' || 
                                doc.specialization === selectedSpecialization;
    const matchCity = selectedCity === 'All Cities' || doc.city === selectedCity;
    return matchSpecialization && matchCity;
  });

  const handleClearFilters = () => {
    setSelectedSpecialization('All Specializations')
    setSelectedCity('All Cities')
  }

  const hasActiveFilters = selectedSpecialization !== 'All Specializations' || selectedCity !== 'All Cities'

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-72 p-8">
        {/* Centered Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Book Appointment</h1>
          <p className="text-gray-600">Find and book appointments with the best doctors</p>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filter Doctors</h2>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Specialization Filter */}
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
                onChange={e => setSelectedSpecialization(e.target.value)} 
                className="w-full rounded-lg border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  City
                </span>
              </label>
              <select 
                value={selectedCity} 
                onChange={e => setSelectedCity(e.target.value)} 
                className="w-full rounded-lg border-gray-300 px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white shadow-sm"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedSpecialization !== 'All Specializations' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedSpecialization}
                    <button
                      onClick={() => setSelectedSpecialization('All Specializations')}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {selectedCity !== 'All Cities' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {selectedCity}
                    <button
                      onClick={() => setSelectedCity('All Cities')}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Doctor List */}
        <DoctorList doctors={filteredDoctors} />
      </main>
    </div>
  )
}
