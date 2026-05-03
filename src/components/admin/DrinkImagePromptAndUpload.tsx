import { useRef, useState } from 'react'
import {
  AI_IMAGE_PROMPT_MAX_CHARS,
  buildChatGptPrefillUrl,
  clampAiImagePrompt,
} from '../../lib/chatGptLink'
import type { DrinkFormFields } from '../../lib/drinkFormAdmin'
import { buildDrinkImagePrompt } from '../../lib/imagePromptRandom'
import { uploadCocktailImageToFirebase } from '../../lib/uploadCocktailImage'
import { AdminDrinkThumbnail } from './AdminDrinkThumbnail'
import { Button } from '../atoms/Button'

type Props = {
  fields: DrinkFormFields
  /** When editing, used in Storage path under `cocktail_images/{id}/`. */
  drinkId?: string
  onImageUrl: (url: string) => void
}

export function DrinkImagePromptAndUpload({ fields, drinkId, onImageUrl }: Props) {
  const [promptText, setPromptText] = useState('')
  const [copyDone, setCopyDone] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [inlineError, setInlineError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const hasDrinkName = Boolean(fields.name.trim())
  const hasPrompt = Boolean(promptText.trim())
  const charsLeft = Math.max(0, AI_IMAGE_PROMPT_MAX_CHARS - promptText.length)

  const regenerate = () => {
    if (!hasDrinkName) return
    setInlineError(null)
    setPromptText(clampAiImagePrompt(buildDrinkImagePrompt(fields)))
  }

  const copyPrompt = async () => {
    if (!hasPrompt) return
    try {
      await navigator.clipboard.writeText(promptText)
      setInlineError(null)
      setCopyDone(true)
      window.setTimeout(() => setCopyDone(false), 2000)
    } catch {
      setInlineError('Could not copy to clipboard.')
    }
  }

  const openChatGpt = () => {
    if (!hasPrompt) return
    window.open(buildChatGptPrefillUrl(promptText), '_blank', 'noopener,noreferrer')
  }

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const name = fields.name.trim()
    if (!name) {
      setInlineError('Enter a drink name before uploading (used in the file path).')
      return
    }

    setInlineError(null)
    setUploading(true)
    try {
      const url = await uploadCocktailImageToFirebase(file, {
        drinkName: name,
        drinkId,
      })
      onImageUrl(url)
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Upload failed. Check Storage rules and bucket.'
      setInlineError(msg)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mb-6 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-left space-y-3">
      <h5 className="text-sm font-medium text-[var(--text-h)] m-0">Prompt for AI image creation</h5>
      <p className="text-xs text-[var(--text)] opacity-85 m-0">
        Generate a scene with random style/surface/location. Edit the text, then open ChatGPT (prefills
        the composer when supported) or copy. Upload an image file below; it is stored in Firebase and the
        drink record keeps the download URL (no manual URL field).
      </p>

      <div className="flex flex-wrap gap-2 items-center">
        <Button type="button" color="secondary" size="sm" disabled={!hasDrinkName} onClick={regenerate}>
          Generate
        </Button>
        <Button
          type="button"
          color="secondary"
          size="sm"
          onClick={() => void copyPrompt()}
          disabled={!hasPrompt}
        >
          {copyDone ? 'Copied' : 'Copy'}
        </Button>
        <Button type="button" color="secondary" size="sm" disabled={!hasPrompt} onClick={openChatGpt}>
          Open ChatGPT
        </Button>
      </div>

      <div>
        <textarea
          className="w-full min-h-[140px] rounded-lg px-3 py-2 text-sm bg-[var(--code-bg)] text-[var(--text)] border border-[var(--border)] focus:outline focus:outline-1 focus:outline-[var(--accent-border)] box-border font-[inherit]"
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
          className="text-xs text-[var(--text)] opacity-80 m-0 mt-1.5 text-right tabular-nums"
        >
          {charsLeft} character{charsLeft === 1 ? '' : 's'} left (max {AI_IMAGE_PROMPT_MAX_CHARS})
        </p>
      </div>

      {inlineError ? (
        <p className="text-xs text-red-500 dark:text-red-400 m-0" role="alert">
          {inlineError}
        </p>
      ) : null}

      <div className="pt-2 border-t border-[var(--border)]">
        <p className="text-xs font-medium text-[var(--text-h)] m-0 mb-2">Upload image to Firebase</p>
        {fields.imageUrl?.trim() ? (
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs text-[var(--text)]">Saved image</span>
            <AdminDrinkThumbnail imageUrl={fields.imageUrl} glass={fields.glass} />
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
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            type="button"
            color="secondary"
            size="sm"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? 'Uploading…' : 'Choose image file'}
          </Button>
          <span className="text-xs text-[var(--text)] opacity-80">
            Path <code className="text-[12px]">cocktail_images/…</code> — replaces any previous saved image URL.
          </span>
        </div>
      </div>
    </div>
  )
}
