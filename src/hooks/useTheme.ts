import {
	createContext,
	createElement,
	useCallback,
	useContext,
	useState,
	type ReactNode,
} from 'react'

export type Theme = 'light' | 'dark'

type ThemeContextValue = {
	theme: Theme
	setTheme: (next: Theme) => void
	toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function readInitialTheme(): Theme {
	if (typeof window === 'undefined') return 'dark'
	const stored = window.localStorage.getItem('theme')
	return stored === 'light' ? 'light' : 'dark'
}

function applyTheme(next: Theme) {
	document.documentElement.classList.toggle('dark', next === 'dark')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setThemeState] = useState<Theme>(readInitialTheme)

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next)
		try {
			window.localStorage.setItem('theme', next)
		} catch {}
		applyTheme(next)
	}, [])

	const toggle = useCallback(() => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}, [theme, setTheme])

	return createElement(
		ThemeContext.Provider,
		{ value: { theme, setTheme, toggle } },
		children,
	)
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext)
	if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
	return ctx
}
