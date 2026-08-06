import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useCreateMenu, useMenus, useUpdateMenu } from '../../hooks/useMenus';
import { MENU_NAME_MAX_LENGTH } from '../../lib/menuName';
import { Button } from '../atoms/Button';
import { SvgIcon } from '../atoms/SvgIcon';

type Props = {
	drinkId: string;
};

/** How long the signed-out hint stays up after a tap. */
const HINT_MS = 1500;

/**
 * "Add to menu" control, sized to sit alongside save and share over the drink photo.
 * Signed-out visitors see the button and a hint rather than a redirect — the point is
 * that they learn the feature exists without losing their place.
 */
export function AddToMenuButton({ drinkId }: Props) {
	const { user } = useAuthUser();
	const [open, setOpen] = useState(false);
	const [hintShown, setHintShown] = useState(false);
	const [newName, setNewName] = useState('');
	const wrapRef = useRef<HTMLDivElement | null>(null);
	const { data: menus = [], isLoading } = useMenus();
	const updateMenu = useUpdateMenu();
	const createMenu = useCreateMenu();

	const signedOut = !user;

	useEffect(() => {
		if (!hintShown) return;
		const timer = setTimeout(() => setHintShown(false), HINT_MS);
		return () => clearTimeout(timer);
	}, [hintShown]);

	// Close on an outside click, and on Escape without also closing the drink modal.
	// The capture-phase listener runs before the modal's window handler, so
	// stopImmediatePropagation keeps Escape scoped to the dropdown.
	useEffect(() => {
		if (!open) return;

		const onPointerDown = (e: globalThis.MouseEvent) => {
			if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
		};
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			e.stopImmediatePropagation();
			setOpen(false);
		};

		document.addEventListener('mousedown', onPointerDown);
		window.addEventListener('keydown', onKeyDown, { capture: true });
		return () => {
			document.removeEventListener('mousedown', onPointerDown);
			window.removeEventListener('keydown', onKeyDown, { capture: true });
		};
	}, [open]);

	const handleToggleOpen = (e: MouseEvent<HTMLButtonElement>) => {
		e.stopPropagation();
		if (signedOut) {
			setHintShown(true);
			return;
		}
		setOpen((v) => !v);
	};

	// Picking a menu is the whole job, so the dropdown closes on the way out. The
	// pills below the panel handle removals.
	const setMembership = (
		menuId: string,
		drinkIds: string[],
		include: boolean,
	) => {
		const next = include
			? [...drinkIds, drinkId]
			: drinkIds.filter((id) => id !== drinkId);
		updateMenu.mutate({ menuId, patch: { drinkIds: next } });
		setOpen(false);
	};

	const handleCreate = () => {
		const name = newName.trim();
		if (!name) return;
		// New menus start with this drink on them — that's why we're here.
		createMenu.mutate({ name, drinkIds: [drinkId] });
		setNewName('');
		setOpen(false);
	};

	return (
		<div ref={wrapRef} className="group/menu relative inline-flex">
			<button
				type="button"
				onClick={handleToggleOpen}
				aria-expanded={signedOut ? undefined : open}
				aria-haspopup={signedOut ? undefined : 'true'}
				aria-disabled={signedOut || undefined}
				aria-label={signedOut ? 'Log in to add to a menu' : 'Add to menu'}
				className={[
					'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full',
					'bg-black/40 text-cream backdrop-blur-sm transition-colors hover:bg-black/60',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60',
					signedOut ? 'opacity-60' : '',
				].join(' ')}>
				<SvgIcon icon="menu-add" size={20} />
			</button>

			{/* Opens up and to the left so it stays within the photo it sits on. */}
			{open ? (
				<div
					role="dialog"
					aria-label="Add to menu"
					className="absolute right-0 bottom-full z-30 mb-2 flex w-64 flex-col gap-2 rounded-md border border-cream/40 bg-paper p-3 text-left shadow-lg dark:bg-coal">
					{isLoading ? <p className="m-0 text-xs">Loading menus…</p> : null}

					{!isLoading && !menus.length ? (
						<p className="m-0 text-xs text-smoke dark:text-sand">
							No menus yet — name one below.
						</p>
					) : null}

					<div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
						{menus.map((menu) => {
							const included = menu.drinkIds.includes(drinkId);
							return (
								<label
									key={menu.id}
									className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-chalk dark:hover:bg-carbon">
									<input
										type="checkbox"
										checked={included}
										onChange={(e) =>
											setMembership(menu.id, menu.drinkIds, e.target.checked)
										}
										className="cursor-pointer accent-brass"
									/>
									<span className="truncate">{menu.name}</span>
								</label>
							);
						})}
					</div>

					<div className="flex gap-2 border-t border-chalk pt-2 dark:border-charcoal">
						<input
							type="text"
							value={newName}
							maxLength={MENU_NAME_MAX_LENGTH}
							onChange={(e) => setNewName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleCreate();
								}
							}}
							placeholder="New menu"
							aria-label="New menu name"
							className="text-input text-sm"
						/>
						<Button
							size="sm"
							onClick={handleCreate}
							disabled={!newName.trim() || createMenu.isPending}>
							Add
						</Button>
					</div>
				</div>
			) : null}

			{signedOut ? (
				<span
					role="tooltip"
					className={[
						'pointer-events-none absolute right-0 bottom-full mb-2 whitespace-nowrap rounded',
						'bg-black/40 px-2 py-1 text-xs text-white backdrop-blur-sm transition-opacity',
						'group-hover/menu:opacity-100 group-focus-within/menu:opacity-100',
						hintShown ? 'opacity-100' : 'opacity-0',
					].join(' ')}>
					Log in to build menus
				</span>
			) : null}
		</div>
	);
}
