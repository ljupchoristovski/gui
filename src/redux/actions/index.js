import { SELECT_NODE } from "../constants/action-types";
import { GET_ARTICLES } from "../constants/action-types";
import { UPDATE_NODE } from "../constants/action-types";
import { INSERT_NODE } from "../constants/action-types";
import { REMOVE_NODE } from "../constants/action-types";

export function selectNodeDiagram(payload) {
  return { type: SELECT_NODE, payload };
}

export function insertDiagramNode(payload) {
  return { type: INSERT_NODE, payload };
}

export function removeDiagramNode(payload) {
  return { type: REMOVE_NODE, payload };
}

export function getArticles() {
  return { type: GET_ARTICLES };
}

export function updateNode(payload) {
  return { type: UPDATE_NODE, payload };
}
