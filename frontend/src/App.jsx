import React, {useState} from 'react'
import Register from './pages/Register'
import Login from './pages/Login'

export default function App(){
  const [route, setRoute] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">IIITD Healthcare</h1>
          <nav className="space-x-2">
            <button className="text-blue-600 hover:underline" onClick={()=>setRoute('home')}>Home</button>
            <button className="text-blue-600 hover:underline" onClick={()=>setRoute('register')}>Registration</button>
            <button className="text-blue-600 hover:underline" onClick={()=>setRoute('login')}>Login</button>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6">
        {route === 'home' && (
          <div className="bg-white rounded shadow p-6">
            <p>Choose Registration or Login to continue.</p>
          </div>
        )}

        {route === 'register' && <Register />}
        {route === 'login' && <Login />}

        <div className="mt-4 text-sm text-gray-500">Static demo — submissions are logged to the console.</div>
      </main>
    </div>
  )
}
