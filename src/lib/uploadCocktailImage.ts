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
	await uploadBytes(storageRef, optimized, { contentType: 'image/webp' });
	const url = await getDownloadURL(storageRef);
	return { url, bytes: optimized.size };
}
