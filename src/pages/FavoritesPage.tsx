import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { useFavorites } from '../hooks/useFavorites';
import { Ingredient } from '../types/recipe';

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites();

  const combinedIngredients = useMemo(() => {
    const ingredientMap = new Map<string, { measure: string; count: number }>();

    favorites.forEach(recipe => {
      recipe.ingredients.forEach(({ ingredient, measure }) => {
        if (ingredientMap.has(ingredient)) {
          ingredientMap.get(ingredient)!.count += 1;
        } else {
          ingredientMap.set(ingredient, { measure, count: 1 });
        }
      });
    });

    return Array.from(ingredientMap.entries()).map(([ingredient, { measure, count }]) => ({
      ingredient,
      measure,
      count,
    }));
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          No favorite recipes yet
        </h2>
        <p className="text-gray-600 mb-4">
          Start adding some recipes to your favorites!
        </p>
        <Link
          to="/"
          className="inline-block bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Browse Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your Favorite Recipes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(recipe => (
            <RecipeCard
              key={recipe.idMeal}
              recipe={recipe}
              isFavorite={true}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Combined Ingredients List
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {combinedIngredients.map(({ ingredient, measure, count }) => (
            <div
              key={ingredient}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="font-medium text-gray-900">{ingredient}</span>
              <div className="text-gray-600">
                <span>{measure}</span>
                <span className="text-sm ml-2">
                  (in {count} {count === 1 ? 'recipe' : 'recipes'})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}