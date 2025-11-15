import React from 'react'

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-72 bg-sky-800 text-white flex flex-col py-8 px-6 min-h-screen z-10 shadow-lg">
      <div className="flex flex-col items-center mb-8">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="font-semibold text-lg text-center">Patient Name</div>
        <div className="text-sm text-sky-200 mt-1">patient@email.com</div>
      </div>
      <nav className="flex flex-col gap-2 flex-1">
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-700 transition-colors text-left">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="font-medium">Profile</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-700 transition-colors text-left">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">Appointment History</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sky-700 transition-colors text-left">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span className="font-medium">Health Track</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors text-left mt-auto">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="font-medium">Logout</span>
        </button>
      </nav>
    </aside>
  )
}
