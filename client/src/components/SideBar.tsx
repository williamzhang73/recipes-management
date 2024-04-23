import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
type Props = {
  sideBarList: string[];
};

function SideBar({ sideBarList }: Props) {
  const navigate = useNavigate();
  const [listItem, setListItem] = useState('');
  function handleClick(list: string) {
    list === 'Ideas' && navigate('/ideas');
    list === 'My Recipes' && navigate('/myrecipes');
    list === 'Favorites' && navigate('/favorites');
    list === 'Add Recipe' && navigate('/addrecipe');
    setListItem(list);
  }
  return (
    <div className="w-1/5 h-screen">
      <ul className="flex flex-col gap-y-4 text-gray-700 w-fit">
        {sideBarList.map((list) => (
          <li
            key={list}
            onClick={() => handleClick(list)}
            className={`${listItem === list && 'text-red-400'}`}>
            {list}
          </li>
        ))}
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
