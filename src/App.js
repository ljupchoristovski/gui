import React from "react";

import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";

import "./App.css"; // contains .diagram-component CSS

// ...

function nodeClicked(e, obj) {
  // executed by click and doubleclick handlers
  var node = obj.part;
  console.log(node.data.text);
}
/**
 * This function is responsible for setting up the diagram's initial properties and any templates.
 */
function initDiagram() {
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
      { width: 70, height: 20, fill: "white" },
      new go.Binding("fill", "color")
    ),

    $(go.TextBlock, { margin: 3 }, new go.Binding("text", "text"))
  );

  return diagram;
}

function initPalette() {
  const $ = go.GraphObject.make;
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
    "Vertical",
    $(
      go.Shape,
      { width: 14, height: 14, fill: "white" },
      new go.Binding("fill", "color")
    ),
    $(go.TextBlock, new go.Binding("text", "text"))
  );

  return palette;
}

/**
 * This function handles any changes to the GoJS model.
 * It is here that you would make any updates to your React state, which is dicussed below.
 */
function handleModelChange(changes) {
  console.log(changes);
}

// render function...
function App() {
  return (
    <div class="App">
      ...
      <ReactPalette
        initPalette={initPalette}
        divClassName="palette-component"
        nodeDataArray={[
          { key: 0, text: "Alpha", color: "lightblue", loc: "0 0" },
          { key: 1, text: "Beta", color: "orange", loc: "150 0" },
          { key: 2, text: "Gamma", color: "lightgreen", loc: "0 150" },
          { key: 3, text: "Delta", color: "pink", loc: "150 150" }
        ]}
      />
      <ReactDiagram
        initDiagram={initDiagram}
        divClassName="diagram-component"
        onModelChange={e => handleModelChange(e)}
      />
      <div class="parameter-component"></div>
      ...
    </div>
  );
}

export default App;
