import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { Recipe1 } from '../lib/data';

type Props = {
  recipe: Recipe1;
};
function RecipeInstructionList({
  recipe: { ingredients, instructions },
}: Props) {
  const replacedIngredients = ingredients.replace(/\r\n/g, '<br/>');
  const replacedInstructions = instructions.replace(/\r\n/g, '<br/>');
  const sanitizedIngredients = DOMPurify.sanitize(replacedIngredients);
  const sanitizedInstructions = DOMPurify.sanitize(replacedInstructions);
  const ingredientRef = useRef<HTMLSpanElement>(null);
  const instructionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ingredientRef.current) {
      ingredientRef.current.innerHTML = sanitizedIngredients;
    }
    if (instructionRef.current) {
      instructionRef.current.innerHTML = sanitizedInstructions;
    }
  }, [sanitizedIngredients, sanitizedInstructions]);

  return (
    <>
      <div className="bg-white w-full h-auto rounded-lg text-gray-700 md:w-4/5  lg:w-11/12">
        <div>
          <span className="block font-medium py-5 mx-3">Ingredients</span>
          <span className="block mx-3" ref={ingredientRef}></span>
          <span className="block font-medium py-5 mx-3">Instructions</span>
          <span className="block mx-3" ref={instructionRef}></span>
        </div>
      </div>
    </>
  );
}
export default RecipeInstructionList;
