import { SELECT_NODE } from "../constants/action-types";
import { GET_ARTICLES } from "../constants/action-types";
import { UPDATE_NODE } from "../constants/action-types";
import { INSERT_NODE } from "../constants/action-types";
import { REMOVE_NODE } from "../constants/action-types";

const initialState = {
  paletteNodes: [
    {
      key: 0,
      text: "Alpha",
      color: "red",
      type: "1",
      leftArray: [],
      topArray: [],
      bottomArray: [],
      rightArray: []
    },
    {
      key: 1,
      text: "Beta",
      color: "green",
      type: "2",
      leftArray: [{ portColor: "#fae3d7", portId: "left0" }],
      topArray: [],
      bottomArray: [],
      rightArray: []
    }
  ],
  diagramNodes: [],
  selectedDiagramNode: []
};

function rootReducer(state = initialState, action) {
  if (action.type === SELECT_NODE) {
    console.log(action.payload);
    return {
      ...state,
      selectedDiagramNode: action.payload
    };
  }
  if (action.type === INSERT_NODE) {
    // return Object.assign({}, state, {
    //   diagramNodes: state.diagramNodes.concat(action.payload)
    // });
    return {
      ...state,
      diagramNodes: [...state.diagramNodes, action.payload]
    };
  }
  if (action.type === REMOVE_NODE) {
    return {
      diagramNodes: state.diagramNodes.filter(
        el => el.key != action.payload.key
      )
    };
  }
  if (action.type === UPDATE_NODE) {
    return {
      ...state,
      diagramNodes: action.payload
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
