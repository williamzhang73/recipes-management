import { Link, Outlet, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { useUser } from './useUser';
function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
  const sideBarList = ['Ideas', 'My Recipes', 'Favorites', 'Add Recipe'];
  async function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const ObjectData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ObjectData),
      };
      const response = await fetch('/api/searchRecipe', req);
      if (!response) throw new Error('Network response not ok.');
      const data = await response.json();
      navigate('/searchlist', { state: data });
    } catch (error) {
      console.error(error);
      throw new Error('query search failed.');
    }
  }
  return (
    <>
      <div className="flex border-b-2 border-white justify-between w-full items-center h-14">
        <Link to="/">
          <span className="font-sans italic font-bold my-3 text-xl">
            Recipes
          </span>
        </Link>
        <span>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="search..."
              className="rounded border-2 border-gray-300"
              name="searchInput"
            />
            <button className="bg-blue-300 text-xs ml-1 rounded h-5 w-12 text-gray-700">
              Search
            </button>
          </form>
        </span>
        {user ? (
          <div className="flex flex-col items-center">
            <span>welcome, {user.username}</span>
            <span
              className="text-xs text-gray-700"
              onClick={() => {
                handleSignOut();
              }}>
              Sign out
            </span>
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <SideBar sideBarList={sideBarList} />
      <Outlet />
    </>
  );
}
export default Header;
