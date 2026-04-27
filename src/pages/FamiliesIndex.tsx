import { Link } from 'react-router-dom'
import { COCKTAIL_FAMILIES } from '../constants/families'

export function FamiliesIndexPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Cocktail families</h1>
      <p style={{ marginBottom: 24 }}>
        Browse variations grouped by classic families (Martini, Sour, Daiquiri, and more).
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
        {COCKTAIL_FAMILIES.map(({ slug, label }) => (
          <li key={slug}>
            <Link
              to={`/families/${slug}`}
              style={{
                display: 'block',
                padding: '12px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'var(--text-h)',
              }}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
