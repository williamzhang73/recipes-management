/* import { useState } from 'react'; */

import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { validateSignIn } from '../lib/data';
import { IoEyeSharp } from 'react-icons/io5';
import { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';

function SignInForm() {
  const { handleSignIn } = useUser();
  const navigate = useNavigate();
  const [pwdInputType, setPwdInputType] = useState<string>('password');
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const data = await validateSignIn(formData);
      const { user, token } = data;
      handleSignIn(user, token);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  }

  function handlePwdInput() {
    if (pwdInputType === 'password') {
      setPwdInputType('text');
      return;
    }
    setPwdInputType('password');
  }

  return (
    <div className="w-full pt-8 flex justify-center border-l-2 border-white md:w-4/5">
      <form
        className="flex flex-col justify-center border-2 py-10 items-center bg-white  h-fit w-4/5 rounded-lg gap-y-3"
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
        <div className="flex items-center relative">
          <input
            type={pwdInputType}
            placeholder="Password"
            className="cursor-pointer border-2 rounded "
            name="password"
          />
          {pwdInputType === 'password' ? (
            <IoEyeSharp className="absolute right-0" onClick={handlePwdInput} />
          ) : (
            <FaRegEyeSlash
              className="absolute right-0"
              onClick={handlePwdInput}
            />
          )}
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
