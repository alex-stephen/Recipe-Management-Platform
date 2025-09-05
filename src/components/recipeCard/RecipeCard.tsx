import React from 'react';
import { Card } from "antd";
import { Recipe } from '../../types/recipe';
import Meta from 'antd/es/card/Meta';
import router from 'next/router';

type Props = {
    recipe: Recipe;
};

const RecipeCard: React.FC<Props> = ({ recipe }) => {
    return (
        <Card
          hoverable
          style={{ width: '100%', margin: '1rem'}}
          cover={
            <div className="h-65 overflow-hidden">
                {recipe.imageUrls && recipe.imageUrls.length > 0 ? (
                    <img 
                    className="w-full h-full object-cover" 
                    alt={`recipe_thumb_${recipe.name}`} 
                    src={recipe.imageUrls[0]} 
                    />
                ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                        No image
                    </div>
                )}
            </div>
          }
          onClick={() => router.push(`/recipes/${recipe.id}`)}
        >
            <Meta title={recipe.name} description={recipe.description} />
        </Card>
    );
}

export default RecipeCard;
