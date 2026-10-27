import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../constants/theme';

const THEME_KEY = '@theme';
const ThemeContext = createContext(null);

export function ThemeContextProvider({ children }) {
  const systemScheme = useColorScheme();
  const [override, setOverride] = useState(null); // null = segue o sistema

  useEffect(() => {
    async function load() {
      try {
        const saved = await AsyncStorage.getItem(THEME_KEY);
        if (saved === 'light' || saved === 'dark') setOverride(saved);
      } catch (error) {
        console.warn('Erro ao carregar tema:', error);
      }
    }
    load();
  }, []);

  const scheme = override ?? systemScheme ?? 'light';

  async function toggleTheme() {
    const next = scheme === 'dark' ? 'light' : 'dark';
    setOverride(next);
    try {
      await AsyncStorage.setItem(THEME_KEY, next);
    } catch (error) {
      console.warn('Erro ao salvar tema:', error);
    }
  }

  return (
    <ThemeContext.Provider value={{ scheme, colors: getTheme(scheme), toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de um ThemeContextProvider');
  }
  return context;
}