"use client";

import { useState, useEffect } from 'react';

interface Ingredient {
  name: string;
  quantity: string;
}

interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [steps, setSteps] = useState('');

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      setRecipes(data);
    }

    fetchRecipes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newRecipe = {
      name,
      description,
      ingredients,
      steps: steps.split('\n').map(item => item.trim()),
    };

    const res = await fetch('/api/recipes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRecipe),
    });

    if (res.ok) {
      const createdRecipe = await res.json();
      setRecipes([...recipes, createdRecipe]);
      setName('');
      setDescription('');
      setIngredients([]);
      setSteps('');
    } else {
      console.error('Failed to create recipe');
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Recipe Catalogue</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <div className="flex justify-between gap-4">
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Ingredient name"
            value={ingredientName}
            onChange={e => setIngredientName(e.target.value)}
          />
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Quantity"
            value={ingredientQuantity}
            onChange={e => setIngredientQuantity(e.target.value)}
          />
        </div>
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Steps (newline-separated)"
          value={steps}
          onChange={e => setSteps(e.target.value)}
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => {
            if (ingredientName.trim() && ingredientQuantity.trim()) {
              setIngredients([...ingredients, { name: ingredientName, quantity: ingredientQuantity }]);
              setIngredientName('');
              setIngredientQuantity('');
            }
          }}
        >
          {'Add Recipe'}
        </button>
      </form>
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Recipes</h2>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id} className="mb-2 p-2 border rounded">
              <h3 className="font-semibold">{recipe.name}</h3>
              <p className="text-sm">{recipe.description}</p>
              <ul className="text-sm list-disc pl-5">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i}>
                    {ing?.name} — {ing.quantity}
                  </li>
                ))}
              </ul>
              <p className="text-sm">Steps: {recipe.steps}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
