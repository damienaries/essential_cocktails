export type DrinkIngredient = {
  name: string | null
  quantity: number | null
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
