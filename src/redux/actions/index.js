import { ADD_ARTICLE } from "../constants/action-types";
import { GET_ARTICLES } from "../constants/action-types";
import { UPDATE_NODE } from "../constants/action-types";

export function addArticle(payload) {
  return { type: ADD_ARTICLE, payload };
}

export function getArticles() {
  return { type: GET_ARTICLES };
}

export function updateNode(payload) {
  return { type: UPDATE_NODE, payload };
}
