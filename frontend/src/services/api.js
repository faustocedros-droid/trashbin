import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event API
export const eventAPI = {
  getAll: () => apiClient.get('/events'),
  get: (id) => apiClient.get(`/events/${id}`),
  create: (data) => apiClient.post('/events', data),
  update: (id, data) => apiClient.put(`/events/${id}`, data),
  delete: (id) => apiClient.delete(`/events/${id}`),
  getSessions: (id) => apiClient.get(`/events/${id}/sessions`),
  createSession: (id, data) => apiClient.post(`/events/${id}/sessions`, data),
};

// Session API
export const sessionAPI = {
  get: (id) => apiClient.get(`/sessions/${id}`),
  update: (id, data) => apiClient.put(`/sessions/${id}`, data),
  delete: (id) => apiClient.delete(`/sessions/${id}`),
  getTireData: (id) => apiClient.get(`/sessions/${id}/tires`),
  addTireData: (id, data) => apiClient.post(`/sessions/${id}/tires`, data),
  getLaps: (id) => apiClient.get(`/sessions/${id}/laps`),
  createLap: (id, data) => apiClient.post(`/sessions/${id}/laps`, data),
};

// Lap API
export const lapAPI = {
  get: (id) => apiClient.get(`/laps/${id}`),
  update: (id, data) => apiClient.put(`/laps/${id}`, data),
  delete: (id) => apiClient.delete(`/laps/${id}`),
};

// Archive API
export const archiveAPI = {
  archiveEvent: (eventId) => apiClient.post('/archive', { event_id: eventId }),
};

export default apiClient;
