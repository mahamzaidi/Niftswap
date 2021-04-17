pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract token1 is ERC20 {
    constructor() ERC20("Another Token", "AT") {
        _mint(msg.sender, 100000);
    }
}
