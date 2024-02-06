const express = require('express');
const { ethers } = require("ethers");
const abi = require("./abi/abi.json")

const app = express();
const port = 3000;


const ethereumNodeUrl = 'https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845';
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545`)

const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

// ABI for the SwappingAggregator contract
const aggregatorAbi = abi

// Contract address of the deployed SwappingAggregator
const aggregatorAddress = '0xEC7cb8C3EBE77BA6d284F13296bb1372A8522c5F';

// Hardcoded swap routes of Uniswap and SushiSwap
const swapRoutes = [
  {
    dexAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap Router contract on ethereum-mainnet
    
  },  
    
  {
    dexAddress: '0x011e52e4e40cf9498c79273329e8827b21e2e581',  // SushiSwap Router contract on ethereum-mainnet

  },
];
app.use(express.json());
// Handle POST requests to /execute
app.post('/execute', async (req, res) => {
  try {
    const { routeIndex } = req.body;
    console.log(routeIndex)

        if (typeof routeIndex !== 'number' || routeIndex < 0 || routeIndex >= swapRoutes.length) {
            return res.status(400).json({ success: false, error: 'Invalid route index' });
        }

        const route = swapRoutes[routeIndex];
        if (!route || !route.dexAddress) {
            return res.status(400).json({ success: false, error: 'Invalid swap route' });
        }

        const { dexAddress } = route;
   
    
    const wallet = new ethers.Wallet(privateKey, provider);
    const aggregatorContract = new ethers.Contract(aggregatorAddress, aggregatorAbi, wallet);

    // Prepare function call data
    const calldata1 = aggregatorContract.interface.encodeFunctionData('routerAddress', [dexAddress]);

    const gasLimit1 = await provider.estimateGas({
      to: aggregatorAddress,
      data: calldata1
  });

  
  // Send transaction
  const tx1 = await wallet.sendTransaction({
    to: aggregatorAddress,
    data: calldata1,
    gasLimit: gasLimit1.mul(2)
  });
  
  // Wait for transaction receipt
  const receipt1 = await tx1.wait();
  const transactionHash1 = receipt1.transactionHash;
  
  
  const tokenIn = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'; // ETH
      const tokenOut = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; // DAI
      const amountIn = ethers.utils.parseEther('1'); // Example: 1 token in
      const amountOutMin = ethers.constants.Zero; // Example: No minimum output amount required
  
      // Encode function call
      const calldata = aggregatorContract.interface.encodeFunctionData('swapTokens', [
            tokenIn,
            tokenOut,
            amountIn,
            amountOutMin,   
        ]);
    
        const gasLimit = await provider.estimateGas({
            to: aggregatorAddress,
            data: calldata
        });
      
      console.log("Gas limit is",gasLimit.toNumber())
          // Send transaction
        const tx = await wallet.sendTransaction({
            to: aggregatorAddress,
            data: calldata,
            gasLimit: gasLimit.mul(130).div(100)
        });

        // Wait for transaction receipt
        const receipt = await tx.wait();
        const transactionHash = receipt.transactionHash;

    
    res.json({ success: true,transactionHash });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
