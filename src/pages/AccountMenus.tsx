import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/atoms/Button';
import { useCreateMenu, useDeleteMenu, useMenus } from '../hooks/useMenus';
import { MENU_NAME_MAX_LENGTH } from '../lib/menuName';

export function AccountMenusPage() {
	const [creating, setCreating] = useState(false);
	const [name, setName] = useState('');
	const { data: menus = [], isLoading } = useMenus();
	const createMenu = useCreateMenu();
	const deleteMenu = useDeleteMenu();

	const trimmed = name.trim();

	const handleCreate = () => {
		if (!trimmed) return;
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
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<p className="m-0 text-sm text-smoke dark:text-sand">
					Build a printable menu from drinks in the library.
				</p>
				{!creating ? (
					<Button onClick={() => setCreating(true)}>Create menu</Button>
				) : null}
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
							disabled={!trimmed || createMenu.isPending}>
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

			<ul className="m-0 flex list-none flex-col gap-3 p-0">
				{menus.map((menu) => (
					<li
						key={menu.id}
						className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-chalk p-4 dark:border-charcoal">
						<div className="min-w-0">
							<Link
								to={`/account/menus/${menu.id}`}
								className="text-ink no-underline hover:underline dark:text-cream">
								<span className="block truncate text-lg">{menu.name}</span>
							</Link>
							<span className="text-xs text-smoke dark:text-sand">
								{menu.drinkIds.length} drink
								{menu.drinkIds.length === 1 ? '' : 's'}
							</span>
						</div>
						<div className="flex items-center gap-3">
							<Link
								to={`/account/menus/${menu.id}`}
								className="text-sm text-palm no-underline hover:underline dark:text-brass">
								Open
							</Link>
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
