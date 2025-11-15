import React from 'react'

export default function Navbar({ route, setRoute }){
  return (
    <header className="bg-sky-700 text-white shadow relative">
     
      <div className="absolute left-0 inset-y-0 flex items-center pl-3 sm:pl-6 cursor-pointer" onClick={() => setRoute('home')}>
        <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
          </svg>
        </div>
        <h1 className="text-lg font-semibold ml-3">IIITD Healthcare</h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-end">
     
        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-2 text-sm text-white/90 mr-4">
            <button onClick={() => setRoute('public')} className={`px-3 py-1 rounded ${route === 'public' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Public</button>
            <button onClick={() => setRoute('general')} className={`px-3 py-1 rounded ${route === 'general' ? 'bg-white/20' : 'hover:bg-white/10'}`}>General</button>
            <button onClick={() => setRoute('doctors')} className={`px-3 py-1 rounded ${route === 'doctors' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Doctors</button>
          </nav>

          <button
            onClick={() => setRoute('register')}
            className={`hidden sm:inline-flex items-center px-4 py-2 rounded-full bg-white text-sky-700 font-medium shadow-md hover:shadow-lg`}
          >
            Register
          </button>

          <button
            onClick={() => setRoute('login')}
            className={`ml-2 inline-flex items-center px-4 py-2 rounded-full bg-transparent border border-white/30 text-white hover:bg-white/10`}
          >
            Login
          </button>
        </div>
      </div>
    </header>
  )
}
