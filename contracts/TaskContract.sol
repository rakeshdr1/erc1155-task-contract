// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TaskContract is ERC1155 {
    uint256 public constant TokenF = 0;
    uint256 public constant TokenN = 1;
    uint256 public constant TokenT = 2;

    uint256 public constant MintTokenFCost = 0.01 ether;
    // Cost in terms of Fungible token F
    uint256 public constant MintTokenNCost = 3;
    uint256 public constant MintTokenTCost = 10;

    constructor() ERC1155("") {}

    function mintTokenF(uint256 amount) external payable {
        restrictExternalCaller();
        require(msg.value >= MintTokenFCost * amount, "Not enough ether sent");
        _mint(msg.sender, TokenF, amount, "");
    }

    function mintTokenN(uint256 tokenCount) external {
        restrictExternalCaller();
        require(
            balanceOf(msg.sender, TokenF) >= tokenCount * MintTokenNCost,
            "Not enough Token F sent"
        );
        require(
            isApprovedForAll(msg.sender, address(this)),
            "Not approved for transfer"
        );
        safeTransferFrom(
            msg.sender,
            address(this),
            TokenF,
            tokenCount * MintTokenNCost,
            ""
        );
        _mint(msg.sender, TokenN, tokenCount, "");
    }

    function mintTokenT(uint256 tokenCount) external {
        restrictExternalCaller();
        require(
            balanceOf(msg.sender, TokenF) >= tokenCount * MintTokenTCost,
            "Not enough Token F sent"
        );
        require(
            balanceOf(msg.sender, TokenN) >= tokenCount,
            "Not enough Token N sent"
        );
        require(
            isApprovedForAll(msg.sender, address(this)),
            "Not approved for transfer"
        );
        _burn(msg.sender, TokenF, tokenCount * MintTokenTCost);
        _burn(msg.sender, TokenN, tokenCount);
        _mint(msg.sender, TokenT, tokenCount, "");
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public virtual returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function restrictExternalCaller() private view {
        require(msg.sender.code.length == 0, "Caller cannot be contract");
    }
}
