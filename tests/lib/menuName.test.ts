import { describe, expect, it } from 'vitest'
import {
	MENU_NAME_MAX_LENGTH,
	findMenuBySlug,
	menuNameTaken,
	menuSlug,
	normalizeMenuName,
} from '../../src/lib/menuName'
import type { CustomMenu } from '../../src/types/user'

function menu(name: string, id = name): CustomMenu {
	return { id, name, drinkIds: [], createdAt: 0, updatedAt: 0 }
}

describe('menuSlug', () => {
	it('kebab-cases a name', () => {
		expect(menuSlug('Tiki Night')).toBe('tiki-night')
	})

	it('strips accents so the URL stays ASCII', () => {
		expect(menuSlug('Café Réserve')).toBe('cafe-reserve')
	})

	it('collapses punctuation and trims stray dashes', () => {
		expect(menuSlug('  Gin & Tonic!  ')).toBe('gin-tonic')
	})

	it('never returns an empty segment', () => {
		// A symbols-only name would slug to '', which would collide with the
		// index route — the encoded fallback keeps it addressable.
		expect(menuSlug('!!!')).not.toBe('')
	})

	it('is stable across casing, so duplicates are detectable', () => {
		expect(menuSlug('TIKI NIGHT')).toBe(menuSlug('tiki night'))
	})
})

describe('normalizeMenuName', () => {
	it('trims and caps at the max length', () => {
		const long = 'x'.repeat(MENU_NAME_MAX_LENGTH + 10)
		expect(normalizeMenuName(`  ${long}  `)).toHaveLength(MENU_NAME_MAX_LENGTH)
	})
})

describe('findMenuBySlug', () => {
	const menus = [menu('Tiki Night'), menu('Summer List')]

	it('resolves a slug back to its menu', () => {
		expect(findMenuBySlug(menus, 'summer-list')?.name).toBe('Summer List')
	})

	it('ignores casing in the incoming URL', () => {
		expect(findMenuBySlug(menus, 'TIKI-NIGHT')?.name).toBe('Tiki Night')
	})

	it('returns undefined for an unknown or missing slug', () => {
		expect(findMenuBySlug(menus, 'nope')).toBeUndefined()
		expect(findMenuBySlug(menus, undefined)).toBeUndefined()
	})
})

describe('menuNameTaken', () => {
	const menus = [menu('Tiki Night')]

	it('catches names that would produce the same URL', () => {
		expect(menuNameTaken(menus, 'tiki night')).toBe(true)
		expect(menuNameTaken(menus, '  Tiki  Night  ')).toBe(true)
	})

	it('allows a distinct name', () => {
		expect(menuNameTaken(menus, 'Winter List')).toBe(false)
	})
})
