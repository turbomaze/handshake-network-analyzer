const HandshakeNetworkAnalyzer = (() => {
  const msOfForce = 10 * 1000;

  function initHandshakeNetworkAnalyzer() {
    // 1. preprocess the graph data
    forceUndirectedness(rawData);
    const components = getConnectedComponents(rawData);

    // 2. initialize the full graph
    const s = new sigma({ graph: data, container: 'container' });
    s.startForceAtlas2({ worker: true, barnesHutOptimize: true });

    // 3. listeners
    document.getElementById('submit').addEventListener('click', () => {
      const address = document.getElementById('address').value;
      const filteredGraph = filterGraphByAddress(components, address);
      renderFilteredGraph(s, filteredGraph);
    });
  }

  // precondition: graph is a raw address graph in adjacency list format
  // postcondition: mutates graph
  function forceUndirectedness(graph) {
    Object.keys(graph).forEach(source => {
      graph[source].forEach(destination => {
        if (!(destination in graph)) {
          graph[destination] = [];
        }

        if (!graph[destination].includes(source)) {
          graph[destination].push(source);
        }
      });
    });
  }

  // precondition: address is in one of the components
  function filterGraphByAddress(components, address) {
    // locate the address
    const component = components.filter(c => c.has(address))[0];

    // filter nodes and edges by the address
    return {
      nodes: data.nodes.filter(({ id }) => component.has(id)),
      edges: data.edges.filter(({ source, target }) => {
        return component.has(source) && component.has(target);
      }),
    };
  }

  // precondition: graph is an undirected graph
  function getConnectedComponents(graph) {
    const connectedComponents = [];
    const nodes = Object.keys(graph);
    let visited = new Set();

    while (visited.size < nodes.length) {
      const root = nodes.filter(n => !visited.has(n))[0];
      const group = new Set();
      getGroup(graph, root, group);
      connectedComponents.push(group);
      visited = new Set([...visited, ...group]);
    }

    return connectedComponents;
  }

  function getGroup(graph, node, v) {
    v.add(node);
    graph[node].filter(n => !v.has(n)).forEach(n => getGroup(graph, n, v));
  }

  function renderFilteredGraph(s, filteredGraph) {
    // 1. stop the old graph
    s.killForceAtlas2();
    s.graph.clear();

    // 2. start the selected subset
    s.graph.read(filteredGraph);
    s.startForceAtlas2({ worker: true, barnesHutOptimize: true, autoStop: true });
    s.refresh();
  }

  return {
    init: initHandshakeNetworkAnalyzer,
  };
})();

window.addEventListener('load', HandshakeNetworkAnalyzer.init);
