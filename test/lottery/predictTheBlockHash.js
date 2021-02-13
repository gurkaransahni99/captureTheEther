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

const contractAddress = "0x5c48fb5D2847dF9184602709805680Bde20a2F40"

// const contractInst = new ethers.Contract(
//     contractAddress,
//     [
//         "function guess(uint8 n) external payable",
//         "function isComplete() external view returns (bool)"
//     ],
//     account
// );

contract ("Predict The Block Hash", async () =>{
    let accounts;
    before(async () => {
        // accounts = await web3.eth.getAccounts()
    })
    it("should print contract", async () => {
        // console.log(contractInst)
    })
    it("should make transaction", async () => {
        // const guessHash = await ethers.getContractFactory("predictTheBlockHash");
        // const guessTest = await guessHash.deploy();
        
        const guessAdd = "0xcBe2cb7c2A694Ee24eb5A08cfE3778Da67bd54e9"

        const guessTest = new ethers.Contract(
            guessAdd,
            [
                "function guess() external",
                "function success() external",
                "function destroy() external",
                "function setTargetContract(address _target) external",
                "function readAnswer() external view returns(uint8, uint8)",
                "function blockHash() external view returns(bytes32)",
                "function answer() external view returns(bytes32)"
            ],
            account
        );
        console.log(guessTest.address)

        // let tx = await web3.eth.sendTransaction({from: account.address, to:guessTest.address, value:1e18.toString() })

        // tx = await guessTest.setTargetContract(contractAddress)
        // await tx.wait()
        
        // tx = await guessTest.guess()
        // await tx.wait()

        let answer = await guessTest.answer();
        console.log({
            answer
        })

        // while(true){
        //     let hash = await guessTest.blockHash();
        //     if(hash == "0"){
        //         break;
        //     }
        //     console.log(hash);
        // }
        
        let blockHash = await guessTest.blockHash()
        console.log({
            blockHash
        })

        // tx = await guessTest.success();
        // await tx.wait()

        await guessTest.destroy();
    })
})