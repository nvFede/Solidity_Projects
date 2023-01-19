const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventFactory", () => {
  let eventFactory;
  let accounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    eventFactory = await ethers.getContractFactory("EventFactory");
    eventFactory = await eventFactory.deploy();
    await eventFactory.deployed();
  });

  it("should create new event", async () => {
    const eventName = "Event 1";
    const numberOfTicketsForTheEvent = 10;
    const ticketPrice = ethers.utils.parseEther("1");

    await eventFactory.createNewEvent(
      eventName,
      numberOfTicketsForTheEvent,
      ticketPrice
    );

    const deployedEvents = await eventFactory.getDeployedEvents();
    expect(deployedEvents.length).to.equal(1);
  });
});

describe("Event", () => {
  let event;
  let accounts;

  beforeEach(async () => {
    accounts = await ethers.getSigners();
    const eventFactory = await ethers.getContractFactory("EventFactory");
    const eventFactoryDeployed = await eventFactory.deploy();
    await eventFactoryDeployed.deployed();

    const eventName = "Event 1";
    const numberOfTicketsForTheEvent = 10;
    const ticketPrice = ethers.utils.parseEther("1");

    await eventFactoryDeployed.createNewEvent(
      eventName,
      numberOfTicketsForTheEvent,
      ticketPrice
    );

    const deployedEvents = await eventFactoryDeployed.getDeployedEvents();
    event = await ethers.getContractAt("Event", deployedEvents[0]);
  });

  it("should allow to see ticket price (pre-sale)", async () => {
    let price = ethers.utils.formatEther(await event.viewTicketPrice());

    expect(price).to.be.equal((0.5).toString());
  });

  it("should buy tickets and emit the correct event", async () => {
    const email = "customer@example.com";
    const quantity = 2;
    const ticketPrice = ethers.utils.parseEther("1");
    const customer = accounts[1];

    const tx = await event
      .connect(customer)
      .buyTickets(email, quantity, { value: ticketPrice });
    const receipt = await tx.wait();

    expect(receipt)
      .to.emit("TicketPurchased")
      .withArgs(customer.address, quantity);

    const customerData = await event.customers(customer.address);
    expect(customerData.email).to.equal(email);
    expect(customerData.quantity.toNumber()).to.equal(quantity);
    expect(await event.numberOfTicketsForTheEvent()).to.equal(8);
  });
  it("should not allow the owner to buy tickets", async () => {
    const email = "customer@example.com";
    const quantity = 2;
    const ticketPrice = ethers.utils.parseEther("1");
    const owner = accounts[0];

    await expect(
      event.connect(owner).buyTickets(email, quantity, { value: ticketPrice })
    ).to.be.revertedWith("you can't buy tickets");
  });

  it("should not allow buying more than the maximum allowed tickets per customer", async () => {
    const email = "customer@example.com";
    const quantity = 4;
    const ticketPrice = 1;
    const value = ethers.utils.parseEther("2"); // 4 tickets at half price
    const customer = accounts[1];

    await expect(
      event.connect(customer).buyTickets(email, quantity, { value: value })
    ).to.be.revertedWith("You can buy a maximum of 3 tickets");
  });

  it("should revert if the customer doesn't paid enough for the tickets ", async () => {
    const email = "customer@example.com";
    const quantity = 3;
    const ticketPrice = 1;
    const value = ethers.utils.parseEther("1"); // 4 tickets at half price
    const customer = accounts[1];

    expect(
      event
        .connect(customer)
        .buyTickets(email, quantity, { value: ticketPrice })
    ).to.be.revertedWith("you didn't paid enough");
  });

  it("should close the pre-sale after the first five tickets bought", async () => {
    let email = "customer@example.com";
    let quantity = 2;
    let ticketPrice = ethers.utils.parseEther("1");
    let customer = accounts[1];

    let tx = await event
      .connect(customer)
      .buyTickets(email, quantity, { value: ticketPrice });
    let receipt = await tx.wait();

    email = "customer2@example.com";
    quantity = 3;
    ticketPrice = ethers.utils.parseEther("1");
    let value = ethers.utils.parseEther("1.5");
    customer = accounts[2];

    tx = await event
      .connect(customer)
      .buyTickets(email, quantity, { value: value });
    receipt = await tx.wait();

    let eventStatus = await event.viewEventStatus();
    expect(eventStatus).to.be.equal(1)
  });
});
