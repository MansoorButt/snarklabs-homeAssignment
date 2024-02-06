require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      forking: {
        url: "https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845",
      }
    }
  }
};

