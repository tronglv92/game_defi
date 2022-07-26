// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract TrongCoin is ERC20PresetMinterPauser, Ownable {
    uint256 public initializedCap = 20000000 * 1e18;

    constructor() ERC20PresetMinterPauser("Trong Coin", "VTC") {
        _mint(_msgSender(), initializedCap);
    }
}
