import React from 'react';
import { useNavigate } from 'react-router-dom';
import { readToken } from '../lib/data';
import { useUser } from '../components/useUser';

function RecipeForm() {
  const navigate = useNavigate();
  const { user } = useUser();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (user) {
      try {
        const formData = new FormData(e.currentTarget);
        /*       const formObject = Object.fromEntries(formData); */
        const req = {
          method: 'POST',
          headers: {
            /*     'Content-Type': 'application/json', */
            Authorization: `Bearer ${readToken()}`,
          },
          body: formData,
        };
        const response = await fetch('/api/recipe', req);
        if (!response.ok) throw new Error('Network response not ok.');
        navigate('/myrecipes');
      } catch (error) {
        console.error(error);
        throw new Error('recipe submitted failed');
      }
    } else {
      alert('Login needed');
      navigate('/sign-in');
    }
  }
  return (
    <div className="w-full border-l-2 border-white pt-8 flex justify-center md:w-4/5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center border-2 rounded-lg gap-y-3 text-gray-700 items-center w-full mx-4 px-4 bg-white h-fit py-10 md:w-4/5 md:mx-0">
        <span className="block font-bold">Recipe Form</span>
        <div className="flex flex-col w-full gap-y-2">
          <label className="flex justify-between">
            <span>title</span>
            <input
              type="text"
              name="title"
              id="title"
              className="w-3/5 border-2 rounded md:w-40"
              required
            />
          </label>

          <label className="flex justify-between">
            <span>image</span>
            <input
              className="w-3/5 text-xs md:w-40 "
              required
              type="file"
              name="image"
              accept=".png, .jpg, .jpeg, .gif"
            />
          </label>

          <div className="flex justify-between">
            <span>preparation time</span>
            <select
              name="preparationTime"
              required
              className="border-2 rounded md:w-40">
              <option>10</option>
              <option>20</option>
              <option>30</option>
              <option>40</option>
              <option>50</option>
              <option>60</option>
              <option>70</option>
              <option>80</option>
              <option>90</option>
              <option>100</option>
            </select>
          </div>

          <div className="flex justify-between">
            <span>cuisine</span>
            <select
              name="cuisine"
              required
              className="border-2 md:w-40 rounded">
              <option>American</option>
              <option>British</option>
              <option>Chinese</option>
              <option>Italian</option>
              <option>Indian</option>
              <option>Japanese</option>
              <option>Mexican </option>
              <option>Swedish </option>
              <option>Scottish</option>
              <option>Thai</option>
            </select>
          </div>

          <div className="flex justify-between">
            <label>
              <input
                type="checkbox"
                id="glutenFree"
                name="glutenFree"
                className="mr-2"
              />
              <span>gluten free</span>
            </label>
            <label>
              <input
                type="checkbox"
                id="vegetarian"
                name="vegetarian"
                className="mr-2"
              />
              <span>vegetarian</span>
            </label>
          </div>
          <div className="flex justify-between">
            <span>ingredients</span>
            <textarea
              className="border-2 rounded"
              name="ingredients"></textarea>
          </div>
          <div className="flex justify-between">
            <span>instructions</span>
            <textarea
              className="border-2 rounded"
              name="instructions"></textarea>
          </div>
        </div>
        <span className="block">
          <button className="bg-blue-300 text-xs rounded h-7 w-20 text-gray-700">
            Add Recipe
          </button>
        </span>
      </form>
    </div>
  );
}
export default RecipeForm;
