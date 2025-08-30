import { NextResponse } from "next/server";
import { Ingredient } from "../../types/recipe";

interface NutritionixFood {
  nf_calories: number;
  nf_protein: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  nf_dietary_fiber: number;
  nf_sugars: number;
  nf_sodium: number;
  nf_potassium: number;
  food_name: string;
}

interface Totals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  sugar: number;
  sodium: number;
  potassium: number;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ingredients: Ingredient[] = body.ingredients;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
    }

    const NUTRITIONIX_ID = process.env.NUTRITIONIX_ID!;
    const NUTRITIONIX_KEY = process.env.NUTRITIONIX_KEY!;

    // Build query string for Nutritionix
    const query = ingredients
      .map((ing) => `${ing.quantity.trim()} ${ing.name}`)
      .join(", ");

    const response = await fetch(
      "https://trackapi.nutritionix.com/v2/natural/nutrients",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-app-id": NUTRITIONIX_ID,
          "x-app-key": NUTRITIONIX_KEY,
        },
        body: JSON.stringify({ query }),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Nutritionix API returned error:", response.status, text);
      return new NextResponse(JSON.stringify({ error: text }), { status: response.status });
    }

    const data = JSON.parse(text);

    // Aggregate main nutritional values
    const totals = (data.foods as NutritionixFood[]).reduce(
      (acc: Totals, food: NutritionixFood) => {
        acc.calories += food.nf_calories || 0;
        acc.protein += food.nf_protein || 0;
        acc.fat += food.nf_total_fat || 0;
        acc.carbs += food.nf_total_carbohydrate || 0;
        acc.fiber += food.nf_dietary_fiber || 0;
        acc.sugar += food.nf_sugars || 0;
        acc.sodium += food.nf_sodium || 0;
        acc.potassium += food.nf_potassium || 0;
        return acc;
      },
      {
        calories: 0,
        protein: 0,
        fat: 0,
        carbs: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        potassium: 0,
      } as Totals
    );

    const formattedTotals = {
      calories: `${Math.round(totals.calories)} kcal`,
      protein: `${Math.round(totals.protein * 10) / 10} g`,
      fat: `${Math.round(totals.fat * 10) / 10} g`,
      carbs: `${Math.round(totals.carbs * 10) / 10} g`,
      fiber: `${Math.round(totals.fiber * 10) / 10} g`,
      sugar: `${Math.round(totals.sugar * 10) / 10} g`,
      sodium: `${Math.round(totals.sodium)} mg`,
      potassium: `${Math.round(totals.potassium)} mg`,
    };

    return NextResponse.json({ totals: formattedTotals, foods: data.foods });
  } catch (err) {
    console.error("Error fetching nutrients:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
