const { expect } = require('chai');

describe('Deployment', function () {
  it('Should deploy SwappingAggregator', async function () {
    const SwappingAggregator = await ethers.getContractFactory('SwappingAggregator');
    const swappingAggregator = await SwappingAggregator.deploy();

   

    // Check if the contract address is not empty
    expect(swappingAggregator.target).to.not.equal(undefined);
  });
});
