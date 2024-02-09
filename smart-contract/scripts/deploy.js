// scripts/deploy.js
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  const SwappingAggregator = await ethers.getContractFactory('SwappingAggregator');
  const swappingAggregator = await SwappingAggregator.deploy();
  
  console.log('SwappingAggregator deployed to:', swappingAggregator.target);

  // deployed address 0x057cD3082EfED32d5C907801BF3628B27D88fD80
}
// npx hardhat node --fork https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845
//npx hardhat run scripts/deploy.js --network localhost


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
