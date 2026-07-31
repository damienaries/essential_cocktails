import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	orderBy,
	query,
	setDoc,
	where,
} from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import type { Drink } from '../types/drink';

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
	const ref = await addDoc(collection(db, 'drinks'), data);
	return ref.id;
}

export async function updateDrinkInFirestore(drink: Drink): Promise<void> {
	const db = getFirebaseDb();
	const ref = doc(db, 'drinks', drink.id);
	const raw = { ...drink } as Record<string, unknown>;
	delete raw.id;
	const data = prepareDrinkFirestoreData(raw);
	await setDoc(ref, data);
}

export async function deleteDrinkFromFirestore(id: string): Promise<void> {
	const db = getFirebaseDb();
	await deleteDoc(doc(db, 'drinks', id));
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
