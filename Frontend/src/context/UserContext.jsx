import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setUser(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(profileData);
      setUser(updatedUser); // langsung update state global
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
const uploadPhoto = async (file) => {
  try {
    const photoUrl = await userService.uploadPhoto(file);
    setUser(prev => ({ ...prev, photoUrl }));
    return photoUrl;
  } catch (err) {
    setError(err.message);
    throw err;
  }
};
  const clearUser = () => setUser(null);

  return (
    <UserContext.Provider value={{ user, loading, error, fetchUser, updateProfile, uploadPhoto, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUserContext must be used inside UserProvider');
  return ctx;
};