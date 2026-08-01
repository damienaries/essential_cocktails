import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { SvgIcon } from '../components/atoms/SvgIcon';
import { MenuSheet } from '../components/menus/MenuSheet';
import { useDrinksQuery } from '../hooks/useDrinksQuery';
import { useCreateMenu, useDeleteMenu, useMenus } from '../hooks/useMenus';
import {
	MENU_NAME_MAX_LENGTH,
	menuNameTaken,
	menuSlug,
} from '../lib/menuName';
import type { Drink } from '../types/drink';

export function AccountMenusPage() {
	const [creating, setCreating] = useState(false);
	const [name, setName] = useState('');
	const { data: menus = [], isLoading } = useMenus();
	const { data: drinks } = useDrinksQuery();
	const createMenu = useCreateMenu();
	const deleteMenu = useDeleteMenu();

	const trimmed = name.trim();
	// Menu URLs are built from the name, so two menus can't share one.
	const nameTaken = Boolean(trimmed) && menuNameTaken(menus, trimmed);

	// Each preview needs full drinks, not ids. One lookup map serves every card.
	const drinksById = useMemo(
		() => new Map((drinks ?? []).map((d) => [d.id, d])),
		[drinks],
	);
	const drinksFor = (drinkIds: string[]): Drink[] =>
		drinkIds
			.map((id) => drinksById.get(id))
			.filter((d): d is Drink => d !== undefined);

	const handleCreate = () => {
		if (!trimmed || nameTaken) return;
		createMenu.mutate(
			{ name: trimmed },
			{
				onSuccess: () => {
					setName('');
					setCreating(false);
				},
			},
		);
	};

	const handleDelete = (menuId: string, menuName: string) => {
		if (!window.confirm(`Delete "${menuName}"? This can't be undone.`)) return;
		deleteMenu.mutate(menuId);
	};

	return (
		<>
			<div className="mb-6 flex justify-end">
				{/* Named group so the tooltip only answers to this button. */}
				<span className="group/create relative">
					<button
						type="button"
						onClick={() => setCreating((v) => !v)}
						aria-expanded={creating}
						aria-label="Create menu"
						className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-palm text-white transition-colors hover:bg-palm/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass/60">
						<SvgIcon icon="plus" size={22} />
					</button>
					<span
						role="tooltip"
						aria-hidden
						className="pointer-events-none absolute top-full right-0 z-20 mt-2 w-56 rounded bg-ink/90 px-2 py-1 text-xs text-cream opacity-0 transition-opacity group-hover/create:opacity-100 group-focus-within/create:opacity-100">
						Build a printable menu from drinks in the library.
					</span>
				</span>
			</div>

			{creating ? (
				<div className="mb-8 rounded-md border border-chalk p-4 dark:border-charcoal">
					<label
						htmlFor="new-menu-name"
						className="mb-2 block text-sm text-ink dark:text-cream">
						Menu name
					</label>
					<div className="flex flex-wrap items-center gap-2">
						<input
							id="new-menu-name"
							type="text"
							value={name}
							maxLength={MENU_NAME_MAX_LENGTH}
							onChange={(e) => setName(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.preventDefault();
									handleCreate();
								}
							}}
							placeholder="Summer list, Tiki night…"
							className="text-input max-w-sm"
							autoFocus
						/>
						<Button
							onClick={handleCreate}
							disabled={!trimmed || nameTaken || createMenu.isPending}>
							{createMenu.isPending ? 'Creating…' : 'Create'}
						</Button>
						<Button
							color="secondary"
							onClick={() => {
								setCreating(false);
								setName('');
							}}>
							Cancel
						</Button>
					</div>
					<p className="mt-2 text-xs text-smoke dark:text-sand">
						{name.length}/{MENU_NAME_MAX_LENGTH} characters
					</p>
					{nameTaken ? (
						<p role="alert" className="mt-2 text-sm text-red-600">
							You already have a menu called “{trimmed}”.
						</p>
					) : null}
					{createMenu.isError ? (
						<p role="alert" className="mt-2 text-sm text-red-600">
							Could not create the menu. Try again.
						</p>
					) : null}
				</div>
			) : null}

			{isLoading ? (
				<p className="text-sm text-smoke dark:text-sand">Loading…</p>
			) : null}

			{!isLoading && !menus.length ? (
				<p className="text-sm text-smoke dark:text-sand">
					No menus yet — create one, then add drinks from any drink's details.
				</p>
			) : null}

			<ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
				{menus.map((menu) => (
					<li key={menu.id} className="flex flex-col gap-2">
						{/* The sheet is sized by its container, so the preview is the real
						    thing scaled down — no separate small layout to keep in sync. */}
						<Link
							to={`/account/menus/${menuSlug(menu.name)}`}
							aria-label={`Open ${menu.name}`}
							className="block rounded transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brass/60">
							<MenuSheet name={menu.name} drinks={drinksFor(menu.drinkIds)} />
						</Link>
						<div className="flex items-center justify-between gap-3">
							<span className="truncate text-sm text-smoke dark:text-sand">
								{menu.drinkIds.length} drink
								{menu.drinkIds.length === 1 ? '' : 's'}
							</span>
							<Button
								color="danger"
								size="sm"
								onClick={() => handleDelete(menu.id, menu.name)}>
								Delete
							</Button>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
