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
              <h5 className="flex-1 m-0 text-ink dark:text-cream text-base font-medium text-left min-w-0">
                {drink.name}
              </h5>
              <div className="flex gap-2 shrink-0">
                <Button type="button" color="primary" onClick={() => setDrinkToEdit(drink)}>
                  <SvgIcon icon="edit" color="currentColor" size={18} />
                </Button>
                <Button
                  type="button"
                  color="danger"
                  onClick={() => confirmDelete(drink.id)}
                  disabled={deleteMutation.isPending}
                >
                  <SvgIcon icon="delete" color="#fff" size={18} />
                </Button>
              </div>
            </div>

            {expandedId === drink.id ? (
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-chalk dark:bg-carbon">
                    <th className="admin-table-cell font-medium text-ink dark:text-cream">Ingredients</th>
                    <th className="admin-table-cell font-medium text-ink dark:text-cream">Method</th>
                    <th className="admin-table-cell font-medium text-ink dark:text-cream">Glass</th>
                    <th className="admin-table-cell font-medium text-ink dark:text-cream">Garnish</th>
                    <th className="admin-table-cell font-medium text-ink dark:text-cream">Ice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="admin-table-cell align-top p-0">
                      <table className="w-full border-collapse">
                        <tbody>
                          {(drink.ingredients ?? []).map((ing, idx) => (
                            <tr
                              key={`${ing.name ?? 'i'}-${idx}`}
                              className={idx % 2 === 1 ? 'bg-chalk/50 dark:bg-carbon/50' : ''}
                            >
                              <td className="p-2 border-b border-chalk dark:border-charcoal w-2/3">
                                {ing.name ?? '—'}
                              </td>
                              <td className="p-2 border-b border-chalk dark:border-charcoal w-1/3">
                                {formatIngredientQuantityCell(ing)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                    <td className="admin-table-cell align-top">{formatMethod(drink)}</td>
                    <td className="admin-table-cell align-top">{drink.glass ?? '—'}</td>
                    <td className="admin-table-cell align-top">{formatGarnish(drink)}</td>
                    <td className="admin-table-cell align-top">{drink.ice ?? '—'}</td>
                  </tr>
                </tbody>
              </table>
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
