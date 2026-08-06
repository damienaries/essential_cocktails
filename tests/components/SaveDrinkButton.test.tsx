import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'

vi.mock('../../src/hooks/useAuthUser', () => ({ useAuthUser: vi.fn() }))
vi.mock('../../src/hooks/useSavedDrinks', () => ({
	useSavedDrinkIds: vi.fn(),
	useToggleSaved: vi.fn(),
}))

import { SaveDrinkButton } from '../../src/components/SaveDrinkButton'
import { useAuthUser } from '../../src/hooks/useAuthUser'
import {
	useSavedDrinkIds,
	useToggleSaved,
} from '../../src/hooks/useSavedDrinks'

const mockAuth = vi.mocked(useAuthUser)
const mockIds = vi.mocked(useSavedDrinkIds)
const mockToggle = vi.mocked(useToggleSaved)

const mutate = vi.fn()

function signedIn(savedIds: string[] = []) {
	mockAuth.mockReturnValue({
		user: { uid: 'u1' } as User,
		isPending: false,
		isAdmin: false,
		refreshUser: vi.fn(),
	})
	mockIds.mockReturnValue(new Set(savedIds))
}

function signedOut() {
	mockAuth.mockReturnValue({
		user: null,
		isPending: false,
		isAdmin: false,
		refreshUser: vi.fn(),
	})
	mockIds.mockReturnValue(new Set())
}

function renderButton() {
	return render(<SaveDrinkButton drinkId="d1" drinkName="Negroni" />)
}

describe('SaveDrinkButton', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockToggle.mockReturnValue({ mutate } as unknown as ReturnType<
			typeof useToggleSaved
		>)
	})

	it('toggles the save for a signed-in user', async () => {
		signedIn()
		const user = userEvent.setup()
		renderButton()

		await user.click(screen.getByRole('button'))

		expect(mutate).toHaveBeenCalledWith({ drinkId: 'd1', save: true })
	})

	it('unsaves a drink that is already saved', async () => {
		signedIn(['d1'])
		const user = userEvent.setup()
		renderButton()

		await user.click(screen.getByRole('button'))

		expect(mutate).toHaveBeenCalledWith({ drinkId: 'd1', save: false })
	})

	it('does not navigate signed-out users away', async () => {
		// Bouncing someone to sign-in for tapping a heart loses their place; the
		// button explains itself instead.
		signedOut()
		const user = userEvent.setup()
		renderButton()

		await user.click(screen.getByRole('button'))

		expect(mutate).not.toHaveBeenCalled()
		expect(screen.getByRole('tooltip')).toHaveTextContent('Log in to save')
	})

	it('marks itself unavailable but stays reachable when signed out', () => {
		signedOut()
		renderButton()

		const button = screen.getByRole('button')
		expect(button).toHaveAttribute('aria-disabled', 'true')
		// Not `disabled`: that would drop it from the tab order and hide the hint
		// from keyboard users entirely.
		expect(button).not.toBeDisabled()
		expect(button).toHaveAccessibleName('Log in to save Negroni')
	})

	it('shows no hint at all when signed in', () => {
		signedIn()
		renderButton()

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
	})
})
