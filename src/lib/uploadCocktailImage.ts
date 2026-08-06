import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getFirebaseStorage } from './firebase';
import { optimizeCocktailImageForUpload } from './optimizeCocktailImage';

function slugFromName(name: string): string {
	const s = name
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
	return s || 'drink';
}

/**
 * Cached for a year and never revalidated. Safe because these objects are immutable
 * in practice: every upload mints a new `slug-{timestamp}.webp` path, so replacing a
 * drink's photo produces a new URL rather than new bytes at the old one.
 */
const IMAGE_CACHE_CONTROL = 'public, max-age=31536000, immutable';

/**
 * Uploads to Storage under `cocktail_images/…` (matches typical Storage rules).
 * Returns the download URL and the uploaded WebP size in bytes.
 */
export async function uploadCocktailImageToFirebase(
	file: File,
	options: { drinkName: string; drinkId?: string },
): Promise<{ url: string; bytes: number }> {
	const storage = getFirebaseStorage();
	const optimized = await optimizeCocktailImageForUpload(file);
	const slug = slugFromName(options.drinkName);
	const folder = options.drinkId ? `${options.drinkId}` : 'new';
	const path = `cocktail_images/${folder}/${slug}-${Date.now()}.webp`;
	const storageRef = ref(storage, path);
	await uploadBytes(storageRef, optimized, {
		contentType: 'image/webp',
		cacheControl: IMAGE_CACHE_CONTROL,
	});
	const url = await getDownloadURL(storageRef);
	return { url, bytes: optimized.size };
}
