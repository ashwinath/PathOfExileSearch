import { combineReducers } from "redux";

const defaultState = {
  search: "",
  poeItems: [],
}

function search(state = defaultState, action) {
  switch (action.type) {
    case "SEARCH":
      return {
        ...state,
        search: action.searchKey,
      };
    case "RECEIVE_SEARCH_RESULTS":
      return {
        ...state,
        poeItems: action.poeItems,
      }
    default:
      return state;
  }
}

export default combineReducers({
  search
});
