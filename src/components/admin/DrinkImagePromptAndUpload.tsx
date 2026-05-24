import { useEffect, useRef, useState } from 'react';
import {
	AI_IMAGE_PROMPT_MAX_CHARS,
	buildChatGptPrefillUrl,
	clampAiImagePrompt,
} from '../../lib/chatGptLink';
import type { DrinkFormFields } from '../../lib/drinkFormAdmin';
import { buildDrinkImagePrompt } from '../../lib/imagePromptRandom';
import { uploadCocktailImageToFirebase } from '../../lib/uploadCocktailImage';
import { AdminDrinkThumbnail } from './AdminDrinkThumbnail';
import { Button } from '../atoms/Button';

type Props = {
	fields: DrinkFormFields;
	/** When editing, used in Storage path under `cocktail_images/{id}/`. */
	drinkId?: string;
	onImageUrl: (url: string) => void;
	onUploadingChange?: (uploading: boolean) => void;
};

export function DrinkImagePromptAndUpload({
	fields,
	drinkId,
	onImageUrl,
	onUploadingChange,
}: Props) {
	const [promptText, setPromptText] = useState('');
	const [copyDone, setCopyDone] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [inlineError, setInlineError] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);
	const dragCounter = useRef(0);

	useEffect(() => {
		onUploadingChange?.(uploading);
	}, [uploading, onUploadingChange]);

	const hasDrinkName = Boolean(fields.name.trim());
	const hasPrompt = Boolean(promptText.trim());
	const charsLeft = Math.max(0, AI_IMAGE_PROMPT_MAX_CHARS - promptText.length);

	const regenerate = () => {
		if (!hasDrinkName) return;
		setInlineError(null);
		setPromptText(clampAiImagePrompt(buildDrinkImagePrompt(fields)));
	};

	const copyPrompt = async () => {
		if (!hasPrompt) return;
		try {
			await navigator.clipboard.writeText(promptText);
			setInlineError(null);
			setCopyDone(true);
			window.setTimeout(() => setCopyDone(false), 2000);
		} catch {
			setInlineError('Could not copy to clipboard.');
		}
	};

	const openChatGpt = () => {
		if (!hasPrompt) return;
		window.open(
			buildChatGptPrefillUrl(promptText),
			'_blank',
			'noopener,noreferrer',
		);
	};

	const handleFile = async (file: File) => {
		const name = fields.name.trim();
		if (!name) {
			setInlineError(
				'Enter a drink name before uploading (used in the file path).',
			);
			return;
		}
		if (!file.type.startsWith('image/')) {
			setInlineError('Please choose an image file.');
			return;
		}

		setInlineError(null);
		setUploading(true);
		try {
			const { url, bytes } = await uploadCocktailImageToFirebase(file, {
				drinkName: name,
				drinkId,
			});
			console.log('[cocktail image upload]', {
				cocktailName: name,
				drinkId: drinkId ?? null,
				originalFile: file.name,
				originalSizeBytes: file.size,
				uploadedWebpBytes: bytes,
				url,
			});
			onImageUrl(url);
		} catch (err) {
			const msg =
				err instanceof Error
					? err.message
					: 'Upload failed. Check Storage rules and bucket.';
			setInlineError(msg);
		} finally {
			setUploading(false);
		}
	};

	const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		e.target.value = '';
		if (file) void handleFile(file);
	};

	const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		if (uploading) return;
		dragCounter.current += 1;
		setIsDragging(true);
	};

	const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		dragCounter.current = Math.max(0, dragCounter.current - 1);
		if (dragCounter.current === 0) setIsDragging(false);
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		dragCounter.current = 0;
		setIsDragging(false);
		if (uploading) return;
		const file = e.dataTransfer.files?.[0];
		if (file) void handleFile(file);
	};

	return (
		<div className="mb-6 p-4 rounded-lg border border-chalk dark:border-charcoal bg-paper dark:bg-coal text-left space-y-3">
			<h5 className="text-sm font-medium text-ink dark:text-cream m-0">
				Prompt for AI image creation
			</h5>
			<p className="text-xs text-smoke dark:text-sand opacity-85 m-0">
				Generate a scene with random style/surface/location. Edit the text, then
				open ChatGPT (prefills the composer when supported) or copy. Upload an
				image file below.
			</p>

			<div className="flex flex-wrap gap-2 items-center">
				<Button
					type="button"
					color="secondary"
					size="sm"
					disabled={!hasDrinkName}
					onClick={regenerate}>
					Generate
				</Button>
				<Button
					type="button"
					color="secondary"
					size="sm"
					onClick={() => void copyPrompt()}
					disabled={!hasPrompt}>
					{copyDone ? 'Copied' : 'Copy'}
				</Button>
				<Button
					type="button"
					color="secondary"
					size="sm"
					disabled={!hasPrompt}
					onClick={openChatGpt}>
					Open ChatGPT
				</Button>
			</div>

			<div>
				<textarea
					className="w-full min-h-[140px] rounded-lg px-3 py-2 text-sm bg-chalk dark:bg-carbon text-smoke dark:text-sand border border-chalk dark:border-charcoal focus:outline focus:outline-1 focus:outline-brass/50 box-border font-[inherit]"
					value={promptText}
					maxLength={AI_IMAGE_PROMPT_MAX_CHARS}
					onChange={(e) => setPromptText(clampAiImagePrompt(e.target.value))}
					placeholder={
						hasDrinkName
							? 'Click "Generate" to build a prompt from the fields above.'
							: 'Enter a drink name, then click Generate.'
					}
					spellCheck
					aria-describedby="admin-ai-prompt-counter"
				/>
				<p
					id="admin-ai-prompt-counter"
					className="text-xs text-smoke dark:text-sand opacity-80 m-0 mt-1.5 text-right tabular-nums">
					{charsLeft} character{charsLeft === 1 ? '' : 's'} left
				</p>
			</div>

			{inlineError ? (
				<p className="text-xs text-red-500 dark:text-red-400 m-0" role="alert">
					{inlineError}
				</p>
			) : null}

			<div className="pt-2 border-t border-chalk dark:border-charcoal">
				<p className="text-xs font-medium text-ink dark:text-cream m-0 mb-2">
					Upload image to Firebase
				</p>
				{fields.imageUrl?.trim() ? (
					<div className="flex flex-wrap items-center gap-3 mb-3">
						<span className="text-xs text-smoke dark:text-sand">
							Saved image
						</span>
						<AdminDrinkThumbnail
							imageUrl={fields.imageUrl}
							glass={fields.glass}
						/>
					</div>
				) : null}
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					className="sr-only"
					aria-label="Choose image file"
					onChange={(ev) => void onPickFile(ev)}
				/>
				<div
					onDragEnter={onDragEnter}
					onDragOver={onDragOver}
					onDragLeave={onDragLeave}
					onDrop={onDrop}
					className={[
						'flex flex-col gap-1.5 rounded-lg border-2 border-dashed p-3 transition-colors',
						isDragging
							? 'border-brass bg-brass/5'
							: 'border-chalk dark:border-charcoal',
					].join(' ')}>
					<div className="flex flex-wrap items-center gap-2">
						<Button
							type="button"
							color="secondary"
							size="sm"
							disabled={uploading}
							onClick={() => fileRef.current?.click()}>
							{uploading ? 'Uploading…' : 'Choose image file'}
						</Button>
						<span className="text-xs text-smoke dark:text-sand opacity-80">
							{isDragging ? 'Drop to upload' : 'or drag and drop an image here'}
						</span>
					</div>
					<p className="m-0 text-xs text-smoke dark:text-sand opacity-60">
						JPEG, PNG, or WebP up to 5 MB · we crop to a 1000 px square and
						re-encode as WebP for storage
					</p>
				</div>
			</div>
		</div>
	);
}
