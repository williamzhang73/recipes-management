import { useLocation } from 'react-router-dom';
import { Recipe1 } from './Ideas';
import RecipeCard from '../components/RecipeCard';
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
    <ul className="w-4/5 h-fit border-l-2 border-white">
      {results.map((result) => (
        <li key={result.recipeId} className="flex justify-center">
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
