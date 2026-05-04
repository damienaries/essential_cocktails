/**
 * Consistent `<img>` hints so the browser can reuse HTTP cache & decode off the main thread.
 * Firebase Storage URLs still honor `Cache-Control` from the bucket; identical URLs hit disk cache.
 */

export const drinkPhotoImgProps = {
	decoding: 'async' as const,
};
