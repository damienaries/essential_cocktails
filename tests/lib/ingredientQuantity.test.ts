import { describe, it, expect } from 'vitest'
import { formatCl, formatOz, ozToCl } from '../../src/lib/ingredientQuantity'

describe('ozToCl', () => {
	it('matches the European pour table for canonical recipes', () => {
		// Sour: 2 / 0.75 / 0.75 oz → 5 / 2 / 2 cl
		expect(ozToCl(2)).toBe(5)
		expect(ozToCl(0.75)).toBe(2)
		// Negroni / Boulevardier (2:1:1 American): 1.5 / 0.75 / 0.75 oz → 4 / 2 / 2 cl
		expect(ozToCl(1.5)).toBe(4)
		// Manhattan: 2 / 1 oz → 5 / 2.5 cl
		expect(ozToCl(1)).toBe(2.5)
	})

	it('covers small pours', () => {
		expect(ozToCl(0.25)).toBe(0.5)
		expect(ozToCl(0.5)).toBe(1.5)
	})

	it('covers larger pours', () => {
		expect(ozToCl(2.5)).toBe(6)
		expect(ozToCl(3)).toBe(7.5)
		expect(ozToCl(4)).toBe(10)
	})

	it('falls back to nearest 0.5 cl for off-table values', () => {
		// literal 1.1 oz × 3 = 3.3 cl → snap to 3.5
		expect(ozToCl(1.1)).toBe(3.5)
		// literal 5 oz × 3 = 15 cl
		expect(ozToCl(5)).toBe(15)
	})
})

describe('formatCl', () => {
	it('omits decimal for integers', () => {
		expect(formatCl(5)).toBe('5')
		expect(formatCl(2)).toBe('2')
	})

	it('keeps one decimal for halves', () => {
		expect(formatCl(2.5)).toBe('2.5')
		expect(formatCl(1.5)).toBe('1.5')
	})
})

describe('formatOz', () => {
	it('shows fractions for common bartender quantities', () => {
		expect(formatOz(0.25)).toBe('1/4')
		expect(formatOz(0.5)).toBe('1/2')
		expect(formatOz(0.75)).toBe('3/4')
		expect(formatOz(1 / 3)).toBe('1/3')
		expect(formatOz(2 / 3)).toBe('2/3')
	})

	it('combines whole numbers with fractions', () => {
		expect(formatOz(1.5)).toBe('1 1/2')
		expect(formatOz(1.75)).toBe('1 3/4')
		expect(formatOz(2.25)).toBe('2 1/4')
	})

	it('shows whole numbers cleanly', () => {
		expect(formatOz(1)).toBe('1')
		expect(formatOz(2)).toBe('2')
	})

	it('tolerates rounding (0.66 → 2/3)', () => {
		expect(formatOz(0.66)).toBe('2/3')
		expect(formatOz(0.67)).toBe('2/3')
		expect(formatOz(0.33)).toBe('1/3')
	})

	it('falls back to decimal for off-grid values', () => {
		expect(formatOz(0.9)).toBe('0.9')
	})
})
