//SPDX-License-Identifier: MIT 

require('dotenv').config();
var HDWalletProvider = require("truffle-hdwallet-provider");

const infuraKey = process.env.infuraKey;
const mnemonic = process.env.mnemonic;

module.exports = {

  networks: {

    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/v3/" + infuraKey);
      },

      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
    },

    bscTestnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        'https://data-seed-prebsc-1-s1.binance.org:8545'
      ),
      //from: '0x66EdEb3C3b5691b7c7e13C3CEC48900b3136d378',
      network_id: 97,
      gas: 4500000,
      gasPrice: 10000000000,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(
        mnemonic,
        'https://bsc-dataseed.binance.org/'
      ),
      network_id: 56,
      gas: 4500000,
      gasPrice: 10000000000,
      skipDryRun: true
    }

  },

  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    },
  },
};
