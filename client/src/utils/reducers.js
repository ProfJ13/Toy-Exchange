import { useReducer } from "react";
import { 
  // EXAMPLE_ACTION
 } from "./actions";

// The reducer is a function that accepts the current state and an action. It returns a new state based on that action.
export const reducer = (state, action) => {
  switch (action.type) {
    // Returns a copy of state with an update products array.
    // case EXAMPLE_ACTION:
    //   return {
    //     ...state,
    //     example: [...action.example],
    //   };
  }
};

export function useStateReducer(initialState) {
  return useReducer(reducer, initialState);
}
