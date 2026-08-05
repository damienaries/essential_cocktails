import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	serverTimestamp,
	where,
	writeBatch,
	type Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import type { Drink } from '../types/drink';

/**
 * Cache validator for the public library. Reading all ~150 drinks costs one Firestore
 * read per drink, on every cold load; reading this one doc costs one read total and
 * says whether the cached copy is still good. Bumped inside the same batch as every
 * drink write, so it can never report "unchanged" after a change.
 */
const LIBRARY_META_PATH = ['meta', 'library'] as const;

function libraryMetaRef() {
	const [collectionId, docId] = LIBRARY_META_PATH;
	return doc(getFirebaseDb(), collectionId, docId);
}

/**
 * Millis of the last library change, or 0 when the doc doesn't exist yet — which
 * reads as "no known version" and forces a full fetch rather than trusting the cache.
 */
export async function fetchLibraryVersion(): Promise<number> {
	const snap = await getDoc(libraryMetaRef());
	if (!snap.exists()) return 0;
	return (snap.data().updatedAt as Timestamp | null)?.toMillis() ?? 0;
}

/**
 * Drop empty `family` / `families` so setDoc removes the fields (clears legacy / bad
 * values reliably). `family` mirrors the first entry of `families` so single-value
 * readers keep working.
 */
function prepareDrinkFirestoreData(
	fields: Record<string, unknown>,
): Record<string, unknown> {
	const { family: famRaw, families: famsRaw, ...rest } = fields
	const out: Record<string, unknown> = { ...rest }
	const fams = Array.isArray(famsRaw)
		? [
				...new Set(
					famsRaw
						.map((f) => (typeof f === 'string' ? f.trim() : ''))
						.filter(Boolean),
				),
			]
		: []
	const fam = typeof famRaw === 'string' ? famRaw.trim() : ''
	const primary = fam || fams[0] || ''
	if (primary !== '') {
		out.family = primary
	}
	if (fams.length > 0) {
		out.families = fams
	}
	return out
}

export async function fetchAllDrinks(): Promise<Drink[]> {
	const db = getFirebaseDb();
	const snapshot = await getDocs(
		query(collection(db, 'drinks'), orderBy('name')),
	);
	const drinks: Drink[] = [];
	snapshot.forEach((docSnap) => {
		drinks.push({ ...docSnap.data(), id: docSnap.id } as Drink);
	});
	return drinks;
}

/** Firestore document fields only (no document id). */
export type DrinkWritePayload = Omit<Drink, 'id'>;

export async function addDrinkToFirestore(
	payload: DrinkWritePayload,
): Promise<string> {
	const db = getFirebaseDb();
	const data = prepareDrinkFirestoreData({
		...(payload as Record<string, unknown>),
	});
	// `doc()` with no id mints a client-side id, which `addDoc` would do for us —
	// but doing it here lets the drink and the version bump share one batch.
	const ref = doc(collection(db, 'drinks'));
	const batch = writeBatch(db);
	batch.set(ref, data);
	batch.set(libraryMetaRef(), { updatedAt: serverTimestamp() });
	await batch.commit();
	return ref.id;
}

export async function updateDrinkInFirestore(drink: Drink): Promise<void> {
	const db = getFirebaseDb();
	const raw = { ...drink } as Record<string, unknown>;
	delete raw.id;
	const data = prepareDrinkFirestoreData(raw);
	const batch = writeBatch(db);
	batch.set(doc(db, 'drinks', drink.id), data);
	batch.set(libraryMetaRef(), { updatedAt: serverTimestamp() });
	await batch.commit();
}

export async function deleteDrinkFromFirestore(id: string): Promise<void> {
	const db = getFirebaseDb();
	const batch = writeBatch(db);
	batch.delete(doc(db, 'drinks', id));
	batch.set(libraryMetaRef(), { updatedAt: serverTimestamp() });
	await batch.commit();
}

/** Exact name match (legacy Vue behavior). Optionally ignore one doc id when editing. */
export async function drinkNameExists(
	name: string,
	excludeId?: string,
): Promise<boolean> {
	const db = getFirebaseDb();
	const q = query(collection(db, 'drinks'), where('name', '==', name.trim()));
	const snapshot = await getDocs(q);
	if (snapshot.empty) return false;
	if (!excludeId) return true;
	return snapshot.docs.some((d) => d.id !== excludeId);
}
