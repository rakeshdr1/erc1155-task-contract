const { ethers, network, artifacts } = require("hardhat");
const fs = require("fs");
const path = require("path");

function saveContractABI(contract: any, artifactName: string) {
  const contractsDir = path.resolve(__dirname, "../output");

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    `${contractsDir}/${artifactName}-${network.name}.json`,
    JSON.stringify({ [artifactName]: contract.address }, undefined, 2)
  );
  const Artifact = artifacts.readArtifactSync(artifactName);

  fs.writeFileSync(
    `${contractsDir}/${artifactName}.json`,
    JSON.stringify(Artifact, null, 2)
  );
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const Task = await ethers.getContractFactory("TaskContract");
  const task = await Task.deploy();

  await task.deployed();

  console.log(
    `TaskContract deployed to ${task.address} from Address ${deployer.address}`
  );
  saveContractABI(task, "TaskContract");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
