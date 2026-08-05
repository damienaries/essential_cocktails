import { describe, expect, it, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Drink } from '../../src/types/drink'

vi.mock('../../src/api/drinks', () => ({
	fetchAllDrinks: vi.fn(),
	fetchLibraryVersion: vi.fn(),
}))

import { fetchAllDrinks, fetchLibraryVersion } from '../../src/api/drinks'
import {
	DRINKS_QUERY_KEY,
	LIBRARY_VERSION_KEY,
	useDrinksQuery,
} from '../../src/hooks/useDrinksQuery'

const mockFetchAll = vi.mocked(fetchAllDrinks)
const mockVersion = vi.mocked(fetchLibraryVersion)

const library: Drink[] = [
	{ id: 'd1', name: 'Daiquiri' },
	{ id: 'd2', name: 'Mai Tai' },
]

function client() {
	return new QueryClient({
		defaultOptions: { queries: { retry: false } },
	})
}

function renderWith(qc: QueryClient) {
	const wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={qc}>{children}</QueryClientProvider>
	)
	return renderHook(() => useDrinksQuery(), { wrapper })
}

/**
 * Stands in for a cache restored from localStorage on a fresh page load. The
 * timestamp is backdated past `staleTime` — a cache that still counts as fresh
 * isn't revalidated at all, which is a separate case tested below.
 */
function seedCache(qc: QueryClient, version: number, drinks: Drink[]) {
	const lastSession = Date.now() - 60 * 60 * 1000
	qc.setQueryData(LIBRARY_VERSION_KEY, version, { updatedAt: lastSession })
	qc.setQueryData(DRINKS_QUERY_KEY, drinks, { updatedAt: lastSession })
}

describe('useDrinksQuery', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockVersion.mockResolvedValue(1000)
		mockFetchAll.mockResolvedValue(library)
	})

	it('fetches the whole library on a cold cache', async () => {
		const { result } = renderWith(client())

		await waitFor(() => expect(result.current.data).toEqual(library))
		expect(mockFetchAll).toHaveBeenCalledTimes(1)
	})

	it('records the version so later loads can compare against it', async () => {
		const qc = client()
		const { result } = renderWith(qc)

		await waitFor(() => expect(result.current.data).toEqual(library))
		expect(qc.getQueryData(LIBRARY_VERSION_KEY)).toBe(1000)
	})

	it('skips the full fetch when the version has not moved', async () => {
		const qc = client()
		seedCache(qc, 1000, library)

		const { result } = renderWith(qc)
		await waitFor(() => expect(mockVersion).toHaveBeenCalled())

		expect(result.current.data).toEqual(library)
		expect(mockFetchAll).not.toHaveBeenCalled()
	})

	it('refetches everything when the version moved', async () => {
		const qc = client()
		seedCache(qc, 999, [{ id: 'stale', name: 'Stale Drink' }])
		mockVersion.mockResolvedValue(1000)

		const { result } = renderWith(qc)

		await waitFor(() => expect(result.current.data).toEqual(library))
		expect(mockFetchAll).toHaveBeenCalledTimes(1)
		expect(qc.getQueryData(LIBRARY_VERSION_KEY)).toBe(1000)
	})

	it('makes no request at all while the cache is still fresh', async () => {
		const qc = client()
		qc.setQueryData(LIBRARY_VERSION_KEY, 1000)
		qc.setQueryData(DRINKS_QUERY_KEY, library)

		const { result } = renderWith(qc)

		expect(result.current.data).toEqual(library)
		expect(mockVersion).not.toHaveBeenCalled()
		expect(mockFetchAll).not.toHaveBeenCalled()
	})

	it('refetches when the version survived but the drinks did not', async () => {
		// localStorage eviction or a partial restore: trusting the version alone here
		// would leave the app with no drinks and no way to recover.
		const qc = client()
		qc.setQueryData(LIBRARY_VERSION_KEY, 1000)

		const { result } = renderWith(qc)

		await waitFor(() => expect(result.current.data).toEqual(library))
		expect(mockFetchAll).toHaveBeenCalledTimes(1)
	})

	it('refetches when the meta doc is missing entirely', async () => {
		// Version 0 means "unknown" — before the doc exists, every load must fetch
		// rather than pinning itself to a version that never changes.
		const qc = client()
		seedCache(qc, 0, library)
		mockVersion.mockResolvedValue(0)

		const { result } = renderWith(qc)

		await waitFor(() => expect(result.current.data).toEqual(library))
		expect(mockFetchAll).toHaveBeenCalledTimes(1)
	})
})
