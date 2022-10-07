// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "./TaskContract.sol";

contract TestTaskContract {
    TaskContract private _task;

    constructor(address token) {
        _task = TaskContract(token);
    }

    function testMintF() public {
        _task.mintTokenF(100);
    }

    function testMintN() public {
        _task.mintTokenN(10);
    }

    function testMintT() public {
        _task.mintTokenT(1);
    }
}
