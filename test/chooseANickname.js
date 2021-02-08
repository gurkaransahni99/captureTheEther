const Web3 = require("web3");
const truffleContract = require('@truffle/contract');
const ethers = require("ethers")
const BN = require('bn.js');
const CONFIG = require("../credentials.js");

const provider = new ethers.providers.WebSocketProvider(`wss://ropsten.infura.io/ws/v3/${CONFIG.infura.mainEndpoint}`)

const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
const account = signer.connect(provider);
const contractAddress = "0x71284E09B83e9B86ec39b5E328F99206B7DC7FaD"
let name = "silent voice"

const contractInst = new ethers.Contract(
    contractAddress,
    [
        "function setNickname(bytes32 nickname) external"
    ],
    account
);

contract ("choose a nickname", async () =>{
    let accounts;
    before(async () => {
        accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        console.log(contractInst)
    })
    it("should make transaction", async () => {
        name = await ethers.utils.formatBytes32String(name)
        console.log({
            name
        })
        let tx = await contractInst.setNickname(name);
        console.log(tx)
    })
})