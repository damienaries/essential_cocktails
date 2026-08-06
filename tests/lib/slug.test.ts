import { describe, expect, it } from 'vitest'
import { drinkSlug, findDrinkBySlug, slugify } from '../../src/lib/slug'
import { menuSlug } from '../../src/lib/menuName'
import type { Drink } from '../../src/types/drink'

const drinks: Drink[] = [
	{ id: 'd1', name: 'Negroni Sbagliato' },
	{ id: 'd2', name: 'Daiquiri' },
	{ id: 'd3', name: 'Café Brûlot' },
]

describe('slugify', () => {
	it('kebab-cases, strips accents, and trims punctuation', () => {
		expect(slugify('Negroni Sbagliato')).toBe('negroni-sbagliato')
		expect(slugify('Café Brûlot')).toBe('cafe-brulot')
		expect(slugify('  Gin & Tonic!  ')).toBe('gin-tonic')
	})

	it('never returns an empty segment', () => {
		expect(slugify('!!!')).not.toBe('')
	})

	it('backs menu slugs too, so the two rule sets cannot drift', () => {
		expect(menuSlug('Tiki Night')).toBe(slugify('Tiki Night'))
	})
})

describe('drink slugs', () => {
	it('round-trips a drink through its URL segment', () => {
		const negroni = drinks[0]
		expect(findDrinkBySlug(drinks, drinkSlug(negroni))).toBe(negroni)
	})

	it('resolves accented names from their ASCII slug', () => {
		expect(findDrinkBySlug(drinks, 'cafe-brulot')?.id).toBe('d3')
	})

	it('ignores casing in the incoming URL', () => {
		expect(findDrinkBySlug(drinks, 'DAIQUIRI')?.id).toBe('d2')
	})

	it('returns undefined for unknown or missing slugs', () => {
		expect(findDrinkBySlug(drinks, 'no-such-drink')).toBeUndefined()
		expect(findDrinkBySlug(drinks, undefined)).toBeUndefined()
	})
})
