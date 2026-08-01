import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import {
	MENU_PAGE_CAPACITY,
	MenuSheet,
} from '../../src/components/menus/MenuSheet'
import type { Drink } from '../../src/types/drink'

function drinks(count: number): Drink[] {
	return Array.from({ length: count }, (_, i) => ({
		id: `d${i + 1}`,
		name: `Drink ${i + 1}`,
		ingredients: [{ name: 'Gin', quantity: 2, unit: 'oz' }],
	}))
}

function pagesOf(container: HTMLElement): HTMLElement[] {
	return Array.from(container.querySelectorAll('.menu-sheet-page'))
}

function drinkCounts(container: HTMLElement): number[] {
	return pagesOf(container).map(
		(page) => page.querySelectorAll('.menu-sheet-drink').length,
	)
}

describe('MenuSheet paging', () => {
	it('stays a single page up to capacity', () => {
		const { container } = render(
			<MenuSheet name="Tiki Night" drinks={drinks(MENU_PAGE_CAPACITY)} />,
		)
		expect(drinkCounts(container)).toEqual([MENU_PAGE_CAPACITY])
		expect(container.querySelector('.menu-sheet--single')).not.toBeNull()
		// No fold to print when there's nothing on the other half.
		expect(container.querySelector('.menu-sheet-fold')).toBeNull()
	})

	it('opens a second page once capacity is exceeded', () => {
		const { container } = render(
			<MenuSheet name="Tiki Night" drinks={drinks(MENU_PAGE_CAPACITY + 1)} />,
		)
		expect(drinkCounts(container)).toEqual([MENU_PAGE_CAPACITY, 1])
		expect(container.querySelector('.menu-sheet--spread')).not.toBeNull()
		expect(container.querySelector('.menu-sheet-fold')).not.toBeNull()
	})

	it('never duplicates a drink across the two halves', () => {
		const { container } = render(
			<MenuSheet name="Tiki Night" drinks={drinks(MENU_PAGE_CAPACITY + 2)} />,
		)
		const names = Array.from(
			container.querySelectorAll('.menu-sheet-drink-name'),
		).map((el) => el.textContent)
		expect(new Set(names).size).toBe(names.length)
	})

	it('keeps overflow beyond two pages on the back rather than dropping it', () => {
		const total = MENU_PAGE_CAPACITY * 2 + 3
		const { container } = render(
			<MenuSheet name="Big List" drinks={drinks(total)} />,
		)
		const counts = drinkCounts(container)
		expect(counts).toHaveLength(2)
		expect(counts[0] + counts[1]).toBe(total)
	})

	it('renders an empty state on a single page', () => {
		const { container, getByText } = render(
			<MenuSheet name="Empty" drinks={[]} />,
		)
		expect(pagesOf(container)).toHaveLength(1)
		expect(getByText('No drinks on this menu yet')).toBeInTheDocument()
	})

	it('flags only the printable sheet', () => {
		const { container: preview } = render(
			<MenuSheet name="Preview" drinks={drinks(2)} />,
		)
		expect(preview.querySelector('.menu-sheet-print')).toBeNull()

		const { container: printable } = render(
			<MenuSheet name="Printable" drinks={drinks(2)} printable />,
		)
		expect(printable.querySelector('.menu-sheet-print')).not.toBeNull()
	})
})
