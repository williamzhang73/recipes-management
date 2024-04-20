import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { insertComment, readToken } from '../lib/data';
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
  return (
    <>
      {user && <ul className="w-4/5 h-screen">{mapped}</ul>}
      {!user && <span>please login first</span>}
    </>
  );
}
export default MyRecipes;
