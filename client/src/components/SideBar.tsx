import { Link } from 'react-router-dom';

function SideBar() {
  return (
    <div className="border-r-2 w-1/5 h-screen border-white">
      <ul className="flex flex-col gap-y-4 text-gray-700">
        <Link to="/ideas">
          <li>Ideas</li>
        </Link>
        <Link to="/myrecipes">
          <li>My Recipes</li>
        </Link>
        <Link to="/favorites">
          <li>Favorites</li>
        </Link>
        <Link to="/addrecipe">
          <li>Add Recipe</li>
        </Link>
      </ul>
      <div className="mt-10">
        <Link to="/sign-in">
          <button className="bg-blue-300 text-xs rounded h-5 w-12 text-gray-700 mr-4">
            Sign In
          </button>
        </Link>
        <Link to="/sign-up">
          <button className="bg-blue-300 text-xs rounded h-5 w-12 text-gray-700">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
}
export default SideBar;
