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
    <div className="flex border-b border-chalk bg-paper dark:border-charcoal dark:bg-coal">
      <input
        type="text"
        className="w-1/2 py-2 px-4 rounded-none bg-paper text-smoke border-0 dark:bg-coal dark:text-sand focus:outline focus:outline-1 focus:outline-brass/50"
        placeholder="Ingredient"
        value={ingredient.name}
        onChange={(e) => onChange({ ...ingredient, name: e.target.value })}
      />
      <input
        type="text"
        autoComplete="off"
        className="w-1/3 py-2 px-4 border-x border-chalk rounded-none bg-paper text-smoke border-y-0 dark:border-charcoal dark:bg-coal dark:text-sand focus:outline focus:outline-1 focus:outline-brass/50"
        placeholder="Quantity"
        value={ingredient.quantity}
        onChange={(e) => onChange({ ...ingredient, quantity: e.target.value })}
      />
      {showUnit ? (
        <input
          type="text"
          readOnly
          className="w-1/6 py-2 px-4 rounded-none bg-chalk text-ink border-0 dark:bg-carbon dark:text-cream"
          value={ingredient.unit}
          aria-label="Unit"
        />
      ) : (
        <div className="w-1/6" />
      )}
    </div>
  )
}
