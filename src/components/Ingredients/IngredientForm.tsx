import React, { useState } from "react";
import Card from "../UI/Card";
import "./IngredientForm.css";
import Iingredient from "../../models/IngredientModel";
import LoadingIndicator from "../UI/LoadingIndicator";

type InputState = {
  name: string;
  amount: number;
};

const IngredientForm: React.FC<{
  onAddIngredient: (newIngredient: Iingredient) => void;
  onLoading: boolean;
}> = React.memo((props) => {
  const [inputState, setInputState] = useState<InputState>({
    name: "",
    amount: 0,
  });
  const { onAddIngredient, onLoading } = props;
  //console.log("Rendering ingredients from IngredientsForm");
  const submitHandler: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (inputState.name !== "" && inputState.amount !== 0) {
      onAddIngredient({
        name: inputState.name,
        amount: inputState.amount,
      });

      setInputState({
        name: "",
        amount: 0,
      });
    }
  };

  const nameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputState((prevState) => ({
      ...prevState,
      name: event.target.value,
    }));
  };

  const amountChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputState((prevState) => ({
      ...prevState,
      amount: +event.target.value,
    }));
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              type="text"
              id="title"
              value={inputState.name}
              onChange={nameChangeHandler}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={inputState.amount}
              onChange={amountChangeHandler}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit" disabled={onLoading}>
              Add Ingredient
            </button>
            {onLoading && <LoadingIndicator />}
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
