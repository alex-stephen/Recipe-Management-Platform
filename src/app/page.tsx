"use client";

import { useState, useEffect } from 'react';

interface Recipe {
  id: string;
  name: string;
  // Add other properties as needed
}

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function fetchRecipes() {
      const res = await fetch('/api/recipes');
      const data = await res.json();
      setRecipes(data);
    }

    fetchRecipes();
  }, []);

  const submit = () => {

  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Recipe Catalogue</h1>

      <form onSubmit={submit} className="space-y-3 mb-8">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Title"
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Ingredients (comma-separated)"
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Instructions (newline-separated)"
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
        >
          {'Add Recipe'}
        </button>
      </form>
      <div>
        <h1>Recipes</h1>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.name}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
