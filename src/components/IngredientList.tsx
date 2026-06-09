import { Link } from "react-router-dom";
import type { DrinkIngredient } from "../types/drink";
import { formatCl, formatOz, ozToCl } from "../lib/ingredientQuantity";
import { glossarySlug, isGlossaryIngredient } from "../lib/ingredientCategory";

type Props = {
  ingredients: DrinkIngredient[];
  metric: boolean;
  /** Fired when a glossary link is followed, so the host modal can close. */
  onNavigateAway: () => void;
};

export function IngredientList({ ingredients, metric, onNavigateAway }: Props) {
  const unit = metric ? "cl" : "oz";

  return (
    <ul className="m-0 mt-16 list-none p-0">
      {ingredients.map((ing, idx) => {
        const q = ing.quantity;
        let amountLabel: string;
        if (q == null) {
          amountLabel = "—";
        } else if (typeof q === "string") {
          amountLabel = q.trim() || "—";
        } else if (typeof q === "number" && Number.isFinite(q)) {
          const displayQty = metric ? formatCl(ozToCl(q)) : formatOz(q);
          amountLabel = `${displayQty} ${unit}`;
        } else {
          amountLabel = "—";
        }
        return (
          <li
            key={`${ing.name ?? "ing"}-${idx}`}
            className="flex justify-between gap-2 border-b border-chalk dark:border-charcoal py-1.5 text-smoke dark:text-sand last:border-b-0 md:gap-3 md:py-2"
          >
            <span className="text-left min-w-0 flex-1">
              {ing.name && isGlossaryIngredient(ing.name) ? (
                <Link
                  to={`/glossary#${glossarySlug(ing.name)}`}
                  onClick={onNavigateAway}
                  className="underline decoration-dotted decoration-smoke/50 underline-offset-4 transition-colors hover:text-brass hover:decoration-brass dark:decoration-sand/50"
                >
                  {ing.name}
                </Link>
              ) : (
                (ing.name ?? "—")
              )}
            </span>
            <span className="shrink-0 whitespace-nowrap text-right tabular-nums">
              {amountLabel}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
