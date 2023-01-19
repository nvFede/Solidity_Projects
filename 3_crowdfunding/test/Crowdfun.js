const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Crowdfunding contract test cases", () => {
  let contract;
  let owner;
  let bobAccount;
  let aliceAccount;

  beforeEach(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    bobAccount = signers[1];
    aliceAccount = signers[2];
    const CrowdFundingContract = await ethers.getContractFactory(
      "CrowdFunding"
    );
    contract = await CrowdFundingContract.deploy();

    async function createCamp(user) {
      const target = ethers.utils.parseEther("10");
      contract
        .connect(user)
        .createCampaign(
          user.address,
          "Test Campaign",
          "Test Description",
          target,
          "testimage.jpg"
        );
    }
  });

  it("should deploy the contract", async () => {
    expect(contract.address).to.not.be.null;
  });

  it("should create a new campaign", async () => {
    const target = ethers.utils.parseEther("1");
    const tx = await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      "testimage.jpg"
    );

    const campaign = await contract.campaigns(0);
    expect(campaign.title).to.equal("Test Campaign");
    expect(campaign.description).to.equal("Test Description");
    expect(campaign.target).to.equal(ethers.utils.parseEther("1"));
    expect(campaign.image).to.equal("testimage.jpg");
    expect(campaign.status).to.equal(0);
  });

 
  it("should allow the owner to close a campaign", async () => {
    const target = ethers.utils.parseEther("1");
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      "testimage.jpg"
    );
    const tx = await contract.closeCampaign(0);
    const campaign = await contract.campaigns(0);
    expect(campaign.status).to.equal(1);
  });
  it("should not allow a user to close a campaign", async () => {
    const target = ethers.utils.parseEther("1");
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      "testimage.jpg"
    );

    const tx = contract.connect(bobAccount).closeCampaign(0);
    expect(tx).to.be.revertedWith("Only the owner can perform this action.");
  });
  it("should allow the owner to re-open a campaign", async () => {
    const target = ethers.utils.parseEther("1");
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      "testimage.jpg"
    );

    await contract.closeCampaign(0);
    const tx = await contract.reOpenCampaign(0);
    const campaign = await contract.campaigns(0);

    expect(campaign.status).to.equal(0);
  });
  it("should not allow a user to re-open a campaign", async () => {
    const target = ethers.utils.parseEther("1");
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      "testimage.jpg"
    );

    await contract.closeCampaign(0);
    const tx = contract.connect(bobAccount).reOpenCampaign(0);
    expect(tx).to.be.revertedWith("Only the owner can perform this action.");
  });
  it("should allow a user to donate to a campaign", async () => {
    const target = ethers.utils.parseEther("1");
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      "testimage.jpg"
    );
    let cc = await contract.campaigns(0);
    const tx = await contract
      .connect(bobAccount)
      .donateToCampaign(0, { value: ethers.utils.parseEther("0.5") });
    const campaign = await contract.campaigns(0);
    expect(campaign.amountCollected).to.equal(ethers.utils.parseEther("0.5"));
  });

  it("should not allow a user to donate to a closed campaign", async () => {
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      ethers.utils.parseEther("1"),
      "testimage.jpg"
    );

    await contract.closeCampaign(0);
    const tx = contract
      .connect(bobAccount)
      .donateToCampaign(0, { value: ethers.utils.parseEther("0.5") });
    expect(tx).to.be.revertedWith("This campaign is not open to fund.");
  });

  it("should not allow a user to donate more than the campaign target", async () => {
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      ethers.utils.parseEther("1"),
      "testimage.jpg"
    );

    const tx = contract
      .connect(bobAccount)
      .donateToCampaign(0, { value: ethers.utils.parseEther("1.5") });
    expect(tx).to.be.revertedWith("Donation exceeds campaign target.");
  });

  it("should allow a user to retrieve the information of a campaign", async () => {
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      ethers.utils.parseEther("10"),
      "testimage.jpg"
    );

    const campaign = await contract.campaigns(0);
    expect(campaign.title).to.equal("Test Campaign");
    expect(campaign.description).to.equal("Test Description");
    expect(campaign.target).to.equal(ethers.utils.parseEther("10"));
    expect(campaign.image).to.equal("testimage.jpg");
    expect(campaign.status).to.equal(0);
  });
  it("should allow the owner to withdraw funds if the campaign is successful", async () => {
    await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      ethers.utils.parseEther("10"),
      "testimage.jpg"
    );

    await contract
      .connect(bobAccount)
      .donateToCampaign(0, { value: ethers.utils.parseEther("5") });
    await contract
      .connect(aliceAccount)
      .donateToCampaign(0, { value: ethers.utils.parseEther("5") });

    const balanceBefore = await ethers.provider.getBalance(owner.address);

    
    

    const campaign = await contract.campaigns(0);
    expect(campaign.status).to.equal(2);

    const tx =  await contract.withdrawFunds(0);


    const balanceAfter = await ethers.provider.getBalance(owner.address);
    expect(balanceAfter.sub(balanceBefore)).to.equal(campaignTarget);
  });
});
