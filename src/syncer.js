const fs = require('fs');
const helpers = require('./helpers');

class Syncer {
  constructor(client, options) {
    if (!options || !options.file) {
      throw new Error('Must provide an output file in options.');
    }

    this.client = client;
    this.options = options;
    this.adjacencyList = {};
  }

  async start() {
    const info = await this.client.getInfo();
    const currentHeight = info.chain.height;
    const rawAdjacencyList = await this.sync(currentHeight);
    this.adjacencyList = helpers.replaceSetsWithArrays(rawAdjacencyList);
  }

  dump() {
    fs.writeFileSync(this.options.file, JSON.stringify(this.adjacencyList));
  }

  async sync(height) {
    const adjacencyList = {};
    const lastBlockSynced = -1;
    for (let i = lastBlockSynced + 1; i <= height; i++) {
      await this.syncBlock(adjacencyList, i);
    }
    return adjacencyList;
  }

  async syncBlock(adjacencyList, height) {
    const block = await this.client.getBlock(height);
    block.txs.forEach(tx => this.syncTx(adjacencyList, tx));
  }

  async syncTx(adjacencyList, tx) {
    const rawInputs = helpers.extractInputAddresses(tx.inputs);
    const inputs = rawInputs.length === 0 ? [Syncer.COINBASE] : rawInputs;
    const outputs = helpers.extractOutputAddresses(tx.outputs);
    inputs.forEach(input => {
      if (!(input in adjacencyList)) {
        adjacencyList[input] = new Set();
      }

      outputs.forEach(output => {
        adjacencyList[input].add(output);
      });
    });
  }
}

Syncer.COINBASE = 'COINBASE';

module.exports = Syncer;
