// scripts/deploy.js
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const SwappingAggregator = await ethers.getContractFactory('SwappingAggregator');
  const swappingAggregator = await SwappingAggregator.deploy();
  
  console.log('SwappingAggregator deployed to:', swappingAggregator.target);

  // deployed address 0xEC7cb8C3EBE77BA6d284F13296bb1372A8522c5F
}
// npx hardhat node --fork https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845
//npx hardhat run scripts/deploy.js --network localhost


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
