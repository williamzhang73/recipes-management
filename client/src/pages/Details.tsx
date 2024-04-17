import RecipeCard from '../components/RecipeCard';
import RecipeInstructionList from './RecipeInstructionList';
import CommentsList from './CommentsList';
import ScrollToTopButton from '../components/ScrollToTopButton';

function Details() {
  const details = true;
  return (
    <>
      <div className="flex flex-col w-4/5 items-center h-screen gap-y-3">
        <RecipeCard details={details} />
        <RecipeInstructionList />
        <CommentsList />
        <div className="text-blue-600 w-4/5 flex justify-end">
          {/* <RxTextAlignTop size={40} color="" /> */}
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
}
export default Details;
