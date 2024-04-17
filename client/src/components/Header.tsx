import { Link, Outlet } from 'react-router-dom';
import SideBar from './SideBar';
function Header() {
  return (
    <>
      <div className="flex border-b-2 border-white justify-between w-full items-center">
        <Link to="/">
          <span className="font-sans italic font-bold my-3 text-xl">
            Recipes
          </span>
        </Link>
        <span>
          <input type="text" placeholder="search..." className="rounded" />
          <button className="bg-blue-300 text-xs ml-1 rounded h-5 w-12 text-gray-700">
            Search
          </button>
        </span>
        <span className="my-3 text-xs text-gray-700">Sign out</span>
      </div>
      <SideBar />
      <Outlet />
    </>
  );
}
export default Header;
