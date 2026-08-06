import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('firebase/storage', () => ({
	ref: vi.fn((_storage, path: string) => ({ path })),
	uploadBytes: vi.fn(async () => undefined),
	getDownloadURL: vi.fn(async () => 'https://example.test/image.webp'),
}))

vi.mock('../../src/lib/firebase', () => ({
	getFirebaseStorage: vi.fn(() => ({})),
}))

vi.mock('../../src/lib/optimizeCocktailImage', () => ({
	optimizeCocktailImageForUpload: vi.fn(async () => ({ size: 1234 })),
}))

import { uploadBytes } from 'firebase/storage'
import { uploadCocktailImageToFirebase } from '../../src/lib/uploadCocktailImage'

const mockUpload = vi.mocked(uploadBytes)

const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })

describe('uploadCocktailImageToFirebase', () => {
	beforeEach(() => vi.clearAllMocks())

	it('uploads with a long immutable cache header', async () => {
		// Without this, Storage defaults to `private, max-age=0` and every image
		// revalidates on every page load.
		await uploadCocktailImageToFirebase(file, { drinkName: 'Negroni' })

		expect(mockUpload).toHaveBeenCalledWith(
			expect.anything(),
			expect.anything(),
			expect.objectContaining({
				contentType: 'image/webp',
				cacheControl: 'public, max-age=31536000, immutable',
			}),
		)
	})

	it('mints a unique path per upload, so a replacement never overwrites', async () => {
		// This is what makes the immutable header safe.
		await uploadCocktailImageToFirebase(file, {
			drinkName: 'Negroni',
			drinkId: 'd1',
		})
		const first = mockUpload.mock.calls[0][0] as unknown as { path: string }

		vi.setSystemTime(new Date(Date.now() + 1000))
		await uploadCocktailImageToFirebase(file, {
			drinkName: 'Negroni',
			drinkId: 'd1',
		})
		const second = mockUpload.mock.calls[1][0] as unknown as { path: string }

		expect(first.path).not.toBe(second.path)
		expect(first.path).toMatch(/^cocktail_images\/d1\/negroni-\d+\.webp$/)
	})
})
