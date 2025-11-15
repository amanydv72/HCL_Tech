// API Service Layer
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.41.106:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const url = `${this.baseURL}${endpoint}`;

    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Log response for debugging
      if (endpoint.includes('/auth/login')) {
        console.log('Login API Response:', data);
      }

      if (!response.ok) {
        const errorMessage = data.message || data.error || data.msg || 'An error occurred';
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      if (error.message) {
        throw error;
      }
      throw new Error('Network error. Please check your connection.');
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: 'GET' });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Auth API
export const authAPI = {
  register: (data) => {
    const api = new ApiService();
    return api.post('/auth/register', data);
  },

  login: (email, password) => {
    const api = new ApiService();
    return api.post('/auth/login', { email, password });
  },

  getProfile: () => {
    const api = new ApiService();
    return api.get('/auth/profile');
  },
};

// Patient API
export const patientAPI = {
  getProfile: () => {
    const api = new ApiService();
    return api.get('/patient/profile');
  },

  updateProfile: (data) => {
    const api = new ApiService();
    return api.put('/patient/profile', data);
  },

  getStats: () => {
    const api = new ApiService();
    return api.get('/patient/stats');
  },

  getDoctors: (params = {}) => {
    const api = new ApiService();
    return api.get('/patient/doctors', params);
  },

  getDoctorDetails: (id) => {
    const api = new ApiService();
    return api.get(`/patient/doctors/${id}`);
  },

  bookAppointment: (data) => {
    const api = new ApiService();
    return api.post('/patient/appointments', data);
  },

  getAppointments: (params = {}) => {
    const api = new ApiService();
    return api.get('/patient/appointments', params);
  },

  getAppointmentDetails: (id) => {
    const api = new ApiService();
    return api.get(`/patient/appointments/${id}`);
  },

  cancelAppointment: (id) => {
    const api = new ApiService();
    return api.put(`/patient/appointments/${id}/cancel`);
  },

  getAppointmentHistory: (params = {}) => {
    const api = new ApiService();
    return api.get('/patient/appointment-history', params);
  },
};

// Doctor API
export const doctorAPI = {
  getProfile: () => {
    const api = new ApiService();
    return api.get('/doctor/profile');
  },

  updateProfile: (data) => {
    const api = new ApiService();
    return api.put('/doctor/profile', data);
  },

  updateAvailability: (data) => {
    const api = new ApiService();
    return api.put('/doctor/availability', data);
  },

  getStats: () => {
    const api = new ApiService();
    return api.get('/doctor/stats');
  },

  getAppointments: (params = {}) => {
    const api = new ApiService();
    return api.get('/doctor/appointments', params);
  },

  getAppointmentDetails: (id) => {
    const api = new ApiService();
    return api.get(`/doctor/appointments/${id}`);
  },

  approveAppointment: (id) => {
    const api = new ApiService();
    return api.put(`/doctor/appointments/${id}/approve`);
  },

  cancelAppointment: (id, notes) => {
    const api = new ApiService();
    return api.put(`/doctor/appointments/${id}/cancel`, { notes });
  },

  completeAppointment: (id, notes) => {
    const api = new ApiService();
    return api.put(`/doctor/appointments/${id}/complete`, { notes });
  },

  addNotes: (id, notes) => {
    const api = new ApiService();
    return api.put(`/doctor/appointments/${id}/notes`, { notes });
  },

  getPatients: (params = {}) => {
    const api = new ApiService();
    return api.get('/doctor/patients', params);
  },
};

export default new ApiService();

