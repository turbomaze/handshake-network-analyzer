function extractInputAddresses(list) {
  return list
    .map(_ => _.coin)
    .filter(Boolean)
    .map(_ => _.address);
}

function extractOutputAddresses(list) {
  return list.map(_ => _.address).filter(Boolean);
}

module.exports = { extractInputAddresses, extractOutputAddresses };
