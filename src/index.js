require('dotenv').config();
const { NodeClient } = require('hs-client');
const Syncer = require('./syncer');

const clientOptions = {
  network: process.env.NETWORK,
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  apiKey: process.env.API_KEY,
};
const nodeClient = new NodeClient(clientOptions);
const syncer = new Syncer(nodeClient, { file: process.env.OUTPUT_FILE });

(async () => {
  try {
    await syncer.start();
    syncer.dump();
  } catch (e) {
    console.log(e);
  }
})();
