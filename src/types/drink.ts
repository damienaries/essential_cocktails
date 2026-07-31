export type DrinkIngredient = {
  name: string | null
  /** Plain volumes like `1.5` (number, oz/cl toggle applies); free text e.g. `1 dash`, `top`. */
  quantity: number | string | null
  unit: string | null
}

export type Drink = {
  id: string
  name: string
  glass?: string | null
  method?: string | string[] | null
  ice?: string | null
  garnish?: string | string[] | null
  imageUrl?: string | null
  /** Primary family (first entry of `families`); kept flat for search and legacy docs. */
  family?: string | null
  /** Every family the drink belongs to, primary first. */
  families?: string[] | null
  ingredients?: DrinkIngredient[] | null
  description?: string | null
}
