import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useCreateMenu, useMenus, useUpdateMenu } from '../../hooks/useMenus';
import { MENU_NAME_MAX_LENGTH } from '../../lib/menuName';
import { Button } from '../atoms/Button';

type Props = {
	drinkId: string;
};

/**
 * "Add to menu" control for the drink modal. Saving is one tap with one destination;
 * a menu needs a target, so this opens a dropdown of the user's menus. The menus the
 * drink is already on show as pills underneath, each removable.
 */
export function AddToMenuPicker({ drinkId }: Props) {
	const { user } = useAuthUser();
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [newName, setNewName] = useState('');
	const wrapRef = useRef<HTMLDivElement | null>(null);
	const { data: menus = [], isLoading } = useMenus();
	const updateMenu = useUpdateMenu();
	const createMenu = useCreateMenu();

	const onMenus = menus.filter((m) => m.drinkIds.includes(drinkId));

	// Close on an outside click, and on Escape without also closing the drink modal.
	// The capture-phase listener runs before the modal's window handler, so
	// stopImmediatePropagation keeps Escape scoped to the dropdown.
	useEffect(() => {
		if (!open) return;

		const onPointerDown = (e: MouseEvent) => {
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

	const handleToggleOpen = () => {
		if (!user) {
			navigate('/signin?next=/account/menus');
			return;
		}
		setOpen((v) => !v);
	};

	const setMembership = (
		menuId: string,
		drinkIds: string[],
		include: boolean,
	) => {
		const next = include
			? [...drinkIds, drinkId]
			: drinkIds.filter((id) => id !== drinkId);
		updateMenu.mutate({ menuId, patch: { drinkIds: next } });
	};

	const handleCreate = () => {
		const name = newName.trim();
		if (!name) return;
		// New menus start with this drink on them — that's why we're here.
		createMenu.mutate({ name, drinkIds: [drinkId] });
		setNewName('');
	};

	return (
		<div className="mt-4 border-t border-chalk pt-3 dark:border-charcoal">
			<div ref={wrapRef} className="relative inline-block">
				<button
					type="button"
					onClick={handleToggleOpen}
					aria-expanded={open}
					aria-haspopup="true"
					className="cursor-pointer text-sm text-smoke underline-offset-2 hover:text-brass hover:underline dark:text-sand">
					+ Add to menu
				</button>

				{open ? (
					// Opens upward: this control sits at the bottom of the modal panel,
					// and the panel's own scroll container would clip a downward menu.
					<div
						role="dialog"
						aria-label="Add to menu"
						className="absolute bottom-full left-0 z-30 mb-2 flex w-64 flex-col gap-2 rounded-md border border-chalk bg-paper p-3 shadow-lg dark:border-charcoal dark:bg-coal">
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
			</div>

			{onMenus.length ? (
				<ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
					{onMenus.map((menu) => (
						<li key={menu.id}>
							<button
								type="button"
								onClick={() => setMembership(menu.id, menu.drinkIds, false)}
								aria-label={`Remove from ${menu.name}`}
								className="flex cursor-pointer items-center gap-1 rounded-full border border-brass/40 bg-brass/10 px-2 py-0.5 text-xs text-ink transition-colors hover:border-brass dark:text-cream">
								<span className="max-w-40 truncate">{menu.name}</span>
								<span aria-hidden className="text-smoke dark:text-sand">
									×
								</span>
							</button>
						</li>
					))}
				</ul>
			) : null}
		</div>
	);
}
