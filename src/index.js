require('dotenv').config();
const { NodeClient } = require('hs-client');

const clientOptions = {
  network: process.env.NETWORK,
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  apiKey: process.env.API_KEY,
};
const nodeClient = new NodeClient(clientOptions);

nodeClient.getBlock(0).then(block => {
  console.log(block);
});
