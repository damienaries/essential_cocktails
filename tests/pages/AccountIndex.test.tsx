import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { UseQueryResult } from '@tanstack/react-query'
import type { CustomMenu, SavedDrink } from '../../src/types/user'

vi.mock('../../src/hooks/useSavedDrinks', () => ({
	useSavedDrinks: vi.fn(),
}))

vi.mock('../../src/hooks/useMenus', () => ({
	useMenus: vi.fn(),
}))

import { AccountIndexPage } from '../../src/pages/AccountIndex'
import { useMenus } from '../../src/hooks/useMenus'
import { useSavedDrinks } from '../../src/hooks/useSavedDrinks'

const mockSaved = vi.mocked(useSavedDrinks)
const mockMenus = vi.mocked(useMenus)

/** Only the two fields the page reads; the rest of the query result is noise. */
function query<T>(data: T | undefined, isLoading = false) {
	return { data, isLoading } as UseQueryResult<T, Error>
}

const savedRow: SavedDrink[] = [{ drinkId: 'd1', savedAt: 1 }]
const menuRow: CustomMenu[] = [
	{ id: 'm1', name: 'Tiki Night', drinkIds: [], createdAt: 0, updatedAt: 0 },
]

function renderIndex() {
	return render(
		<MemoryRouter initialEntries={['/account']}>
			<Routes>
				<Route path="/account" element={<AccountIndexPage />} />
				<Route path="/account/saved" element={<div>Saved Body</div>} />
				<Route path="/account/menus" element={<div>Menus Body</div>} />
				<Route path="/account/profile" element={<div>Profile Body</div>} />
			</Routes>
		</MemoryRouter>,
	)
}

describe('AccountIndexPage', () => {
	beforeEach(() => vi.clearAllMocks())

	it('holds until both counts are known, so it cannot land on the wrong tab', () => {
		mockSaved.mockReturnValue(query<SavedDrink[]>(undefined, true))
		mockMenus.mockReturnValue(query<CustomMenu[]>(undefined, true))
		renderIndex()

		expect(screen.getByText('Loading…')).toBeInTheDocument()
		expect(screen.queryByText('Profile Body')).not.toBeInTheDocument()
	})

	it('prefers saved drinks when there are any', () => {
		mockSaved.mockReturnValue(query(savedRow))
		mockMenus.mockReturnValue(query(menuRow))
		renderIndex()

		expect(screen.getByText('Saved Body')).toBeInTheDocument()
	})

	it('falls through to menus when nothing is saved', () => {
		mockSaved.mockReturnValue(query<SavedDrink[]>([]))
		mockMenus.mockReturnValue(query(menuRow))
		renderIndex()

		expect(screen.getByText('Menus Body')).toBeInTheDocument()
	})

	it('lands on profile for a brand-new account', () => {
		mockSaved.mockReturnValue(query<SavedDrink[]>([]))
		mockMenus.mockReturnValue(query<CustomMenu[]>([]))
		renderIndex()

		expect(screen.getByText('Profile Body')).toBeInTheDocument()
	})
})
