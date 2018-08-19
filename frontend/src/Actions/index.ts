import axios from "axios";
import { Dispatch } from "redux";
import { SearchItemResult, PoeNinjaItem } from "../Interfaces";

function init() {
  return {
    type: "INIT"
  };
}

function search(searchKey: string) {
  return {
    type: "SEARCH",
    searchKey,
  };
}

function receiveResults(poeItems: PoeNinjaItem[]) {
  return {
    type: "RECEIVE_SEARCH_RESULTS",
    poeItems,
  };
}

function searchServer(searchKey: string, dispatch: Dispatch) {
  try {
    axios.get<SearchItemResult>("/-/items/search", {
      params: {
        search: searchKey,
      }
    }).then(response => {
      dispatch(receiveResults(response.data.data));

      // Always load first result to details
      if (response.data.data.length > 0) {
        dispatch(selectItem(response.data.data[0].id))
      }
    });
  } catch (error) {
    console.error(error.message);
  }
}

function selectItem(id: string) {
  return {
    type: "SELECT_ITEM",
    id,
  };
}

export { search, searchServer, init, selectItem };
