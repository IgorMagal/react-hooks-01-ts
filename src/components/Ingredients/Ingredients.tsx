import { useCallback, useEffect, useMemo, useReducer } from "react";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import Iingredient from "../../models/IngredientModel";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";

type State = {
  ingredients: Iingredient[];
  isLoading: boolean;
  error: null | string;
};

type Action =
  | { type: "SET_INGREDIENTS"; payload: Iingredient[] }
  | { type: "ADD_INGREDIENT"; payload: Iingredient }
  | { type: "REMOVE_INGREDIENT"; payload: string }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: null | string };

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

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      throw new Error("Invalid action");
  }
};

function Ingredients() {
  const [state, dispatch] = useReducer(ingredientReducer, {
    ingredients: [],
    isLoading: false,
    error: null,
  });

  //const [ingredients, setIngredients] = useState<Iingredient[]>([]);
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Fetching ingredients...", state.ingredients);
  }, [state.ingredients]);

  const addIngredientHandler = useCallback((newIngredient: Iingredient) => {
    dispatch({ type: "SET_LOADING", payload: true });
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
      .then((respData) =>
        dispatch({ type: "ADD_INGREDIENT", payload: newIngredient })
      )
      .then((e) => dispatch({ type: "SET_LOADING", payload: false }));
  }, []);

  const removeIngredientHandler = useCallback((id: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    fetch(
      `https://react-http-reqs-f9475-default-rtdb.firebaseio.com/ingredients/${id}.json`,
      {
        method: "DELETE",
      }
    )
      .then((r) => dispatch({ type: "REMOVE_INGREDIENT", payload: id }))
      .then(() => dispatch({ type: "SET_LOADING", payload: false }))
      .catch((e) => {
        dispatch({ type: "SET_ERROR", payload: e.message });
      });
  }, []);

  const filterIngredientHandler = useCallback(
    (filteredIngredients: Iingredient[]) => {
      dispatch({ type: "SET_INGREDIENTS", payload: filteredIngredients });
    },
    []
  );

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
  }, []);

  const filterLoadingStateHandler = useCallback((state: boolean) => {
    dispatch({ type: "SET_LOADING", payload: state });
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
      {state.error && (
        <ErrorModal onClose={() => clearError()}>{state.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredient={addIngredientHandler}
        onLoading={state.isLoading}
      />
      <section>
        <Search
          onFilterIngredients={filterIngredientHandler}
          setLoadingstate={filterLoadingStateHandler}
        />
        {state.isLoading ? <p>Fetching ingredients...</p> : ingredientsList}
      </section>
    </div>
  );
}

export default Ingredients;
