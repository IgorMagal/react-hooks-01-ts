import { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import Iingredient from "../../models/IngredientModel";
import IngredientList from "./IngredientList";

function Ingredients() {
  const [ingredients, setIngredients] = useState<Iingredient[]>([]);

  useEffect(() => {
    fetch(
      "https://react-http-reqs-f9475-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        const loadedIngredients: Iingredient[] = [];
        for (const key in data) {
          loadedIngredients.push({
            id: key,
            name: data[key].name,
            amount: data[key].amount,
          });
        }
        setIngredients(loadedIngredients);
      });
  }, [ingredients]);

  const addIngredientHandler = (newIngredient: Iingredient) => {
    fetch(
      "https://react-http-reqs-f9475-default-rtdb.firebaseio.com/ingredients.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIngredient),
      }
    )
      .then((resp) => resp.json())
      .then((respData) => setIngredients(ingredients.concat(newIngredient)));
  };

  const removeIngredientHandler = (id: string) => {
    setIngredients(ingredients.filter((ingredient) => ingredient.id !== id));
  };

  const filterIngredientHandler = (ingredients: Iingredient[]) => {
    setIngredients(ingredients);
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />
      <section>
        <Search
          ingredientsList={ingredients}
          onFilterChange={filterIngredientHandler}
        />
        <IngredientList
          ingredients={ingredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
