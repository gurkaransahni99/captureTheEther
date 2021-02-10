pragma solidity ^0.4.21;

contract guessTheRandomNumber{
    uint val;
    
    function getNumber(uint blockNumber, uint timestamp) public view returns (uint) {
        val = uint8(keccak256(block.blockhash(blockNumber - 1), timestamp));
        return val;
        
    }
}