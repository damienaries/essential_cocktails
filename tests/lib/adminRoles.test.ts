import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

beforeEach(() => {
	vi.resetModules()
})

afterEach(() => {
	vi.unstubAllEnvs()
})

async function load(uids: string) {
	vi.stubEnv('VITE_ADMIN_UIDS', uids)
	return import('../../src/lib/adminRoles')
}

describe('isAdminUid', () => {
	it('returns false when no admin UIDs are configured', async () => {
		const { isAdminUid } = await load('')
		expect(isAdminUid('anyone')).toBe(false)
		expect(isAdminUid(null)).toBe(false)
		expect(isAdminUid(undefined)).toBe(false)
	})

	it('matches a single configured UID', async () => {
		const { isAdminUid } = await load('abc123')
		expect(isAdminUid('abc123')).toBe(true)
		expect(isAdminUid('def456')).toBe(false)
	})

	it('matches any of several comma-separated UIDs', async () => {
		const { isAdminUid } = await load('abc123,def456,ghi789')
		expect(isAdminUid('abc123')).toBe(true)
		expect(isAdminUid('def456')).toBe(true)
		expect(isAdminUid('ghi789')).toBe(true)
		expect(isAdminUid('not-listed')).toBe(false)
	})

	it('trims whitespace around UIDs', async () => {
		const { isAdminUid } = await load('  abc123 ,  def456 ')
		expect(isAdminUid('abc123')).toBe(true)
		expect(isAdminUid('def456')).toBe(true)
	})

	it('treats empty / null / undefined input as not admin', async () => {
		const { isAdminUid } = await load('abc123')
		expect(isAdminUid('')).toBe(false)
		expect(isAdminUid(null)).toBe(false)
		expect(isAdminUid(undefined)).toBe(false)
	})
})
