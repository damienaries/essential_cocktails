/**
 * Client-side cocktail image prep for Storage.
 *
 * Sharp (and similar) only run in Node; this app uploads from the browser straight to
 * Firebase, so we resize + WebP-encode here. A future @2x asset (e.g. 1000px) can follow
 * the same pattern or move encoding to a Cloud Function if you need server-side sharp.
 */

export const COCKTAIL_IMAGE_DISPLAY_PX = 500;
/** Soft target for payload size (bytes); we only log if exceeded, not a hard cap. */
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

/** Draw image contained in a square canvas without upscaling; letterbox with solid bg. */
function drawContainedSquare(
	canvas: HTMLCanvasElement,
	bitmap: ImageBitmap,
	side: number,
	letterboxRgb: [number, number, number],
): void {
	const ctx = canvas.getContext('2d');
	if (!ctx) throw new Error('Could not get canvas context.');

	const w = bitmap.width;
	const h = bitmap.height;
	const scale = Math.min(side / w, side / h, 1);
	const tw = w * scale;
	const th = h * scale;
	const ox = (side - tw) / 2;
	const oy = (side - th) / 2;

	canvas.width = side;
	canvas.height = side;
	ctx.fillStyle = `rgb(${letterboxRgb[0]}, ${letterboxRgb[1]}, ${letterboxRgb[2]})`;
	ctx.fillRect(0, 0, side, side);
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
 * Resize (down only; never upscales) into a square, encode WebP.
 * Returns a Blob ready for `uploadBytes`.
 */
export async function optimizeCocktailImageForUpload(
	file: File,
	options?: {
		targetBytes?: number;
		side?: number;
		letterboxRgb?: [number, number, number];
	},
): Promise<Blob> {
	const targetBytes = options?.targetBytes ?? COCKTAIL_IMAGE_TARGET_BYTES;
	const side = options?.side ?? COCKTAIL_IMAGE_DISPLAY_PX;
	const letterboxRgb = options?.letterboxRgb ?? [255, 255, 255];

	let bitmap: ImageBitmap;
	try {
		bitmap = await createImageBitmap(file);
	} catch {
		throw new Error('Could not read this image. Try PNG, JPEG, or WebP.');
	}

	try {
		const canvas = document.createElement('canvas');
		drawContainedSquare(canvas, bitmap, side, letterboxRgb);
		const blob = await canvasToWebp(canvas, WEBP_QUALITY);
		warnIfOverTarget(blob, targetBytes);
		return blob;
	} finally {
		bitmap.close();
	}
}
