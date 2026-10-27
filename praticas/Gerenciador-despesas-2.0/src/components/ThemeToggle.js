import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../store/theme-context';

export default function ThemeToggle() {
  const { scheme, colors, toggleTheme } = useAppTheme();

  return (
    <Pressable onPress={toggleTheme} hitSlop={10} style={{ marginLeft: 16 }}>
      <Ionicons
        name={scheme === 'dark' ? 'sunny-outline' : 'moon-outline'}
        size={24}
        color={colors.primary}
      />
    </Pressable>
  );
}