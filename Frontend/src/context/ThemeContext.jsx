import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);

  const saveTheme = useCallback((value) => {
    localStorage.setItem('darkMode', value);
  }, []);

  const revertTheme = useCallback(() => {
    const saved = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(saved);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      setIsDarkMode, 
      toggleDarkMode, 
      saveTheme, 
      revertTheme 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
