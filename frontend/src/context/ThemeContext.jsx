import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../services/api';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('glassmorphic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        if (settings?.theme) {
          setTheme(settings.theme);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    // Remove old themes
    document.body.classList.remove('theme-normal', 'theme-dark', 'theme-vintage', 'theme-glassmorphic');
    
    // Add new theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Optional: map normal to light mode specifically, or let Tailwind default to base
    if (theme === 'normal') document.body.classList.add('theme-normal');

  }, [theme]);

  const changeTheme = async (newTheme) => {
    setTheme(newTheme);
    try {
      await updateSettings({ theme: newTheme });
    } catch (e) {
      console.error('Failed to save theme setting', e);
    }
  };

  if (loading) return null; // Or a stealthy loader

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
