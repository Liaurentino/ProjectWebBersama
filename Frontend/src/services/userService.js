/**
 * User Service
 * Centralized place for all user-related API calls.
 * Switch mock data to actual fetch calls when the backend is ready.
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Mock data
const MOCK_USER = {
  id: 'dummy-user-id',
  name: 'Andhika Pratama',
  username: 'andhika',
  email: 'andhika.pratama@univ.ac.id',
  bio: 'Be Yourself and never lauma',
  jurusan: 'Informatics Engineering',
  semester: 5,
  interests: 'Software Development',
  photoUrl: "https://www.figma.com/api/mcp/asset/1f26d65b-90c0-4d50-b219-80350290b7e9",
  stats: {
    streak: 12,
    tasksCompleted: 45,
    focusHours: 86
  }
};

export const userService = {
  /**
   * Fetch current user profile
   */
  async getProfile() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Switch to this when BE is ready:
    /*
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'x-user-id': localStorage.getItem('userId')
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return await response.json();
    */
    
    return MOCK_USER;
  },

  /**
   * Update user profile
   */
  async updateProfile(profileData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('API Call: PATCH /users/profile', profileData);

    // Switch to this when BE is ready:
    /*
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(profileData)
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return await response.json();
    */

    return { ...MOCK_USER, ...profileData };
  }
};
