import { Link, useNavigate } from 'react-router-dom';
import { register } from '../lib/data';
import { IoEyeSharp } from 'react-icons/io5';
import { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { handleValidateEmailFormat } from '../lib/utility';

function SignUpForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [inputPwdType, setInputPwdType] = useState<string>('password');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidName) {
      alert('Username must be unique.');
      return;
    }
    if (!isValidEmail) {
      alert('Email must be unique.');
      return;
    }
    try {
      const formData = new FormData(event.currentTarget);
      await register(formData);
      alert('register successfully, sign in please.');
      navigate('/sign-in');
    } catch (error) {
      console.error(error);
    }
  }

  async function handleValidateUsername() {
    try {
      const res = await fetch(`/api/users/${username}`);
      const data = await res.json();
      if (!data) {
        setIsValidName(false);
      } else {
        setIsValidName(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function handleValidateEmail() {
    const regExpEmail = handleValidateEmailFormat(email);
    if (!regExpEmail) {
      alert('Email format not satisfied.');
      return;
    }
    const response = await fetch(`/api/users/validEmail/${email}`);
    if (!response.ok) throw new Error(`Response network not ok.`);
    const data = await response.json();
    if (data) {
      setIsValidEmail(true);
    } else {
      setIsValidEmail(false);
    }
  }

  function handlePwdInput() {
    if (inputPwdType === 'password') {
      setInputPwdType('text');
      return;
    }
    setInputPwdType('password');
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
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onBlur={handleValidateUsername}
            />
          </div>
          {!isValidName && (
            <div>
              <p className="text-red-400 text-xs">
                Username has been registered. Use another username.
              </p>
            </div>
          )}
          <div className="flex items-center relative">
            <input
              type={inputPwdType}
              placeholder="Password"
              className="border-2 rounded cursor-pointer"
              name="password"
            />
            {inputPwdType === 'password' ? (
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
          <div>
            <input
              type="text"
              name="email"
              className="border-2 rounded"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleValidateEmail}
            />
          </div>
          {!isValidEmail && (
            <div>
              <p className="text-red-400 text-xs">
                Email has been registered. Use another email.
              </p>
            </div>
          )}
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
