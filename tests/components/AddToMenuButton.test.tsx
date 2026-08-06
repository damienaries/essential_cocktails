import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { User } from 'firebase/auth'
import type { CustomMenu } from '../../src/types/user'

vi.mock('../../src/hooks/useAuthUser', () => ({ useAuthUser: vi.fn() }))
vi.mock('../../src/hooks/useMenus', () => ({
	useMenus: vi.fn(),
	useCreateMenu: vi.fn(),
	useUpdateMenu: vi.fn(),
}))

import { AddToMenuButton } from '../../src/components/menus/AddToMenuButton'
import { useAuthUser } from '../../src/hooks/useAuthUser'
import {
	useCreateMenu,
	useMenus,
	useUpdateMenu,
} from '../../src/hooks/useMenus'

const mockAuth = vi.mocked(useAuthUser)
const mockMenus = vi.mocked(useMenus)
const mockCreate = vi.mocked(useCreateMenu)
const mockUpdate = vi.mocked(useUpdateMenu)

const updateMutate = vi.fn()

const menus: CustomMenu[] = [
	{ id: 'm1', name: 'Tiki Night', drinkIds: [], createdAt: 0, updatedAt: 0 },
]

function setAuth(signedIn: boolean) {
	mockAuth.mockReturnValue({
		user: signedIn ? ({ uid: 'u1' } as User) : null,
		isPending: false,
		isAdmin: false,
		refreshUser: vi.fn(),
	})
}

describe('AddToMenuButton', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockMenus.mockReturnValue({ data: menus, isLoading: false } as ReturnType<
			typeof useMenus
		>)
		mockUpdate.mockReturnValue({ mutate: updateMutate } as unknown as ReturnType<
			typeof useUpdateMenu
		>)
		mockCreate.mockReturnValue({
			mutate: vi.fn(),
			isPending: false,
		} as unknown as ReturnType<typeof useCreateMenu>)
	})

	it('opens the menu list for a signed-in user', async () => {
		setAuth(true)
		const user = userEvent.setup()
		render(<AddToMenuButton drinkId="d1" />)

		await user.click(screen.getByRole('button', { name: 'Add to menu' }))

		expect(screen.getByRole('dialog', { name: 'Add to menu' })).toBeVisible()
		expect(screen.getByText('Tiki Night')).toBeInTheDocument()
	})

	it('hints instead of redirecting when signed out', async () => {
		setAuth(false)
		const user = userEvent.setup()
		render(<AddToMenuButton drinkId="d1" />)

		const button = screen.getByRole('button', {
			name: 'Log in to add to a menu',
		})
		await user.click(button)

		// Visible and explained, so the feature is discoverable without an account.
		expect(screen.getByRole('tooltip')).toHaveTextContent('Log in to build menus')
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
		expect(button).toHaveAttribute('aria-disabled', 'true')
		expect(button).not.toBeDisabled()
	})

	it('adds the drink and closes when a menu is picked', async () => {
		setAuth(true)
		const user = userEvent.setup()
		render(<AddToMenuButton drinkId="d1" />)

		await user.click(screen.getByRole('button', { name: 'Add to menu' }))
		await user.click(screen.getByRole('checkbox'))

		expect(updateMutate).toHaveBeenCalledWith({
			menuId: 'm1',
			patch: { drinkIds: ['d1'] },
		})
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
	})
})
