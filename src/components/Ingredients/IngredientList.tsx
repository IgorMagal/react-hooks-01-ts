import React from "react";
import "./IngredientList.css";
import Iingredient from "../../models/IngredientModel";

const IngredientList: React.FC<{
  onRemoveItem: () => void;
  ingredients: Iingredient[];
}> = (props) => {
  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ig) => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.name}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
