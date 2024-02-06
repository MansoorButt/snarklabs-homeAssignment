// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
import './IERC20.sol'; 
import './IUniswapV2Router02.sol'; 
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SwappingAggregator {
   
    IUniswapV2Router private uniswapRouter;
    address private router ;

    function routerAddress(address _routerAdd) public {
        router = _routerAdd;
        uniswapRouter = IUniswapV2Router(router);
    }

    function swapTokens(
    address _tokenIn,
    address _tokenOut,
    uint256 _amountIn,
    uint256 _amountOutMin
    ) external returns (uint){
        require(IERC20(_tokenIn).transferFrom(msg.sender, address(this), _amountIn),"Transfer of tokenIn failed");
        IERC20(_tokenIn).approve(address(uniswapRouter), _amountIn);
        address[] memory path = new address[](2);
        path[0] = _tokenIn;
        path[1] = _tokenOut;
        // Call the Uniswap V2 swap function.
        uint[] memory amounts = uniswapRouter.swapExactTokensForTokens(
        _amountIn,
        _amountOutMin,
        path,
        address(this),
        block.timestamp
        );
        return amounts[1];
}

}
