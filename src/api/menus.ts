import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
	type DocumentData,
	type Timestamp,
} from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'
import type { CustomMenu } from '../types/user'

// Menus live at `users/{uid}/menus/{menuId}` with auto-generated ids. Each doc
// holds an ordered `drinkIds` array referencing the public drinks library.
function menusCollection(uid: string) {
	return collection(getFirebaseDb(), 'users', uid, 'menus')
}
function menuDocRef(uid: string, menuId: string) {
	return doc(getFirebaseDb(), 'users', uid, 'menus', menuId)
}

/** Firestore Timestamp → ms epoch, tolerant of the pending-write null. */
function toMillis(ts: unknown): number {
	return (ts as Timestamp | null)?.toMillis?.() ?? Date.now()
}

/** Shape a raw Firestore doc into the app's CustomMenu type. */
function mapMenu(id: string, data: DocumentData): CustomMenu {
	return {
		id,
		name: (data.name as string) ?? '',
		drinkIds: (data.drinkIds as string[]) ?? [],
		createdAt: toMillis(data.createdAt),
		updatedAt: toMillis(data.updatedAt),
	}
}

/** All of a user's menus, most recently updated first. */
export async function fetchMenus(uid: string): Promise<CustomMenu[]> {
	const snap = await getDocs(
		query(menusCollection(uid), orderBy('updatedAt', 'desc')),
	)
	return snap.docs.map((d) => mapMenu(d.id, d.data()))
}

/** A single menu, or null if it doesn't exist. */
export async function fetchMenu(
	uid: string,
	menuId: string,
): Promise<CustomMenu | null> {
	const snap = await getDoc(menuDocRef(uid, menuId))
	return snap.exists() ? mapMenu(snap.id, snap.data()) : null
}

/** Create a menu (optionally pre-populated) and return its new id. */
export async function createMenu(
	uid: string,
	name: string,
	drinkIds: string[] = [],
): Promise<string> {
	const ref = await addDoc(menusCollection(uid), {
		name: name.trim(),
		drinkIds,
		createdAt: serverTimestamp(),
		updatedAt: serverTimestamp(),
	})
	return ref.id
}

/** Fields a caller may change on a menu. */
export type MenuPatch = Partial<Pick<CustomMenu, 'name' | 'drinkIds'>>

/** Update a menu's name and/or drinks; always bumps `updatedAt`. */
export async function updateMenu(
	uid: string,
	menuId: string,
	patch: MenuPatch,
): Promise<void> {
	const data: Record<string, unknown> = { updatedAt: serverTimestamp() }
	if (patch.name !== undefined) data.name = patch.name.trim()
	if (patch.drinkIds !== undefined) data.drinkIds = patch.drinkIds
	await updateDoc(menuDocRef(uid, menuId), data)
}

/** Delete a menu. */
export async function deleteMenu(uid: string, menuId: string): Promise<void> {
	await deleteDoc(menuDocRef(uid, menuId))
}
