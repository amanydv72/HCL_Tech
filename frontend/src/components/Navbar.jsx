import React from 'react'

export default function Navbar({ route, setRoute }){
  return (
    <header className="bg-sky-700 text-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setRoute('home')}>
          <div className="bg-white/20 rounded-full w-10 h-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8m-4-4h8" />
            </svg>
          </div>
          <h1 className="text-lg font-semibold ml-4 pl-2">IIITD Healthcare</h1>
        </div>

        <nav className="flex items-center space-x-2">
          <button onClick={() => setRoute('home')} className={`px-3 py-1 rounded ${route === 'home' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Home</button>
          <button onClick={() => setRoute('public')} className={`px-3 py-1 rounded ${route === 'public' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Public Health</button>
          <button onClick={() => setRoute('general')} className={`px-3 py-1 rounded ${route === 'general' ? 'bg-white/20' : 'hover:bg-white/10'}`}>General</button>
          <button onClick={() => setRoute('register')} className={`px-3 py-1 rounded ${route === 'register' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Registration</button>
          <button onClick={() => setRoute('login')} className={`px-3 py-1 rounded ${route === 'login' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Login</button>
          <button onClick={() => setRoute('doctors')} className={`px-3 py-1 rounded ${route === 'doctors' ? 'bg-white/20' : 'hover:bg-white/10'}`}>Doctor List</button>
        </nav>
      </div>
    </header>
  )
}
