import store from "../redux/store/index";
import { selectNodeDiagram } from "../redux/actions/index";

window.store = store;
window.selectNodeDiagram = selectNodeDiagram;
