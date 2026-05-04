import type { IngredientFieldRow } from '../../lib/drinkFormAdmin'
import { isPlainNumericQuantityString } from '../../lib/ingredientQuantity'

type Props = {
  ingredient: IngredientFieldRow
  onChange: (next: IngredientFieldRow) => void
}

export function IngredientRowInput({ ingredient, onChange }: Props) {
  const q = ingredient.quantity.trim()
  const showUnit = Boolean(q) && isPlainNumericQuantityString(q)

  return (
    <div className="flex border-b border-[var(--border)] bg-[var(--bg)]">
      <input
        type="text"
        className="w-1/2 py-2 px-4 rounded-none bg-[var(--bg)] text-[var(--text)] border-0 focus:outline focus:outline-1 focus:outline-[var(--accent-border)]"
        placeholder="Ingredient"
        value={ingredient.name}
        onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
      />
      <input
        type="text"
        inputMode="decimal"
        className="w-1/3 py-2 px-4 border-x border-[var(--border)] rounded-none bg-[var(--bg)] text-[var(--text)] border-y-0 focus:outline focus:outline-1 focus:outline-[var(--accent-border)]"
        placeholder="Quantity"
        value={ingredient.quantity}
        onChange={(e) => onChange({ ...ingredient, quantity: e.target.value })}
      />
      {showUnit ? (
        <input
          type="text"
          readOnly
          className="w-1/6 py-2 px-4 rounded-none bg-[var(--code-bg)] text-[var(--text-h)] border-0"
          value={ingredient.unit}
          aria-label="Unit"
        />
      ) : (
        <div className="w-1/6" />
      )}
    </div>
  )
}
