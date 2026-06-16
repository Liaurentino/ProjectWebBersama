const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  const json = await res.json();
  return json.data;
};

export const userService = {
  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/user/profile`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(profileData),
    });
    return handleResponse(res);
  },

  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);
    const res = await fetch(`${API_BASE_URL}/user/profile/photo`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData,
    });
    return handleResponse(res);
  },

  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/user/settings`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE_URL}/user/settings`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settingsData),
    });
    return handleResponse(res);
  },

  async getDashboard() {
    const res = await fetch(`${API_BASE_URL}/dashboard`, { headers: authHeaders() });
    return handleResponse(res);
  },

  async getStatistics() {
    const res = await fetch(`${API_BASE_URL}/statistics`, { headers: authHeaders() });
    return handleResponse(res);
  },
};