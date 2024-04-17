function AddRecipes() {
  return (
    <div className="w-4/5 pt-8 flex justify-center">
      <form className=" flex flex-col justify-center border-2 items-center bg-white  h-5/6 w-4/5 rounded-lg gap-y-3 text-gray-700">
        <span className="block font-bold">Recipe Form</span>
        <div className="flex flex-col gap-y-2">
          <label className="flex justify-between">
            <span>title</span>
            <input
              type="text"
              name="title"
              id="title"
              className="border-2 rounded w-40"
              required
            />
          </label>

          <label className="flex justify-between">
            <span>imageUrl</span>
            <input
              type="text"
              name="imageUrl"
              id="imageUrl"
              className="border-2 rounded w-40"
              required
            />
          </label>

          <div className="flex justify-between">
            <span>preparation time</span>
            <select
              name="preparationTime"
              required
              className="border-2 w-40 rounded">
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
            <select name="cuisine" required className="border-2 w-40 rounded">
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
            <textarea className="border-2 rounded"></textarea>
          </div>
          <div className="flex justify-between">
            <span>instructions</span>
            <textarea className="border-2 rounded"></textarea>
          </div>
        </div>
        <span className="block">
          <button className="bg-blue-100 text-xs rounded h-7 w-20 text-gray-700">
            Add Recipe
          </button>
        </span>
      </form>
    </div>
  );
}
export default AddRecipes;
