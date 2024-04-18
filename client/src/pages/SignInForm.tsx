/* import { useState } from 'react'; */

import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';

function SignInForm() {
  const { handleSignIn } = useUser();
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const formObject = Object.fromEntries(formData);
      const req = {
        method: 'post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(formObject),
      };
      const response = await fetch('/api/auth/sign-in', req);
      if (!response.ok) {
        alert(`username or password doesn't match.`);
        throw new Error('Network response not ok.');
      }
      const data = await response.json();
      const { user, token } = data;
      handleSignIn(user, token);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-4/5 pt-8 flex justify-center">
      <form
        className=" flex flex-col justify-center border-2 items-center bg-white  h-3/5 w-4/5 rounded-lg gap-y-3"
        onSubmit={handleSubmit}>
        <span className="block font-bold">Sign In</span>
        <div>
          <input
            type="text"
            placeholder="Username"
            className="border-2 rounded cursor-pointer"
            name="username"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            className="border-2 rounded cursor-pointer"
            name="password"
          />
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-blue-300 text-xs rounded h-7 w-12 text-gray-700">
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
