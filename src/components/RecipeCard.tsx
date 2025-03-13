import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Recipe } from '../types/recipe';
import { cn } from '../lib/utils';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
}

export default function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
      <Link to={`/recipe/${recipe.idMeal}`}>
        <img
          src={recipe.strMealThumb}
          alt={recipe.strMeal}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <Link to={`/recipe/${recipe.idMeal}`}>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-orange-500">
              {recipe.strMeal}
            </h3>
          </Link>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(recipe)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Heart
                className={cn('h-5 w-5', {
                  'fill-current text-red-500': isFavorite,
                })}
              />
            </button>
          )}
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Category:</span> {recipe.strCategory}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Origin:</span> {recipe.strArea}
          </p>
        </div>
      </div>
    </div>
  );
}