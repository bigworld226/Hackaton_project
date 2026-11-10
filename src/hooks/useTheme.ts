import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<ThemeMode, 'system'>

const STORAGE_KEY = 'common-theme'
const DARK_MODE_QUERY = '(prefers-color-scheme: dark)'

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system'

  const storedTheme = window.localStorage.getItem(STORAGE_KEY)
  return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'system'
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia(DARK_MODE_QUERY).matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getStoredTheme)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)
  const resolvedTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    const mediaQuery = window.matchMedia(DARK_MODE_QUERY)
    const updateSystemTheme = (event: MediaQueryListEvent) => {
      setSystemTheme(event.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', updateSystemTheme)
    return () => mediaQuery.removeEventListener('change', updateSystemTheme)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', resolvedTheme === 'dark')
    root.dataset.theme = resolvedTheme
    root.style.colorScheme = resolvedTheme
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme, resolvedTheme])

  return { theme, resolvedTheme, setTheme }
}
