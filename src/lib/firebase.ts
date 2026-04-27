import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getFirestore, type Firestore } from 'firebase/firestore'

function readFirebaseConfig() {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
  }
}

let app: FirebaseApp | null = null
let db: Firestore | null = null

export function getFirebaseDb(): Firestore {
  if (db) return db

  const config = readFirebaseConfig()
  if (!config.apiKey || !config.projectId) {
    throw new Error(
      'Firebase is not configured. Copy `.env.example` to `.env.local` and set the VITE_FIREBASE_* variables from the Firebase console.',
    )
  }

  app = initializeApp(config)
  db = getFirestore(app)
  return db
}
