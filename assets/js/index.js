const HandshakeNetworkAnalyzer = (() => {
  function initHandshakeNetworkAnalyzer() {
    // 1. preprocess the graph data

    // 2. initialize the full graph
    const s = new sigma({ graph: data, container: 'container' });
    s.startForceAtlas2({ worker: true, barnesHutOptimize: true });
  }

  function filter(address) {
    // 1. find the subgraph to draw

    // 2. stop the old graph
    s.stopForceAtlas2();
    s.graph.clear();
    s.refresh();
    s.graph.clear();

    // 3. start the selected subset
    s.graph.read({});
    s.startForceAtlas2({ worker: true, barnesHutOptimize: true });
  }

  return {
    init: initHandshakeNetworkAnalyzer,
    filter,
  };
})();

window.addEventListener('load', HandshakeNetworkAnalyzer.init);
