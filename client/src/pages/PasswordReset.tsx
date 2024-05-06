import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PasswordReset() {
  const [password, setPassword] = useState<string>('');
  const [reEnteredPassword, setReEnteredPassword] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state;
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password !== reEnteredPassword) {
      alert('Passwords need to match.');
      return;
    }
    try {
      const req = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      };
      const response = await fetch('/api/users/password-reset', req);
      if (!response.ok) throw new Error('Response network not ok.');
      const data = await response.json();
      if (data) {
        navigate('/sign-in');
      }
    } catch (error) {
      e;
      console.error(error);
    }
  }
  return (
    <div className="px-5 w-full md:w-4/5">
      <form
        onSubmit={handleSubmit}
        className="w-full border-2 border-white rounded bg-white mt-6 px-4 h-60 flex flex-col gap-y-3">
        <span className="block font-bold text-center mt-7">Password Reset</span>
        <span className="block">Enter your new password.</span>
        <div>
          <label>
            <input
              required
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="border-2 border-gray-500 rounded"
            />
          </label>
        </div>
        <div>
          <label>
            <input
              required
              type="password"
              name="reEnteredPassword"
              value={reEnteredPassword}
              onChange={(e) => setReEnteredPassword(e.target.value)}
              placeholder="Re-enter password"
              className="border-2 border-gray-500 rounded"
            />
          </label>
          <button className="bg-blue-300 rounded ml-4">Continue</button>
        </div>
      </form>
    </div>
  );
}
export default PasswordReset;
