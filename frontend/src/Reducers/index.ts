import { combineReducers } from "redux";
import { PoeNinjaItem } from "../Interfaces";

interface SearchState {
  search: string;
  poeItems: PoeNinjaItem[];
  clickeditem?: PoeNinjaItem[];
}

const defaultState = {
  search: "",
  poeItems: [],
  activeLinksButton: "allLinksButtonStatus",
}

function search(state: SearchState = defaultState, action) {
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
    case "SELECT_ITEM":
      const { id } = action;
      const clicked = state.poeItems.filter((item) => item.id === id)
      return {
        ...state,
        clickedItem: clicked.length > 0 ? clicked[0] : undefined,
      }
    case "SELECT_LINKS_RADIO":
      const { buttonId } = action;
      return {
        ...state,
        activeLinksButton: buttonId,
      }
    default:
      return state;
  }
}

export default combineReducers({
  search
});
