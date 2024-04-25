import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RecipeCommentForm from '../pages/RecipeCommentForm';
import { Recipe1 } from '../pages/Ideas';
import { readToken, readUser } from '../lib/data';
import { useEffect, useState } from 'react';
import { useUser } from './useUser';
type Props = {
  details: boolean;
  recipe: Recipe1;
  handleCommentPost: (message, recipeId) => void;
};

function RecipeCard({ details, recipe, handleCommentPost }: Props) {
  const [isLikes, setIsLikes] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState(0);
  const { user } = useUser();
  const { recipeId, username, title, imageUrl, preparationTime, cuisine } =
    recipe;
  const navigate = useNavigate();
  const favorite = { color: 'red' };

  useEffect(() => {
    async function fetchIsLikes() {
      const req = {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(
        `/api/likes/${readUser()?.userId}/${recipeId}`,
        req
      );
      if (!response.ok) throw new Error('Network response not ok.');
      const data = await response.json();
      if (data === 'dislike') {
        setIsLikes(false);
      } else {
        setIsLikes(true);
      }
    }

    async function fetchLikesCount() {
      try {
        if (!recipeId) throw new Error('recipeId required.');
        const response = await fetch(`/api/likes/${recipeId}`);
        const data = await response.json();
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
  }, [isLikes, likesCount]);

  function handleDetailsClick() {
    navigate('/details', { state: recipe });
  }

  async function handleFaClickData(recipeId: string, userId: number) {
    if (!user) {
      alert('login required');
      return;
    }

    try {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${readToken()}`,
        },
        body: JSON.stringify({ recipeId, userId }),
      };
      const response = await fetch('/api/likes', req);
      if (!response.ok) throw new Error('Network response not ok.');
      const data = await response.json();
      if (data === 'inserted') {
        setIsLikes(true);
      } else {
        setIsLikes(false);
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
              src={`http://localhost:8080/${imageUrl}`}
              alt="sushi"
              className="h-full w-full object-cover"
              onClick={handleDetailsClick}
            />
          </div>
          <div className="w-3/5 flex flex-col gap-y-5 ">
            <span className="block">{username}</span>
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
