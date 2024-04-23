import { useEffect, useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from './MyRecipes';
import ScrollToTopButton from '../components/ScrollToTopButton';
export type Recipe1 = Recipe & {
  username: string;
};

type Props = {
  handleCommentPost: (recipeId: string, message: string) => void;
  error: unknown;
  setError: (error: unknown) => void;
};

function Ideas({ handleCommentPost, error, setError }: Props) {
  const [isLoading, setIsLoading] = useState(true);
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
    <li
      key={recipe.recipeId}
      className="flex justify-center md:w-full lg:w-1/2">
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
      <ul className="flex flex-wrap w-full p-3 gap-y-3 flex-col md:h-fit md:border-l-2 md:border-white md:w-4/5 md:flex-row">
        {mapped}
      </ul>
      <div className="text-blue-600 sticky bottom-0 w-screen">
        <ScrollToTopButton />
      </div>
    </>
  );
}
export default Ideas;
