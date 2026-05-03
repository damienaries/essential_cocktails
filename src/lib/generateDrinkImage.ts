/** True when the drink already has a non-empty image URL (manual or generated). */
export function hasRenderableDrinkImageUrl(url: string | null | undefined): boolean {
  return Boolean(url?.trim())
}

/**
 * Optional local image service (legacy Vue `essential_cocktails/server`).
 * Set VITE_DRINK_IMAGE_API_URL (e.g. http://localhost:3000). If unset, returns null.
 */
export async function tryGenerateDrinkImage(drinkName: string): Promise<string | null> {
  const base = import.meta.env.VITE_DRINK_IMAGE_API_URL?.replace(/\/$/, '')
  if (!base || !drinkName.trim()) return null

  try {
    const res = await fetch(`${base}/api/generate-drink-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ drinkName: drinkName.trim() }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { imagePath?: string }
    return data.imagePath ?? null
  } catch {
    return null
  }
}
