import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

enum Tokens {
  TokenF,
  TokenN,
  TokenT,
}

describe("TaskContract", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployTaskContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, user1, user2] = await ethers.getSigners();

    const Task = await ethers.getContractFactory("TaskContract");
    const task = await Task.deploy();

    const Test = await ethers.getContractFactory("TestTaskContract");
    const test = await Test.deploy(task.address);

    return { task, test, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("Should set the right cost for Token F minting", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);

      expect(await task.MINT_TOKEN_F_COST()).to.equal(
        ethers.utils.parseEther("0.01")
      );
    });

    it("Should set the right cost for Token N minting", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);

      expect(await task.MINT_TOKEN_N_COST()).to.equal(3);
    });

    it("Should set the right cost for Token T minting", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);

      expect(await task.MINT_TOKEN_T_COST()).to.equal(10);
    });

    it("should revert if caller is a contract", async () => {
      const { test } = await loadFixture(deployTaskContractFixture);

      await expect(test.testMintF()).to.be.revertedWith(
        "Caller cannot be contract"
      );

      await expect(test.testMintN()).to.be.revertedWith(
        "Caller cannot be contract"
      );

      await expect(test.testMintT()).to.be.revertedWith(
        "Caller cannot be contract"
      );
    });
  });

  describe("TokenF minting", function () {
    it("Should mint 100 Token F if 1 ether is sent", async function () {
      const { task, user1 } = await loadFixture(deployTaskContractFixture);

      await task
        .connect(user1)
        .mintTokenF(100, { value: ethers.utils.parseEther("1") });
      expect(await task.balanceOf(user1.address, Tokens.TokenF)).to.equal(100);
    });

    it("Should fail minting 100 Token F if less amount sent (0.1 ether) is sent", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);

      await expect(
        task.mintTokenF(100, { value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("Not enough ether sent");
    });
  });

  describe("TokenN minting", function () {
    it("Should mint 10 Token N if 30 Token F is sent", async function () {
      const { task, user2 } = await loadFixture(deployTaskContractFixture);
      await task
        .connect(user2)
        .mintTokenF(100, { value: ethers.utils.parseEther("1") });

      await task.connect(user2).setApprovalForAll(task.address, true);
      await task.connect(user2).mintTokenN(10);
      expect(await task.balanceOf(user2.address, Tokens.TokenN)).to.equal(10);
    });

    it("Should fail minting Token N if Token F balance of user is lower than required", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);
      await task.mintTokenF(10, { value: ethers.utils.parseEther("0.1") });

      await task.setApprovalForAll(task.address, true);
      await expect(task.mintTokenN(10)).to.be.revertedWith(
        "Not enough Token F sent"
      );
    });

    it("Should fail minting Token N if user is not set approval", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);
      await task.mintTokenF(100, { value: ethers.utils.parseEther("1") });

      await expect(task.mintTokenN(10)).to.be.revertedWith(
        "Not approved for transfer"
      );
    });
  });

  describe("TokenT minting", function () {
    it("Should mint 3 Token T if 30 Token F and 3 Token N is sent", async function () {
      const { task, user2 } = await loadFixture(deployTaskContractFixture);
      await task
        .connect(user2)
        .mintTokenF(100, { value: ethers.utils.parseEther("1") });

      await task.connect(user2).setApprovalForAll(task.address, true);
      await task.connect(user2).mintTokenN(3);
      await task.connect(user2).mintTokenT(3);
      expect(await task.balanceOf(user2.address, Tokens.TokenT)).to.equal(3);
    });

    it("Should fail minting Token T if Token N balance of user is lower than required", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);
      await task.mintTokenF(100, { value: ethers.utils.parseEther("1") });

      await task.setApprovalForAll(task.address, true);
      await task.mintTokenN(1);
      await expect(task.mintTokenT(3)).to.be.revertedWith(
        "Not enough Token N sent"
      );
    });

    it("Should fail minting Token T if Token F balance of user is lower than required", async function () {
      const { task } = await loadFixture(deployTaskContractFixture);
      await task.mintTokenF(10, { value: ethers.utils.parseEther("0.1") });

      await task.setApprovalForAll(task.address, true);
      await task.mintTokenN(1);
      await expect(task.mintTokenT(3)).to.be.revertedWith(
        "Not enough Token F sent"
      );
    });

    it("Should Burn 10 Token F and 1 Token N for minting each Token N ", async function () {
      const { task, user2 } = await loadFixture(deployTaskContractFixture);
      await expect(
        task
          .connect(user2)
          .mintTokenF(100, { value: ethers.utils.parseEther("1") })
      ).to.changeEtherBalance(user2, ethers.utils.parseEther("-1"));

      await task.connect(user2).setApprovalForAll(task.address, true);
      await task.connect(user2).mintTokenN(3);
      await task.connect(user2).mintTokenT(3);

      expect(await task.balanceOf(user2.address, Tokens.TokenT)).to.equal(3);
      expect(await task.balanceOf(user2.address, Tokens.TokenF)).to.equal(61);
      expect(await task.balanceOf(user2.address, Tokens.TokenN)).to.equal(0);
    });
  });
});
