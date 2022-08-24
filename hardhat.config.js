require("dotenv/config");

require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */


module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url: process.env.ALCHEMY_GEORLI_URL,
      accounts: [process.env.GOERLI_PRIVATE_KEY]
    }

  }
};
