'use client';

import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useState } from 'react';

// --- GraphQL Queries & Mutations ---
const RECIPES = gql`
  query Recipes($limit: Int, $offset: Int, $search: String) {
    recipes(limit: $limit, offset: $offset, search: $search) {
      id
      title
      ingredients
      instructions
      createdAt
    }
  }
`;

const CREATE_RECIPE = gql`
  mutation CreateRecipe($input: RecipeInput!) {
    createRecipe(input: $input) {
      id
      title
    }
  }
`;

// --- TypeScript types ---
interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  createdAt: Date;
}

interface RecipesQueryData {
  recipes: Recipe[];
}

interface RecipesQueryVars {
  limit: number;
  offset: number;
  search: string;
}

interface CreateRecipeData {
  createRecipe: Pick<Recipe, 'id' | 'title'>;
}

interface CreateRecipeVars {
  input: {
    title: string;
    ingredients: string[];
    instructions: string[];
  };
}

// --- Component ---
export default function Home() {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [search, setSearch] = useState('');

  // Query with typed generics
  const { data, loading, refetch, error: queryError } = useQuery<RecipesQueryData, RecipesQueryVars>(RECIPES, {
    variables: { limit: 20, offset: 0, search: '' },
    fetchPolicy: 'cache-and-network',
  });

  // Mutation with typed generics
  const [createRecipe, { loading: creating, error: mutationError }] = useMutation<CreateRecipeData, CreateRecipeVars>(CREATE_RECIPE);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await createRecipe({
        variables: {
          input: {
            title,
            ingredients: ingredients.split(',').map(s => s.trim()).filter(Boolean),
            instructions: instructions.split('\n').map(s => s.trim()).filter(Boolean),
          },
        },
      });

      // Reset input fields
      setTitle('');
      setIngredients('');
      setInstructions('');

      // Refetch recipes with current search
      await refetch({ limit: 20, offset: 0, search });
    } catch (err) {
      console.error('Error creating recipe:', (err));
    }
  };

  const onSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await refetch({ limit: 20, offset: 0, search });
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Recipe Catalogue (GraphQL)</h1>

      <form onSubmit={submit} className="space-y-3 mb-8">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
        />
        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Instructions (newline-separated)"
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          disabled={creating}
        >
          {creating ? 'Adding...' : 'Add Recipe'}
        </button>
        {mutationError && <p className="text-red-500">{mutationError.message}</p>}
      </form>

      <form onSubmit={onSearch} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="Search title or ingredient"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="border rounded px-4 py-2">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {queryError && <p className="text-red-500">{queryError.message}</p>}

      <ul className="space-y-6">
        {data?.recipes?.map((r) => (
          <li key={r.id} className="border rounded p-4">
            <h2 className="text-xl font-semibold">{r.title}</h2>

            <p className="font-bold mt-2">Ingredients</p>
            <ul className="list-disc list-inside">
              {r.ingredients.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ul>

            <p className="font-bold mt-2">Instructions</p>
            <ol className="list-decimal list-inside">
              {r.instructions.map((i, idx) => (
                <li key={idx}>{i}</li>
              ))}
            </ol>

            <p className="opacity-60 text-sm mt-2">
              {r.createdAt.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
