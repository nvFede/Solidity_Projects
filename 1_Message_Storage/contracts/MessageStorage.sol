// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract MessageStorage {
    address public owner;
    string message;

    constructor() {
        owner = msg.sender;
    }
    function setMessage(string memory _message) public {
        require(msg.sender == owner, "Only the contract owner can change the message.");
        require(bytes(_message).length > 0, "Please write a message.");
        message = _message;
    }

    function viewMessage() public view returns (string memory) {
        return message;
    }

    function transferOwnership(address newOwner) public {
        require(msg.sender == owner, "Only the contract owner can transfer ownership.");
        require(newOwner != address(0), "Cannot transfer ownership to the null address.");
        owner = newOwner;
    }
}