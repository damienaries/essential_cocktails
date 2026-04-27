import type { Drink } from '../types/drink'

type Props = {
  drink: Drink
  onSelect: (drink: Drink) => void
}

export function CocktailCard({ drink, onSelect }: Props) {
  const image = drink.imageUrl
  const bg = image
    ? `linear-gradient(to right, rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${image})`
    : 'linear-gradient(145deg, rgba(42,36,56,0.9), rgba(26,23,32,0.95))'

  return (
    <figure
      style={{
        position: 'relative',
        margin: 0,
        height: 200,
        borderRadius: 8,
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: 'var(--shadow)',
      }}
      onClick={() => onSelect(drink)}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: bg,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.35s ease',
        }}
      >
        <div
          style={{
            position: 'relative',
            fontSize: '1.15rem',
            color: '#fff',
            textAlign: 'center',
            padding: 12,
            textTransform: 'capitalize',
            fontWeight: 500,
            textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          }}
        >
          {drink.name}
        </div>
      </div>
    </figure>
  )
}
