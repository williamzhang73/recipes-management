import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/data';
import { IoEyeSharp } from 'react-icons/io5';
import { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';

function SignUpForm() {
  const navigate = useNavigate();
  const [isUsername, setIsUsername] = useState<boolean>(true);
  const [pwdInputType, setPwdInputType] = useState<string>('password');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const data = await register(formData);
      if (data === 'duplicate username') {
        setIsUsername(false);
        return;
      }
      alert('register successfully, sign in please.');
      navigate('/sign-in');
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
        onSubmit={handleSubmit}
        className="flex flex-col justify-center border-2 py-10 items-center bg-white  h-fit w-4/5 rounded-lg gap-y-3">
        <span className="block font-bold">Register</span>
        <div className="flex flex-col gap-y-3">
          <div>
            <input
              type="text"
              placeholder="Username"
              className="border-2 rounded cursor-pointer"
              name="username"
            />
          </div>
          {!isUsername && (
            <div>
              <p className="text-red-400 text-xs">duplicate username</p>
            </div>
          )}
          <div className="flex items-center relative">
            <input
              type={pwdInputType}
              placeholder="Password"
              className="border-2 rounded cursor-pointer"
              name="password"
            />
            {pwdInputType === 'password' ? (
              <IoEyeSharp
                className="absolute right-0"
                onClick={handlePwdInput}
              />
            ) : (
              <FaRegEyeSlash
                className="absolute right-0"
                onClick={handlePwdInput}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button className="bg-blue-300 text-xs rounded h-7 w-12 text-gray-700">
            Register
          </button>
          <span className="block text-xs">
            Already have an account?
            <Link to="/sign-in">
              <span className="text-blue-500">Sign in</span>
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
export default SignUpForm;
