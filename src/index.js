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
const syncer = new Syncer(nodeClient);

(async () => {
  try {
    syncer.start();
  } catch (e) {
    console.log(e);
  }
})();
