const hre = require("hardhat");



async function main() {

  const CustomToken = await hre.ethers.getContractFactory("CustomToken");
  const customToken = await CustomToken.deploy();
  
  await customToken.deployed();
  console.log(
    `CustomToken Contract deployed to ${customToken.address}`
  );

  const DaiToken = await hre.ethers.getContractFactory("DaiToken");
  const daiToken = await DaiToken.deploy();
  
  await daiToken.deployed();
  console.log(
    `Dai Token Contract deployed to ${daiToken.address}`
  );

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
