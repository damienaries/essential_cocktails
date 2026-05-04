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
  family?: string | null
  ingredients?: DrinkIngredient[] | null
  description?: string | null
}
