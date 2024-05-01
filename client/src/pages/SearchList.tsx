import { useLocation } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { Recipe1 } from '../lib/data';
type Props = {
  handleCommentPost: (recipeId: string, message: string) => void;
  error: unknown;
  setError: (error: unknown) => void;
};
function SearchList({ handleCommentPost }: Props) {
  const location = useLocation();
  const results = location.state as Recipe1[];

  if (results.length === 0) return <div>no results.</div>;
  return (
    <ul className="flex flex-wrap w-full p-3 gap-y-3 flex-col md:h-fit md:border-l-2 md:border-white md:w-4/5 md:flex-row">
      {results.map((result) => (
        <li
          key={result.recipeId}
          className="flex justify-center md:w-full lg:w-1/2">
          <RecipeCard
            recipe={result}
            handleCommentPost={handleCommentPost}
            details={true}
          />
        </li>
      ))}
    </ul>
  );
}
export default SearchList;
