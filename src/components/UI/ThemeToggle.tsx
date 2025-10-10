import React from 'react';
import { useTheme } from '../../hooks/useTheme';
export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return <button onClick={toggle}>Theme: {theme}</button>;
}
