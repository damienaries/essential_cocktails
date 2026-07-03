import {
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	setDoc,
	type Timestamp,
} from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'
import type { SavedDrink } from '../types/user'

// Saved drinks live at `users/{uid}/saved/{drinkId}` — the document id IS the
// drinkId. That makes saving/unsaving a direct write/delete by id, with no
// duplicate checks or lookup queries.
function savedCollection(uid: string) {
	return collection(getFirebaseDb(), 'users', uid, 'saved')
}
function savedDocRef(uid: string, drinkId: string) {
	return doc(getFirebaseDb(), 'users', uid, 'saved', drinkId)
}

/** A user's saved drinks, most recently saved first. */
export async function fetchSavedDrinks(uid: string): Promise<SavedDrink[]> {
	const snap = await getDocs(
		query(savedCollection(uid), orderBy('savedAt', 'desc')),
	)
	return snap.docs.map((d) => ({
		drinkId: d.id,
		// `savedAt` is briefly null right after a write (the server timestamp
		// hasn't resolved yet); fall back to "now" so ordering stays stable.
		savedAt: (d.data().savedAt as Timestamp | null)?.toMillis() ?? Date.now(),
	}))
}

/** Save a drink. Idempotent — re-saving just refreshes the timestamp. */
export async function saveDrink(uid: string, drinkId: string): Promise<void> {
	await setDoc(savedDocRef(uid, drinkId), { savedAt: serverTimestamp() })
}

/** Remove a drink from the user's saved list. */
export async function unsaveDrink(uid: string, drinkId: string): Promise<void> {
	await deleteDoc(savedDocRef(uid, drinkId))
}
