import { Outlet, Link } from 'react-router-dom';
function Header() {
  return (
    <>
      <div className="flex border-b-2 justify-between w-full items-center">
        <span className="font-sans italic font-bold my-3 text-xl">Recipes</span>
        <span>
          <input type="text" placeholder="search..." className="rounded" />
          <button className="bg-blue-100 text-xs ml-1 rounded h-5 w-12 text-gray-700">
            Search
          </button>
        </span>
        <span className="my-3 text-xs text-gray-700">Sign out</span>
      </div>
      <div className="border-r-2 w-1/5 h-screen">
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
            <button className="bg-blue-100 text-xs rounded h-5 w-12 text-gray-700 mr-4">
              Sign In
            </button>
          </Link>
          <Link to="/sign-up">
            <button className="bg-blue-100 text-xs rounded h-5 w-12 text-gray-700">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
      <Outlet />
    </>
  );
}
export default Header;
