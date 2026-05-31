import { describe, it, expect } from 'vitest'
import { glassIconName, iceIconName, methodIconName } from '../../src/lib/metaIcons'

describe('methodIconName', () => {
	it('maps closed-enum methods', () => {
		expect(methodIconName('Shake')).toBe('method-shake')
		expect(methodIconName('Stir')).toBe('method-stir')
		expect(methodIconName('Muddle')).toBe('method-muddle')
		expect(methodIconName('Swizzle')).toBe('method-swizzle')
	})

	it('routes Build to the swizzle glyph (no dedicated build icon yet)', () => {
		expect(methodIconName('Build')).toBe('method-swizzle')
		expect(methodIconName('build')).toBe('method-swizzle')
	})

	it('recognizes Dry Shake before Shake', () => {
		expect(methodIconName('Dry Shake')).toBe('method-dry-shake')
		expect(methodIconName('dry shake')).toBe('method-dry-shake')
		expect(methodIconName('dryshake')).toBe('method-dry-shake')
	})

	it('is case-insensitive', () => {
		expect(methodIconName('SHAKE')).toBe('method-shake')
		expect(methodIconName('stir')).toBe('method-stir')
	})

	it('accepts arrays (first value wins)', () => {
		expect(methodIconName(['Stir', 'Strain'])).toBe('method-stir')
	})

	it('returns null for unknown / empty', () => {
		expect(methodIconName(null)).toBe(null)
		expect(methodIconName(undefined)).toBe(null)
		expect(methodIconName('')).toBe(null)
		expect(methodIconName('Throw')).toBe(null)
	})
})

describe('iceIconName', () => {
	it('maps closed-enum ice values', () => {
		expect(iceIconName('cube')).toBe('ice-cube')
		expect(iceIconName('Cubed')).toBe('ice-cube')
		expect(iceIconName('crushed')).toBe('ice-crushed')
		expect(iceIconName('up')).toBe('ice-up')
	})

	it('treats "none" / "no ice" as up', () => {
		expect(iceIconName('none')).toBe('ice-up')
		expect(iceIconName('No ice')).toBe('ice-up')
	})

	it('returns null for unknown / empty', () => {
		expect(iceIconName(null)).toBe(null)
		expect(iceIconName(undefined)).toBe(null)
		expect(iceIconName('')).toBe(null)
		expect(iceIconName('sphere')).toBe(null)
	})
})

describe('glassIconName', () => {
	it('matches free-text glassware to canonical icons', () => {
		expect(glassIconName('Coupe')).toBe('glass-coupe')
		expect(glassIconName('Martini glass')).toBe('glass-coupe')
		expect(glassIconName('Nick & Nora')).toBe('glass-coupe')
		expect(glassIconName('Cocktail')).toBe('glass-coupe')

		expect(glassIconName('Highball')).toBe('glass-highball')
		expect(glassIconName('Collins')).toBe('glass-highball')

		expect(glassIconName('Rocks')).toBe('glass-rocks-sm')
		expect(glassIconName('Old Fashioned')).toBe('glass-rocks-sm')
		expect(glassIconName('Tumbler')).toBe('glass-rocks-sm')

		expect(glassIconName('Champagne flute')).toBe('glass-champagne')
		expect(glassIconName('Tulip')).toBe('glass-champagne')
	})

	it('disambiguates DOF before plain old fashioned', () => {
		expect(glassIconName('Double Old Fashioned')).toBe('glass-dof')
		expect(glassIconName('double old-fashioned')).toBe('glass-dof')
		expect(glassIconName('Double Rocks')).toBe('glass-dof')
		expect(glassIconName('DOF')).toBe('glass-dof')
		expect(glassIconName('D.O.F.')).toBe('glass-dof')
	})

	it('matches tiki and vintage shapes', () => {
		expect(glassIconName('Tiki Mug')).toBe('glass-tiki')
		expect(glassIconName('tiki')).toBe('glass-tiki')
		expect(glassIconName('Vintage')).toBe('glass-vintage')
	})

	it('returns null for unknown / empty', () => {
		expect(glassIconName(null)).toBe(null)
		expect(glassIconName(undefined)).toBe(null)
		expect(glassIconName('')).toBe(null)
		expect(glassIconName('Swizzle cup')).toBe(null)
		expect(glassIconName('Hurricane')).toBe(null)
	})
})
