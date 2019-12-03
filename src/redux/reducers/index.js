import { ADD_ARTICLE } from "../constants/action-types";
import { GET_ARTICLES } from "../constants/action-types";
import { UPDATE_NODE } from "../constants/action-types";

const initialState = {
  articles: []
};

function rootReducer(state = initialState, action) {
  console.log(action.type);
  if (action.type === ADD_ARTICLE) {
    return {
      ...state,
      articles: action.payload
    };
  }
  if (action.type === UPDATE_NODE) {
    return {
      ...state,
      articles: action.payload
    };
  }
  //   if (action.type === GET_ARTICLES) {
  //     return {
  //       articles: articles
  //     };
  //   }
  return state;
}

export default rootReducer;
