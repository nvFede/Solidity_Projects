
# Buy me a Coffee Contract with Tests

This contract, called "Coffee", is designed to allow users to buy a virtual coffee using Ether (ETH), the native cryptocurrency of the Ethereum blockchain. Along with sending this payment, the user also sends two strings: **_name** and _**message** which are used to create a "memo" that is associated with this coffee purchase.

The contract has a three functions:

- **BuyCoffee:** Allows a user to tip the owner of the contract with a coffee

- **withdraw:** Allows the contract owner to withdraw the funds stored in the contract

- **viewBalance** Allows the owner of the contract, to view the contract balance

### Tests
The test cases written in JavaScript are designed to test the functionality of the Coffee contract. They are written using the Chai and Hardhat libraries, and test various aspects of the contract's behavior.


```
Buy me a Coffee contract test cases

✔ Check if the contract deploys successfully (564ms)
✔ should set and retrieve a message
✔ should only allow the contract owner to change the message
✔ should allow the contract owner to transfer ownership
✔ should not allow transfer ownership to null address

```


### Tech
- Solidity
- Hardhat
- EtherJS

