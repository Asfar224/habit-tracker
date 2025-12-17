// API Service Layer - Handles all HTTP requests to backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  signup: async (email, password, name) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: { email, password, name },
    });
  },

  login: async (email, password) => {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Habits API
export const habitsAPI = {
  getAll: async (userId) => {
    return apiCall(`/habits?userId=${userId}`, {
      method: 'GET',
    });
  },

  getById: async (habitId) => {
    return apiCall(`/habits/${habitId}`, {
      method: 'GET',
    });
  },

  create: async (habitData) => {
    return apiCall('/habits', {
      method: 'POST',
      body: habitData,
    });
  },

  update: async (habitId, habitData) => {
    return apiCall(`/habits/${habitId}`, {
      method: 'PUT',
      body: habitData,
    });
  },

  delete: async (habitId) => {
    return apiCall(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  },
};

// Habit Completions API
export const completionsAPI = {
  getAll: async (userId) => {
    return apiCall(`/completions?userId=${userId}`, {
      method: 'GET',
    });
  },

  getByHabit: async (habitId, userId) => {
    return apiCall(`/completions?habitId=${habitId}&userId=${userId}`, {
      method: 'GET',
    });
  },

  markComplete: async (habitId, date) => {
    return apiCall('/completions', {
      method: 'POST',
      body: { habitId, date },
    });
  },

  unmarkComplete: async (completionId) => {
    return apiCall(`/completions/${completionId}`, {
      method: 'DELETE',
    });
  },
};

export default {
  auth: authAPI,
  habits: habitsAPI,
  completions: completionsAPI,
};

