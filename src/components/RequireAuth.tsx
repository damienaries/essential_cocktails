import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthUser } from '../hooks/useAuthUser'

// Gate for any signed-in user (unlike RequireAdmin, no role check). Redirects
// to sign-in with a `next` param so the user returns here after logging in.
export function RequireAuth({ children }: { children: ReactNode }) {
	const { user, isPending } = useAuthUser()
	const { pathname } = useLocation()

	if (isPending) return <p className="text-center">Checking access…</p>

	if (!user) {
		const next = encodeURIComponent(pathname)
		return <Navigate to={`/signin?next=${next}`} replace />
	}

	return <>{children}</>
}
