const API_BASE_URL = 'http://localhost:5000/api';

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const userService = {
  async getProfile() {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const json = await res.json();
    return json.data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const json = await res.json();
    return json.data;
  },

  async getSettings() {
    const res = await fetch(`${API_BASE_URL}/user/settings`, {
      headers: authHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch settings');
    const json = await res.json();
    return json.data;
  },

  async updateSettings(settingsData) {
    const res = await fetch(`${API_BASE_URL}/user/settings`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(settingsData),
    });
    if (!res.ok) throw new Error('Failed to update settings');
    const json = await res.json();
    return json.data;
  },
};