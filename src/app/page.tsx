"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import PhotoUploader from './components/photos/PhotoUploader';

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
  imageUrls: string[];
}

const UNIT_OPTIONS = ["g", "kg", "tsp", "tbsp", "ml", "L", "full", "1/2"];

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
  const [ingredientName, setIngredientName] = useState('');
  const [ingredientQuantity, setIngredientQuantity] = useState('');
  const [ingredientUnit, setIngredientUnit] = useState("");
  const [steps, setSteps] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState('');
  const [,setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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
    console.log("images", imageUrls)
    const newRecipe = {
      name,
      description,
      ingredients,
      steps,
      imageUrls,
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
      setSteps([]);
      setImageFiles([]);
      setImageUrls([]);
    } else {
      console.error('Failed to create recipe');
    }
  };

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">{`Sarah's Recipe Website`}</h1>

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
        {/* Ingredients list */}
        {ingredients.map((ing, i) => (
          <div key={i} className="flex justify-between gap-4 mb-2">
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Ingredient name"
              value={ing.name}
              onChange={e => {
                const updated = [...ingredients];
                updated[i].name = e.target.value;
                setIngredients(updated);
              }}
            />
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Quantity"
              value={ing.quantity}
              onChange={e => {
                const updated = [...ingredients];
                updated[i].quantity = e.target.value;
                setIngredients(updated);
              }}
            />
          </div>
        ))}

        {/* Current ingredient input */}
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
          <select
            className="bg-white text-black border rounded px-2 py-1"
            name="units"
            id="units"
            value={ingredientUnit}
            onChange={e => setIngredientUnit(e.target.value)}
          >
            <option value="" hidden>
              Units
            </option>
            <option value="">
              none
            </option>
            {UNIT_OPTIONS.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))} 
          </select>
        </div>

        {/* Add ingredient button */}
        <button
          type="button"
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => {
            if (ingredientName.trim() && ingredientQuantity.trim()) {
              setIngredients([...ingredients, { name: ingredientName, quantity: `${ingredientQuantity} ${ingredientUnit}` }]);
              setIngredientName('');
              setIngredientQuantity('');
            }
          }}
        >
          + Add Ingredient
        </button>

        {/* Ingredients list */}
        {steps.map((step, i) => (
          <div key={i} className="flex justify-between items-center gap-4 mb-2">
            <span>{i+1}.</span>
            <input
              className="border rounded px-3 py-2 flex-1"
              placeholder="Ingredient name"
              value={step}
              onChange={e => {
                const updated = [...steps];
                updated[i] = e.target.value;
                setSteps(updated);
              }}
            />
          </div>
        ))}

        <textarea
          className="border rounded px-3 py-2 w-full"
          placeholder="Steps"
          value={currentStep}
          onChange={e => setCurrentStep(e.target.value)}
        />

        {/* Add Step button */}
        <button
          type="button"
          className="block bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => {
            if (steps) {
              setSteps([...steps, currentStep]);
              setCurrentStep('');
            }
          }}
        >
          + Add Step
        </button>

         {/* Photo uploader */}
        <PhotoUploader
          onChange={(files, urls) => {
            setImageFiles(files);
            setImageUrls(urls);
          }}
        />

        <div className="grid">
          <button
            type="submit"
            className="bg-green-800 text-white px-4 py-2 rounded justify-self-end"
          >
            Add Recipe
          </button>
        </div>
      </form>
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Recipes</h2>
        <ul>
          {recipes.map((recipe, index) => (
            <li
              key={recipe.id ?? index}
              className="mb-2 p-2 border rounded grid grid-cols-[1fr_auto] gap-4"
            >
              <div>
                <h3 className="font-semibold">{recipe.name}</h3>
                <p className="text-sm">{recipe.description}</p>

                <ul className="text-sm list-disc pl-5">
                  {recipe.ingredients?.map((ing, i) => (
                    <li key={i} className="grid grid-cols-[150px_100px] gap-4">
                      <span>{ing?.name}</span>
                      <span>{ing.quantity}</span>
                    </li>
                  ))}
                </ul>

                <label className="text-sm">Steps:</label>
                <ul className="text-sm list-decimal pl-5">
                  {recipe.steps?.map((step, i) => (
                    <li key={i}>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {recipe.imageUrls && recipe.imageUrls.length > 0 && (
                <Image
                    src={recipe.imageUrls[0]}
                    alt={recipe.name || "Recipe image"}
                    width={128}
                    height={128}
                    className="w-32 h-32 object-cover rounded self-center"
                />
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
