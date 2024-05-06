import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OtpVerification() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state;
  const [OTP, setOtp] = useState<string>('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await fetch(`/api/users/OTPVerify/${OTP}/${email}`);
      if (!response.ok) throw new Error('Response network not ok.');
      const result = await response.json();
      if (result === 'expired') {
        alert('OTP expired, re-submit your request.');
        return;
      }
      if (!result) {
        alert('Wrong OTP entered.');
        return;
      }
      navigate('/password-reset', { state: email });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="w-full h-fit md:w-4/5">
      <form
        onSubmit={handleSubmit}
        className="w-full border-2 border-white rounded bg-white mt-6 px-4 h-60 flex flex-col gap-y-3">
        <span className="block font-bold text-center mt-7">
          Password Assistance
        </span>
        <span className="block">Enter the OTP sending to your email.</span>
        <div>
          <label>
            <input
              required
              type="text"
              name="OTP"
              value={OTP}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="border-2 border-gray-500 rounded"
            />
          </label>
          <button className="bg-blue-300 rounded ml-4">Continue</button>
        </div>
      </form>
    </div>
  );
}
export default OtpVerification;
