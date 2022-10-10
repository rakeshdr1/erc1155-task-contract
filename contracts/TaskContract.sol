// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TaskContract is ERC1155 {
    uint256 public constant TOKEN_F = 0;
    uint256 public constant TOKEN_N = 1;
    uint256 public constant TOKEN_T = 2;

    uint256 public constant MINT_TOKEN_F_COST = 0.01 ether;
    // Cost in terms of Fungible token F
    uint256 public constant MINT_TOKEN_N_COST = 3;
    uint256 public constant MINT_TOKEN_T_COST = 10;

    constructor() ERC1155("") {}

    function mintTokenF(uint256 amount) external payable {
        _restrictExternalCaller();
        require(
            msg.value >= MINT_TOKEN_F_COST * amount,
            "Not enough ether sent"
        );
        _mint(msg.sender, TOKEN_F, amount, "");
    }

    function mintTokenN(uint256 tokenCount) external {
        _restrictExternalCaller();
        require(
            balanceOf(msg.sender, TOKEN_F) >= tokenCount * MINT_TOKEN_N_COST,
            "Not enough Token F sent"
        );
        require(
            isApprovedForAll(msg.sender, address(this)),
            "Not approved for transfer"
        );
        safeTransferFrom(
            msg.sender,
            address(this),
            TOKEN_F,
            tokenCount * MINT_TOKEN_N_COST,
            ""
        );
        _mint(msg.sender, TOKEN_N, tokenCount, "");
    }

    function mintTokenT(uint256 tokenCount) external {
        _restrictExternalCaller();
        require(
            balanceOf(msg.sender, TOKEN_F) >= tokenCount * MINT_TOKEN_T_COST,
            "Not enough Token F sent"
        );
        require(
            balanceOf(msg.sender, TOKEN_N) >= tokenCount,
            "Not enough Token N sent"
        );
        require(
            isApprovedForAll(msg.sender, address(this)),
            "Not approved for transfer"
        );
        _burn(msg.sender, TOKEN_F, tokenCount * MINT_TOKEN_T_COST);
        _burn(msg.sender, TOKEN_N, tokenCount);
        _mint(msg.sender, TOKEN_T, tokenCount, "");
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

    function _restrictExternalCaller() private view {
        require(msg.sender.code.length == 0, "Caller cannot be contract");
    }
}
