const { expect } = require("chai");
const { ethers } = require("hardhat");
//const CoffeeABI = require("../artifacts/contracts/Coffee.sol/Coffee.json");

describe("Buy me a Coffee", function () {
  let coffee, owner, otherAccount;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    otherAccount = signers[1];
    const CoffeeContract = await ethers.getContractFactory("Coffee");
    coffee = await CoffeeContract.deploy();
  });

  it("Check if the contract deploys successfully", async function () {
    expect(coffee.address).to.be.not.undefined;
    expect(coffee.address).to.be.not.null;
    expect(coffee.address).to.be.not.NaN;
    expect(coffee.address).to.be.not.equal("");
    expect(coffee.address).to.be.not.equal(0x0);
  });

  it("should buy a coffee and leave a memo", async () => {
    const name = "John Doe";
    const message = "Thanks! you are great.";
    const value = ethers.utils.parseEther("1");

    const tx = await coffee
      .connect(otherAccount)
      .buyCoffee(name, message, { value });
    let receipt = await tx.wait();
    //console.log("NEW MEMO", receipt.events?.filter((x) => {return x.event == "NewMemo"}));

    expect(receipt.events[0].args.from).to.equal(otherAccount.address);
    expect(receipt.events[0].args.name).to.equal(name);
    expect(receipt.events[0].args.message).to.equal(message);

    // Check that the memo was stored in the contract
    const memos = await coffee.getMemos();
    expect(memos[0].from).to.equal(otherAccount.address);
    expect(memos[0].name).to.equal(name);
    expect(memos[0].message).to.equal(message);
  });

  it("should not allow buy a coffee for free", async () => {
    const name = "John Doe";
    const message = "Thanks! you are great.";
    const value = ethers.utils.parseEther("0");

    await expect(
      coffee.connect(otherAccount).buyCoffee(name, message, { value })
    ).to.be.revertedWith("can't buy coffee for free!");
  });

  it("Should not allow to write a long memo or long name ", async () => {
    const name = "a".repeat(26);
    const message = "a".repeat(257);
    const value = ethers.utils.parseEther("1");

    await expect(
      coffee.connect(otherAccount).buyCoffee(name, message, { value })
    ).to.be.reverted;
  });

  it("should allow owner to view the balance of the contract", async () => {
    const value = ethers.utils.parseEther("1");
    await coffee
      .connect(otherAccount)
      .buyCoffee("John Doe", "Thanks", { value });
    const balance = await coffee.viewBalance();
    expect(balance).to.equal(value);
  });

  it("Should allow owner to withdraw the funds of the contract", async () => {
    const balance = await coffee.viewBalance();

    const tx = coffee.connect(owner).withdraw()

    // await expect().to.emit(
    //   "NewWithdrawl"
    // );
  });

  it("should not allow withdrawing balance for non-owner", async () => {
    await expect(coffee.connect(otherAccount).withdraw()).to.be.revertedWith(
      "Only the owner can perform this action."
    );
  });

  // it("should not allow transaction buying coffee if another one is currently in progress", async () => {
  //   const name = "John Doe";
  //   const message = "Thanks! you are great.";
  //   const value = ethers.utils.parseEther("1");

  //   const buyCoffeePromise = coffee
  //     .connect(otherAccount)
  //     .buyCoffee(name, message, { value });

  //   try {
  //     await coffee.connect(otherAccount).buyCoffee(name, message, { value });
  //     expect.fail();
  //   } catch (error) {
  //     expect(error.message).to.equal(
  //       "Another transaction is currently buying coffee, please wait for it to complete."
  //     );
  //   }
  //   await buyCoffeePromise;
  // });

  it("Should not allow random user to withdraw the funds of the contract", async () => {});
});
