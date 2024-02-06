const { expect } = require('chai');

describe('Deployment', function () {
  it('Should deploy SwappingAggregator', async function () {
    const SwappingAggregator = await ethers.getContractFactory('SwappingAggregator');
    const swappingAggregator = await SwappingAggregator.deploy();

    await swappingAggregator.deployed();

    // Check if the contract address is not empty
    expect(swappingAggregator.address).to.not.equal('0x0000000000000000000000000000000000000000');
  });
});
