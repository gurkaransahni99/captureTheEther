const Web3 = require("web3");
const truffleContract = require('@truffle/contract');
const ethers = require("ethers")
const BN = require('bn.js');
const CONFIG = require("../credentials.js");

const provider = new ethers.providers.WebSocketProvider(`wss://ropsten.infura.io/ws/v3/${CONFIG.infura.mainEndpoint}`)

const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
const account = signer.connect(provider);
const contractAddress = "0x42EA4f9518c3e63838Eb80Eaae5F75b7e3906E7B"

const contractInst = new ethers.Contract(
    contractAddress,
    [
        "function callme() external"
    ],
    account
);

contract ("call me", async () =>{
    let accounts;
    before(async () => {
        accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        console.log(contractInst)
    })
    it("should make transaction", async () => {
        let tx = await contractInst.callme();
        console.log(tx)
    })
})