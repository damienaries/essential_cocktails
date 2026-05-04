import type { DrinkFormFields } from './drinkFormAdmin'

const surfaces = [
  'marble table',
  'wooden countertop',
  'glass surface',
  'brass countertop',
  'cast iron table',
  'low coffee table',
] as const

const styles = ['modern', 'vintage', 'tropical', 'tiki', 'artsy', 'traditional'] as const

const locations = [
  'outdoor',
  'indoor',
  'poolside',
  'speakeasy',
  'near a window with a view',
  'dive bar',
  'michelin starred restaurant',
] as const

export type ImagePromptRandomParams = {
  surface: string
  style: string
  location: string
}

export function getRandomImagePromptParams(): ImagePromptRandomParams {
  return {
    surface: surfaces[Math.floor(Math.random() * surfaces.length)]!,
    style: styles[Math.floor(Math.random() * styles.length)]!,
    location: locations[Math.floor(Math.random() * locations.length)]!,
  }
}

/** Full editable prompt for ChatGPT / image tools, using form fields + random scene params. */
export function buildDrinkImagePrompt(fields: DrinkFormFields): string {
  const p = getRandomImagePromptParams()
  const name = fields.name.trim() || 'cocktail'
  const ingredients = fields.ingredients
    .map((i) => i.name.trim())
    .filter(Boolean)
    .join(', ')

  return [
    `A beautiful ${p.style} image of a "${name}" cocktail displayed on a ${p.surface} in a ${p.location}.`,
    'The drink should be the central focus, showing its characteristic color, garnish, and correct glass type.',
    `Glass: ${fields.glass.trim() || 'appropriate classic glass'}.`,
    `Method: ${fields.method}. Ice: ${fields.ice}. Garnish: ${fields.garnish.trim() || 'per spec'}.`,
    `Family / style cue: ${fields.family.trim() || 'classic'}.`,
    ingredients ? `Ingredients: ${ingredients}.` : '',
    'Photorealistic, professional bar photography, soft natural light, shallow depth of field.',
  ]
    .filter(Boolean)
    .join(' ')
}
