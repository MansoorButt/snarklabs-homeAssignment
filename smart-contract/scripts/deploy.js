// scripts/deploy.js
const { ethers } = require('hardhat');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(deployer)
  

  const SwappingAggregator = await ethers.getContractFactory('SwappingAggregator');
  const swappingAggregator = await SwappingAggregator.deploy();
  
  console.log('SwappingAggregator deployed to:', swappingAggregator.target);

  // deployed address 0x15F2ea83eB97ede71d84Bd04fFF29444f6b7cd52
}
// npx hardhat node --fork https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845
//npx hardhat run scripts/deploy.js --network localhost


main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
