const { expect } = require("chai");
const { Signer } = require("ethers");
const { ethers } = require("hardhat");

describe("Message contract test cases", () => {
  let message;
  let contract;
  let owner;
  let other;

  const setup = async () => {
    [owner, other] = await ethers.getSigners();
    message = await ethers.getContractFactory("MessageStorage");
    contract = await message.deploy();

    return {
      owner,
      other,
      message,
      contract,
    };
  };

  it("Check if the contract deploys successfully", async function () {
    const { contract } = await setup();

    expect(contract.address).to.be.not.undefined;
    expect(contract.address).to.be.not.null;
    expect(contract.address).to.be.not.NaN;
    expect(contract.address).to.be.not.equal("");
    expect(contract.address).to.be.not.equal(0x0);
  });

  it("should set and retrieve a message", async () => {
    const { contract } = await setup();
    const testMessage = "Hello, world!";

    await contract.setMessage(testMessage);
    const retrievedMessage = await contract.viewMessage();

    expect(retrievedMessage).to.equal(testMessage);
  });

  it("should only allow the contract owner to change the message", async () => {
    const testMessage = "Unauthorized access";
    const { contract, other } = await setup();
    await expect(
      contract.connect(other).setMessage(testMessage)
    ).to.be.revertedWith("Only the contract owner can change the message.");
  });

  it("should allow the contract owner to transfer ownership", async () => {
    const { contract } = await setup();
    await contract.transferOwnership(other.address);
    expect(await contract.owner()).to.equal(other.address);
  });

  it("should not allow transfer ownership to null address", async () => {
    const { contract } = await setup();
    await expect(contract.transferOwnership(
        ethers.constants.AddressZero
      )).to.be.revertedWith("Cannot transfer ownership to the null address.");
  });

});
