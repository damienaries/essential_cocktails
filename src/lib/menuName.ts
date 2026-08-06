import { slugify } from './slug';
import type { CustomMenu } from '../types/user';

/** Menu names print as a heading on the sheet, so they stay short enough to fit. */
export const MENU_NAME_MAX_LENGTH = 30;

export function normalizeMenuName(value: string): string {
	return value.trim().slice(0, MENU_NAME_MAX_LENGTH);
}

export function menuSlug(name: string): string {
	return slugify(name);
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
