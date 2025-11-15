import React, {useState} from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Public from './pages/Public'
import Doctors from './pages/Doctors'
import Navbar from './components/Navbar'

export default function App(){
  const [route, setRoute] = useState('home')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar route={route} setRoute={setRoute} />

      <main className="max-w-3xl mx-auto p-6">
        {route === 'home' && (
          <div className="bg-white rounded shadow p-6">
            <p>Choose Registration or Login to continue.</p>
          </div>
        )}

        {route === 'public' && (
          <Public />
        )}

        {route === 'general' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-2">General</h2>
            <p className="text-sm text-gray-700">General information and FAQs.</p>
          </div>
        )}

        {route === 'doctors' && (
          <Doctors />
        )}

        {route === 'register' && <Register />}
        {route === 'login' && <Login />}
      </main>
    </div>
  )
}