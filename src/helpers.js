function extractInputAddresses(list) {
  return list
    .map(_ => _.coin)
    .filter(Boolean)
    .map(_ => _.address);
}

function extractOutputAddresses(list) {
  return list.map(_ => _.address).filter(Boolean);
}

function replaceSetsWithArrays(adjacencyList) {
  Object.keys(adjacencyList).forEach(address => {
    adjacencyList[address] = Array.from(adjacencyList[address]);
  });
  return adjacencyList;
}

module.exports = { extractInputAddresses, extractOutputAddresses, replaceSetsWithArrays };
