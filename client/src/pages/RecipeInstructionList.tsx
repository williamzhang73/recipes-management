import { Recipe1 } from './Ideas';

type Props = {
  recipe: Recipe1;
};
function RecipeInstructionList({ recipe }: Props) {
  return (
    <>
      {/* <div className="font-bold">instructions</div> */}
      <div className="bg-white h-auto w-4/5 rounded-lg text-gray-700">
        <div>
          <span className="block font-medium">ingredients</span>
          <span className="block">{recipe.ingredients}</span>
          <span className="block font-medium">instructions</span>
          <span className="block">{recipe.instructions}</span>
        </div>
      </div>
    </>
  );
}
export default RecipeInstructionList;
