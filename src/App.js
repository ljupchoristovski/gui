import React, { useState, useEffect } from "react";

import * as go from "gojs";
import { ReactDiagram, ReactPalette } from "gojs-react";
import { connect } from "react-redux";
import {
  insertDiagramNode,
  removeDiagramNode,
  selectNodeDiagram,
  getArticles,
  updateNode
} from "./redux/actions/index";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

import "./App.css"; // contains .diagram-component CSS

// render function...
function ConnectApp() {
  const [selectedNode, setSelectedNode] = useState({});
  const [paramText, setParamText] = useState();
  const [paramColor, setparamColor] = useState();

  const paletteNodes = [
    {
      key: 1,
      text: "Alpha",
      color: "red",
      loc: "0 0",
      type: "1",
      leftArray: [],
      topArray: [],
      bottomArray: [],
      rightArray: []
    },
    {
      key: 2,
      text: "Beta",
      color: "green",
      loc: "150 0",
      type: "2",
      leftArray: [],
      topArray: [],
      bottomArray: [],
      rightArray: []
    },
    {
      key: 3,
      text: "Gamma",
      color: "blue",
      loc: "0 150",
      type: "3",
      leftArray: [],
      topArray: [],
      bottomArray: [],
      rightArray: []
    }
  ];

  const $ = go.GraphObject.make;

  function makeButton(text, action, visiblePredicate) {
    return $(
      "ContextMenuButton",
      $(go.TextBlock, text),
      { click: action },
      // don't bother with binding GraphObject.visible if there's no predicate
      visiblePredicate
        ? new go.Binding("visible", "", function(o, e) {
            return o.diagram ? visiblePredicate(o, e) : false;
          }).ofObject()
        : {}
    );
  }

  var nodeMenu = $(
    // context menu for each Node
    "ContextMenu",
    makeButton("Add top port", function(e, obj) {
      addPort("top");
    }),
    makeButton("Add left port", function(e, obj) {
      addPort("left");
    }),
    makeButton("Add right port", function(e, obj) {
      addPort("right");
    }),
    makeButton("Add bottom port", function(e, obj) {
      addPort("bottom");
    })
  );

  var portSize = new go.Size(8, 8);

  function initPalette() {
    const palette = $(go.Palette, {
      "undoManager.isEnabled": true, // enable undo & redo
      "clickCreatingTool.archetypeNodeData": {
        text: "new node"
        // color: "lightblue"
      },
      model: $(go.GraphLinksModel, {
        linkKeyProperty: "key" // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      })
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

    return palette;
  }

  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": true, // enable undo & redo
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key", // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
      nodeKeyProperty: "key"
    })
  });

  // define a simple Node template
  diagram.nodeTemplate = $(
    go.Node,
    "Table",
    {
      locationObjectName: "BODY",
      locationSpot: go.Spot.Center,
      selectionObjectName: "BODY",
      contextMenu: nodeMenu
    },
    // new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
    //   go.Point.stringify
    // ),

    // the body
    $(
      go.Panel,
      "Auto",
      {
        row: 1,
        column: 1,
        name: "BODY",
        stretch: go.GraphObject.Fill
      },
      $(go.Shape, "Rectangle", {
        fill: "#dbf6cb",
        stroke: null,
        strokeWidth: 0,
        minSize: new go.Size(60, 60)
      }),
      $(
        go.TextBlock,
        {
          margin: 10,
          textAlign: "center",
          font: "bold 14px Segoe UI,sans-serif",
          stroke: "#484848",
          editable: true
        },
        new go.Binding("text", "text").makeTwoWay()
      )
    ), // end Auto Panel body

    // the Panel holding the left port elements, which are themselves Panels,
    // created for each item in the itemArray, bound to data.leftArray
    $(go.Panel, "Vertical", new go.Binding("itemArray", "leftArray"), {
      row: 1,
      column: 0,
      itemTemplate: $(
        go.Panel,
        {
          _side: "left", // internal property to make it easier to tell which side it's on
          fromSpot: go.Spot.Left,
          toSpot: go.Spot.Left,
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer"
        },
        new go.Binding("portId", "portId"),
        $(
          go.Shape,
          "Rectangle",
          {
            stroke: null,
            strokeWidth: 0,
            desiredSize: portSize,
            margin: new go.Margin(1, 0)
          },
          new go.Binding("fill", "portColor")
        )
      ) // end itemTemplate
    }), // end Vertical Panel

    // the Panel holding the top port elements, which are themselves Panels,
    // created for each item in the itemArray, bound to data.topArray
    $(go.Panel, "Horizontal", new go.Binding("itemArray", "topArray"), {
      row: 0,
      column: 1,
      itemTemplate: $(
        go.Panel,
        {
          _side: "top",
          fromSpot: go.Spot.Top,
          toSpot: go.Spot.Top,
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer"
        },
        new go.Binding("portId", "portId"),
        $(
          go.Shape,
          "Rectangle",
          {
            stroke: null,
            strokeWidth: 0,
            desiredSize: portSize,
            margin: new go.Margin(0, 1)
          },
          new go.Binding("fill", "portColor")
        )
      ) // end itemTemplate
    }), // end Horizontal Panel

    // the Panel holding the right port elements, which are themselves Panels,
    // created for each item in the itemArray, bound to data.rightArray
    $(go.Panel, "Vertical", new go.Binding("itemArray", "rightArray"), {
      row: 1,
      column: 2,
      itemTemplate: $(
        go.Panel,
        {
          _side: "right",
          fromSpot: go.Spot.Right,
          toSpot: go.Spot.Right,
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer"
        },
        new go.Binding("portId", "portId"),
        $(
          go.Shape,
          "Rectangle",
          {
            stroke: null,
            strokeWidth: 0,
            desiredSize: portSize,
            margin: new go.Margin(1, 0)
          },
          new go.Binding("fill", "portColor")
        )
      ) // end itemTemplate
    }), // end Vertical Panel

    // the Panel holding the bottom port elements, which are themselves Panels,
    // created for each item in the itemArray, bound to data.bottomArray
    $(go.Panel, "Horizontal", new go.Binding("itemArray", "bottomArray"), {
      row: 2,
      column: 1,
      itemTemplate: $(
        go.Panel,
        {
          _side: "bottom",
          fromSpot: go.Spot.Bottom,
          toSpot: go.Spot.Bottom,
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer"
        },
        new go.Binding("portId", "portId"),
        $(
          go.Shape,
          "Rectangle",
          {
            stroke: null,
            strokeWidth: 0,
            desiredSize: portSize,
            margin: new go.Margin(0, 1)
          },
          new go.Binding("fill", "portColor")
        )
      ) // end itemTemplate
    }) // end Horizontal Panel
  ); // end Node

  diagram.linkTemplate = $(
    go.Link,
    {
      routing: go.Link.Orthogonal,
      fromSpot: go.Spot.Left,
      toSpot: go.Spot.Right
    },
    new go.Binding("fromEndSegmentLength"),
    new go.Binding("toEndSegmentLength"),
    $(go.Shape),
    $(go.Shape, { toArrow: "Standard" })
  );

  diagram.addDiagramListener("ObjectSingleClicked", function(e) {
    setSelectedNode({});
    e &&
      e.subject &&
      e.subject.part &&
      e.subject.part.data &&
      setSelectedNode({
        diagramModel: diagram.model,
        diagramNode: e.subject.part.data
      });
  });

  diagram.addDiagramListener("BackgroundSingleClicked", function(e) {
    setSelectedNode({});
  });

  diagram.addDiagramListener("BackgroundDoubleClicked", function(e) {
    setSelectedNode({});
  });

  diagram.model = new go.GraphLinksModel([], []);

  function handleModelChange(changes) {}

  function changeNodeParam(param, e, selNode) {
    param === "text"
      ? setParamText(e.target.value)
      : setparamColor(e.target.value);
    selNode.diagramModel.commit(function(m) {
      var data = m.nodeDataArray.find(el => el.key == selNode.diagramNode.key); // get the first link data
      console.log(data);
      m.set(data, param, e.target.value);
    });
  }

  function addPort(side) {
    diagram.startTransaction("addPort");
    diagram.selection.each(function(node) {
      // skip any selected Links
      if (!(node instanceof go.Node)) return;
      // compute the next available index number for the side
      var i = 0;
      while (node.findPort(side + i.toString()) !== node) i++;
      // now this new port name is unique within the whole Node because of the side prefix
      var name = side + i.toString();
      // get the Array of port data to be modified
      var arr = node.data[side + "Array"];
      if (arr) {
        // create a new port data object
        var newportdata = {
          portId: name,
          portColor: "black"
          // if you add port data properties here, you should copy them in copyPortData above
        };
        // and add it to the Array of port data
        diagram.model.insertArrayItem(arr, -1, newportdata);
      }
    });
    diagram.commitTransaction("addPort");
  }

  return (
    <div className="App">
      ...
      <ReactPalette
        initPalette={initPalette}
        divClassName="palette-component"
        nodeDataArray={paletteNodes}
      />
      <ReactDiagram
        initDiagram={() => diagram}
        divClassName="diagram-component"
        onModelChange={handleModelChange}
      />
      <div className="parameter-component">
        {selectedNode &&
          selectedNode.diagramNode &&
          selectedNode.diagramNode !== undefined &&
          Object.keys(selectedNode.diagramNode).map((el, index) => {
            return (
              <div key={selectedNode.diagramNode["key"]}>
                {selectedNode.diagramNode[el] &&
                  (el === "key" || el === "text" || el === "color") && (
                    <div>
                      {el === "key" && (
                        <div>
                          {el}:{selectedNode.diagramNode[el]}
                        </div>
                      )}
                      {el === "text" && (
                        <TextField
                          id="standard-basic"
                          label="Text"
                          value={
                            paramText !== ""
                              ? selectedNode.diagramNode[el]
                              : paramText
                          }
                          onChange={e =>
                            changeNodeParam("text", e, selectedNode)
                          }
                        />
                      )}
                      {el === "color" && (
                        <div>
                          {el}:
                          <FormControl className="form">
                            <Select
                              labelId="demo-simple-select-label"
                              id={"demo-simple-select" + index}
                              value={selectedNode.diagramNode[el]}
                              onChange={e =>
                                changeNodeParam("color", e, selectedNode)
                              }
                            >
                              <MenuItem value={"red"}>{"red"}</MenuItem>
                              <MenuItem value={"green"}>{"green"}</MenuItem>
                              <MenuItem value={"blue"}>{"blue"}</MenuItem>
                            </Select>
                          </FormControl>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            );
          })}
      </div>
      ...
    </div>
  );
}

const mapStateToProps = state => {
  return {
    // paletteNodes: state.paletteNodes,
    // selectedDiagramNode: state.selectedDiagramNode
    // diagramNodes: state.diagramNodes
  };
};

const mapDispatchToProps = {
  // insertDiagramNode,
  // removeDiagramNode,
  // selectNodeDiagram
  // getArticles,
  // updateNode
};

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectApp);

export default App;
