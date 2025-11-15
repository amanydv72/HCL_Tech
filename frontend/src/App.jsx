import React, { useState, useEffect } from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Public from './pages/Public'
import Doctors from './pages/Doctors'
import Navbar from './components/Navbar'
import PatientHome from './pages/PatientHome'
import PatientAppointments from './pages/PatientAppointments'
import PatientHistory from './pages/PatientHistory'
import PatientProfile from './pages/PatientProfile'
import DoctorDashboard from './pages/DoctorDashboard'
import { useAuth } from './context/AuthContext'

export default function App() {
  const [route, setRoute] = useState('home')
  const { isAuthenticated, isPatient, isDoctor, loading, user } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (isPatient && route !== 'patientHome' && route !== 'patientAppointments' && route !== 'patientHistory' && route !== 'patientProfile') {
          setRoute('patientHome')
        } else if (isDoctor && route !== 'doctorDashboard') {
          setRoute('doctorDashboard')
        } else if (isAuthenticated && route === 'login') {
          // If just logged in and still on login page, redirect
          if (isPatient) {
            setRoute('patientHome')
          } else if (isDoctor) {
            setRoute('doctorDashboard')
          }
        }
      } else if (!isAuthenticated && route !== 'home' && route !== 'login' && route !== 'register') {
        setRoute('home')
      }
    }
  }, [isAuthenticated, isPatient, isDoctor, loading, route])

  const handleLoginSuccess = (role) => {
    console.log('handleLoginSuccess called with role:', role) // Debug log
    console.log('Current auth state:', { isAuthenticated, isPatient, isDoctor, user }) // Debug log
    
    // Force route change immediately
    if (role === 'patient' || role === 'Patient') {
      setRoute('patientHome')
    } else if (role === 'doctor' || role === 'Doctor') {
      setRoute('doctorDashboard')
    } else if (role === 'admin' || role === 'Admin') {
      setRoute('home') // Admin dashboard can be added later
    } else {
      // Fallback: check auth context
      if (isPatient) {
        setRoute('patientHome')
      } else if (isDoctor) {
        setRoute('doctorDashboard')
      } else {
        setRoute('home')
      }
    }
  }

  const handleRegisterSuccess = (role) => {
    console.log('handleRegisterSuccess called with role:', role) // Debug log
    console.log('Current auth state:', { isAuthenticated, isPatient, isDoctor, user }) // Debug log
    
    // Force route change immediately after registration
    if (role === 'patient' || role === 'Patient') {
      setRoute('patientHome')
    } else if (role === 'doctor' || role === 'Doctor') {
      setRoute('doctorDashboard')
    } else {
      // Fallback: check auth context
      if (isPatient) {
        setRoute('patientHome')
      } else if (isDoctor) {
        setRoute('doctorDashboard')
      } else {
        setRoute('home')
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <svg className="animate-spin h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar route={route} setRoute={setRoute} />

      <main className={route === 'patientHome' || route === 'patientAppointments' || route === 'patientHistory' || route === 'patientProfile' || route === 'doctorDashboard' ? '' : 'max-w-3xl mx-auto p-6'}>
        {route === 'home' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome to IIITD Healthcare</h1>
            <p className="text-gray-600 mb-4">Choose Registration or Login to continue.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setRoute('register')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Register
              </button>
              <button
                onClick={() => setRoute('login')}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Login
              </button>
            </div>
          </div>
        )}

        {route === 'public' && <Public />}
        {route === 'doctors' && <Doctors />}

        {route === 'register' && <Register onRegisterSuccess={handleRegisterSuccess} />}
        {route === 'login' && <Login onLoginSuccess={handleLoginSuccess} />}

        {/* Patient Routes */}
        {route === 'patientHome' && <PatientHome currentRoute={route} onNavigate={setRoute} />}
        {route === 'patientAppointments' && <PatientAppointments currentRoute={route} onNavigate={setRoute} />}
        {route === 'patientHistory' && <PatientHistory currentRoute={route} onNavigate={setRoute} />}
        {route === 'patientProfile' && <PatientProfile currentRoute={route} onNavigate={setRoute} />}

        {/* Doctor Routes */}
        {route === 'doctorDashboard' && <DoctorDashboard currentRoute={route} onNavigate={setRoute} />}
      </main>
    </div>
  )
}