import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleValidateEmailFormat } from '../lib/utility';

export function EmailSentForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const recipe = location.state;
  const [toAddress, setToAddress] = useState<string>('');
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const objectData = Object.fromEntries(formData);
    objectData.fromAddress = 'willzhang73@gmail.com';
    const body = {
      recipe,
      objectData,
    };
    try {
      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };
      const response = await fetch('/api/sendemail', req);
      if (!response.ok) throw new Error('Network response not ok');
      const data = await response.json();
      if (data === 'recipe undefined') {
        alert('recipe can not be undefined.');
      }
      if (data === 'sent') {
        alert('email sent successfully.');
        navigate('/ideas');
      }
    } catch (error) {
      alert('email sent failed');
      console.error(error);
    }
  }

  return (
    <div className="mx-6 w-full flex justify-center md:mx-0 md:border-l-2 md:border-white md:w-4/5">
      <form
        onSubmit={handleSubmit}
        className="p-3 w-full flex flex-col gap-y-3  bg-white h-fit mt-9 justify-center md:px-8 md:w-4/5">
        <span className="block text-center text-lg">Email Sent Form</span>
        <label className="flex justify-between">
          <span>From</span>
          <span className="w-3/4 md:w-48">Willzhang73@gmail.com</span>
        </label>

        <div>
          <label className="flex justify-between">
            <span>To</span>
            <input
              name="toAddress"
              className="w-3/4  border-2 rounded md:w-48"
              value={toAddress}
              onChange={(e) => {
                setToAddress(e.target.value);
              }}
              onBlur={() =>
                setIsValidEmail(handleValidateEmailFormat(toAddress))
              }
              placeholder="recipient"
              required></input>
          </label>
          <span className="block text-red-500">
            *Sandbox mode, only AWS verified email can be sent
          </span>
        </div>
        {!isValidEmail && (
          <div className="flex justify-between">
            <span></span>
            <span className="text-red-400">invalid email</span>
          </div>
        )}

        <label className="flex justify-between">
          <span>Title</span>
          <input
            name="title"
            className="w-3/4 border-2 rounded md:w-48"
            placeholder="title"
            required></input>
        </label>
        <label className="md:flex md:justify-between">
          Message
          <textarea
            placeholder="message"
            name="message"
            className="block w-full border-2 rounded md:w-48"></textarea>
        </label>
        <div className="flex justify-center">
          <button className="bg-blue-300 text-xs rounded h-7 w-12 text-gray-700">
            Sent
          </button>
        </div>
      </form>
    </div>
  );
}
