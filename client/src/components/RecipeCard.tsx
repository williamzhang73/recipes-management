import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RecipeCommentForm from './RecipeCommentForm';
import { AiOutlineMail } from 'react-icons/ai';
import {
  Recipe1,
  insertOrDeleteLikes,
  readUser,
  searchIsLikes,
  searchLikesCount,
} from '../lib/data';
import { useEffect, useState } from 'react';
import { useUser } from './useUser';
type Props = {
  details: boolean;
  recipe: Recipe1;
  handleCommentPost: (message: string, recipeId: string) => void;
  handleFavorite?: (inserted: boolean, recipeId: string) => void;
};

function RecipeCard({
  details,
  recipe,
  handleCommentPost,
  handleFavorite,
}: Props) {
  const [isLikes, setIsLikes] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useUser();
  const { recipeId, username, title, imageUrl, preparationTime, cuisine } =
    recipe;
  const navigate = useNavigate();
  const favorite = { color: 'red' };

  useEffect(() => {
    async function fetchIsLikes() {
      const data = await searchIsLikes(readUser()?.userId, recipeId);
      if (data === 'dislike') {
        setIsLikes(false);
      } else {
        setIsLikes(true);
      }
    }

    async function fetchLikesCount() {
      try {
        const data = await searchLikesCount(recipeId);
        const count = data.count as number;
        if (!count) return setLikesCount(0);
        setLikesCount(count);
      } catch (error) {
        throw new Error('fetch likes count failed');
      }
    }
    if (readUser()) {
      fetchIsLikes();
    }
    fetchLikesCount();
  }, [isLikes, likesCount, recipeId]);

  function handleDetailsClick() {
    navigate('/details', { state: recipe });
  }

  async function handleFaClickData(recipeId: string, userId: number) {
    if (!user) {
      alert('login required');
      return;
    }

    try {
      const data = await insertOrDeleteLikes(recipeId, userId);
      if (data === 'inserted') {
        setIsLikes(true);
        handleFavorite?.(true, recipeId);
      } else {
        setIsLikes(false);
        handleFavorite?.(false, recipeId);
      }
    } catch (error) {
      console.error(error);
      throw new Error('faHeart clicks failed.');
    }
  }

  function handleFaClickStyle() {
    setIsLikes(!isLikes);
  }

  function handleFaClick(recipeId: string, userId: number | undefined) {
    if (user) {
      handleFaClickStyle();
      if (!userId) throw new Error('userId is undefined.');
      handleFaClickData(recipeId, userId);
    } else {
      alert('login required.');
    }
  }

  function handleEmailClick() {
    navigate('/email-sent-form', { state: recipe });
  }

  return (
    <>
      <div
        className={`${
          !details ? 'h-screen' : 'h-full'
        } w-full bg-stone-200 flex flex-wrap justify-center gap-y-4 md:w-4/5 lg:w-11/12`}>
        <div
          className={`bg-white ${
            !details ? 'w-4/5 h-3/5' : 'w-full'
          } rounded-lg flex overflow-hidden text-gray-700 relative shadow `}>
          <div className="w-2/5">
            <img
              src={`http://recipes-management-dev.us-west-1.elasticbeanstalk.com/${imageUrl}`}
              alt="sushi"
              className="h-full w-full object-cover"
              onClick={handleDetailsClick}
            />
          </div>
          <div className="w-3/5 flex flex-col gap-y-5 ">
            <div className="flex justify-between">
              <span>{username}</span>
              <span onClick={handleEmailClick}>
                <AiOutlineMail />
              </span>
            </div>

            <div className="flex flex-col gap-y-2 md:ml-8 ">
              <span className="block">{title}</span>
              <span className="block">{cuisine}</span>
              <span
                className="block w-fit"
                onClick={() => handleFaClick(recipeId, readUser()?.userId)}>
                {isLikes ? (
                  <FaHeart style={favorite} className="inline" />
                ) : (
                  <FaHeart className="inline" />
                )}
                {likesCount} likes
              </span>

              <span
                className="block bg-blue-300 w-12 rounded"
                onClick={handleDetailsClick}>
                More
              </span>
              <RecipeCommentForm
                handleCommentPost={handleCommentPost}
                recipeId={recipe.recipeId}
              />
            </div>
          </div>
          <div className="absolute bg-orange-300 rounded mt-2 ml-2">
            {preparationTime} mins
          </div>
        </div>
      </div>
    </>
  );
}
export default RecipeCard;
