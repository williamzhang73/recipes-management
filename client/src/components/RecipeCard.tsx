import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import RecipeCommentForm from '../pages/RecipeCommentForm';
import { Recipe1 } from '../pages/Ideas';
import { readToken } from '../lib/data';
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
  const {
    recipeId,
    userId,
    username,
    title,
    imageUrl,
    preparationTime,
    cuisine,
    glutenFree,
    vegetarian,
    ingredients,
    instructions,
    createdAt,
  } = recipe;
  const navigate = useNavigate();
  const favorite = { color: 'red' };
  /*   const userId = user?.userId; */
  useEffect(() => {
    async function fetchIsLikes() {
      const req = {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const response = await fetch(`/api/likes/${userId}/${recipeId}`, req);
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
        console.log(error);
        throw new Error('fetch likes count failed');
      }
    }
    if (user) {
      fetchIsLikes();
    }

    fetchLikesCount();
  }, [isLikes, likesCount]);

  function handleClick() {
    navigate('/details', { state: recipe });
  }

  async function handleFaClickData(recipeId: string, userId: string) {
    if (user) {
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
    } else {
      alert('login required');
    }
  }

  function handleFaClickStyle() {
    setIsLikes(!isLikes);
  }

  function handleFaClick(recipeId: string, userId: string | undefined) {
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
        className={`w-4/5  ${
          !details ? 'h-screen' : 'h-3/5'
        } bg-stone-200 flex flex-wrap justify-center gap-y-4 pt-8`}>
        <div
          className={`bg-white ${
            !details ? 'w-4/5 h-3/5' : 'w-full'
          } rounded-lg flex overflow-hidden text-gray-700 relative shadow `}>
          <div className="w-2/5">
            <img
              src={`http://localhost:8080/${imageUrl}`}
              alt="sushi"
              className="h-full w-full object-cover"
              onClick={handleClick}
            />
          </div>
          <div className="w-3/5 flex flex-col gap-y-5 ">
            <span className="block">{username}</span>
            <div className="ml-8 flex flex-col gap-y-2">
              <span className="block">{title}</span>
              <span className="block">{cuisine}</span>
              <span
                className="block w-fit"
                onClick={() =>
                  handleFaClick(recipeId, user?.userId.toString())
                }>
                {isLikes ? (
                  <FaHeart style={favorite} className="inline" />
                ) : (
                  <FaHeart className="inline" />
                )}
                {likesCount} likes
              </span>

              <span
                className="block bg-blue-300 w-12 rounded"
                onClick={handleClick}>
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
