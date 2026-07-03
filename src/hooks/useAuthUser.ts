import {
	createContext,
	createElement,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'
import { isAdminUid } from '../lib/adminRoles'

export type AuthState = {
	user: User | null
	isPending: boolean
	isAdmin: boolean
	/** Re-read the current user after an in-place profile change (see below). */
	refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

/**
 * Single source of auth truth for the app. One `onAuthStateChanged` listener
 * feeds every consumer via context, instead of each component opening its own.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(
		() => getFirebaseAuth().currentUser,
	)
	const [isPending, setIsPending] = useState(() => user == null)
	// Bumped by refreshUser so a mutated-in-place User still re-renders consumers.
	const [tick, setTick] = useState(0)

	useEffect(() => {
		const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
			setUser(u)
			setIsPending(false)
		})
		return unsub
	}, [])

	const refreshUser = useCallback(async () => {
		// `updateProfile`/`reload` mutate the current User object in place but do
		// NOT fire onAuthStateChanged. Reload from the server, then bump `tick` so
		// the memoised context value changes and consumers read the fresh fields.
		await getFirebaseAuth().currentUser?.reload()
		setUser(getFirebaseAuth().currentUser)
		setTick((n) => n + 1)
	}, [])

	const value = useMemo<AuthState>(
		() => ({ user, isPending, isAdmin: isAdminUid(user?.uid), refreshUser }),
		[user, isPending, refreshUser, tick],
	)

	return createElement(AuthContext.Provider, { value }, children)
}

export function useAuthUser(): AuthState {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuthUser must be used within an AuthProvider')
	return ctx
}
