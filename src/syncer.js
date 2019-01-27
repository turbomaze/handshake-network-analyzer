const helpers = require('./helpers');

class Syncer {
  constructor(client) {
    this.client = client;
    this.addressAdjacencyList = {};
    this.numberOfEdges = 0;
  }

  async start() {
    const info = await this.client.getInfo();
    const currentHeight = info.chain.height;
    this.sync(currentHeight);
  }

  async sync(height) {
    const lastBlockSynced = -1;
    for (let i = lastBlockSynced + 1; i <= height; i++) {
      await this.syncBlock(i);
    }
  }

  async syncBlock(height) {
    const block = await this.client.getBlock(height);
    block.txs.forEach(this.syncTx.bind(this));
  }

  async syncTx(tx) {
    const rawInputs = helpers.extractInputAddresses(tx.inputs);
    const inputs = rawInputs.length === 0 ? [Syncer.COINBASE] : rawInputs;
    const outputs = helpers.extractOutputAddresses(tx.outputs);
    inputs.forEach(input => {
      if (!(input in this.addressAdjacencyList)) {
        this.addressAdjacencyList[input] = new Set();
      }

      outputs.forEach(output => {
        this.addressAdjacencyList[input].add(output);
        this.numberOfEdges++;
      });
    });
  }
}

Syncer.COINBASE = 'COINBASE';

module.exports = Syncer;
