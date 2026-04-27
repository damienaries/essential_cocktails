import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { getFirebaseDb } from '../lib/firebase'
import type { Drink } from '../types/drink'

export async function fetchAllDrinks(): Promise<Drink[]> {
  const db = getFirebaseDb()
  const snapshot = await getDocs(query(collection(db, 'drinks'), orderBy('name')))
  const drinks: Drink[] = []
  snapshot.forEach((docSnap) => {
    drinks.push({ id: docSnap.id, ...docSnap.data() } as Drink)
  })
  return drinks
}
