
require('dotenv').config();

const infuraKey = '6c3246d965da4533b6aec7b634bacbc4';
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "donate code decorate sorry code actress voyage apart soul garbage year exile";


module.exports = {

  networks: {

    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    bscTestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        'https://data-seed-prebsc-1-s1.binance.org:8545'
      ),
      network_id: 97,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        'https://bsc-dataseed.binance.org/'
      ),
      network_id: 56,
      skipDryRun: true
    }
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.16",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
};