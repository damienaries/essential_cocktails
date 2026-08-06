import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareDrinkButton } from '../../src/components/ShareDrinkButton'
import type { Drink } from '../../src/types/drink'

const drink: Drink = { id: 'd1', name: 'Negroni Sbagliato' }

// `userEvent.setup()` installs its own clipboard stub, so ours has to go in after
// it. jsdom also exposes `navigator.clipboard` as a getter-only property, so it has to be
// redefined rather than assigned.
function mockClipboard(writeText = vi.fn(async () => undefined)) {
	Object.defineProperty(navigator, 'clipboard', {
		value: { writeText },
		configurable: true,
		writable: true,
	})
	return writeText
}

describe('ShareDrinkButton', () => {
	beforeEach(() => vi.clearAllMocks())
	afterEach(() => vi.useRealTimers())

	it('copies the canonical drink URL, not the current address bar', async () => {
		const user = userEvent.setup()
		const writeText = mockClipboard()
		render(<ShareDrinkButton drink={drink} />)

		await user.click(screen.getByRole('button'))

		expect(writeText).toHaveBeenCalledWith(
			`${window.location.origin}/drinks/negroni-sbagliato`,
		)
	})

	it('confirms the copy', async () => {
		const user = userEvent.setup()
		mockClipboard()
		render(<ShareDrinkButton drink={drink} />)

		expect(screen.getByRole('status')).toHaveTextContent('')

		await user.click(screen.getByRole('button'))

		await waitFor(() =>
			expect(screen.getByRole('status')).toHaveTextContent('Link copied'),
		)
	})

	it('stays quiet when the clipboard is unavailable', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {})
		const user = userEvent.setup()
		mockClipboard(vi.fn(async () => Promise.reject(new Error('denied'))))
		render(<ShareDrinkButton drink={drink} />)

		await user.click(screen.getByRole('button'))

		// No false confirmation — claiming success on a failed copy is worse than
		// saying nothing, since the user would paste something stale.
		expect(screen.getByRole('status')).toHaveTextContent('')
	})

	it('names the drink for screen readers', () => {
		mockClipboard()
		render(<ShareDrinkButton drink={drink} />)

		expect(
			screen.getByRole('button', { name: 'Copy link to Negroni Sbagliato' }),
		).toBeInTheDocument()
	})
})
