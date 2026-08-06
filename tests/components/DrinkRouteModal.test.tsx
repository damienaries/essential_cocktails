import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
	MemoryRouter,
	Route,
	Routes,
	useLocation,
} from 'react-router-dom'
import type { Drink } from '../../src/types/drink'

vi.mock('../../src/hooks/useDrinksQuery', () => ({
	useDrinksQuery: vi.fn(),
}))

// The modal itself is heavy (icons, motion, save/menu hooks); this suite is about
// routing, so it stands in for the real one.
vi.mock('../../src/components/DrinkDetailModal', () => ({
	DrinkDetailModal: ({
		drink,
		drinks,
		onClose,
		onNavigate,
	}: {
		drink: Drink
		drinks?: Drink[]
		onClose: () => void
		onNavigate?: (d: Drink) => void
	}) => (
		<div>
			<h2>{drink.name}</h2>
			<p>siblings:{drinks?.length ?? 0}</p>
			<button type="button" onClick={onClose}>
				Close
			</button>
			{drinks?.[1] ? (
				<button type="button" onClick={() => onNavigate?.(drinks[1])}>
					Next
				</button>
			) : null}
		</div>
	),
}))

import { DrinkRouteModal } from '../../src/components/DrinkRouteModal'
import { useDrinksQuery } from '../../src/hooks/useDrinksQuery'
import { useOpenDrink, useRoutedLocation } from '../../src/hooks/useDrinkRoute'

const mockDrinks = vi.mocked(useDrinksQuery)

const library: Drink[] = [
	{ id: 'd1', name: 'Negroni' },
	{ id: 'd2', name: 'Negroni Sbagliato' },
	{ id: 'd3', name: 'Daiquiri' },
]

function Probe() {
	const { pathname } = useLocation()
	return <span data-testid="url">{pathname}</span>
}

/** A grid page that opens drinks the way the real pages do. */
function GridPage({ siblings }: { siblings?: Drink[] }) {
	const openDrink = useOpenDrink()
	return (
		<div>
			<span>Grid Body</span>
			<button type="button" onClick={() => openDrink(library[0], siblings)}>
				Open Negroni
			</button>
		</div>
	)
}

/** Mirrors App: pages render at the routed location, the modal sits above them. */
function Shell({ siblings }: { siblings?: Drink[] }) {
	const routedLocation = useRoutedLocation()
	return (
		<>
			<Routes location={routedLocation}>
				<Route path="/" element={<GridPage siblings={siblings} />} />
				<Route path="/families" element={<GridPage siblings={siblings} />} />
			</Routes>
			<DrinkRouteModal />
			<Probe />
		</>
	)
}

function renderAt(path: string, siblings?: Drink[]) {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<Shell siblings={siblings} />
		</MemoryRouter>,
	)
}

describe('DrinkRouteModal', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockDrinks.mockReturnValue({ data: library } as ReturnType<
			typeof useDrinksQuery
		>)
	})

	it('opens straight from a pasted URL', () => {
		renderAt('/drinks/negroni-sbagliato')
		expect(screen.getByText('Negroni Sbagliato')).toBeInTheDocument()
	})

	it('falls back to the whole library for prev/next on a pasted link', () => {
		renderAt('/drinks/negroni')
		expect(screen.getByText(`siblings:${library.length}`)).toBeInTheDocument()
	})

	it('renders nothing for an unknown slug rather than crashing', () => {
		renderAt('/drinks/not-a-drink')
		expect(screen.queryByRole('heading')).not.toBeInTheDocument()
	})

	it('waits for the library instead of flashing "not found"', () => {
		mockDrinks.mockReturnValue({ data: undefined } as ReturnType<
			typeof useDrinksQuery
		>)
		renderAt('/drinks/negroni')
		expect(screen.queryByText('Negroni')).not.toBeInTheDocument()
	})

	it('puts the drink in the URL when opened from a page', async () => {
		const user = userEvent.setup()
		renderAt('/')

		await user.click(screen.getByText('Open Negroni'))

		expect(screen.getByTestId('url')).toHaveTextContent('/drinks/negroni')
		expect(screen.getByText('Negroni')).toBeInTheDocument()
	})

	it('keeps the page underneath rendered while the modal is open', async () => {
		const user = userEvent.setup()
		renderAt('/')

		await user.click(screen.getByText('Open Negroni'))

		expect(screen.getByText('Grid Body')).toBeInTheDocument()
	})

	it('scopes prev/next to the list the drink was opened from', async () => {
		const user = userEvent.setup()
		renderAt('/families', [library[0], library[1]])

		await user.click(screen.getByText('Open Negroni'))

		expect(screen.getByText('siblings:2')).toBeInTheDocument()
	})

	it('closing returns to the page it was opened from', async () => {
		const user = userEvent.setup()
		renderAt('/families')

		await user.click(screen.getByText('Open Negroni'))
		await user.click(screen.getByText('Close'))

		expect(screen.getByTestId('url')).toHaveTextContent('/families')
		expect(screen.queryByText('Negroni')).not.toBeInTheDocument()
	})

	it('closing a pasted link lands on the grid', async () => {
		const user = userEvent.setup()
		renderAt('/drinks/negroni')

		await user.click(screen.getByText('Close'))

		expect(screen.getByTestId('url')).toHaveTextContent('/')
	})

	it('prev/next swaps the URL without stacking history entries', async () => {
		const user = userEvent.setup()
		renderAt('/families')

		await user.click(screen.getByText('Open Negroni'))
		await user.click(screen.getByText('Next'))
		expect(screen.getByTestId('url')).toHaveTextContent(
			'/drinks/negroni-sbagliato',
		)

		// One Close, not two, gets back to the page — the walk used `replace`.
		await user.click(screen.getByText('Close'))
		expect(screen.getByTestId('url')).toHaveTextContent('/families')
	})
})

/** Guards the App-level rule that the modal URL doesn't swap the page behind it. */
describe('background location', () => {
	it('a drink URL opened in-app keeps the previous page as the background', async () => {
		const user = userEvent.setup()
		mockDrinks.mockReturnValue({ data: library } as ReturnType<
			typeof useDrinksQuery
		>)

		function BackgroundProbe() {
			const location = useLocation()
			const state = location.state as { background?: { pathname: string } }
			return <span data-testid="bg">{state?.background?.pathname ?? 'none'}</span>
		}

		render(
			<MemoryRouter initialEntries={['/families']}>
				<Routes>
					<Route path="/families" element={<GridPage />} />
					<Route path="/drinks/:slug" element={null} />
				</Routes>
				<BackgroundProbe />
			</MemoryRouter>,
		)

		await user.click(screen.getByText('Open Negroni'))
		expect(screen.getByTestId('bg')).toHaveTextContent('/families')
	})
})
