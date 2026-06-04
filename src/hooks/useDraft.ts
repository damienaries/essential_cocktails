import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

type Plain = Record<string, unknown>

function readFromStorage<T>(key: string): Partial<T> | null {
	if (typeof window === 'undefined') return null
	try {
		const raw = window.localStorage.getItem(key)
		return raw ? (JSON.parse(raw) as Partial<T>) : null
	} catch {
		return null
	}
}

function writeToStorage(key: string, value: unknown): void {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.setItem(key, JSON.stringify(value))
	} catch {
		/* quota or private mode — fall through silently */
	}
}

function removeFromStorage(key: string): void {
	if (typeof window === 'undefined') return
	try {
		window.localStorage.removeItem(key)
	} catch {
		/* ignore */
	}
}

export type UseDraftOptions = {
	/**
	 * When false, the hook behaves like plain `useState`: no storage read on
	 * mount, no write on change. Use this to opt out conditionally — e.g. the
	 * admin drink form persists in 'add' mode but not 'edit' mode.
	 */
	enabled?: boolean
}

/**
 * `useState` backed by `localStorage`.
 *
 *  - On mount: reads the stored value and shallow-merges it over `initial`, so a
 *    draft saved against an older schema doesn't crash when fields are added.
 *  - On change: writes the full value to storage. localStorage writes are
 *    synchronous and fast enough that no debounce is needed.
 *  - Returns `[value, setValue, clearDraft]`. Call `clearDraft()` after a
 *    successful save (or an explicit "discard" action) to start fresh.
 *  - When `options.enabled` is false, the hook silently skips all storage
 *    interactions — `clearDraft` is still safe to call (no-op).
 */
export function useDraft<T extends Plain>(
	key: string,
	initial: T,
	options: UseDraftOptions = {},
): [T, Dispatch<SetStateAction<T>>, () => void] {
	const enabled = options.enabled ?? true

	const [value, setValue] = useState<T>(() => {
		if (!enabled) return initial
		const stored = readFromStorage<T>(key)
		return stored ? { ...initial, ...stored } : initial
	})

	useEffect(() => {
		if (!enabled) return
		writeToStorage(key, value)
	}, [enabled, key, value])

	const clearDraft = () => {
		if (!enabled) return
		removeFromStorage(key)
	}

	return [value, setValue, clearDraft]
}
