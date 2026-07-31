/** Menu names print as a heading on the sheet, so they stay short enough to fit. */
export const MENU_NAME_MAX_LENGTH = 30;

export function normalizeMenuName(value: string): string {
	return value.trim().slice(0, MENU_NAME_MAX_LENGTH);
}
