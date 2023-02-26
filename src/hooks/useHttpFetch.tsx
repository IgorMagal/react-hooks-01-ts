import { useCallback, useReducer } from "react";

type State = {
  isLoading: boolean;
  error: null | string;
  data: null | Object;
};

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: null | string };

const httpReducer = (state: State, action: Action) => {
  switch (action.type) {
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

const useHttpFetch = () => {
  const [state, dispatch] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
    data: null,
  });

  const clearError = useCallback(() => {
    dispatch({ type: "SET_ERROR", payload: null });
    dispatch({ type: "SET_LOADING", payload: false });
  }, []);

  const sendReq = useCallback(
    (method: string, body: BodyInit | null | undefined, url: string) => {
      dispatch({ type: "SET_LOADING", payload: true });
      return fetch(url, {
        method: method,
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          dispatch({ type: "SET_LOADING", payload: false });
          return response.json();
        })
        .catch((e) => {
          dispatch({ type: "SET_ERROR", payload: e.message });
          throw e;
        });
    },
    []
  );

  return {
    isLoading: state.isLoading,
    error: state.error,
    resData: state.data,
    sendReq: sendReq,
    clearError: clearError,
  };
};

export default useHttpFetch;
