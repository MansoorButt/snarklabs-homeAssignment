const express = require('express');
const Web3 = require('web3');
const { Transaction } = require('@ethereumjs/tx')
const { ethers } = require("ethers");

const app = express();
const port = 3000;

// Ethereum node URL or Infura URL
const provider = new ethers.providers.JsonRpcProvider(`http://127.0.0.1:8545`)

// Private key for the Hardhat wallet account (for simplicity)
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// ABI for the SwappingAggregator contract
const aggregatorAbi = [
  {
    "constant": false,
    "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "target",
              "type": "address"
            },
            {
              "internalType": "bytes",
              "name": "data",
              "type": "bytes"
            }
          ],
          "internalType": "struct SwappingAggregator.Call[]",
          "name": "callData",
          "type": "tuple[]"
        }
      ],
      "name": "execute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
  }
];

// Contract address of the deployed SwappingAggregator
const aggregatorAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

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
    
    const calldata = aggregatorContract.interface.encodeFunctionData('execute', [[{
      target: dexAddress,
      data: ethers.utils.defaultAbiCoder.encode(['uint256', 'uint256', 'address[]', 'address', 'uint256'], ['1000000000000000000', '0', ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', '0x6B175474E89094C44Da98b954EedeAC495271d0F'], '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', '1644600000'])
  }]]);
    
    
  const tx = await wallet.sendTransaction({
    to: aggregatorAddress,
    data: calldata
});

  const receipt = await tx.wait();
  const transactionHash = receipt.transactionHash;

    
    res.json({ success: true, transactionHash });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
