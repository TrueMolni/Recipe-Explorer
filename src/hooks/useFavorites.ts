import { useState, useEffect } from 'react';
import { Recipe } from '../types/recipe';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(current => {
      const exists = current.some(r => r.idMeal === recipe.idMeal);
      if (exists) {
        return current.filter(r => r.idMeal !== recipe.idMeal);
      }
      return [...current, recipe];
    });
  };

  const isFavorite = (id: string) => {
    return favorites.some(recipe => recipe.idMeal === id);
  };

  return { favorites, toggleFavorite, isFavorite };
}