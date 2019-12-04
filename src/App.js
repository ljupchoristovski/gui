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

import "./App.css"; // contains .diagram-component CSS

// render function...
const ConnectApp = ({
  paletteNodes,
  diagramNodes,
  insertDiagramNode,
  removeDiagramNode,
  selectNodeDiagram,
  selectedDiagramNode,
  updateNode
}) => {
  const [type, setType] = useState("");

  function CustomLink() {
    go.Link.call(this);
  }
  go.Diagram.inherit(CustomLink, go.Link);

  CustomLink.prototype.findSidePortIndexAndCount = function(node, port) {
    var nodedata = node.data;
    if (nodedata !== null) {
      var portdata = port.data;
      var side = port._side;
      var arr = nodedata[side + "Array"];
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        if (arr[i] === portdata) return [i, len];
      }
    }
    return [-1, len];
  };

  CustomLink.prototype.computeEndSegmentLength = function(
    node,
    port,
    spot,
    from
  ) {
    var esl = go.Link.prototype.computeEndSegmentLength.call(
      this,
      node,
      port,
      spot,
      from
    );
    var other = this.getOtherPort(port);
    if (port !== null && other !== null) {
      var thispt = port.getDocumentPoint(this.computeSpot(from));
      var otherpt = other.getDocumentPoint(this.computeSpot(!from));
      if (
        Math.abs(thispt.x - otherpt.x) > 20 ||
        Math.abs(thispt.y - otherpt.y) > 20
      ) {
        var info = this.findSidePortIndexAndCount(node, port);
        var idx = info[0];
        var count = info[1];
        if (port._side == "top" || port._side == "bottom") {
          if (otherpt.x < thispt.x) {
            return esl + 4 + idx * 8;
          } else {
            return esl + (count - idx - 1) * 8;
          }
        } else {
          // left or right
          if (otherpt.y < thispt.y) {
            return esl + 4 + idx * 8;
          } else {
            return esl + (count - idx - 1) * 8;
          }
        }
      }
    }
    return esl;
  };

  function CustomLink() {
    go.Link.call(this);
  }
  go.Diagram.inherit(CustomLink, go.Link);

  CustomLink.prototype.findSidePortIndexAndCount = function(node, port) {
    var nodedata = node.data;
    if (nodedata !== null) {
      var portdata = port.data;
      var side = port._side;
      var arr = nodedata[side + "Array"];
      var len = arr.length;
      for (var i = 0; i < len; i++) {
        if (arr[i] === portdata) return [i, len];
      }
    }
    return [-1, len];
  };

  CustomLink.prototype.computeEndSegmentLength = function(
    node,
    port,
    spot,
    from
  ) {
    var esl = go.Link.prototype.computeEndSegmentLength.call(
      this,
      node,
      port,
      spot,
      from
    );
    var other = this.getOtherPort(port);
    if (port !== null && other !== null) {
      var thispt = port.getDocumentPoint(this.computeSpot(from));
      var otherpt = other.getDocumentPoint(this.computeSpot(!from));
      if (
        Math.abs(thispt.x - otherpt.x) > 20 ||
        Math.abs(thispt.y - otherpt.y) > 20
      ) {
        var info = this.findSidePortIndexAndCount(node, port);
        var idx = info[0];
        var count = info[1];
        if (port._side == "top" || port._side == "bottom") {
          if (otherpt.x < thispt.x) {
            return esl + 4 + idx * 8;
          } else {
            return esl + (count - idx - 1) * 8;
          }
        } else {
          // left or right
          if (otherpt.y < thispt.y) {
            return esl + 4 + idx * 8;
          } else {
            return esl + (count - idx - 1) * 8;
          }
        }
      }
    }
    return esl;
  };

  CustomLink.prototype.hasCurviness = function() {
    if (isNaN(this.curviness)) return true;
    return go.Link.prototype.hasCurviness.call(this);
  };

  CustomLink.prototype.computeCurviness = function() {
    if (isNaN(this.curviness)) {
      var fromnode = this.fromNode;
      var fromport = this.fromPort;
      var fromspot = this.computeSpot(true);
      var frompt = fromport.getDocumentPoint(fromspot);
      var tonode = this.toNode;
      var toport = this.toPort;
      var tospot = this.computeSpot(false);
      var topt = toport.getDocumentPoint(tospot);
      if (
        Math.abs(frompt.x - topt.x) > 20 ||
        Math.abs(frompt.y - topt.y) > 20
      ) {
        if (
          (fromspot.equals(go.Spot.Left) || fromspot.equals(go.Spot.Right)) &&
          (tospot.equals(go.Spot.Left) || tospot.equals(go.Spot.Right))
        ) {
          var fromseglen = this.computeEndSegmentLength(
            fromnode,
            fromport,
            fromspot,
            true
          );
          var toseglen = this.computeEndSegmentLength(
            tonode,
            toport,
            tospot,
            false
          );
          var c = (fromseglen - toseglen) / 2;
          if (frompt.x + fromseglen >= topt.x - toseglen) {
            if (frompt.y < topt.y) return c;
            if (frompt.y > topt.y) return -c;
          }
        } else if (
          (fromspot.equals(go.Spot.Top) || fromspot.equals(go.Spot.Bottom)) &&
          (tospot.equals(go.Spot.Top) || tospot.equals(go.Spot.Bottom))
        ) {
          var fromseglen = this.computeEndSegmentLength(
            fromnode,
            fromport,
            fromspot,
            true
          );
          var toseglen = this.computeEndSegmentLength(
            tonode,
            toport,
            tospot,
            false
          );
          var c = (fromseglen - toseglen) / 2;
          if (frompt.x + fromseglen >= topt.x - toseglen) {
            if (frompt.y < topt.y) return c;
            if (frompt.y > topt.y) return -c;
          }
        }
      }
    }
    return go.Link.prototype.computeCurviness.call(this);
  };

  function nodeClicked(e, obj) {
    var node = obj.part;
    selectNodeDiagram(node.data);
  }
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

  const diagram = $(go.Diagram, {
    "undoManager.isEnabled": true, // enable undo & redo
    // "clickCreatingTool.archetypeNodeData": {
    //   text: "new node",
    //   color: "lightblue"
    // },
    model: $(go.GraphLinksModel, {
      linkKeyProperty: "key" // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
    })
  });

  // define a simple Node template
  diagram.nodeTemplate = $(
    go.Node,
    "Table", // the Shape will go around the TextBlock
    { contextMenu: nodeMenu },
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
          new go.Binding("fill", "red")
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
          new go.Binding("fill", "red")
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
          new go.Binding("fill", "red")
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
          new go.Binding("fill", "red")
        )
      ) // end itemTemplate
    }) // end Horizontal Panel
  );

  diagram.linkTemplate = $(
    CustomLink, // defined below
    {
      routing: go.Link.AvoidsNodes,
      corner: 4,
      curve: go.Link.JumpGap,
      reshapable: true,
      resegmentable: true,
      relinkableFrom: true,
      relinkableTo: true
    },
    new go.Binding("points").makeTwoWay(),
    $(go.Shape, { stroke: "#2F4F4F", strokeWidth: 2 })
  );

  diagram.addDiagramListener("ObjectSingleClicked", function(e) {
    var part = e.subject.part;
    console.log(part.data);
    selectNodeDiagram(part.data);
    // nodeClicked
    // diagram.model = new go.GraphLinksModel([
    //   { key: 0, text: "Alpha", color: "lightblue" },
    //   { key: 1, text: "Basasdaeta", color: "orange" }
    // ]);
  });

  diagram.addDiagramListener("BackgroundSingleClicked", function(e) {
    selectNodeDiagram({});
  });

  diagram.addModelChangedListener(function(evt) {
    // ignore unimportant Transaction events
    if (!evt.isTransactionFinished) return;
    var txn = evt.object; // a Transaction
    if (txn === null) return;
    // iterate over all of the actual ChangedEvents of the Transaction
    txn.changes.each(function(e) {
      // ignore any kind of change other than adding/removing a node
      if (e.modelChange !== "nodeDataArray") return;
      // record node insertions and removals
      if (e.change === go.ChangedEvent.Insert) {
        console.log(evt.propertyName + " added node with key: " + e.newValue);
        console.log(diagram.model);
        // diagram.model.addArrayItem(diagramNodes,e.newValue)
        // insertDiagramNode(e.newValue);
        selectNodeDiagram(e.newValue);
      } else if (e.change === go.ChangedEvent.Remove) {
        removeDiagramNode(e.oldValue);
        selectNodeDiagram({});
        console.log(
          evt.propertyName + " removed node with key: " + e.oldValue.key
        );
      }
    });
  });

  diagram.model = new go.GraphLinksModel(diagramNodes);

  const palette = $(go.Palette, {
    "undoManager.isEnabled": true // enable undo & redo
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
  function handleModelChange(changes) {}

  const handleTypeChange = (event, node) => {
    // diagram.startTransaction("colorNode");
    // diagram.model.setDataProperty(diagram.model, "color", "red");
    // diagram.commitTransaction("colorNode");
    // setType(event.target.value);
  };

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
      console.log(node.data);
      if (arr) {
        // create a new port data object
        var newportdata = {
          portId: name,
          portColor: "red"
          // if you add port data properties here, you should copy them in copyPortData above
        };
        // and add it to the Array of port data
        diagram.model.insertArrayItem(arr, -1, newportdata);
      }
    });
    diagram.commitTransaction("addPort");
  }

  return (
    <div class="App">
      ...
      <ReactPalette
        initPalette={() => palette}
        divClassName="palette-component"
        nodeDataArray={paletteNodes}
      />
      <ReactDiagram
        initDiagram={() => diagram}
        divClassName="diagram-component"
        onModelChange={handleModelChange}
      />
      <div class="parameter-component">
        {selectedDiagramNode &&
          Object.keys(selectedDiagramNode).map((el, index) => {
            // console.log(el);
            return (
              <div>
                {/* {selectedDiagramNode[el] && el === "key" && el === "text" && el === "color" && el === "type"
                && (<div>
                  <span>{el}:</span><span>{selectedDiagramNode[el]}</span>
                  <FormControl className="form">
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={type !== "" ? type : selectedDiagramNode[el]}
                      onChange={e =>
                        handleTypeChange(e, selectedDiagramNode[el])
                      }
                    >
                      <MenuItem value={"1"}>{"1"}</MenuItem>
                      <MenuItem value={"2"}>{"2"}</MenuItem>
                      <MenuItem value={"3"}>{"3"}</MenuItem>
                    </Select>
                  </FormControl>
                </div)} */}
              </div>
            );
          })}
      </div>
      ...
    </div>
  );
};

const mapStateToProps = state => {
  return {
    paletteNodes: state.paletteNodes,
    selectedDiagramNode: state.selectedDiagramNode,
    diagramNodes: state.diagramNodes
  };
};

const mapDispatchToProps = {
  insertDiagramNode,
  removeDiagramNode,
  selectNodeDiagram,
  getArticles,
  updateNode
};

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectApp);

export default App;
