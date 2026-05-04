/**
 * Client-side cocktail image prep for Storage.
 *
 * this app uploads from the browser straight to Firebase, so we resize + WebP-encode here.
 */

/** Square output edge length (px) */
export const COCKTAIL_IMAGE_DISPLAY_PX = 1000;
/** Soft target for payload size (bytes) */
export const COCKTAIL_IMAGE_TARGET_BYTES = 100 * 1024;

const WEBP_MIME = 'image/webp';
/** Default WebP quality — GPT exports + WebP usually land near the soft target. */
const WEBP_QUALITY = 0.86;

function canvasToWebp(
	canvas: HTMLCanvasElement,
	quality: number,
): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else
					reject(
						new Error(
							'Could not encode WebP (browser may not support WebP export).',
						),
					);
			},
			WEBP_MIME,
			quality,
		);
	});
}

/**
 * Scale and center-crop to a square (like CSS `object-fit: cover`).
 * Avoids the white side/top bars you get with "contain" + letterboxing on portrait shots.
 */
function drawCoverSquare(
	canvas: HTMLCanvasElement,
	bitmap: ImageBitmap,
	side: number,
): void {
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context.');

	const w = bitmap.width;
	const h = bitmap.height;
	const scale = Math.max(side / w, side / h);
	const tw = w * scale;
	const th = h * scale;
	const ox = (side - tw) / 2;
	const oy = (side - th) / 2;

	canvas.width = side;
	canvas.height = side;
	ctx.drawImage(bitmap, ox, oy, tw, th);
}

function warnIfOverTarget(blob: Blob, targetBytes: number): void {
	if (blob.size <= targetBytes) return;
	const kb = (blob.size / 1024).toFixed(1);
	const targetKb = (targetBytes / 1024).toFixed(0);
	console.warn(
		`[cocktail image] WebP is ${kb} KB (soft target ~${targetKb} KB). Fine to ship; tweak WEBP_QUALITY or dimensions if you care.`,
	);
}

/**
 * Resize to a square WebP (cover crop), encode WebP.
 * Returns a Blob ready for `uploadBytes`.
 */
export async function optimizeCocktailImageForUpload(
	file: File,
	options?: { targetBytes?: number; side?: number },
): Promise<Blob> {
	const targetBytes = options?.targetBytes ?? COCKTAIL_IMAGE_TARGET_BYTES;
	const side = options?.side ?? COCKTAIL_IMAGE_DISPLAY_PX;

	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file);
	} catch {
		throw new Error('Could not read this image. Try PNG, JPEG, or WebP.');
	}

	try {
		const canvas = document.createElement('canvas');
		drawCoverSquare(canvas, bitmap, side);
		const blob = await canvasToWebp(canvas, WEBP_QUALITY);
		warnIfOverTarget(blob, targetBytes);
		return blob;
	} finally {
		bitmap.close();
	}
}
