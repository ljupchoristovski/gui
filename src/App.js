import React, { useState, useEffect } from "react";

import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import { connect } from "react-redux";
import { addArticle, getArticles, updateNode } from "./redux/actions/index";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import "./App.css"; // contains .diagram-component CSS

// render function...
const ConnectApp = ({ articles, addArticle, getArticles, updateNode }) => {
  const [nodeArray, setNodeArray] = useState([
    { key: 0, text: "Alpha", color: "lightblue" },
    { key: 1, text: "Beta", color: "orange" }
  ]);

  function nodeClicked(e, obj) {
    // executed by click and doubleclick handlers
    var node = obj.part;
    addArticle(node.data);
    // console.log(node.data.text);
  }
  /**
   * This function is responsible for setting up the diagram's initial properties and any templates.
   */
  // const nodeArray = [
  //   { key: 0, text: "Alpha", color: "lightblue" },
  //   { key: 1, text: "Beta", color: "orange" }
  // ];

  const $ = go.GraphObject.make;
  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": true, // enable undo & redo
    "clickCreatingTool.archetypeNodeData": {
      text: "new node",
      color: "lightblue"
    },
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key" // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
    })
  });

  // define a simple Node template
  diagram.nodeTemplate = $(
    go.Node,
    "Auto", // the Shape will go around the TextBlock
    { click: nodeClicked },
    $(
      go.Shape,
      { width: 150, height: 100, fill: "white" },
      new go.Binding("fill", "color")
    ),

    $(
      go.TextBlock,
      { editable: true },
      { margin: 3 },
      new go.Binding("text", "text")
    )
  );

  diagram.addDiagramListener("ObjectSingleClicked", function(e) {
    var part = e.subject.part;
    console.log(diagram.model);
    diagram.model = new go.GraphLinksModel([
      { key: 0, text: "Alpha", color: "lightblue" },
      { key: 1, text: "Basasdaeta", color: "orange" }
    ]);
  });

  const palette = $(go.Palette, {
    "undoManager.isEnabled": true, // enable undo & redo
    "clickCreatingTool.archetypeNodeData": {
      text: "new node",
      color: "lightblue"
    }
  });

  // define a simple Node template
  palette.nodeTemplate = $(
    go.Node,
    "Horizontal",
    $(go.Shape, "Circle", {
      fill: "red",
      strokeWidth: 2,
      desiredSize: new go.Size(20, 20)
    }),
    $(
      go.TextBlock,
      {
        stroke: "#333333",
        font: "bold 14px sans-serif"
      },
      new go.Binding("text", "text")
    )
  );

  /**
   * This function handles any changes to the GoJS model.
   * It is here that you would make any updates to your React state, which is dicussed below.
   */
  function handleModelChange(changes) {
    console.log(changes);
  }

  function handleColorChange(color, node) {
    // console.log(color.target.value);
    node.color = color.target.value;
    updateNode(node);
  }

  return (
    <div class="App">
      ...
      <ReactPalette
        initPalette={() => palette}
        divClassName="palette-component"
        nodeDataArray={nodeArray}
      />
      <ReactDiagram
        initDiagram={() => diagram}
        divClassName="diagram-component"
        onModelChange={handleModelChange}
      />
      <div class="parameter-component">
        {articles &&
          Object.keys(articles).map((el, index) => {
            // console.log(el);
            return (
              <div>
                <span>{el}:</span>
                {el !== "color" && articles[el]}

                {el === "color" && (
                  <FormControl className="form">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={age}
                      onChange={e => handleColorChange(e, articles)}
                    >
                      <MenuItem value={"blue"}>blue</MenuItem>
                      <MenuItem value={"red"}>red</MenuItem>
                      <MenuItem value={"green"}>green</MenuItem>
                    </Select>
                  </FormControl>
                )}
                {/*<span>{{articles[index][el]}}</span> */}
              </div>
            );
          })}
      </div>
      ...
    </div>
  );
};

const mapStateToProps = state => {
  return { articles: state.articles };
};

const mapDispatchToProps = {
  addArticle,
  getArticles,
  updateNode
};

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectApp);

export default App;
