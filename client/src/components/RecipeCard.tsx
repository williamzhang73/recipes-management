import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
type Props = {
  details: boolean;
};
function RecipeCard({ details }: Props) {
  return (
    <>
      <div
        className={`w-4/5  ${
          !details ? 'h-screen' : 'h-3/5'
        } bg-gray-100 flex flex-wrap justify-center gap-y-4 pt-8`}>
        <div
          className={`bg-white ${
            !details ? 'w-4/5 h-3/5' : 'w-full'
          } rounded-lg flex overflow-hidden text-gray-700 relative`}>
          <div className="w-2/5">
            <Link to="/details">
              <img
                src="../../images/sushi.png"
                alt="sushi"
                className="h-full w-full object-cover"
              />
            </Link>
          </div>
          <div className="w-3/5 flex flex-col gap-y-5 ">
            <span className="block">sushi_lover_99</span>
            <div className="ml-8 flex flex-col gap-y-2">
              <span className="block">California Sushi</span>
              <span className="block">Japanese Cuisine</span>
              <span className="block">
                <FaHeart color="red" className="inline" />3 likes
              </span>
              <Link to="/details">
                <span className="block bg-blue-300 w-12 rounded">More</span>
              </Link>
              {}
              <form>
                <textarea className="border-2 rounded "></textarea>
                <button className="block text-blue-500 ml-32">Post</button>
              </form>
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
