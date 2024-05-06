import { useState } from 'react';
import { handleValidateEmailFormat } from '../lib/utility';
import { useNavigate } from 'react-router-dom';

function PasswordAssistance() {
  const [email, setEmail] = useState<string>('');
  const navigate = useNavigate();
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);

  async function handleSubmit(
    e: React.MouseEvent<HTMLFormElement, MouseEvent>
  ) {
    e.preventDefault();
    if (!isValidEmail) {
      alert('Email format must be correct');
      return;
    }
    try {
      const response = await fetch(`/api/users/OTPEmail/${email}`);
      if (!response.ok) throw new Error('Response network not ok.');
      const data = await response.json();
      if (data) {
        navigate('/otp-verification', { state: email });
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="px-5 w-full h-fit md:w-4/5">
      <form
        onSubmit={handleSubmit}
        className="w-full border-2 border-white rounded bg-white mt-6 px-4 h-60 flex flex-col gap-y-3">
        <span className="block font-bold text-center mt-7">
          Password Assistance
        </span>
        <span className="block">
          Enter your email address associated with your account.
        </span>
        <div>
          <label>
            <input
              required
              type="text"
              name="email"
              placeholder="Email"
              className="border-2 border-gray-500 rounded"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              onBlur={() => setIsValidEmail(handleValidateEmailFormat(email))}
            />
          </label>
          <button className="bg-blue-300 rounded ml-4">Continue</button>
        </div>
        {!isValidEmail && (
          <div className="text-red-400">Invalid email format.</div>
        )}
      </form>
    </div>
  );
}
export default PasswordAssistance;
