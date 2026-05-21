/**
 * Phase A: admin identity is just a UID allowlist from env. When the paid tier
 * lands, this gets replaced by a Firebase custom-claims check
 * (`user.getIdTokenResult().claims.role === 'admin'`). The function name stays
 * the same so callers don't need to change.
 */

const ADMIN_UIDS: ReadonlySet<string> = new Set(
	(import.meta.env.VITE_ADMIN_UIDS ?? '')
		.toString()
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean),
)

export function isAdminUid(uid: string | null | undefined): boolean {
	if (!uid) return false
	return ADMIN_UIDS.has(uid)
}
