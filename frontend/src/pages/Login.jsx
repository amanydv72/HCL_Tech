import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function LoginForm({ fields, onSubmit, title, submitText, loading }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-4">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">{title}</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const data = Object.fromEntries(new FormData(e.target).entries())
          onSubmit(data)
        }}
      >
        <div className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {f.label}
              </label>
              <input
                name={f.name}
                type={f.type || 'text'}
                required={!!f.required}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 px-4 py-2.5 transition-colors"
                disabled={loading}
              />
            </div>
          ))}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </>
              ) : (
                submitText
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function Login({ onLoginSuccess }) {
  const [tab, setTab] = useState('patient')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const toast = useToast()

  const handleLogin = (role) => async (data) => {
    setLoading(true)
    try {
      // Admin uses email field but might be username in UI
      const email = data.email || data.username
      const result = await login(email, data.password)
      
      console.log('Login result:', result) // Debug log
      
      toast.success(`Welcome back! Redirecting...`)
      
      // Use the actual role from the response, not the tab role
      const actualRole = result.role || role
      
      if (onLoginSuccess) {
        // Small delay to ensure state is updated
        setTimeout(() => {
          onLoginSuccess(actualRole)
        }, 300)
      }
    } catch (error) {
      console.error('Login error:', error) // Debug log
      toast.error(error.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="flex space-x-2 mb-4 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setTab('patient')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            tab === 'patient'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Patient
        </button>
        <button
          onClick={() => setTab('doctor')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            tab === 'doctor'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Doctor
        </button>
        <button
          onClick={() => setTab('admin')}
          className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
            tab === 'admin'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Admin
        </button>
      </div>

      {tab === 'patient' && (
        <LoginForm
          title="Patient Login"
          submitText="Login as Patient"
          onSubmit={handleLogin('patient')}
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]}
          loading={loading}
        />
      )}
      {tab === 'doctor' && (
        <LoginForm
          title="Doctor Login"
          submitText="Login as Doctor"
          onSubmit={handleLogin('doctor')}
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]}
          loading={loading}
        />
      )}
      {tab === 'admin' && (
        <LoginForm
          title="Admin Login"
          submitText="Login as Admin"
          onSubmit={handleLogin('admin')}
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Password', type: 'password', required: true },
          ]}
          loading={loading}
        />
      )}
    </div>
  )
}
