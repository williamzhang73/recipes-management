import { Link, Outlet, useNavigate } from 'react-router-dom';
import SideBar from './SideBar';
import { useUser } from './useUser';
import { useState } from 'react';
function Header() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
  const sideBarList = ['Ideas', 'My Recipes', 'Favorites', 'Add Recipe'];
  const [listItem, setListItem] = useState('');

  async function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    handleSetList('');
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const objectData = Object.fromEntries(formData);
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objectData),
      };
      const response = await fetch('/api/searchRecipe', req);
      if (!response) throw new Error('Network response not ok.');
      const data = await response.json();
      navigate('/search-list', { state: data });
    } catch (error) {
      console.error(error);
      throw new Error('query search failed.');
    }
  }

  function handleSetList(list: string) {
    setListItem(list);
  }

  async function handleSignOutClick() {
    try {
      if (user?.username === 'guest') {
        const response = await fetch('/api/users/guest', {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Response network is not ok.');
      }

      handleSignOut();
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="px-5 border-b-2 border-white w-full flex flex-col justify-center items-center md:flex-row md:h-14 md:justify-between">
        <Link to="/">
          <span className="font-sans italic font-bold my-3 text-xl">
            Recipes
          </span>
        </Link>
        <span>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search"
              className="rounded border-2 border-gray-300"
              name="searchInput"
              required
            />
            <button className="bg-blue-300 text-xs ml-1 rounded h-5 w-12 text-gray-700">
              Search
            </button>
          </form>
        </span>
        {user ? (
          <div className="flex gap-x-4 items-center md:flex md:flex-col md:items-center">
            <span>Welcome, {user.username}</span>
            <span
              className="text-xs text-gray-700"
              onClick={handleSignOutClick}>
              Sign out
            </span>
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <SideBar
        sideBarList={sideBarList}
        handleSetList={handleSetList}
        listItem={listItem}
      />
      <Outlet />
    </>
  );
}
export default Header;
