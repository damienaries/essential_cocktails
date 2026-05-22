import { describe, it, expect } from 'vitest'
import { categorizeIngredient, glossarySlug, isGlossaryIngredient } from '../../src/lib/ingredientCategory'

describe('categorizeIngredient', () => {
	it('returns "other" for empty / null input', () => {
		expect(categorizeIngredient(null)).toBe('other')
		expect(categorizeIngredient(undefined)).toBe('other')
		expect(categorizeIngredient('')).toBe('other')
		expect(categorizeIngredient('   ')).toBe('other')
	})

	it('recognizes bitters before anything else', () => {
		expect(categorizeIngredient('Angostura bitters')).toBe('bitters')
		expect(categorizeIngredient("Peychaud's bitters")).toBe('bitters')
		expect(categorizeIngredient('orange bitters')).toBe('bitters')
	})

	it('classifies common syrups and sweeteners', () => {
		expect(categorizeIngredient('Simple syrup')).toBe('syrup')
		expect(categorizeIngredient('demerara syrup')).toBe('syrup')
		expect(categorizeIngredient('honey')).toBe('syrup')
		expect(categorizeIngredient('orgeat')).toBe('syrup')
		expect(categorizeIngredient('Grenadine')).toBe('syrup')
		expect(categorizeIngredient('agave')).toBe('syrup')
	})

	it('classifies modifiers (vermouth, liqueurs, amari)', () => {
		expect(categorizeIngredient('Sweet vermouth')).toBe('modifier')
		expect(categorizeIngredient('Campari')).toBe('modifier')
		expect(categorizeIngredient('Aperol')).toBe('modifier')
		expect(categorizeIngredient('Maraschino liqueur')).toBe('modifier')
		expect(categorizeIngredient('Cointreau')).toBe('modifier')
		expect(categorizeIngredient('Lillet Blanc')).toBe('modifier')
		expect(categorizeIngredient('Crème de cassis')).toBe('modifier')
	})

	it('classifies base spirits', () => {
		expect(categorizeIngredient('London dry gin')).toBe('spirit')
		expect(categorizeIngredient('Rye whiskey')).toBe('spirit')
		expect(categorizeIngredient('Bourbon')).toBe('spirit')
		expect(categorizeIngredient('White rum')).toBe('spirit')
		expect(categorizeIngredient('Mezcal')).toBe('spirit')
	})

	it('classifies juices', () => {
		expect(categorizeIngredient('Lime juice')).toBe('juice')
		expect(categorizeIngredient('lemon')).toBe('juice')
		expect(categorizeIngredient('orange juice')).toBe('juice')
	})

	it('returns fruit (not modifier) for "maraschino cherry"', () => {
		// the modifier rule includes "maraschino" but cherry should win
		expect(categorizeIngredient('maraschino cherry')).toBe('fruit')
	})

	it('falls back to other for unknown / non-cocktail ingredients', () => {
		expect(categorizeIngredient('Egg white')).toBe('other')
		expect(categorizeIngredient('soda water')).toBe('other')
	})
})

describe('isGlossaryIngredient', () => {
	it('is true only for syrups and modifiers', () => {
		expect(isGlossaryIngredient('Simple syrup')).toBe(true)
		expect(isGlossaryIngredient('Sweet vermouth')).toBe(true)
		expect(isGlossaryIngredient('Gin')).toBe(false)
		expect(isGlossaryIngredient('Lime juice')).toBe(false)
		expect(isGlossaryIngredient('Angostura bitters')).toBe(false)
		expect(isGlossaryIngredient('')).toBe(false)
		expect(isGlossaryIngredient(null)).toBe(false)
	})
})

describe('glossarySlug', () => {
	it('lowercases and hyphenates', () => {
		expect(glossarySlug('Simple Syrup')).toBe('simple-syrup')
		expect(glossarySlug('Sweet Vermouth')).toBe('sweet-vermouth')
	})

	it('strips accents and special characters', () => {
		expect(glossarySlug('Crème de cassis')).toBe('creme-de-cassis')
	})

	it('collapses repeated separators and trims edges', () => {
		expect(glossarySlug('  Honey  syrup  ')).toBe('honey-syrup')
		expect(glossarySlug('--foo--bar--')).toBe('foo-bar')
	})
})
