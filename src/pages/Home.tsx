import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CocktailCard } from '../components/CocktailCard'
import { DrinkDetailModal } from '../components/DrinkDetailModal'
import { filterDrinks } from '../lib/filterDrinks'
import { useDrinksQuery } from '../hooks/useDrinksQuery'
import type { Drink } from '../types/drink'

export function HomePage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Drink | null>(null)
  const { data, isPending, isError, error } = useDrinksQuery()

  const visible = useMemo(() => filterDrinks(data ?? [], search), [data, search])

  if (isPending) {
    return <p style={{ textAlign: 'center' }}>Loading drinks…</p>
  }

  if (isError) {
    return (
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'left' }}>
        <h1 style={{ marginTop: 0 }}>Essential Cocktails</h1>
        <p role="alert">
          Could not load drinks: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
        <p style={{ color: 'var(--text)' }}>
          If you just cloned the repo, add Firebase config in <code>.env.local</code> (see{' '}
          <code>.env.example</code>).
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ marginBottom: 24, textAlign: 'left' }}>
        <h1 style={{ marginTop: 0 }}>Essential Cocktails</h1>
        <p style={{ marginBottom: 16, color: 'var(--text)' }}>
          A curated compendium of classic drinks for bartenders, managers, and cocktail enthusiasts.{' '}
          <Link to="/families" style={{ color: 'var(--accent)' }}>
            Browse by family
          </Link>
          .
        </p>
        <label htmlFor="drink-search" style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>
          Search by name, family, or ingredient
        </label>
        <input
          id="drink-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
          placeholder="e.g. martini, lime, rye…"
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '10px 12px',
            fontSize: 16,
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-h)',
          }}
        />
        <p style={{ marginTop: 8, fontSize: 14, color: 'var(--text)' }}>
          Showing {visible.length} of {(data ?? []).length}
        </p>
      </div>

      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}
      >
        {visible.map((drink) => (
          <CocktailCard key={drink.id} drink={drink} onSelect={setSelected} />
        ))}
      </section>

      {selected ? <DrinkDetailModal drink={selected} onClose={() => setSelected(null)} /> : null}
    </div>
  )
}
