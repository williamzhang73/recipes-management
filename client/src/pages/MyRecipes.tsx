import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { readToken } from '../lib/data';
import RecipeCard from '../components/RecipeCard';
import { Recipe1 } from './Ideas';
export type Recipe = {
  recipeId: string;
  title: string;
  userId: string;
  imageUrl: string;
  preparationTime: string;
  cuisine: string;
  glutenFree: boolean;
  vegetarian: boolean;
  ingredients: string;
  instructions: string;
  createdAt: string;
};
function MyRecipes() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [data, setData] = useState<Recipe1[]>();
  useEffect(() => {
    async function fetchData() {
      try {
        const req = {
          headers: {
            authorization: `Bearer ${readToken()}`,
          },
        };
        const response = await fetch('/api/myrecipes', req);
        if (!response.ok) throw new Error('Network response not ok.');
        const data = await response.json();
        console.log('fetched recipes: ', data);
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
  return (
    <>
      {user && <ul className="w-4/5 h-screen">{mapped}</ul>}
      {!user && <span>please login first</span>}
    </>
  );
}
export default MyRecipes;
