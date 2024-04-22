import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from './MyRecipes';
import { useUser } from '../components/useUser';
import { insertComment } from '../lib/data';
export type Recipe1 = Recipe & {
  username: string;
};
function Ideas() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [data, setData] = useState<Recipe1[]>();
  const { user } = useUser();
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

  async function handleCommentPost(message: string, recipeId: string) {
    if (user) {
      const messageObject = {
        userId: user.userId,
        message,
        recipeId,
      };
      try {
        await insertComment(messageObject);
        alert('message posted.');
      } catch (error) {
        console.error(error);
        setError(error);
      }
    } else {
      alert('login required.');
    }
  }

  const mapped = data?.map((recipe) => (
    <li key={recipe.recipeId} className="flex justify-center">
      <RecipeCard
        details={true}
        recipe={recipe}
        handleCommentPost={handleCommentPost}
      />
    </li>
  ));
  if (isLoading) return <div>loading....</div>;
  if (error) return <div>page load failed</div>;
  return <ul className="w-4/5 h-fit border-l-2 border-white">{mapped}</ul>;
}
export default Ideas;
