import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { deleteDrinkFromFirestore } from '../../api/drinks'
import { useDrinksQuery } from '../../hooks/useDrinksQuery'
import { formatGarnish, formatMethod } from '../../lib/drinkDisplay'
import { formatIngredientQuantityCell } from '../../lib/ingredientQuantity'
import type { Drink } from '../../types/drink'
import { Button } from '../atoms/Button'
import { SvgIcon } from '../atoms/SvgIcon'
import { AdminDrinkThumbnail } from './AdminDrinkThumbnail'
import { EditDrinkModal } from './EditDrinkModal'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') as readonly string[]

/** A–Z if the drink name starts with that letter (Latin); otherwise null (still listed when unfiltered). */
function drinkNameFirstLetter(name: string | null | undefined): string | null {
  const t = (name ?? '').trim()
  if (!t) return null
  const ch = t[0].toLocaleUpperCase('en-US').normalize('NFD')[0]
  if (ch >= 'A' && ch <= 'Z') return ch
  return null
}

export function DrinkAdminTable() {
  const queryClient = useQueryClient()
  const { data: drinks = [], isLoading, isError, error } = useDrinksQuery()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [drinkToEdit, setDrinkToEdit] = useState<Drink | null>(null)
  const [letterFilter, setLetterFilter] = useState<string | null>(null)

  const { lettersPresent, visibleDrinks } = useMemo(() => {
    const sorted = [...drinks].sort((a, b) =>
      (a.name ?? '').localeCompare(b.name ?? '', undefined, { sensitivity: 'base' }),
    )
    const lettersPresent = new Set<string>()
    for (const d of sorted) {
      const L = drinkNameFirstLetter(d.name)
      if (L) lettersPresent.add(L)
    }
    const visibleDrinks =
      letterFilter == null
        ? sorted
        : sorted.filter((d) => drinkNameFirstLetter(d.name) === letterFilter)
    return { lettersPresent, visibleDrinks }
  }, [drinks, letterFilter])

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
    return <p className="text-[var(--text)] text-sm">Loading drinks…</p>
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
      <div
        className="flex flex-wrap justify-center gap-1 mb-4"
        role="toolbar"
        aria-label="Filter drinks by first letter"
      >
        {LETTERS.map((letter) => {
          const hasAny = lettersPresent.has(letter)
          const isSelected = letterFilter === letter
          return (
            <button
              key={letter}
              type="button"
              disabled={!hasAny}
              aria-pressed={isSelected}
              title={
                hasAny
                  ? isSelected
                    ? `Filter ${letter} (active) — click to show all`
                    : `Show names starting with ${letter}`
                  : `No drinks starting with ${letter}`
              }
              onClick={() => {
                if (!hasAny) return
                setLetterFilter((current) => (current === letter ? null : letter))
              }}
              className={[
                'min-w-[1.65rem] px-1.5 py-1 text-xs rounded border font-medium transition-colors',
                !hasAny
                  ? 'opacity-35 cursor-not-allowed border-[var(--border)] text-[var(--text)] bg-transparent'
                  : isSelected
                    ? 'border-[var(--accent-border)] bg-[var(--accent-bg)] text-[var(--text-h)] cursor-pointer'
                    : 'border-[var(--border)] bg-[var(--bg)] text-[var(--text-h)] hover:bg-[var(--code-bg)] cursor-pointer',
              ].join(' ')}
            >
              {letter}
            </button>
          )
        })}
      </div>

      <section className="text-left space-y-2">
        {letterFilter != null && visibleDrinks.length === 0 ? (
          <p className="text-sm text-[var(--text)] m-0 py-4 text-center">
            No drinks match this filter.
          </p>
        ) : null}
        {visibleDrinks.map((drink) => (
          <div key={drink.id} className="mb-2 shadow-[var(--shadow)] rounded overflow-hidden border border-[var(--border)]">
            <div className="flex justify-between items-center bg-[var(--code-bg)] border-b border-[var(--border)] p-4 gap-3">
              <button
                type="button"
                className="text-[var(--text-h)] bg-transparent border-0 cursor-pointer p-0 w-8 text-left font-mono shrink-0"
                onClick={() => toggleCollapse(drink.id)}
                aria-expanded={expandedId === drink.id}
                aria-label={expandedId === drink.id ? 'Collapse details' : 'Expand details'}
              >
                {expandedId === drink.id ? '▼' : '▶'}
              </button>
              <AdminDrinkThumbnail imageUrl={drink.imageUrl} glass={drink.glass} />
              <h5 className="flex-1 m-0 text-[var(--text-h)] text-base font-medium text-left min-w-0">
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
                  <tr className="bg-[var(--code-bg)]">
                    <th className="admin-table-cell font-medium text-[var(--text-h)]">Ingredients</th>
                    <th className="admin-table-cell font-medium text-[var(--text-h)]">Method</th>
                    <th className="admin-table-cell font-medium text-[var(--text-h)]">Glass</th>
                    <th className="admin-table-cell font-medium text-[var(--text-h)]">Garnish</th>
                    <th className="admin-table-cell font-medium text-[var(--text-h)]">Ice</th>
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
                              className={idx % 2 === 1 ? 'bg-[var(--code-bg)]/50' : ''}
                            >
                              <td className="p-2 border-b border-[var(--border)] w-2/3">
                                {ing.name ?? '—'}
                              </td>
                              <td className="p-2 border-b border-[var(--border)] w-1/3">
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

      {drinkToEdit ? (
        <EditDrinkModal drink={drinkToEdit} onClose={() => setDrinkToEdit(null)} />
      ) : null}
    </>
  )
}
