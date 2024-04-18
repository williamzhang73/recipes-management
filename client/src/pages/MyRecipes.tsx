import { useUser } from '../components/useUser';

function MyRecipes() {
  const { user } = useUser();
  return (
    <div>
      {user && <span>my recipes</span>}
      {!user && <span>please login before viewing</span>}
    </div>
  );
}
export default MyRecipes;
