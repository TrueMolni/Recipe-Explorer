import axios from 'axios';
import { Recipe, RecipeResponse } from '../types/recipe';
import { formatIngredients } from '../lib/utils';

const api = axios.create({
  baseURL: 'https://www.themealdb.com/api/json/v1/1',
});

export async function searchRecipes(query: string): Promise<Recipe[]> {
  const { data } = await api.get<RecipeResponse>(`/search.php?s=${query}`);
  return (data.meals || []).map(recipe => ({
    ...recipe,
    ingredients: formatIngredients(recipe),
  }));
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  const { data } = await api.get<RecipeResponse>(`/lookup.php?i=${id}`);
  if (!data.meals) return null;
  const recipe = data.meals[0];
  return {
    ...recipe,
    ingredients: formatIngredients(recipe),
  };
}

export async function getCategories(): Promise<string[]> {
  const { data } = await api.get('/list.php?c=list');
  return data.meals.map((cat: { strCategory: string }) => cat.strCategory);
}

export async function getAllRecipes(categories: string[]): Promise<Recipe[]> {
  const allRecipesMap = new Map<string, Recipe>();

  const categoryPromises = categories.map(async category => {
    const categoryData = await safeGet<RecipeResponse>(`/filter.php?c=${category}`);
    if (!categoryData?.meals) return [];

    const recipePromises = categoryData.meals.map(meal => getRecipeById(meal.idMeal));
    const recipes = await Promise.all(recipePromises);

    return recipes.filter((recipe): recipe is Recipe => recipe !== null);
  });

  const categoryRecipes = await Promise.all(categoryPromises);
  categoryRecipes.flat().forEach(recipe => {
    allRecipesMap.set(recipe.idMeal, recipe);
  });

  return Array.from(allRecipesMap.values());
}
