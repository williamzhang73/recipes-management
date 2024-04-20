import { FaHeart } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import RecipeCommentForm from '../pages/RecipeCommentForm';
import { Recipe1 } from '../pages/Ideas';
import { readToken } from '../lib/data';
import { useEffect, useState } from 'react';
type Props = {
  details: boolean;
  recipe: Recipe1;
  handleCommentPost: (message, recipeId) => void;
};
function RecipeCard({ details, recipe, handleCommentPost }: Props) {
  const [isLikes, setIsLikes] = useState<boolean>(false);
  const {
    recipeId,
    username,
    title,
    userId,
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

  useEffect(() => {
    async function fetchLikes() {
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
    fetchLikes();
  }, []);

  function handleClick() {
    navigate('/details', { state: recipe });
  }

  async function handleFaClick(recipeId: string, userId: string) {
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
            <Link to="/details">
              <img
                src={`http://localhost:8080/${imageUrl}`}
                alt="sushi"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
          <div className="w-3/5 flex flex-col gap-y-5 ">
            <span className="block">{username}</span>
            <div className="ml-8 flex flex-col gap-y-2">
              <span className="block">{title}</span>
              <span className="block">{cuisine}</span>
              <span
                className="block"
                onClick={() => handleFaClick(recipeId, userId)}>
                {isLikes ? (
                  <FaHeart color="red" className="inline" />
                ) : (
                  <FaHeart className="inline" />
                )}
                3 likes
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
