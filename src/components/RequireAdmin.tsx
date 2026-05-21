import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthUser } from '../hooks/useAuthUser'

export function RequireAdmin({ children }: { children: ReactNode }) {
	const { user, isPending, isAdmin } = useAuthUser()
	const { pathname } = useLocation()

	if (isPending) return <p className="text-center">Checking access…</p>

	if (!user) {
		const next = encodeURIComponent(pathname)
		return <Navigate to={`/signin?next=${next}`} replace />
	}

	if (!isAdmin) return <Navigate to="/" replace />

	return <>{children}</>
}
