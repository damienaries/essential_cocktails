import { useEffect, useState } from 'react'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'
import { isAdminUid } from '../lib/adminRoles'

export type AuthState = {
	user: User | null
	isPending: boolean
	isAdmin: boolean
}

export function useAuthUser(): AuthState {
	const [user, setUser] = useState<User | null>(() => getFirebaseAuth().currentUser)
	const [isPending, setIsPending] = useState(() => user == null)

	useEffect(() => {
		const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
			setUser(u)
			setIsPending(false)
		})
		return unsub
	}, [])

	return { user, isPending, isAdmin: isAdminUid(user?.uid) }
}
