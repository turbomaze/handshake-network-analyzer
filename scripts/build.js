require('dotenv').config();
const fs = require('fs');

const outputFile = process.env.OUTPUT_FILE;
const buildFile = process.env.BUILD_FILE;
const data = fs.readFileSync(outputFile, 'utf-8');
const rawGraph = JSON.parse(data);

// collect the raw nodes and edges from the data file
const rawNodes = new Set();
const rawEdges = [];
Object.keys(rawGraph).forEach(sourceAddress => {
  rawNodes.add(sourceAddress);
  rawGraph[sourceAddress].forEach(destinationAddress => {
    rawNodes.add(destinationAddress);
    rawEdges.push([sourceAddress, destinationAddress]);
  });
});

// clean up the nodes for sigma.js
const nodes = Array.from(rawNodes).map(address => {
  return {
    id: address,
    label: address,
    x: 1 * Math.random(),
    y: 1 * Math.random(),
    size: 3,
    color: '#ff0000',
  };
});

// clean up the edges for sigma.js
const edges = rawEdges.map(([source, destination]) => {
  return {
    id: `${source}-${destination}`,
    source,
    target: destination,
  };
});

// emit the clean graph
const graph = { nodes, edges };
fs.writeFileSync(buildFile, 'const data=' + JSON.stringify(graph) + ';');
