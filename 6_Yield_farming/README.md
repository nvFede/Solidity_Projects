# yield farming 

This smart contract system is composed of three main contracts: DaiToken, CustomToken, and TokenFarm.

DaiToken contract is an ERC-20 compliant token contract that implements standard functions such as transfer, approve and transferFrom. It has public variables such as name, symbol, totalSupply, and decimals. It also has two events, Transfer and Approval, that are emitted when the transfer and approve functions are called respectively.

CustomToken contract is also an ERC-20 compliant token contract that is similar to DaiToken contract. It also implements standard functions such as transfer, approve and transferFrom. It has public variables such as name, symbol, totalSupply, and decimals. It also has two events, Transfer and Approval, that are emitted when the transfer and approve functions are called respectively.

TokenFarm contract is a staking contract that allows stakers to stake their custom tokens in order to earn dai tokens. It has a public variable name that is a string. It also has three public variables, customToken, daiToken, and owner, that keep track of the custom token and dai token addresses, as well as the owner of the contract. It also has several arrays and mappings that are used to keep track of stakers addresses and staking balances.

The constructor of the TokenFarm contract takes two arguments, _customToken and _daiToken, which are the addresses of the custom token and dai token contracts. It assigns the msg.sender address to the owner variable and assigns the addresses of the custom token and dai token contracts to the customToken and daiToken variables respectively.


### Token Farm testing

    ✔ Should tranfer all tokens
    ✔ Should have the correct name and symbol for the DAI token
    ✔ Should have the correct name and symbol for the Custom token
    ✔ Should have the correct Custom token address
    ✔ Should have the correct Dai token address
    ✔ Should have 1000000 custom token
    ✔ Should stake tokens correctly
    ✔ Should issue reward for the stacker
    ✔ Should not allow to issue tokens if is not contract owner
    ✔ Should allow to unstake dai token

    
### Audits

The contract was audit with Mythril but it's should not be used in production.
```
myth analyze contracts/Test.sol
The analysis was completed successfully. No issues were detected.
```
