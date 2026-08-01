import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import type { User } from 'firebase/auth'

vi.mock('../../src/hooks/useAuthUser', () => ({
	useAuthUser: vi.fn(),
}))

import { RequireAuth } from '../../src/components/RequireAuth'
import { useAuthUser } from '../../src/hooks/useAuthUser'

const mocked = vi.mocked(useAuthUser)

function authState(partial: {
	user: User | null
	isPending: boolean
	isAdmin?: boolean
}) {
	return {
		isAdmin: false,
		...partial,
		refreshUser: vi.fn(),
	}
}

/** Echoes the sign-in URL so the `next` round-trip can be asserted. */
function SignInProbe() {
	const { pathname, search } = useLocation()
	return <div>{`Sign In Body ${pathname}${search}`}</div>
}

function renderAt(path: string) {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route
					path="/account/saved"
					element={
						<RequireAuth>
							<div>Account Body</div>
						</RequireAuth>
					}
				/>
				<Route path="/signin" element={<SignInProbe />} />
			</Routes>
		</MemoryRouter>,
	)
}

describe('RequireAuth', () => {
	beforeEach(() => vi.clearAllMocks())

	it('waits while auth is resolving instead of bouncing to sign-in', () => {
		mocked.mockReturnValue(authState({ user: null, isPending: true }))
		renderAt('/account/saved')

		expect(screen.getByText('Checking access…')).toBeInTheDocument()
		expect(screen.queryByText(/Sign In Body/)).not.toBeInTheDocument()
	})

	it('renders the page for a signed-in user, admin or not', () => {
		mocked.mockReturnValue(
			authState({ user: { uid: 'u1' } as User, isPending: false }),
		)
		renderAt('/account/saved')

		expect(screen.getByText('Account Body')).toBeInTheDocument()
	})

	it('sends signed-out visitors to sign-in with a way back', () => {
		mocked.mockReturnValue(authState({ user: null, isPending: false }))
		renderAt('/account/saved')

		expect(
			screen.getByText(
				`Sign In Body /signin?next=${encodeURIComponent('/account/saved')}`,
			),
		).toBeInTheDocument()
	})
})
