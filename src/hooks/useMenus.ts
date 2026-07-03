import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	createMenu,
	deleteMenu,
	fetchMenu,
	fetchMenus,
	updateMenu,
	type MenuPatch,
} from '../api/menus'
import { useAuthUser } from './useAuthUser'

// List key is scoped by uid; a single menu adds its id. Keeping them related
// (`['menus', uid]` vs `['menus', uid, menuId]`) lets us invalidate precisely.
const menusKey = (uid: string | undefined) => ['menus', uid] as const
const menuKey = (uid: string | undefined, menuId: string) =>
	['menus', uid, menuId] as const

/** All of the signed-in user's menus, most recently updated first. */
export function useMenus() {
	const { user } = useAuthUser()
	const uid = user?.uid
	return useQuery({
		queryKey: menusKey(uid),
		queryFn: () => fetchMenus(uid!),
		enabled: !!uid,
	})
}

/** A single menu by id (e.g. the menu detail page). */
export function useMenu(menuId: string | undefined) {
	const { user } = useAuthUser()
	const uid = user?.uid
	return useQuery({
		queryKey: menuKey(uid, menuId ?? ''),
		queryFn: () => fetchMenu(uid!, menuId!),
		enabled: !!uid && !!menuId,
	})
}

/** Create a menu; resolves to the new id. Refreshes the menu list. */
export function useCreateMenu() {
	const { user } = useAuthUser()
	const uid = user?.uid
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ name, drinkIds }: { name: string; drinkIds?: string[] }) => {
			if (!uid) throw new Error('Must be signed in to create a menu')
			return createMenu(uid, name, drinkIds)
		},
		onSuccess: () => void qc.invalidateQueries({ queryKey: menusKey(uid) }),
	})
}

/** Update a menu's name and/or drinks. Refreshes both the list and that menu. */
export function useUpdateMenu() {
	const { user } = useAuthUser()
	const uid = user?.uid
	const qc = useQueryClient()
	return useMutation({
		mutationFn: ({ menuId, patch }: { menuId: string; patch: MenuPatch }) => {
			if (!uid) throw new Error('Must be signed in to update a menu')
			return updateMenu(uid, menuId, patch)
		},
		onSuccess: (_data, { menuId }) => {
			void qc.invalidateQueries({ queryKey: menusKey(uid) })
			void qc.invalidateQueries({ queryKey: menuKey(uid, menuId) })
		},
	})
}

/** Delete a menu. Refreshes the menu list. */
export function useDeleteMenu() {
	const { user } = useAuthUser()
	const uid = user?.uid
	const qc = useQueryClient()
	return useMutation({
		mutationFn: (menuId: string) => {
			if (!uid) throw new Error('Must be signed in to delete a menu')
			return deleteMenu(uid, menuId)
		},
		onSuccess: () => void qc.invalidateQueries({ queryKey: menusKey(uid) }),
	})
}
