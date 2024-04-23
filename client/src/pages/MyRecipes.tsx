import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { readToken } from '../lib/data';
import RecipeCard from '../components/RecipeCard';
import { Recipe1 } from './Ideas';
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
    async function fetchData() {
      if (user) {
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
      } else {
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
  if (error) return <div>data fetch failed</div>;
  return (
    <>
      {user && (
        <>
          <ul className="flex flex-wrap w-full p-3 gap-y-3 flex-col md:h-fit md:border-l-2 md:border-white md:w-4/5 md:flex-row">
            {mapped}
          </ul>
          <div className="text-blue-600 w-screen sticky bottom-0">
            <ScrollToTopButton />
          </div>
        </>
      )}
      {!user && <span>login required.</span>}
    </>
  );
}
export default MyRecipes;
