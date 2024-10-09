module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", // Match any network id
      // gas: 800000000,
      // gasPrice: 2000000000,
    },
  },
  compilers: {
    solc: {
      version: "0.8.19", // Specify the Solidity compiler version here
      settings: {
        optimizer: {
          enabled: false,
          // runs: 200,
        },
      },
    },
  },
};
