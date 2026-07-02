'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiClient } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';

interface Recipe {
  id: number;
  title: string;
  description: string;
  difficulty_level: string;
  prep_time: number;
  cook_time: number;
  cuisine: string;
}

export default function RecipesPage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await apiClient.get('/recipes');
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) {
      fetchRecipes();
      return;
    }

    try {
      const response = await apiClient.get(`/recipes/search?q=${searchQuery}`);
      setRecipes(response.data.recipes);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
    }
  };

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Recettes</h1>
        {isAuthenticated && (
          <Link
            href="/recipes/create"
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            + Créer une recette
          </Link>
        )}
      </div>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher une recette..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Rechercher
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune recette trouvée
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg cursor-pointer transition">
        <h3 className="text-xl font-bold mb-2">{recipe.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex gap-4 text-sm text-gray-500">
          {recipe.prep_time && (
            <span>⏱️ {recipe.prep_time} min</span>
          )}
          {recipe.difficulty_level && (
            <span>📊 {recipe.difficulty_level}</span>
          )}
          {recipe.cuisine && (
            <span>🌍 {recipe.cuisine}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
