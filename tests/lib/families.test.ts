import { describe, it, expect } from 'vitest'
import {
	canonicalFamilyLabelsForForm,
	drinkFamilyKeys,
	drinkInFamily,
	isFamilySlug,
} from '../../src/constants/families'

describe('drinkFamilyKeys', () => {
	it('reads the multi-family field when present', () => {
		expect(drinkFamilyKeys({ families: ['Daiquiri', 'Tiki'] })).toEqual([
			'daiquiri',
			'tiki',
		])
	})

	it('falls back to the legacy single family', () => {
		expect(drinkFamilyKeys({ family: 'Sour' })).toEqual(['sour'])
	})

	it('prefers families over a stale primary and drops duplicates', () => {
		expect(
			drinkFamilyKeys({ family: 'Daiquiri', families: ['Daiquiri', 'daiquiri'] }),
		).toEqual(['daiquiri'])
	})

	it('returns nothing for missing or blank values', () => {
		expect(drinkFamilyKeys({})).toEqual([])
		expect(drinkFamilyKeys({ family: '  ', families: [] })).toEqual([])
	})
})

describe('drinkInFamily', () => {
	const zombie = { family: 'Tiki', families: ['Tiki'] }
	const daiquiri = { family: 'Daiquiri', families: ['Daiquiri', 'Tiki'] }

	it('matches every family a drink belongs to', () => {
		expect(drinkInFamily(daiquiri, 'daiquiri')).toBe(true)
		expect(drinkInFamily(daiquiri, 'tiki')).toBe(true)
		expect(drinkInFamily(zombie, 'tiki')).toBe(true)
	})

	it('does not match families the drink is out of', () => {
		expect(drinkInFamily(zombie, 'daiquiri')).toBe(false)
	})
})

describe('canonicalFamilyLabelsForForm', () => {
	it('canonicalizes slugs and casing to select labels', () => {
		expect(
			canonicalFamilyLabelsForForm({ families: ['old-fashioned', 'TIKI'] }),
		).toEqual(['Old Fashioned', 'Tiki'])
	})

	it('drops unknown values', () => {
		expect(canonicalFamilyLabelsForForm({ families: ['Nonsense'] })).toEqual([])
	})
})

describe('isFamilySlug', () => {
	it('accepts tiki', () => {
		expect(isFamilySlug('tiki')).toBe(true)
	})
})
