import { drinkPhotoImgProps } from '../lib/drinkImageAttrs'
import type { Drink } from '../types/drink'

type Props = {
  drink: Drink
  onSelect: (drink: Drink) => void
}

export function CocktailCard({ drink, onSelect }: Props) {
  const imageUrl = drink.imageUrl?.trim()

  return (
    <button
      type="button"
      onClick={() => onSelect(drink)}
      aria-label={`Open details for ${drink.name}`}
      className="m-0 w-full cursor-pointer rounded-lg border-0 bg-transparent p-0 text-left font-[inherit] shadow-[var(--shadow)] transition-transform duration-300 hover:opacity-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-border)]"
    >
      <span className="relative block h-[200px] w-full overflow-hidden rounded-lg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            width={440}
            height={200}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
            {...drinkPhotoImgProps}
          />
        ) : (
          <span
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(145deg,rgba(42,36,56,0.95),rgba(26,23,32,0.98))]"
          />
        )}
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(to_right,rgba(0,0,0,.5),rgba(0,0,0,.5))]"
        >
          <span
            className="relative px-3 text-center text-[1.15rem] font-medium capitalize text-white"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
          >
            {drink.name}
          </span>
        </span>
      </span>
    </button>
  )
}
