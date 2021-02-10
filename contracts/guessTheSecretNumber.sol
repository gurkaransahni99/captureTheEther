pragma solidity ^0.4.21;

contract guessTheSecretNumber{
    bytes32 hashVal = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;
    
    function getNumber() public view returns (uint) {
        for(uint8 i=0; i<256; i++){
            if(keccak256(i) == hashVal){
                return i;
            }
        }
        return 1000;
    }
}