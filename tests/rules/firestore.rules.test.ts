import {
	assertFails,
	assertSucceeds,
	initializeTestEnvironment,
	type RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest'

// Must match the UID literal in firestore.rules. Not a secret.
const ADMIN_UID = '2sWAHCy0BzUweYN9HBlUZNRnS543'
const NON_ADMIN_UID = 'some-random-user-uid'

let testEnv: RulesTestEnvironment

beforeAll(async () => {
	testEnv = await initializeTestEnvironment({
		projectId: 'demo-rules-test',
		firestore: {
			rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
			host: '127.0.0.1',
			port: 8080,
		},
	})
})

afterAll(async () => {
	await testEnv?.cleanup()
})

beforeEach(async () => {
	await testEnv.clearFirestore()
})

describe('drinks/{drinkId}', () => {
	it('allows anonymous reads', async () => {
		const anon = testEnv.unauthenticatedContext().firestore()
		await assertSucceeds(getDoc(doc(anon, 'drinks/old-fashioned')))
	})

	it('allows signed-in non-admin reads', async () => {
		const user = testEnv.authenticatedContext(NON_ADMIN_UID).firestore()
		await assertSucceeds(getDoc(doc(user, 'drinks/old-fashioned')))
	})

	it('denies anonymous writes', async () => {
		const anon = testEnv.unauthenticatedContext().firestore()
		await assertFails(setDoc(doc(anon, 'drinks/evil'), { name: 'evil' }))
	})

	it('denies signed-in non-admin writes', async () => {
		const user = testEnv.authenticatedContext(NON_ADMIN_UID).firestore()
		await assertFails(setDoc(doc(user, 'drinks/evil'), { name: 'evil' }))
	})

	it('allows admin to create', async () => {
		const admin = testEnv.authenticatedContext(ADMIN_UID).firestore()
		await assertSucceeds(
			setDoc(doc(admin, 'drinks/daiquiri'), { name: 'Daiquiri' }),
		)
	})

	it('allows admin to update', async () => {
		// Seed via privileged context so admin rule is exercised on update only
		await testEnv.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'drinks/daiquiri'), { name: 'Daiquiri' })
		})
		const admin = testEnv.authenticatedContext(ADMIN_UID).firestore()
		await assertSucceeds(
			updateDoc(doc(admin, 'drinks/daiquiri'), { name: 'Hemingway Daiquiri' }),
		)
	})

	it('allows admin to delete', async () => {
		await testEnv.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'drinks/daiquiri'), { name: 'Daiquiri' })
		})
		const admin = testEnv.authenticatedContext(ADMIN_UID).firestore()
		await assertSucceeds(deleteDoc(doc(admin, 'drinks/daiquiri')))
	})

	it('denies non-admin from updating an existing drink', async () => {
		await testEnv.withSecurityRulesDisabled(async (ctx) => {
			await setDoc(doc(ctx.firestore(), 'drinks/daiquiri'), { name: 'Daiquiri' })
		})
		const user = testEnv.authenticatedContext(NON_ADMIN_UID).firestore()
		await assertFails(
			updateDoc(doc(user, 'drinks/daiquiri'), { name: 'Tampered' }),
		)
	})
})

describe('any other collection (catch-all deny)', () => {
	it('denies anonymous reads on unspecified paths', async () => {
		const anon = testEnv.unauthenticatedContext().firestore()
		await assertFails(getDoc(doc(anon, 'secrets/key')))
	})

	it('denies anonymous writes on unspecified paths', async () => {
		const anon = testEnv.unauthenticatedContext().firestore()
		await assertFails(setDoc(doc(anon, 'secrets/key'), { value: 'shh' }))
	})

	it('denies even admin from writing to unspecified paths', async () => {
		const admin = testEnv.authenticatedContext(ADMIN_UID).firestore()
		await assertFails(setDoc(doc(admin, 'users/me'), { displayName: 'me' }))
	})
})
