import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const Task = await ethers.getContractFactory("TaskContract");
  const task = await Task.deploy();

  await task.deployed();

  console.log(
    `TaskContract deployed to ${task.address} from Address ${deployer}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
