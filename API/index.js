const express = require('express');
const Web3 = require('web3');
const { Transaction } = require('@ethereumjs/tx')

const app = express();
const port = 3000;

// Ethereum node URL or Infura URL
const ethereumNodeUrl = 'https://mainnet.infura.io/v3/5944ae3272a84e4d9c88542677daa845';

// Private key for the Hardhat wallet account (for simplicity)
const privateKey = Buffer.from('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', 'hex');

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

// Handle POST requests to /execute
app.post('/execute', async (req, res) => {
  try {
    const { routeIndex } = req.body;

    if (routeIndex < 0 || routeIndex >= swapRoutes.length) {
      return res.status(400).json({ success: false, error: 'Invalid route index' });
    }

    const { dexAddress } = swapRoutes[routeIndex];

   
    const web3 = new Web3(ethereumNodeUrl);

    
    const gasPrice = await web3.eth.getGasPrice();

    
    const aggregatorContract = new web3.eth.Contract(aggregatorAbi, aggregatorAddress);

    // Encoding the calldata for the swapExactTokensForTokens function
    const calldata = aggregatorContract.methods.execute([{
      target: dexAddress,
      data: web3.eth.abi.encodeFunctionCall({
        name: 'swapExactTokensForTokens',
        type: 'function',
        inputs: [
            { type: 'uint256', value: '1000000000000000000' },  // amountIn (1 token)
            { type: 'uint256', value: '0' },                   // amountOutMin (0 tokens, for simplicity)
            { 
              type: 'address[]', 
              value: ['0x71C7656EC7ab88b098defB751B7401B5f6d8976F', '0x6B175474E89094C44Da98b954EedeAC495271d0F'] // ETH to DAI on mainnet
            },                                                  
            { type: 'address', value: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },   // to (my hardhat wallet address)
            { type: 'uint256', value: '1644600000' }           

        ]
      }),
    }]).encodeABI();


    const txObject = {
      to: aggregatorAddress,
      data: calldata,
      gasPrice: gasPrice,
    };

   
    const transaction = new Transaction.fromTxData(txObject, { chain: 'mainnet' }); 

    
    transaction.sign(privateKey);

    const serializedTransaction = transaction.serialize();

    
    const transactionHash = await web3.eth.sendSignedTransaction('0x' + serializedTransaction.toString('hex'));

    
    res.json({ success: true, transactionHash });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
