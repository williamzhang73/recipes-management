import { useEffect, useRef } from 'react';
import { Recipe1 } from './Ideas';

type Props = {
  recipe: Recipe1;
};
function RecipeInstructionList({
  recipe: { ingredients, instructions },
}: Props) {
  const replacedIngredients = ingredients.replace(/\r\n/g, '<br/>');
  const replacedInstructions = instructions.replace(/\r\n/g, '<br/>');

  const ingredientRef = useRef<HTMLSpanElement>(null);
  const instructionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ingredientRef.current) {
      ingredientRef.current.innerHTML = replacedIngredients;
    }
    if (instructionRef.current) {
      instructionRef.current.innerHTML = replacedInstructions;
    }
  }, [replacedIngredients, replacedInstructions]);

  return (
    <>
      <div className="bg-white w-full h-auto rounded-lg text-gray-700 md:w-4/5  lg:w-11/12">
        <div>
          <span className="block font-medium py-5">ingredients</span>
          <span className="block" ref={ingredientRef}></span>
          <span className="block font-medium py-5">instructions</span>
          <span className="block" ref={instructionRef}></span>
        </div>
      </div>
    </>
  );
}
export default RecipeInstructionList;
