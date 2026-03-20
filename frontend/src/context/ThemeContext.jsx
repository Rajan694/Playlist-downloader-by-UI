import { createContext, useContext, useEffect, useState } from 'react';
import { getSettings, updateSettings } from '../services/api';
import { themeConfigs } from '../theme/themeConfigs';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
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
    // Remove all classes
    document.body.className = '';

    // Add new theme classes
    const currentConfig = themeConfigs[theme] || themeConfigs.dark;
    document.body.className = `${currentConfig.appBackground} antialiased`;
    document.body.style.fontFamily = "'Inter', system-ui, sans-serif";
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
    <ThemeContext.Provider value={{ theme, changeTheme, themeConfig: themeConfigs[theme] || themeConfigs.dark }}>
      {children}
    </ThemeContext.Provider>
  );
};
