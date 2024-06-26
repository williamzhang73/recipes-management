import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { Recipe1, readUser, searchMyRecipes } from '../lib/data';
import RecipeCard from '../components/RecipeCard';
import ScrollToTopButton from '../components/ScrollToTopButton';
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
type Props = {
  handleCommentPost: (recipeId: string, message: string) => void;
  error: unknown;
  setError: (error: unknown) => void;
};

function MyRecipes({ handleCommentPost, error, setError }: Props) {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Recipe1[]>();

  useEffect(() => {
    if (!readUser()) return;
    async function fetchData() {
      try {
        const data = await searchMyRecipes();
        setData(data);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [setError]);

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
  if (user && isLoading) return <div>loading....</div>;
  if (user && error) return <div>page load failed</div>;
  return (
    <>
      {user && data?.length != 0 && (
        <>
          <ul className="flex flex-wrap w-full p-3 gap-y-3 flex-col md:h-fit md:border-l-2 md:border-white md:w-4/5 md:flex-row">
            {mapped}
          </ul>
          <div className="text-blue-600 w-screen sticky bottom-0">
            <ScrollToTopButton />
          </div>
        </>
      )}
      {user && data?.length === 0 && <span>no results</span>}
      {!user && <span>login required.</span>}
    </>
  );
}
export default MyRecipes;
