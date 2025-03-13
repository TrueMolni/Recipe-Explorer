import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Youtube } from 'lucide-react';
import { getRecipeById } from '../services/api';
import { useFavorites } from '../hooks/useFavorites';
import { cn } from '../lib/utils';

export default function RecipeDetailPage() {
  const { id = '' } = useParams();
  const { data: recipe, isLoading } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => getRecipeById(id),
  });
  const { isFavorite, toggleFavorite } = useFavorites();

  if (isLoading) {
    return <div className="text-center py-12">Loading recipe...</div>;
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Recipe not found.</p>
        <Link to="/" className="text-orange-500 hover:underline mt-4 inline-block">
          Back to recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to recipes
        </Link>
        <button
          onClick={() => toggleFavorite(recipe)}
          className="flex items-center space-x-1 text-gray-600 hover:text-red-500"
        >
          <Heart
            className={cn('h-5 w-5', {
              'fill-current text-red-500': isFavorite(recipe.idMeal),
            })}
          />
          <span>{isFavorite(recipe.idMeal) ? 'Remove from favorites' : 'Add to favorites'}</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-96 object-cover"
        />
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{recipe.strMeal}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-gray-600">
                <span className="font-medium">Category:</span> {recipe.strCategory}
              </span>
              <span className="text-gray-600">
                <span className="font-medium">Origin:</span> {recipe.strArea}
              </span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <span className="w-24 font-medium">{item.measure}</span>
                  <span>{item.ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Instructions</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {recipe.strInstructions}
            </p>
          </div>

          {recipe.strYoutube && (
            <div>
              <a
                href={recipe.strYoutube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-red-600 hover:text-red-700"
              >
                <Youtube className="h-5 w-5" />
                <span>Watch on YouTube</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}