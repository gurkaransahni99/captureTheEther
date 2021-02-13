pragma solidity ^0.4.21;

contract RetirementFund {

    address target;

    function setTargetContract(address _target) public{
        target = _target;
    }

    function destroy() public{
        selfdestruct(target);
    }

    function() external payable {}
}