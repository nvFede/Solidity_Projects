// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");


async function main() {

  const EventFactory = await hre.ethers.getContractFactory("EventFactory");
  const eventFactory = await EventFactory.deploy();
  
  await eventFactory.deployed();

  const eventName = "My Event";
  const numberOfTicketsForTheEvent = 100;
  const ticketPrice = hre.ethers.utils.parseEther("1");

  await eventFactory.createNewEvent(
    eventName,
    numberOfTicketsForTheEvent,
    ticketPrice
  );
  const eventAddress = await eventFactory.getDeployedEvents();
  //const event = await Event.at(eventAddress[0]);

  console.log(
    `Contract deployed to ${eventAddress}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
