'use client';

import { useEffect, useState } from 'react';

type Recipe = {
  id: string;
  title: string;
  ingredients: string[];
  steps: string[];
  createdAt: string;
};

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');

  const load = async () => {
    const res = await fetch('/api/recipes', { cache: 'no-store' });
    setRecipes(await res.json());
  };

  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await fetch('/api/recipes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        ingredients: ingredients.split(',').map(i => i.trim()),
        steps: steps.split('\n').map(s => s.trim()),
      }),
    });

    setTitle('');
    setIngredients('');
    setSteps('');
    await load();
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Recipe Catalogue</h1>

      <form onSubmit={add} className="space-y-4 mb-8">
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Recipe title"
          className="border rounded px-3 py-2 w-full"
        />
        <textarea
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          placeholder="Ingredients (comma-separated)"
          className="border rounded px-3 py-2 w-full"
        />
        <textarea
          value={steps}
          onChange={e => setSteps(e.target.value)}
          placeholder="Steps (newline-separated)"
          className="border rounded px-3 py-2 w-full"
        />
        <button className="bg-black text-white px-4 py-2 rounded">Add Recipe</button>
      </form>

      <ul className="space-y-6">
        {recipes.map(r => (
          <li key={r.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{r.title}</h2>
            <p className="font-bold mt-2">Ingredients:</p>
            <ul className="list-disc list-inside">
              {r.ingredients.map((i, idx) => <li key={idx}>{i}</li>)}
            </ul>
            <p className="font-bold mt-2">Steps:</p>
            <ol className="list-decimal list-inside">
              {r.steps.map((s, idx) => <li key={idx}>{s}</li>)}
            </ol>
          </li>
        ))}
      </ul>
    </main>
  );
}
