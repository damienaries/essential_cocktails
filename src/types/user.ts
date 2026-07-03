/**
 * Per-user data (Phase B). Firestore layout:
 *   users/{uid}/saved/{drinkId}   — one doc per saved drink (doc id === drinkId)
 *   users/{uid}/menus/{menuId}    — one custom menu (auto-generated id)
 *
 * Both reference drinks by id only; full drink data is joined from the cached
 * drinks query, so nothing is duplicated and drink edits propagate for free.
 */

/** A drink the user has saved. The Firestore document id is the drinkId. */
export type SavedDrink = {
	/** References drinks/{id}; equals the Firestore document id. */
	drinkId: string
	/** ms epoch — Firestore Timestamp.toMillis() applied at the API boundary. */
	savedAt: number
}

/** A user-curated menu built from existing drinks. */
export type CustomMenu = {
	id: string
	name: string
	/** Ordered references to drinks/{id}. */
	drinkIds: string[]
	createdAt: number
	updatedAt: number
}
