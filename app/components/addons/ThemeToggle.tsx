'use client';

import {useEffect, useState} from 'react';

import {ButtonToggle} from '~/components/buttons';

type ThemeToggleProps = {
  variant: 'minimal' | 'toggle';
  classes?: string;
};

export default function ThemeToggle({
  variant = 'toggle',
  classes,
}: ThemeToggleProps) {
  const [theme, setTheme] = useState('dark');
  const [toggleState, setToggleState] = useState<'on' | 'off'>('off');

  const handleThemeChange = (newTheme: string) => {
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    handleToggle(newTheme === 'dark' ? 'off' : 'on');
    const documentDiv = document.querySelector('html');
    documentDiv?.setAttribute('data-theme', newTheme);
  };

  const handleToggle = (state: 'on' | 'off') => {
    setToggleState(state);
  };

  // Get theme from session storage on load
  useEffect(() => {
    // Check for saved user preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      handleThemeChange(storedTheme);
      return;
    }

    // If no stored preference, fall back to system preference
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;
    handleThemeChange(prefersDark ? 'dark' : 'light');
  }, []);

  return (
    variant === 'toggle' && (
      <ButtonToggle
        toggleState={toggleState}
        onClick={() => handleThemeChange(theme === 'light' ? 'dark' : 'light')}
        aria-label="Click to toggle theme between light and dark"
        classes={classes}
      />
    )
  );
}
