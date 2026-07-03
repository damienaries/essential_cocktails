import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAdmin } from '../../src/components/RequireAdmin'
import type { User } from 'firebase/auth'

vi.mock('../../src/hooks/useAuthUser', () => ({
	useAuthUser: vi.fn(),
}))

import { useAuthUser } from '../../src/hooks/useAuthUser'

const mocked = vi.mocked(useAuthUser)

const fakeUser = { uid: 'fake-uid' } as User

// Build a full AuthState from the fields each test cares about.
function authState(partial: {
	user: User | null
	isPending: boolean
	isAdmin: boolean
}) {
	return { ...partial, refreshUser: vi.fn() }
}

function renderAt(path: string) {
	return render(
		<MemoryRouter initialEntries={[path]}>
			<Routes>
				<Route
					path="/admin"
					element={
						<RequireAdmin>
							<div>Admin Page Body</div>
						</RequireAdmin>
					}
				/>
				<Route path="/signin" element={<div>Sign In Body</div>} />
				<Route path="/" element={<div>Home Body</div>} />
			</Routes>
		</MemoryRouter>,
	)
}

beforeEach(() => {
	mocked.mockReset()
})

describe('RequireAdmin', () => {
	it('shows loading state while auth is pending', () => {
		mocked.mockReturnValue(authState({ user: null, isPending: true, isAdmin: false }))
		renderAt('/admin')
		expect(screen.getByText(/checking access/i)).toBeInTheDocument()
		expect(screen.queryByText('Admin Page Body')).not.toBeInTheDocument()
	})

	it('redirects unauthenticated users to /signin', () => {
		mocked.mockReturnValue(authState({ user: null, isPending: false, isAdmin: false }))
		renderAt('/admin')
		expect(screen.getByText('Sign In Body')).toBeInTheDocument()
		expect(screen.queryByText('Admin Page Body')).not.toBeInTheDocument()
	})

	it('redirects signed-in non-admins to home', () => {
		mocked.mockReturnValue(authState({ user: fakeUser, isPending: false, isAdmin: false }))
		renderAt('/admin')
		expect(screen.getByText('Home Body')).toBeInTheDocument()
		expect(screen.queryByText('Admin Page Body')).not.toBeInTheDocument()
	})

	it('renders children for admin users', () => {
		mocked.mockReturnValue(authState({ user: fakeUser, isPending: false, isAdmin: true }))
		renderAt('/admin')
		expect(screen.getByText('Admin Page Body')).toBeInTheDocument()
	})
})
