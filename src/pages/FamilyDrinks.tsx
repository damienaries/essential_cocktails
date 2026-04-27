import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CocktailCard } from '../components/CocktailCard'
import { DrinkDetailModal } from '../components/DrinkDetailModal'
import {
  COCKTAIL_FAMILIES,
  isFamilySlug,
  normalizeFamilyName,
  slugToFamilyFilter,
} from '../constants/families'
import { useDrinksQuery } from '../hooks/useDrinksQuery'
import type { Drink } from '../types/drink'

export function FamilyDrinksPage() {
  const { slug } = useParams<{ slug: string }>()
  const [selected, setSelected] = useState<Drink | null>(null)
  const { data, isPending, isError, error } = useDrinksQuery()

  const label = useMemo(() => {
    if (!slug || !isFamilySlug(slug)) return null
    return COCKTAIL_FAMILIES.find((f) => f.slug === slug)?.label ?? slug
  }, [slug])

  const filtered = useMemo(() => {
    if (!slug || !isFamilySlug(slug) || !data) return []
    const key = slugToFamilyFilter(slug)
    return data.filter((d) => normalizeFamilyName(d.family) === key)
  }, [data, slug])

  if (!slug || !isFamilySlug(slug)) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p>Unknown family.</p>
        <Link to="/families">Back to families</Link>
      </div>
    )
  }

  if (isPending) {
    return <p style={{ textAlign: 'center' }}>Loading drinks…</p>
  }

  if (isError) {
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p role="alert">Could not load drinks: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Link to="/families">Back to families</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/families" style={{ color: 'var(--accent)' }}>
          ← All families
        </Link>
        <h1 style={{ margin: '12px 0 0' }}>{label}</h1>
        <p style={{ margin: '8px 0 0', color: 'var(--text)' }}>
          {filtered.length} drink{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {filtered.map((drink) => (
          <CocktailCard key={drink.id} drink={drink} onSelect={setSelected} />
        ))}
      </section>

      {selected ? <DrinkDetailModal drink={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
