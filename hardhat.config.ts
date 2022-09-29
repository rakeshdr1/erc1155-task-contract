import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    // Use this for deploying with Private Key
    // mumbai: {
    //   url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: [process.env.PRI_KEY as string],
    // },
    mumbai: {
      url: "https://matic-mumbai.chainstacklabs.com",
      chainId: 80001,
    },
    /**
     * @description This is the default network for truffle dashboard.
     * There is no need to paste PRIVATE_KEY for deployment. This enables the connection to the
     * MetaMask wallet in the browser from where the contract deployment transcation can be signed.
     * @see {@link https://trufflesuite.com/docs/truffle/getting-started/using-the-truffle-dashboard/}
     */
    truffle: {
      url: "http://localhost:24012/rpc",
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
