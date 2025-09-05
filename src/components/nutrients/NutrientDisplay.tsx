import { Recipe } from "../../types/recipe";

interface NutrientDisplayProps {
  recipe: Recipe;
}

export const NutrientDisplay: React.FC<NutrientDisplayProps> = ({ recipe }) => {
  return (
    <div className="nutrients">
      <h4>Estimated Nutritional Info</h4>
      {recipe.nutrients && (
        <ul>
          <li>Calories: {recipe.nutrients.calories}</li>
          <li>Protein: {recipe.nutrients.protein}</li>
          <li>Fat: {recipe.nutrients.fat}</li>
          <li>Carbs: {recipe.nutrients.carbs}</li>
          <li>Fiber: {recipe.nutrients.fiber}</li>
          <li>Sugar: {recipe.nutrients.sugar}</li>
          <li>Sodium: {recipe.nutrients.sodium}</li>
          <li>Potassium: {recipe.nutrients.potassium}</li>
        </ul>
      )}
    </div>
  );
};