require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/NEdki-doZp6hs2eRSdAn_",
      accounts: ["d49328a96a9ea2ef1f21379762edb7055116460d0be596a1288e3ddc7e336e25"]
    }
  }
};