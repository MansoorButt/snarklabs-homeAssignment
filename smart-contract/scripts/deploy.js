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

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
