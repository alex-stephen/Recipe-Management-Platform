import { List, Typography } from "antd";
import { Recipe } from "../../types/recipe";

interface NutrientDisplayProps {
  recipe: Recipe;
}

export const NutrientDisplay: React.FC<NutrientDisplayProps> = ({ recipe }) => {
  return (
    <div className="nutrients">
      <List
        size="default"
        header={<strong className="text-white text-2xl">Estimated Nutritional Info</strong>}
        dataSource={
          recipe.nutrients
            ? [
                { label: "Calories", value: recipe.nutrients.calories },
                { label: "Protein", value: recipe.nutrients.protein },
                { label: "Fat", value: recipe.nutrients.fat },
                { label: "Carbs", value: recipe.nutrients.carbs },
                { label: "Fiber", value: recipe.nutrients.fiber },
                { label: "Sugar", value: recipe.nutrients.sugar },
                { label: "Sodium", value: recipe.nutrients.sodium },
                { label: "Potassium", value: recipe.nutrients.potassium },
              ]
            : []
        }
        renderItem={(item) => (
          <List.Item style={{ paddingTop: '4px', paddingBottom: '4px' }}>
            <Typography.Text style={{ color: "white" }} className="flex pl-8 w-full">
              <span className="w-64">{item.label}:</span>
              <span>{item.value}</span>
            </Typography.Text>
          </List.Item>
        )}
      />
    </div>
  );
};