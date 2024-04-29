import { useNavigate } from 'react-router-dom';
type Props = {
  sideBarList: string[];
  listItem: string;
  handleSetList: (list: string) => void;
};

function SideBar({ sideBarList, handleSetList, listItem }: Props) {
  const navigate = useNavigate();
  function handleClick(list: string) {
    list === 'Ideas' && navigate('/ideas');
    list === 'My Recipes' && navigate('/myrecipes');
    list === 'Favorites' && navigate('/favorites');
    list === 'Add Recipe' && navigate('/addrecipe');
    handleSetList(list);
  }

  function handleSignInClick() {
    navigate('/sign-in');
    handleSetList('');
  }

  function handleSignUpClick() {
    navigate('/sign-up');
    handleSetList('');
  }

  return (
    <div className="h-fit w-full md:w-1/5 lg:h-screen">
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
      <div className="flex flex-col items-start lg:mt-10 lg:flex-row">
        <button
          onClick={handleSignInClick}
          className="mt-2 sm:mt-2 bg-blue-300 text-xs rounded h-5 w-12 text-gray-700 lg:mr-4">
          Sign In
        </button>

        <button
          onClick={handleSignUpClick}
          className="mt-2 sm:mt-2 bg-blue-300 text-xs rounded h-5 w-12 text-gray-700">
          Sign Up
        </button>
      </div>
    </div>
  );
}
export default SideBar;
