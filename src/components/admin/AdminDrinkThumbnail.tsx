import { useState } from 'react'
import { drinkPhotoImgProps } from '../../lib/drinkImageAttrs'

type Props = {
  imageUrl?: string | null
  /** Reserved for future glassware-specific placeholders. */
  glass?: string | null
}

function PlaceholderGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 3h8l-1.2 9.2a3 3 0 0 1-2.95 2.6h-.7a3 3 0 0 1-2.95-2.6L8 3z" />
      <path d="M9 21h6" />
      <path d="M10 18h4" />
    </svg>
  )
}

export function AdminDrinkThumbnail({ imageUrl }: Props) {
  const [broken, setBroken] = useState(false)
  const src = imageUrl?.trim()
  const showPhoto = Boolean(src) && !broken

  return (
    <div
      className="w-11 h-11 shrink-0 rounded-md overflow-hidden border border-chalk bg-paper dark:border-charcoal dark:bg-coal flex items-center justify-center"
      title={showPhoto ? undefined : 'No image — add glassware art under src/assets/images/'}
    >
      {showPhoto ? (
        <img
          src={src}
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
          {...drinkPhotoImgProps}
          onError={() => setBroken(true)}
        />
      ) : (
        <span className="text-smoke opacity-55 flex items-center justify-center w-full h-full bg-chalk dark:text-sand dark:bg-carbon">
          <PlaceholderGlyph />
        </span>
      )}
    </div>
  )
}
