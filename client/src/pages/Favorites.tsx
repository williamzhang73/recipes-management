import { useUser } from '../components/useUser';

function Favorites() {
  const { user } = useUser();
  return (
    <div>
      {user && <span>my favorites</span>}
      {!user && <span>please login before viewing</span>}
    </div>
  );
}
export default Favorites;
