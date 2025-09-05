export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
  imageUrls: string[];
  nutrients: Nutrient;
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Nutrient {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  fiber: string;
  sugar: string;
  sodium: string;
  potassium: string;
}