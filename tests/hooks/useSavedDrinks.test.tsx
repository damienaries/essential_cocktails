import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { User } from 'firebase/auth'

vi.mock('../../src/api/savedDrinks', () => ({
	fetchSavedDrinks: vi.fn(),
	saveDrink: vi.fn(),
	unsaveDrink: vi.fn(),
}))

vi.mock('../../src/hooks/useAuthUser', () => ({
	useAuthUser: vi.fn(),
}))

import {
	fetchSavedDrinks,
	saveDrink,
	unsaveDrink,
} from '../../src/api/savedDrinks'
import { useAuthUser } from '../../src/hooks/useAuthUser'
import {
	useSavedDrinkIds,
	useToggleSaved,
} from '../../src/hooks/useSavedDrinks'

const mockFetch = vi.mocked(fetchSavedDrinks)
const mockSave = vi.mocked(saveDrink)
const mockUnsave = vi.mocked(unsaveDrink)
const mockAuth = vi.mocked(useAuthUser)

function signedIn(uid = 'user-1') {
	mockAuth.mockReturnValue({
		user: { uid } as User,
		isPending: false,
		isAdmin: false,
		refreshUser: vi.fn(),
	})
}

/** Fresh client per test so one test's cache can't leak into the next. */
function wrapper() {
	const client = new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	})
	return ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={client}>{children}</QueryClientProvider>
	)
}

/** Renders the read and the mutation together, the way a save button uses them. */
function renderSaveToggle() {
	return renderHook(
		() => ({ ids: useSavedDrinkIds(), toggle: useToggleSaved() }),
		{ wrapper: wrapper() },
	)
}

describe('useSavedDrinks', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		signedIn()
	})

	it('exposes fetched saves as an id set', async () => {
		mockFetch.mockResolvedValue([{ drinkId: 'd1', savedAt: 1 }])
		const { result } = renderSaveToggle()

		await waitFor(() => expect(result.current.ids.has('d1')).toBe(true))
	})

	it('does not query while signed out', () => {
		mockAuth.mockReturnValue({
			user: null,
			isPending: false,
			isAdmin: false,
			refreshUser: vi.fn(),
		})
		const { result } = renderSaveToggle()

		expect(mockFetch).not.toHaveBeenCalled()
		expect(result.current.ids.size).toBe(0)
	})

	it('shows the save immediately, before the write resolves', async () => {
		mockFetch.mockResolvedValue([])
		// Hold the write open so we can observe the optimistic state on its own.
		let release!: () => void
		mockSave.mockReturnValue(
			new Promise<void>((resolve) => {
				release = resolve
			}),
		)

		const { result } = renderSaveToggle()
		await waitFor(() => expect(mockFetch).toHaveBeenCalled())

		act(() => {
			result.current.toggle.mutate({ drinkId: 'd1', save: true })
		})

		await waitFor(() => expect(result.current.ids.has('d1')).toBe(true))
		expect(mockSave).toHaveBeenCalledWith('user-1', 'd1')

		mockFetch.mockResolvedValue([{ drinkId: 'd1', savedAt: 2 }])
		await act(async () => {
			release()
		})
		await waitFor(() => expect(result.current.ids.has('d1')).toBe(true))
	})

	it('rolls the save back when the write fails', async () => {
		mockFetch.mockResolvedValue([])
		mockSave.mockRejectedValue(new Error('offline'))

		const { result } = renderSaveToggle()
		await waitFor(() => expect(mockFetch).toHaveBeenCalled())

		// Hold the post-mutation refetch open. Otherwise it resolves to the server's
		// (empty) truth and hides whether the rollback itself ever happened.
		mockFetch.mockReturnValue(new Promise(() => {}))

		act(() => {
			result.current.toggle.mutate({ drinkId: 'd1', save: true })
		})

		await waitFor(() => expect(result.current.toggle.isError).toBe(true))
		expect(result.current.ids.has('d1')).toBe(false)
	})

	it('removes a save optimistically when toggling off', async () => {
		mockFetch.mockResolvedValue([{ drinkId: 'd1', savedAt: 1 }])
		let release!: () => void
		mockUnsave.mockReturnValue(
			new Promise<void>((resolve) => {
				release = resolve
			}),
		)

		const { result } = renderSaveToggle()
		await waitFor(() => expect(result.current.ids.has('d1')).toBe(true))

		act(() => {
			result.current.toggle.mutate({ drinkId: 'd1', save: false })
		})

		await waitFor(() => expect(result.current.ids.has('d1')).toBe(false))
		expect(mockUnsave).toHaveBeenCalledWith('user-1', 'd1')

		mockFetch.mockResolvedValue([])
		await act(async () => {
			release()
		})
	})
})
