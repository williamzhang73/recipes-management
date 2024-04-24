import { Recipe1 } from './Ideas';

type Props = {
  recipe: Recipe1;
};
function RecipeInstructionList({ recipe }: Props) {
  return (
    <>
      <div className="bg-white w-full h-auto rounded-lg text-gray-700 md:w-4/5  lg:w-11/12">
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
