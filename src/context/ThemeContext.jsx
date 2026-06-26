import React, { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Always force light theme by removing any data-theme attribute
  document.documentElement.removeAttribute('data-theme');
  
  // Dummy values so components don't crash
  const isDarkMode = false;
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
