import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useDebounce } from "use-debounce";
import { searchRecipes, getCategories } from "../services/api";
import RecipeCard from "../components/RecipeCard";
import Pagination from "../components/Pagination";
import { useFavorites } from "../hooks/useFavorites";

const ITEMS_PER_PAGE = 12;

async function fetchAllMeals() {
  try {
    const categoriesRes = await fetch(
      "https://www.themealdb.com/api/json/v1/1/list.php?c=list"
    );
    const categoriesData = await categoriesRes.json();

    const categories = categoriesData.meals.map((cat) => cat.strCategory);

    const mealRequests = categories.map((category) =>
      fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
      ).then((res) => res.json())
    );

    const mealsByCategory = await Promise.all(mealRequests);
    const allMeals = mealsByCategory.flatMap((mealData) => mealData.meals);

    return allMeals;
  } catch (error) {
    console.error("Помилка завантаження страв:", error);
    return [];
  }
}

async function fetchMealsByCategory(category) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );
    const data = await res.json();
    return data.meals || [];
  } catch (error) {
    console.error("Помилка завантаження страв категорії:", error);
    return [];
  }
}

export default function RecipesPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const { data: allRecipes = [], isLoading: isLoadingAllRecipes } = useQuery({
    queryKey: ["recipes", "all"],
    queryFn: fetchAllMeals,
    enabled: !selectedCategory,
    staleTime: 1000 * 60 * 5,
  });

  const { data: categoryRecipes = [], isLoading: isLoadingCategoryRecipes } =
    useQuery({
      queryKey: ["recipes", selectedCategory],
      queryFn: () => fetchMealsByCategory(selectedCategory),
      enabled: !!selectedCategory,
      staleTime: 1000 * 60 * 5,
    });

  const { data: searchResults = [], isLoading: isLoadingSearch } = useQuery({
    queryKey: ["recipes", "search", debouncedSearch],
    queryFn: () => searchRecipes(debouncedSearch),
    enabled: debouncedSearch.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  const isLoading =
    isLoadingCategories ||
    (!debouncedSearch && !selectedCategory && isLoadingAllRecipes) ||
    (!debouncedSearch && selectedCategory && isLoadingCategoryRecipes) ||
    (debouncedSearch && isLoadingSearch);

  const recipesToShow = useMemo(() => {
    if (debouncedSearch) return searchResults;
    if (selectedCategory) return categoryRecipes;
    return allRecipes;
  }, [
    debouncedSearch,
    searchResults,
    selectedCategory,
    categoryRecipes,
    allRecipes,
  ]);

  const { filteredRecipes, totalPages } = useMemo(() => {
    return {
      filteredRecipes: recipesToShow,
      totalPages: Math.ceil(recipesToShow.length / ITEMS_PER_PAGE),
    };
  }, [recipesToShow]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const paginatedRecipes = useMemo(() => {
    return filteredRecipes.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredRecipes, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-semibold text-gray-700">
            Loading recipes...
          </div>
          <div className="text-gray-500">
            Please wait while we prepare your culinary journey
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {paginatedRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-xl font-semibold text-gray-700 mb-2">
            No recipes found
          </div>
          <div className="text-gray-500">
            Try a different search term or category
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.idMeal}
                recipe={recipe}
                isFavorite={isFavorite(recipe.idMeal)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
