export const CHATGPT_ORIGIN = 'https://chatgpt.com';
export const AI_IMAGE_PROMPT_MAX_CHARS = 1000;

export function clampAiImagePrompt(prompt: string): string {
	if (prompt.length <= AI_IMAGE_PROMPT_MAX_CHARS) return prompt;
	return prompt.slice(0, AI_IMAGE_PROMPT_MAX_CHARS);
}

/**
 * ChatGPT often prefills (and may auto-send) from the `q` query param — behavior is product-defined and can change.
 * Prompt is clamped to {@link AI_IMAGE_PROMPT_MAX_CHARS} so URLs stay practical.
 */
export function buildChatGptPrefillUrl(prompt: string): string {
	const q = clampAiImagePrompt(prompt).trim();
	if (!q) return CHATGPT_ORIGIN;
	return `${CHATGPT_ORIGIN}/?q=${encodeURIComponent(q)}`;
}
