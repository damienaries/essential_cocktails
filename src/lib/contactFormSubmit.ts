/**
 * Posts the contact form to a Google Apps Script web app.
 *
 * Uses `text/plain` to avoid a CORS preflight that Apps Script doesn't
 * gracefully handle. The script reads `e.postData.contents` as a raw string
 * and JSON.parses it.
 */

export type ContactPayload = {
	name: string;
	email: string;
	subject: string;
	message: string;
	website: string; // HP
};

export type ContactResult = { ok: true } | { ok: false; error: string };

const WEBHOOK_URL = import.meta.env.VITE_CONTACT_WEBHOOK_URL ?? '';

export async function submitContactForm(
	payload: ContactPayload,
): Promise<ContactResult> {
	if (!WEBHOOK_URL) {
		return { ok: false, error: 'Contact form is not configured.' };
	}

	try {
		const response = await fetch(WEBHOOK_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain;charset=utf-8' },
			body: JSON.stringify(payload),
			redirect: 'follow',
		});
		if (!response.ok) {
			return { ok: false, error: `Server returned ${response.status}` };
		}
		const text = await response.text();
		try {
			const json = JSON.parse(text) as { ok?: boolean; error?: string };
			if (json.ok) return { ok: true };
			return { ok: false, error: json.error ?? 'Unknown error' };
		} catch {
			// Apps Script sometimes returns plain text; treat 200 + non-JSON as success.
			return { ok: true };
		}
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : 'Network error',
		};
	}
}
