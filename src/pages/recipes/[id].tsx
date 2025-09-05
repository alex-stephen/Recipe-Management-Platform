import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Recipe } from '../../types/recipe';
import TopNavBar from '../../components/navBar/TopNavBar';
import { List, Typography } from 'antd';
import { NutrientDisplay } from '../../components/nutrients/NutrientDisplay';

const RecipeDetails: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchRecipe() {
      const res = await fetch(`/api/recipes/${id}`);
      const data = await res.json();
      setRecipe(data);
    }

    fetchRecipe();
  }, [id]);

  if (!recipe) return <p>Loading...</p>;

  return (
    <>
      <TopNavBar/>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
        {recipe.imageUrls?.[0] && (
          <img
            className="w-full h-110 object-cover mb-4 rounded-[10px]"
            src={recipe.imageUrls[0]}
            alt={recipe.name}
          />
        )}
        <p className="text-lg mb-4 pl-10 pr-10 break-normal">{recipe.description}</p>
        <div className='pl-10'>
          <List
            size="default"
            header={<strong className="text-white text-2xl">Ingredients</strong>}
            dataSource={recipe.ingredients ?? []}
            renderItem={(ingredient) => (
              <List.Item style={{ paddingTop: '4px', paddingBottom: '4px' }}>
                <Typography.Text className="flex text-white pl-8 w-full">
                  <span className="text-white w-64">{ingredient.name}:</span>
                  <span className="text-white">{ingredient.quantity}</span>
                </Typography.Text>
              </List.Item>
            )}
          />
          <List
            size="default"
            header={<strong className="text-white text-2xl">Instructions</strong>}
            dataSource={recipe.steps ?? []}
            renderItem={(step, index) => (
              <List.Item style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                <Typography.Text style={{ color: 'white' }} className="flex pl-8 w-full">
                  <span className="font-bold mr-3">{index + 1}.</span>
                  <span>{step}</span>
                </Typography.Text>
              </List.Item>
            )}
          />
          <NutrientDisplay recipe={recipe}/>
        </div>
      </div>
    </>
  );
};

export default RecipeDetails;