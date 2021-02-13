/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-ethers");
// require("solidity-coverage");

// require('hardhat-spdx-license-identifier');
// require("hardhat-gas-reporter");

const CONFIG = require("./credentials.js");


module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.7.5"
            }
        ],
        overrides: {
            "contracts/guessTheSecretNumber.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/guessTheRandomNumber.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/guessTheNewNumber.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/predictTheFuture.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/predictTheBlockHash.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/tokenSale.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/tokenWhale.sol": {
                version: "0.4.21",
                settings: { }
            },
            "contracts/retirementFund.sol": {
                version: "0.4.21",
                settings: { }
            }
        }
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
        },
        ropsten: {
            url: `https://ropsten.infura.io/v3/${CONFIG.infura.mainEndpoint}`,
            accounts: [`${CONFIG.wallet.PKEY}`]
        }
    }
};
