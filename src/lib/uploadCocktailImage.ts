import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { getFirebaseStorage } from './firebase'

const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'gif', 'webp'])

function slugFromName(name: string): string {
  const s = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return s || 'drink'
}

/**
 * Uploads to Storage under `cocktail_images/…` (matches typical Storage rules).
 * Returns a download URL suitable for `imageUrl` on the drink document.
 */
export async function uploadCocktailImageToFirebase(
  file: File,
  options: { drinkName: string; drinkId?: string },
): Promise<string> {
  const storage = getFirebaseStorage()
  const rawExt = (file.name.split('.').pop() || 'webp').toLowerCase()
  const ext = ALLOWED_EXT.has(rawExt) ? rawExt : 'webp'
  const slug = slugFromName(options.drinkName)
  const folder = options.drinkId ? `${options.drinkId}` : 'new'
  const path = `cocktail_images/${folder}/${slug}-${Date.now()}.${ext}`
  const storageRef = ref(storage, path)
  const contentType = file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`
  await uploadBytes(storageRef, file, { contentType })
  return getDownloadURL(storageRef)
}
