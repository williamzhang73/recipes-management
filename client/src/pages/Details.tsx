import RecipeCard from '../components/RecipeCard';
import RecipeInstructionList from './RecipeInstructionList';
import CommentsList from './CommentsList';
import ScrollToTopButton from '../components/ScrollToTopButton';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUser } from '../components/useUser';
import { Recipe1, insertComment, searchComments } from '../lib/data';
import LoadingPage from './LoadingPage';
export type PostComment = {
  userId: number;
  recipeId: string;
  message: string;
};
export type Comment = PostComment & {
  username: string;
  commentId: string;
  createdAt: string;
};
function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [commentsData, setCommentsData] = useState<Comment[]>([]);
  const recipe = useLocation().state as Recipe1;

  useEffect(() => {
    async function fetchComments() {
      try {
        const data = await searchComments(recipe.recipeId);
        if (!data)
          throw new Error(`no values found for recipeId ${recipe.recipeId} `);
        setCommentsData(data);
      } catch (error) {
        console.error(error);
        setError(error);
        throw new Error('fetch comments failed.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchComments();
  }, [recipe.recipeId]);

  const { user } = useUser();
  async function handleCommentPost(message: string, recipeId: string) {
    if (user) {
      const messageObject = {
        userId: user.userId,
        message,
        recipeId,
      };
      try {
        const data = await insertComment(messageObject);
        data.username = user.username;
        setCommentsData([data, ...commentsData]);
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('login required.');
    }
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center w-4/5 h-screen border-l-2 border-white">
        <LoadingPage />
      </div>
    );
  if (error) return <div>page load failed</div>;
  return (
    <>
      <div className="flex flex-col w-full p-3 items-center h-fit gap-y-3 border-l-2 border-white relative lg:w-4/5 ">
        <RecipeCard
          details={true}
          recipe={recipe}
          handleCommentPost={handleCommentPost}
        />
        <RecipeInstructionList recipe={recipe} />
        <div className="w-full font-bold text-gray-700 md:w-4/5  lg:w-11/12">
          Comments
        </div>
        <ul className="w-full flex flex-col list-none md:w-4/5 lg:w-11/12">
          {' '}
          {commentsData?.map((comment) => (
            <li key={comment.commentId} className="">
              <CommentsList comment={comment} />
            </li>
          ))}
        </ul>
        <div className="text-blue-600 sticky bottom-0">
          <ScrollToTopButton />
        </div>
      </div>
    </>
  );
}
export default Details;
