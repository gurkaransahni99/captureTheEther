const Web3 = require("web3");
const truffleContract = require('@truffle/contract');
// const ethers = require("ethers")
const { BigNumber, utils } = require("ethers")

const BN = require('bn.js');
const CONFIG = require("../../credentials.js");

const provider = new ethers.providers.WebSocketProvider(`wss://ropsten.infura.io/ws/v3/${CONFIG.infura.mainEndpoint}`)

const signer = new ethers.Wallet(CONFIG.wallet.PKEY);
const account = signer.connect(provider);

function isString(s) {
    return (typeof s === 'string' || s instanceof String)
}

const parseBaseUnit = (value, decimals) => {
    let orig = value;
    if (BN.isBN(value)) {
        value = value.toString()
    }
    if (!isString(value)) {
        throw new Error(`Not a String: ${value} ${decimals} ${orig}`)
    }
    value = BigNumber.from(value)
    return utils.formatUnits(value, decimals)
}

const toBaseUnit = (value, decimals) => {
    if (!isString(value)) {
        throw new Error('Pass strings to prevent floating point precision issues.')
    }
    const ten = new BN(10);
    const base = ten.pow(new BN(decimals));

    // Is it negative?
    let negative = (value.substring(0, 1) === '-');
    if (negative) {
        value = value.substring(1);
    }

    if (value === '.') {
        throw new Error(
            `Invalid value ${value} cannot be converted to`
            + ` base unit with ${decimals} decimals.`
        );
    }

    // Split it into a whole and fractional part
    let comps = value.split('.');
    if (comps.length > 2) { throw new Error('Too many decimal points'); }

    let whole = comps[0]; let
        fraction = comps[1];

    if (!whole) { whole = '0'; }
    if (!fraction) { fraction = '0'; }
    if (fraction.length > decimals) {
        throw new Error('Too many decimal places');
    }

    while (fraction.length < decimals) {
        fraction += '0';
    }

    whole = new BN(whole);
    fraction = new BN(fraction);
    let wei = (whole.mul(base)).add(fraction);

    if (negative) {
        wei = wei.neg();
    }

    return new BN(wei.toString(10), 10);
}

const contractAddress = "0x3779E6b18377a3Fa4AE0318e00B1305684A3d058"

const contractInst = new ethers.Contract(
    contractAddress,
    [
        "function guess(uint8 n) external payable"
    ],
    account
);

const secretNumberHash = "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365"

contract ("Guess the secret number", async () =>{
    let accounts;
    before(async () => {
        accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        console.log(contractInst)
    })
    it("should make transaction", async () => {
        const guessNumber = await ethers.getContractFactory("guessTheSecretNumber");
        const guessTest = await guessNumber.deploy();
        // console.log(guessTest)
        let i = await guessTest.getNumber({ from: account[0] })
        console.log({
            i:i.toString()
        })
        if(i.toString() != "1000"){
            let tx = await contractInst.guess(i, { value:  1e18.toString() });
            console.log(tx)
        }
    })
})