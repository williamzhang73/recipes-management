import React, { useState } from 'react';
import { readToken } from '../lib/data';
import { useUser } from '../components/useUser';
type Props = {
  recipeId: string;
};
function RecipeCommentForm({ recipeId }: Props) {
  const [message, setMessage] = useState('');
  const { user } = useUser();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      try {
        const messageObject = {
          userId: user.userId,
          message,
          recipeId: recipeId,
        };
        const req = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${readToken()}`,
          },
          body: JSON.stringify(messageObject),
        };
        const response = await fetch('/api/comments', req);
        if (!response) throw new Error('Network response not ok.');
        setMessage('');
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('login required.');
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
