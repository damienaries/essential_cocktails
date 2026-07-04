import { FirebaseError } from 'firebase/app'

// Firebase auth error codes → user-facing copy. Sign-in failures (wrong
// password / no such user / bad credential) are deliberately collapsed into one
// vague message so we don't reveal whether an email is registered.
const FRIENDLY: Record<string, string> = {
	'auth/email-already-in-use': 'An account with this email already exists.',
	'auth/invalid-email': 'That email address looks invalid.',
	'auth/weak-password': 'Password should be at least 6 characters.',
	'auth/missing-password': 'Please enter a password.',
	'auth/invalid-credential': 'Incorrect email or password.',
	'auth/wrong-password': 'Incorrect email or password.',
	'auth/user-not-found': 'Incorrect email or password.',
	'auth/user-disabled': 'This account has been disabled.',
	'auth/too-many-requests':
		'Too many attempts — please try again in a little while.',
	'auth/network-request-failed':
		'Network error. Check your connection and try again.',
}

/** Map any thrown auth error to a friendly message, with a safe fallback. */
export function friendlyAuthError(
	err: unknown,
	fallback = 'Something went wrong. Please try again.',
): string {
	if (err instanceof FirebaseError) return FRIENDLY[err.code] ?? fallback
	return err instanceof Error ? err.message : fallback
}
