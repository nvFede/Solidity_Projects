// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CustomToken.sol";
import "./DaiToken.sol";

contract TokenFarm {		
	string public name = "Custom Token Farm";
	address public owner;
	CustomToken public customToken;
	DaiToken public daiToken;	

	address[] public stakers;
	mapping(address => uint) public stakingBalance;
	mapping(address => bool) public hasStaked;
	mapping(address => bool) public isStaking;

	constructor(CustomToken _customToken, DaiToken _daiToken)  {
		customToken = _customToken;
		daiToken = _daiToken;
		owner = msg.sender;
	}

	function stakeTokens(uint _amount) public {				
		daiToken.transferFrom(msg.sender, address(this), _amount);

		stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;		

		if(!hasStaked[msg.sender]) {
			stakers.push(msg.sender);
		}

		isStaking[msg.sender] = true;
		hasStaked[msg.sender] = true;
	}

	function unstakeTokens() public {
		uint balance = stakingBalance[msg.sender];

		require(balance > 0, "the ammount of the staking balance cannot be 0");

		daiToken.transfer(msg.sender, balance);

		stakingBalance[msg.sender] = 0;

		isStaking[msg.sender] = false;
	}

	
	function issueTokens() public {
		require(msg.sender == owner, "only the owner can call this function");

		for (uint i=0; i<stakers.length; i++) {
			address recipient = stakers[i];
			uint balance = stakingBalance[recipient];
			if(balance > 0) {
				customToken.transfer(recipient, balance);
			}			
		}
	}

}