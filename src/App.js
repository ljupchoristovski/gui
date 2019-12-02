import React from 'react';
import './App.css';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';

function initDiagram() {
  const $ = go.GraphObject.make;
  const diagram =
    $(go.Diagram,
      {
        'undoManager.isEnabled': true, 
        'clickCreatingTool.archetypeNodeData': { text: 'new node', color: 'lightblue' },
        model: $(go.GraphLinksModel,
          {
            linkKeyProperty: 'key'  
          })
      });

  diagram.nodeTemplate =
    $(go.Node, 'Auto',  
      new go.Binding('location', 'loc', go.Point.parse).makeTwoWay(go.Point.stringify),
      $(go.Shape, 'RoundedRectangle',
        { name: 'SHAPE', fill: 'white', strokeWidth: 0 },
        new go.Binding('fill', 'color')),
      $(go.TextBlock,
        { margin: 8, editable: true },  
        new go.Binding('text').makeTwoWay()
      )
    );

  return diagram;
}

function handleModelChange(changes) {
  console.log(changes);
}

function App() {
  return (
    <div>
      ...
      <ReactDiagram
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
      ...
    </div>
  );
}

export default App;
