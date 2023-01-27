const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n, "ether");
};

describe("Token Farm testing", () => {
  let customToken,
    daiToken,
    tokenFarm,
    accounts,
    owner,
    bobAccount,
    aliceAccount,
    johnAccount;

  beforeEach(async () => {
    [owner, aliceAccount, bobAccount, johnAccount] = await ethers.getSigners();

    customToken = await ethers.getContractFactory("CustomToken");
    customToken = await customToken.deploy();

    daiToken = await ethers.getContractFactory("DaiToken");
    daiToken = await daiToken.deploy();

    tokenFarm = await ethers.getContractFactory("TokenFarm");
    tokenFarm = await tokenFarm.deploy(customToken.address, daiToken.address);

    await customToken.transfer(tokenFarm.address, "1000000000000000000000000");

    await daiToken.transfer(bobAccount.address, tokens("10"), {
      from: owner.address,
    });

    await customToken.deployed();
    await daiToken.deployed();
    await tokenFarm.deployed();
  });

  it("Should tranfer all tokens", async () => {});

  it("Should have the correct name and symbol for the DAI token", async () => {
    const name = await daiToken.name();
    const symbol = await daiToken.symbol();
    expect(name).to.equal("Mock DAI Token");
    expect(symbol).to.equal(symbol, "mDAI");
  });

  it("Should have the correct name and symbol for the Custom token", async () => {
    const name = await customToken.name();
    const symbol = await customToken.symbol();
    expect(name).to.equal(name, "Custom Token");
    expect(symbol).to.equal(symbol, "Ctok");
  });

  it("Should have the correct Custom token address", async () => {
    const address = await tokenFarm.customToken();
    expect(address).to.equal(customToken.address);
  });

  it("Should have the correct Dai token address", async () => {
    const address = await tokenFarm.daiToken();
    expect(address).to.equal(daiToken.address);
  });

  it("Should have 1000000 custom token", async () => {
    const balance = await customToken.balanceOf(tokenFarm.address);
    expect(balance.toString()).to.equal(tokens("1000000"));
  });

  it("Should stake tokens correctly", async () => {
    const balanceOfInvestorBeforeStaking = await daiToken.balanceOf(
      bobAccount.address
    );

    await daiToken.connect(bobAccount).approve(tokenFarm.address, tokens("5"));

    await tokenFarm.connect(bobAccount).stakeTokens(tokens("5"));

    const balanceOfInvestorAfterStaking = await daiToken.balanceOf(
      bobAccount.address
    );

    const investorStakingBalance = await tokenFarm.stakingBalance(
      bobAccount.address
    );
    const investorHasStake = await tokenFarm.hasStaked(bobAccount.address);
    const investorCurrentStakingStatus = await tokenFarm.isStaking(
      bobAccount.address
    );

    expect(balanceOfInvestorAfterStaking.toString()).to.equal(tokens("5"));
    expect(balanceOfInvestorBeforeStaking.toString()).to.equal(tokens("10"));
    expect(investorStakingBalance.toString()).to.equal(tokens("5"));
    expect(investorHasStake).to.equal(true);
    expect(investorCurrentStakingStatus).to.equal(true, "True");
  });

  it("Should issue reward for the stacker", async () => {
    await tokenFarm.connect(owner).issueTokens();
    const investorStakingBalance = await tokenFarm.stakingBalance(
      bobAccount.address
    );
    const investorRewardBalance = await customToken.balanceOf(
      bobAccount.address
    );
    expect(investorStakingBalance.toString()).to.equal(
      investorRewardBalance.toString()
    );
  });

  it("Should not allow to issue tokens if is not contract owner", async () => {
    await expect(
      tokenFarm.connect(bobAccount).issueTokens()
    ).to.be.revertedWith("only the owner can call this function");
  });

  it("Should allow to unstake dai token", async () => {
    await daiToken.connect(bobAccount).approve(tokenFarm.address, tokens("5"));

    await tokenFarm.connect(bobAccount).stakeTokens(tokens("5"));

    await tokenFarm.connect(bobAccount).unstakeTokens();
    const investorContractBalance = await tokenFarm.stakingBalance(
      bobAccount.address
    );
  
    const investorBalance = await customToken.balanceOf(bobAccount.address);
   
    expect(investorContractBalance.toString()).to.equal('0');
    expect(investorBalance.toString()).to.equal('0');

  });
});
