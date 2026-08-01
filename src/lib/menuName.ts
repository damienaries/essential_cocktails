import type { CustomMenu } from '../types/user';

/** Menu names print as a heading on the sheet, so they stay short enough to fit. */
export const MENU_NAME_MAX_LENGTH = 30;

export function normalizeMenuName(value: string): string {
	return value.trim().slice(0, MENU_NAME_MAX_LENGTH);
}

export function menuSlug(name: string): string {
	const slug = name
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
	// Names made entirely of symbols would slug to nothing; keep them addressable.
	return slug || encodeURIComponent(name.trim().toLowerCase());
}

export function findMenuBySlug(
	menus: CustomMenu[],
	slug: string | undefined,
): CustomMenu | undefined {
	if (!slug) return undefined;
	const target = decodeURIComponent(slug).toLowerCase();
	return menus.find((menu) => menuSlug(menu.name) === target);
}

/** True when another menu already claims this name's URL. */
export function menuNameTaken(menus: CustomMenu[], name: string): boolean {
	const slug = menuSlug(name);
	return menus.some((menu) => menuSlug(menu.name) === slug);
}
