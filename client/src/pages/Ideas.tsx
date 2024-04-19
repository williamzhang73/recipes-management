import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from './MyRecipes';
export type Recipe1 = Recipe & {
  username: string;
};
function Ideas() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [data, setData] = useState<Recipe1[]>();
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/ideas');
        if (!response.ok) throw new Error('Network response not ok.');
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);
  const mapped = data?.map((recipe) => (
    <li key={recipe.recipeId} className="flex justify-center">
      <RecipeCard details={true} recipe={recipe} />
    </li>
  ));
  if (isLoading) return <div>loading....</div>;
  if (error) return <div>page load failed</div>;
  return <ul className="w-4/5">{mapped}</ul>;
}
export default Ideas;
