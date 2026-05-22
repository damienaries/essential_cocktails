import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
	type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { getBytes, ref, uploadBytes } from 'firebase/storage'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterAll, beforeAll, describe, it } from 'vitest'

const ADMIN_UID = '2sWAHCy0BzUweYN9HBlUZNRnS543'
const NON_ADMIN_UID = 'some-random-user-uid'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
	testEnv = await initializeTestEnvironment({
		projectId: 'demo-rules-test',
		storage: {
			rules: readFileSync(resolve(__dirname, '../../storage.rules'), 'utf8'),
			host: '127.0.0.1',
			port: 9199,
		},
	})
})

afterAll(async () => {
	await testEnv?.cleanup()
})

function smallImageBytes(): Uint8Array {
	// A few bytes is enough — the rules only check size + contentType.
	return new Uint8Array([1, 2, 3, 4])
}

describe('cocktail_images/**', () => {
	it('allows anonymous reads', async () => {
		// Seed an object via privileged context so the read has something to fetch.
		await testEnv.withSecurityRulesDisabled(async (ctx) => {
			await uploadBytes(
				ref(ctx.storage(), 'cocktail_images/seed.webp'),
				smallImageBytes(),
				{ contentType: 'image/webp' },
			)
		})
		const anon = testEnv.unauthenticatedContext().storage()
		await assertSucceeds(getBytes(ref(anon, 'cocktail_images/seed.webp')))
	})

	it('denies anonymous writes', async () => {
		const anon = testEnv.unauthenticatedContext().storage()
		await assertFails(
			uploadBytes(
				ref(anon, 'cocktail_images/anon.webp'),
				smallImageBytes(),
				{ contentType: 'image/webp' },
			),
		)
	})

	it('denies non-admin writes', async () => {
		const user = testEnv.authenticatedContext(NON_ADMIN_UID).storage()
		await assertFails(
			uploadBytes(
				ref(user, 'cocktail_images/user.webp'),
				smallImageBytes(),
				{ contentType: 'image/webp' },
			),
		)
	})

	it('allows admin to write an image under 5 MB', async () => {
		const admin = testEnv.authenticatedContext(ADMIN_UID).storage()
		await assertSucceeds(
			uploadBytes(
				ref(admin, 'cocktail_images/ok.webp'),
				smallImageBytes(),
				{ contentType: 'image/webp' },
			),
		)
	})

	it('denies admin writes when content-type is not an image', async () => {
		const admin = testEnv.authenticatedContext(ADMIN_UID).storage()
		await assertFails(
			uploadBytes(
				ref(admin, 'cocktail_images/oops.pdf'),
				smallImageBytes(),
				{ contentType: 'application/pdf' },
			),
		)
	})

	it('denies admin writes when payload exceeds 5 MB', async () => {
		const admin = testEnv.authenticatedContext(ADMIN_UID).storage()
		const tooLarge = new Uint8Array(5 * 1024 * 1024 + 1)
		await assertFails(
			uploadBytes(ref(admin, 'cocktail_images/big.webp'), tooLarge, {
				contentType: 'image/webp',
			}),
		)
	})
})

describe('other storage paths (catch-all deny)', () => {
	it('denies anonymous writes outside cocktail_images', async () => {
		const anon = testEnv.unauthenticatedContext().storage()
		await assertFails(
			uploadBytes(ref(anon, 'leaks/test.txt'), smallImageBytes(), {
				contentType: 'text/plain',
			}),
		)
	})

	it('denies admin writes outside cocktail_images', async () => {
		const admin = testEnv.authenticatedContext(ADMIN_UID).storage()
		await assertFails(
			uploadBytes(
				ref(admin, 'private/secret.webp'),
				smallImageBytes(),
				{ contentType: 'image/webp' },
			),
		)
	})
})
