import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { deleteDrinkFromFirestore } from '../../api/drinks'
import { useDrinksQuery } from '../../hooks/useDrinksQuery'
import { useLetterFilter } from '../../hooks/useLetterFilter'
import { formatGarnish, formatMethod } from '../../lib/drinkDisplay'
import { formatIngredientQuantityCell } from '../../lib/ingredientQuantity'
import type { Drink } from '../../types/drink'
import { Button } from '../atoms/Button'
import { LetterFilterToolbar } from '../LetterFilterToolbar'
import { SvgIcon } from '../atoms/SvgIcon'
import { AdminDrinkThumbnail } from './AdminDrinkThumbnail'
import { EditDrinkModal } from './EditDrinkModal'

export function DrinkAdminTable() {
  const queryClient = useQueryClient()
  const { data: drinks = [], isLoading, isError, error } = useDrinksQuery()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [drinkToEdit, setDrinkToEdit] = useState<Drink | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()

  // Auto-open the edit modal when `?edit=<id>` is present (used by the
  // duplicate-name link in the add form). One-shot: the param is consumed.
  useEffect(() => {
    const editId = searchParams.get('edit')
    if (!editId || !drinks.length) return
    const drink = drinks.find((d) => d.id === editId)
    if (drink) setDrinkToEdit(drink)
    searchParams.delete('edit')
    setSearchParams(searchParams, { replace: true })
  }, [drinks, searchParams, setSearchParams])

  const sorted = useMemo(
    () =>
      [...drinks].sort((a, b) =>
        (a.name ?? '').localeCompare(b.name ?? '', undefined, { sensitivity: 'base' }),
      ),
    [drinks],
  )

  const {
    letterFilter,
    setLetterFilter,
    lettersPresent,
    filteredByLetter: visibleDrinks,
  } = useLetterFilter(sorted)

  const deleteMutation = useMutation({
    mutationFn: deleteDrinkFromFirestore,
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ['drinks'] }),
  })

  const toggleCollapse = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const confirmDelete = (id: string) => {
    if (!window.confirm('Delete this drink? This cannot be undone.')) return
    deleteMutation.mutate(id)
  }

  if (isLoading) {
    return <p className="text-smoke dark:text-sand text-sm">Loading drinks…</p>
  }

  if (isError) {
    return (
      <p className="text-red-500 dark:text-red-400 text-sm" role="alert">
        {error instanceof Error ? error.message : 'Could not load drinks.'}
      </p>
    )
  }

  return (
    <>
      <LetterFilterToolbar
        lettersPresent={lettersPresent}
        letterFilter={letterFilter}
        onChange={setLetterFilter}
      />

      <section className="text-left space-y-2">
        {letterFilter != null && visibleDrinks.length === 0 ? (
          <p className="text-sm text-smoke dark:text-sand m-0 py-4 text-center">
            No drinks match this filter.
          </p>
        ) : null}
        {visibleDrinks.map((drink) => (
          <div key={drink.id} className="mb-2 shadow-md rounded overflow-hidden border border-chalk dark:border-charcoal">
            <div className="flex justify-between items-center bg-chalk dark:bg-carbon border-b border-chalk dark:border-charcoal p-4 gap-3">
              <button
                type="button"
                className="text-ink dark:text-cream bg-transparent border-0 cursor-pointer p-0 w-8 text-left font-mono shrink-0"
                onClick={() => toggleCollapse(drink.id)}
                aria-expanded={expandedId === drink.id}
                aria-label={expandedId === drink.id ? 'Collapse details' : 'Expand details'}
              >
                {expandedId === drink.id ? '▼' : '▶'}
              </button>
              <AdminDrinkThumbnail imageUrl={drink.imageUrl} glass={drink.glass} />
              <h5 className="flex-1 m-0 text-ink dark:text-cream text-base font-medium text-left min-w-0 capitalize">
                {drink.name}
              </h5>
            </div>

            {expandedId === drink.id ? (
              <div className="space-y-5 p-4">
                <div className="flex gap-2">
                  <Button type="button" color="primary" size="sm" onClick={() => setDrinkToEdit(drink)}>
                    <SvgIcon icon="edit" color="currentColor" size={14} />
                  </Button>
                  <Button
                    type="button"
                    color="danger"
                    size="sm"
                    onClick={() => confirmDelete(drink.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <SvgIcon icon="delete" color="#fff" size={14} />
                  </Button>
                </div>

                <div>
                  <p className="m-0 mb-1.5 text-xs font-medium uppercase tracking-wide text-smoke dark:text-sand">
                    Ingredients
                  </p>
                  {(drink.ingredients ?? []).length ? (
                    <ul className="m-0 list-none divide-y divide-chalk p-0 dark:divide-charcoal">
                      {(drink.ingredients ?? []).map((ing, idx) => (
                        <li
                          key={`${ing.name ?? 'i'}-${idx}`}
                          className="flex justify-between gap-3 py-1.5 text-sm"
                        >
                          <span className="text-ink dark:text-cream">{ing.name ?? '—'}</span>
                          <span className="shrink-0 text-smoke dark:text-sand tabular-nums">
                            {formatIngredientQuantityCell(ing)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="m-0 text-sm text-smoke dark:text-sand">—</p>
                  )}
                </div>

                <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3">
                  {(
                    [
                      ['Method', formatMethod(drink)],
                      ['Glass', drink.glass ?? '—'],
                      ['Garnish', formatGarnish(drink)],
                      ['Ice', drink.ice ?? '—'],
                    ] as const
                  ).map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs font-medium uppercase tracking-wide text-smoke dark:text-sand">
                        {label}
                      </dt>
                      <dd className="m-0 mt-0.5 text-sm text-ink dark:text-cream">
                        {value || '—'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
        ))}
      </section>

      <AnimatePresence>
        {drinkToEdit ? (
          <EditDrinkModal drink={drinkToEdit} onClose={() => setDrinkToEdit(null)} />
        ) : null}
      </AnimatePresence>
    </>
  )
}
