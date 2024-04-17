import { Link } from 'react-router-dom';
function SignInForm() {
  return (
    <div className="w-4/5 pt-8 flex justify-center">
      <form className=" flex flex-col justify-center border-2 items-center bg-white  h-3/5 w-4/5 rounded-lg gap-y-3">
        <span className="block font-bold">Sign In</span>
        <div>
          <input
            type="text"
            placeholder="Username"
            className="border-2 rounded cursor-pointer"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Password"
            className="border-2 rounded cursor-pointer"
          />
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-blue-100 text-xs rounded h-7 w-12 text-gray-700">
            Sign In
          </button>
          <span className="block text-xs">
            Don't have an account?
            <Link to="/sign-up">
              <span className="text-blue-500">Sign up</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
export default SignInForm;
