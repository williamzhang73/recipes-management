import React, { useState } from 'react';
type Props = {
  handleCommentPost: (message, recipeId) => void;
  recipeId: string;
};
function RecipeCommentForm({ handleCommentPost, recipeId }: Props) {
  const [message, setMessage] = useState('');
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleCommentPost(message, recipeId);
    setMessage('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="border-2 rounded border-gray-400 w-11/12"
        name="message"
        placeholder="Comment"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
        }}></textarea>
      <button className="block text-blue-500 w-11/12 text-right">Post</button>
    </form>
  );
}
export default RecipeCommentForm;
