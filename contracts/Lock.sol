// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TaskContract is ERC1155 {
    uint256 public constant TokenF = 0;
    uint256 public constant TokenN = 1;
    uint256 public constant TokenT = 2;

    uint256 public constant MintTokenFCost = 0.01 ether;

    constructor() ERC1155("") {}

    function mintTokenF(uint256 amount) external payable {
        require(msg.value >= MintTokenFCost * amount, "Not enough ether sent");
        _mint(msg.sender, TokenF, amount, "");
    }

    function mintTokenN(uint256 amount) external payable {
        require(msg.value >= MintTokenFCost * amount, "Not enough ether sent");
        _mint(msg.sender, TokenF, amount, "");
    }
}
