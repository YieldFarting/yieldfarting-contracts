// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract FartToken is ERC20, Ownable {
	address public masterChef;

	constructor() ERC20('YIELDFARTING.FINANCE', 'FART') {}

	function setMasterChef(address _masterChef) external onlyOwner {
		masterChef = _masterChef;
	}

	function mint(address _to, uint256 _amount) external {
		require(msg.sender == masterChef, 'Caller is not the masterchef');
		_mint(_to, _amount);
	}
}
