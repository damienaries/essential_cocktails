import { Link } from 'react-router-dom'
import { COCKTAIL_FAMILIES } from '../constants/families'

export function FamiliesIndexPage() {
  return (
    <div className="mx-auto max-w-[720px] text-left">
      <h1 className="mt-0">Cocktail families</h1>
      <p className="mb-6">
        Browse variations grouped by classic families (Martini, Sour, Daiquiri, and more).
      </p>
      <ul className="m-0 grid list-none gap-2 p-0">
        {COCKTAIL_FAMILIES.map(({ slug, label }) => (
          <li key={slug}>
            <Link
              to={`/families/${slug}`}
              className="block rounded-lg border border-chalk px-4 py-3 text-ink no-underline dark:border-charcoal dark:text-cream"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
