import React, {useState} from 'react'
import Register from './pages/Register'
import Login from './pages/Login'
import Public from './pages/Public'
import Doctors from './pages/Doctors'
import Navbar from './components/Navbar'
import PatientHome from './pages/PatientHome'


export default function App(){
  // const [route, setRoute] = useState('home')
  const [route, setRoute] = useState('patientHome')
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar route={route} setRoute={setRoute} />

      <main className={route === 'patientHome' ? '' : 'max-w-3xl mx-auto p-6'}>
        {route === 'home' && (
          <div className="bg-white rounded shadow p-6">
            <p>Choose Registration or Login to continue.</p>
          </div>
        )}

      
      {route === 'public' && (
        <Public />
      )}


      {route === 'doctors' && (
        <Doctors />
      )}

        {route === 'doctors' && (
          <div className="bg-white rounded shadow p-6">
            <h2 className="text-lg font-semibold mb-2">Doctor List</h2>
            <p className="text-sm text-gray-700">A list of doctors will be shown here in a full app.</p>
          </div>
        )}

        {route === 'register' && <Register />}
        {route === 'login' && (
          <Login onPatientLogin={() => setRoute('patientHome')} />
        )}
        {route === 'patientHome' && <PatientHome />}
      </main>
    </div>
  )
}



