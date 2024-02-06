// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SwappingAggregator {
    struct Call {
        address target; 
        bytes data;     
    }

     function execute(Call[] memory callData) public {
        for (uint i = 0; i < callData.length; i++) {
            bool success;
            bytes memory returnData;
            (success, returnData) = callData[i].target.call(callData[i].data);
            require(success, "Call execution failed");
        }
    }
}