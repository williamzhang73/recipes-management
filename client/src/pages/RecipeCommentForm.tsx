import React, { useState } from 'react';

function RecipeCommentForm() {
  const [message, setMessage] = useState('');
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
      const response = await fetch('/api/comments', req);
      if (!response) throw new Error('Network response not ok.');
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="border-2 rounded "
        name="message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}></textarea>
      <button className="block text-blue-500 ml-32">Post</button>
    </form>
  );
}
export default RecipeCommentForm;
