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

const contractAddress = "0x608F37e84e3D74Ce0Cc14Dd304572F7D7d170465"

const contractInst = new ethers.Contract(
    contractAddress,
    [
        "function guess(uint8 n) external payable",
    ],
    account
);

contract ("Guess the new number", async () =>{
    let accounts;
    before(async () => {
        accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        console.log(contractInst)
    })
    it("should make transaction", async () => {
        const guessNumber = await ethers.getContractFactory("guessTheNewNumber");
        const guessTest = await guessNumber.deploy();
        
        // const guessAdd = "0x277fca74c6cc4410dcfb18f227e3ab7f15e65197"
        // const guessTest = new ethers.Contract(
        //     guessAdd,
        //     [
        //         "function getNumber(address target) external payable"
        //     ],
        //     account
        // );
        console.log(guessTest.address)

        // let block = await web3.eth.getBlock("9637331");
        // console.log(block)

        // let tx = await guessTest.getNumber(contractAddress)
        let tx = await guessTest.getNumber(contractAddress, { value:  1e18.toString() })
        await tx.wait()
        let i = await guessTest.answer();
        console.log({
            i
        })

        await guessTest.destroy();

        // let tx = await contractInst.guess(53, { value:  1e18.toString() });
        // console.log(tx)

    })
})