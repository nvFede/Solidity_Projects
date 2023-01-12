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
  });

  it("should deploy the contract", async () => {
    expect(contract.address).to.not.be.null;
  });

  it("should create a new campaign", async () => {
    const deadline = Math.floor(new Date("2022-10-01").getTime() / 1000);
    const target = ethers.utils.parseEther("1");
    const campaignId = await contract.createCampaign(
      owner.address,
      "Test Campaign",
      "Test Description",
      target,
      deadline,
      "testimage.jpg"
    );
    const campaign = await contract.campaigns(campaignId);
      console.log(campaign);
    // const campaign = await contract.campaigns(campaignId);
    // expect(campaign.title).to.equal("Test Campaign");
    // expect(campaign.description).to.equal("Test Description");
    // expect(campaign.target).to.equal(ethers.utils.parseEther("1"));
    // expect(campaign.deadline.toNumber()).to.equal(deadline);
    // expect(campaign.image).to.equal("image.jpg");
    // expect(campaign.status).to.equal(0);
  });
});
