
# Message Storage Contract with Tests

The contract has a few functions:

- **setMessage:** Allows the contract owner to set a message by passing a string as the argument. It uses an access control mechanism, only the contract owner can set a message.

- **viewMessage:** Allows anyone to view the message that has been stored in the contract.

- **transferOwnership:** Allows the contract owner to transfer the ownership of the contract to a different address. It uses an access control mechanism and check that the new owner address is not the null address (0x0)

### Tests

**The first test** checks if the contract has been deployed successfully by ensuring the contract address is defined, not null, not NaN, not empty string and not the null address (0x0)

**The second test** verifies the message storage functionality by first deploying the contract and then set a message and retrieve it again, verifying that the message is equal to the message set before.

**The third test** checks that only the contract owner is allowed to change the message by trying to change the message with a different address and expecting the transaction to be reverted.

**The forth test** verifies that the contract owner can transfer the ownership of the contract to a different address.

**the fifth test** checks that the contract owner can't transfer ownership to the null address by trying to transfer ownership to the null address and expecting the transaction to be reverted.

```
Message contract test cases

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




### 🚀 About Me

Made with love by Fede.rico

