import { useCallback, useEffect, useMemo, useReducer } from "react";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import Iingredient from "../../models/IngredientModel";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import useHttpFetch from "../../hooks/useHttpFetch";

type State = {
  ingredients: Iingredient[];
};

type Action =
  | { type: "SET_INGREDIENTS"; payload: Iingredient[] }
  | { type: "ADD_INGREDIENT"; payload: Iingredient }
  | { type: "REMOVE_INGREDIENT"; payload: string };

const ingredientReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_INGREDIENTS":
      return {
        ...state,
        ingredients: action.payload,
      };
    case "ADD_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.concat(action.payload),
      };
    case "REMOVE_INGREDIENT":
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        ),
      };
    default:
      throw new Error("Invalid action");
  }
};

function Ingredients() {
  const [state, dispatch] = useReducer(ingredientReducer, {
    ingredients: [],
  });
  const { error, isLoading, sendReq, clearError } = useHttpFetch();

  useEffect(() => {
    console.log("Fetching ingredients...", state.ingredients);
  }, [state.ingredients]);

  const addIngredientHandler = useCallback(
    (newIngredient: Iingredient) => {
      sendReq(
        "POST",
        JSON.stringify(newIngredient),
        "https://react-http-reqs-f9475-default-rtdb.firebaseio.com/ingredients.json"
      )
        .then((r) =>
          dispatch({ type: "ADD_INGREDIENT", payload: newIngredient })
        )
        .catch((e) => console.log(e));
    },
    [sendReq]
  );

  const removeIngredientHandler = useCallback(
    (id: string) => {
      sendReq(
        "DELETE",
        null,
        `https://react-http-reqs-f9475-default-rtdb.firebaseio.com/ingredients/${id}.json`
      )
        .then((r) => dispatch({ type: "REMOVE_INGREDIENT", payload: id }))
        .catch((e) => console.log(e));
    },
    [sendReq]
  );

  const filterIngredientHandler = useCallback(
    (filteredIngredients: Iingredient[]) => {
      dispatch({ type: "SET_INGREDIENTS", payload: filteredIngredients });
    },
    []
  );

  const filterLoadingStateHandler = useCallback((state: boolean) => {
    // dispatch({ type: "SET_LOADING", payload: state });
  }, []);

  const ingredientsList = useMemo(() => {
    return (
      <IngredientList
        ingredients={state.ingredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [state.ingredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={() => clearError()}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        onLoading={isLoading}
      />
      <section>
        <Search
          onFilterIngredients={filterIngredientHandler}
          setLoadingstate={filterLoadingStateHandler}
        />
        {isLoading ? <p>Fetching ingredients...</p> : ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
