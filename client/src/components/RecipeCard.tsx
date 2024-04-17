import { FaHeart } from 'react-icons/fa';
function RecipeCard() {
  return (
    <>
      <div className="w-4/5 bg-gray-100 flex flex-wrap justify-center gap-y-4 pt-8">
        <div className="bg-white h-3/5 w-4/5 rounded-lg flex overflow-hidden text-gray-700 relative">
          <div className="w-2/5">
            <img
              src="../../images/sushi.png"
              alt="sushi"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="w-3/5 flex flex-col gap-y-5 ">
            <span className="block">sushi_lover_99</span>
            <div className="ml-8 flex flex-col gap-y-2">
              <span className="block">California Sushi</span>
              <span className="block">Japanese Cuisine</span>
              <span className="block">
                <FaHeart color="red" className="inline" />3 likes
              </span>
              <span className="block bg-blue-100 w-12 rounded">More</span>
            </div>
          </div>
          <div className="absolute bg-orange-300 rounded mt-2 ml-2">
            70 mins
          </div>
        </div>
      </div>
    </>
  );
}
export default RecipeCard;
