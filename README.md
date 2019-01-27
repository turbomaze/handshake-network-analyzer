Handshake Network Analyzer
==

Use this tool to analyze the movement of funds on the Handshake network.

## Development

You need to provide the connection details for a Handshake RPC server in the `.env` file.

```bash
# set up config
cp .env.config .env

# sync all transactions to build the graph
npm run sync

# convert the raw graph into sigma.js format for rendering
npm run build

# serve the index.html file to view the graph
npm run start
```

## License
MIT License: https://igliu.mit-license.org
