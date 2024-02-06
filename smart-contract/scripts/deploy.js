// scripts/deploy.js
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const SwappingAggregator = await ethers.getContractFactory('SwappingAggregator');
  const swappingAggregator = await SwappingAggregator.deploy();
  
  console.log('SwappingAggregator deployed to:', swappingAggregator.target);

  // deployed address 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
}
// npx hardhat node --fork https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
