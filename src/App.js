import React from 'react';
import './App.css';
import * as go from 'gojs';
import { ReactDiagram, ReactPalette } from 'gojs-react';

function initDiagram(diagramId) {
  const $ = go.GraphObject.make;

    const myDiagram = $(go.Diagram, "root", {
        initialContentAlignment: go.Spot.LeftCenter
    });

    myDiagram.nodeTemplate = $(
        go.Node,
        'Auto',
        $(go.Shape, 'RoundedRectangle', { strokeWidth: 0 }, new go.Binding('fill', 'color')),
        $(go.TextBlock, { margin: 8 }, new go.Binding('text', 'key'))
    );

    return myDiagram;
}

function initPalette() {
  const $ = go.GraphObject.make;
  const palette =
  $(go.Palette, "palette-content",
	{
		layout: $(go.GridLayout,
		{
			cellSize: new go.Size(200, 20),
			wrappingColumn: 1
		})      
	});
  palette.nodeTemplate = $(go.Node, "Horizontal", 
  {    
       movable: false
  },
    $(go.Shape,
      { width: 15, height: 15, fill: "white" },
      new go.Binding("fill", "color")),
    $(go.TextBlock,
      new go.Binding("text", "color"))
  );
  return palette;
}


function handleModelChange(changes) {
  console.log(changes);
}

function App() {
  return (
    <div>
      <ReactDiagram 
        diagramId="myDiagramDiv"
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={[
          { key: 0, text: 'Alpha', color: 'lightblue', loc: '0 0' },
          { key: 1, text: 'Beta', color: 'orange', loc: '150 0' },
          { key: 2, text: 'Gamma', color: 'lightgreen', loc: '0 150' },
          { key: 3, text: 'Delta', color: 'pink', loc: '150 150' }
        ]}
        linkDataArray={[
          { key: -1, from: 0, to: 1 },
          { key: -2, from: 0, to: 2 },
          { key: -3, from: 1, to: 1 },
          { key: -4, from: 2, to: 3 },
          { key: -5, from: 3, to: 0 }
        ]}
        onModelChange={(e) => handleModelChange(e)}
      />
    {/* <div id="palette-content" style={{'width': '500px', 'height': '500px', 'backgroundColor': '#DAE4E4'}}>
      <ReactPalette
        initPalette={initPalette}
        divClassName='palette-component'
        nodeDataArray={[
          { key: "LB", color: "lightblue" },
          { key: "P", color: "pink" },
          { key: "Y", color: "yellow" },
          { key: "LG", color: "lightgreen" },
          { key: "O", color: "orange" }
        ]}
      />
      </div> */}
    </div>
  );
}

export default App;
