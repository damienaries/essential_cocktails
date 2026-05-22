import { describe, it, expect } from 'vitest'
import { formatGarnish, formatIce, formatMethod } from '../../src/lib/drinkDisplay'
import type { Drink } from '../../src/types/drink'

const base: Drink = { id: 'x', name: 'Test' }

describe('formatMethod', () => {
	it('handles single string', () => {
		expect(formatMethod({ ...base, method: 'Shake' })).toBe('Shake')
	})

	it('joins arrays with commas', () => {
		expect(formatMethod({ ...base, method: ['Shake', 'Strain'] })).toBe(
			'Shake, Strain',
		)
	})

	it('returns empty string when missing', () => {
		expect(formatMethod(base)).toBe('')
		expect(formatMethod({ ...base, method: null })).toBe('')
	})
})

describe('formatGarnish', () => {
	it('shows "No garnish" for empty values', () => {
		expect(formatGarnish(base)).toBe('No garnish')
		expect(formatGarnish({ ...base, garnish: '' })).toBe('No garnish')
		expect(formatGarnish({ ...base, garnish: '   ' })).toBe('No garnish')
		expect(formatGarnish({ ...base, garnish: null })).toBe('No garnish')
	})

	it('joins arrays', () => {
		expect(
			formatGarnish({ ...base, garnish: ['Lemon twist', 'Cherry'] }),
		).toBe('Lemon twist, Cherry')
	})

	it('returns the string as-is', () => {
		expect(formatGarnish({ ...base, garnish: 'Lime wheel' })).toBe('Lime wheel')
	})
})

describe('formatIce', () => {
	it('returns trimmed string', () => {
		expect(formatIce({ ...base, ice: '  cube  ' })).toBe('cube')
	})

	it('returns empty string for missing or blank', () => {
		expect(formatIce(base)).toBe('')
		expect(formatIce({ ...base, ice: '' })).toBe('')
		expect(formatIce({ ...base, ice: '   ' })).toBe('')
		expect(formatIce({ ...base, ice: null })).toBe('')
	})
})
