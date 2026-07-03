import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchSavedDrinks, saveDrink, unsaveDrink } from '../api/savedDrinks'
import type { SavedDrink } from '../types/user'
import { useAuthUser } from './useAuthUser'

// Cache key is scoped by uid so two accounts on the same device never share
// saved-drink data. Disabled queries (signed out) simply never run.
const savedKey = (uid: string | undefined) => ['saved', uid] as const

/** The signed-in user's saved drinks, most recent first. Idle when signed out. */
export function useSavedDrinks() {
	const { user } = useAuthUser()
	const uid = user?.uid
	return useQuery({
		queryKey: savedKey(uid),
		queryFn: () => fetchSavedDrinks(uid!),
		enabled: !!uid,
	})
}

/**
 * O(1) lookup set of saved drink ids, derived from the same query via `select`.
 * Handy for save toggles on cards where we only need "is this one saved?".
 */
export function useSavedDrinkIds(): Set<string> {
	const { user } = useAuthUser()
	const uid = user?.uid
	const { data } = useQuery({
		queryKey: savedKey(uid),
		queryFn: () => fetchSavedDrinks(uid!),
		enabled: !!uid,
		select: (rows: SavedDrink[]) => new Set(rows.map((r) => r.drinkId)),
	})
	return data ?? new Set()
}

/**
 * Toggle a drink's saved state. Optimistically updates the cache so the UI
 * flips immediately, rolls back on error, and re-syncs with the server after.
 */
export function useToggleSaved() {
	const { user } = useAuthUser()
	const uid = user?.uid
	const qc = useQueryClient()

	return useMutation({
		mutationFn: async ({
			drinkId,
			save,
		}: {
			drinkId: string
			save: boolean
		}) => {
			if (!uid) throw new Error('Must be signed in to save drinks')
			if (save) await saveDrink(uid, drinkId)
			else await unsaveDrink(uid, drinkId)
		},
		onMutate: async ({ drinkId, save }) => {
			const key = savedKey(uid)
			// Stop in-flight refetches so they can't clobber our optimistic write.
			await qc.cancelQueries({ queryKey: key })
			const previous = qc.getQueryData<SavedDrink[]>(key)
			qc.setQueryData<SavedDrink[]>(key, (rows = []) =>
				save
					? [
							{ drinkId, savedAt: Date.now() },
							...rows.filter((r) => r.drinkId !== drinkId),
						]
					: rows.filter((r) => r.drinkId !== drinkId),
			)
			return { previous }
		},
		onError: (_err, _vars, context) => {
			// Restore the pre-mutation snapshot if the write failed.
			if (context?.previous) qc.setQueryData(savedKey(uid), context.previous)
		},
		onSettled: () => {
			void qc.invalidateQueries({ queryKey: savedKey(uid) })
		},
	})
}
