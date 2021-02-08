/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
// require("solidity-coverage");

// require('hardhat-spdx-license-identifier');
// require("hardhat-gas-reporter");


module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.7.0"
            }
        ],
    },
    spdxLicenseIdentifier: {
        overwrite: true,
        runOnCompile: true,
    },
    // gasReporter: {
    //     currency: 'USD',
    //     gasPrice: 1
    // },
    defaultNetwork: "hardhat",
    settings: {
        optimizer: {
            enabled: true,
            runs: 1
        }
    },
    mocha: {
        timeout: 1000000000000
    },

    networks: {
        hardhat: {
            forking: {
                // url: "https://mainnet.infura.io/v3/7b54fb6c4fb64d71a21c1ae19867674a",
                url: "https://e93ba240ecf94244a82f2f141091d14c.eth.rpc.rivet.cloud",
                // url: "https://eth-mainnet.alchemyapi.io/v2/fCB7S8vvlUFxHmnrJlzYGGp0aYf1NGkE",
                timeout: 1000000000000
            },
            blockGasLimit: 10000000000000,
            allowUnlimitedContractSize: true,
            timeout: 1000000000000,
            accounts: {
                accountsBalance: "9999000000000000000000000000000000",
                count: 20
            },
        }
    }
};
