pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract token2 is ERC20 {
  constructor() ERC20('Some Token', 'ST') {
    _mint(msg.sender, 100000);
  }
}