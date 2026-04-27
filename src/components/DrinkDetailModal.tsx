import { useEffect, useState } from 'react'
import type { Drink } from '../types/drink'
import { formatGarnish, formatMethod } from '../lib/drinkDisplay'

type Props = {
  drink: Drink
  onClose: () => void
}

export function DrinkDetailModal({ drink, onClose }: Props) {
  const [metric, setMetric] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const unit = metric ? 'cl' : 'oz'
  const ingredients = drink.ingredients ?? []

  return (
    <div
      role="presentation"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="drink-detail-title"
        style={{
          background: 'var(--bg)',
          color: 'var(--text)',
          maxWidth: 900,
          width: '100%',
          maxHeight: '90svh',
          overflow: 'auto',
          borderRadius: 8,
          boxShadow: 'var(--shadow)',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 0,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            flex: '1 1 280px',
            minHeight: 280,
            background: drink.imageUrl
              ? `url(${drink.imageUrl}) center/cover no-repeat`
              : 'linear-gradient(145deg, #2a2438, #1a1720)',
          }}
        />
        <div style={{ flex: '1 1 320px', padding: '20px 24px', borderLeft: '1px solid var(--border)' }}>
          <h2 id="drink-detail-title" style={{ marginTop: 0, textTransform: 'uppercase' }}>
            {drink.name}
          </h2>
          <p style={{ textTransform: 'capitalize', margin: '8px 0' }}>{formatMethod(drink)}</p>
          <p style={{ textTransform: 'capitalize', margin: '8px 0' }}>{formatGarnish(drink)}</p>

          <div style={{ position: 'relative', marginTop: 24 }}>
            <button
              type="button"
              onClick={() => setMetric((v) => !v)}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 999,
                border: '1px solid var(--border)',
                background: 'var(--code-bg)',
                cursor: 'pointer',
              }}
            >
              {metric ? 'cl' : 'oz'}
            </button>
            <ul style={{ listStyle: 'none', padding: 0, margin: '28px 0 0' }}>
              {ingredients.map((ing, idx) => {
                const qty = ing.quantity
                const displayQty =
                  qty == null || Number.isNaN(qty) ? '—' : metric ? String(qty * 3) : String(qty)
                return (
                  <li
                    key={`${ing.name ?? 'ing'}-${idx}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 12,
                      padding: '6px 0',
                      borderBottom: '1px solid var(--border)',
                    }}
                  >
                    <span>{ing.name ?? '—'}</span>
                    <span style={{ whiteSpace: 'nowrap' }}>
                      {displayQty} {unit}
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>

          {drink.description ? (
            <small style={{ display: 'block', marginTop: 16, lineHeight: 1.5 }}>{drink.description}</small>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: 24,
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: 4,
              border: '1px solid var(--border)',
              background: 'transparent',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
