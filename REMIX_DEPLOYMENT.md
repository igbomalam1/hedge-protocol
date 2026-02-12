# Deploy HOGS Token Using Remix IDE

## Step-by-Step Deployment Guide

### Step 1: Open Remix IDE
1. Go to https://remix.ethereum.org
2. Wait for Remix to load completely

### Step 2: Create the Contract File
1. In the **File Explorer** (left sidebar), click the **"+"** icon to create a new file
2. Name it: `HedgehogsToken.sol`
3. Copy the entire contract code from `contracts/HedgehogsToken.sol` and paste it into Remix

### Step 3: Install OpenZeppelin Contracts
1. In Remix, look at the contract imports at the top
2. Remix will automatically detect and install OpenZeppelin contracts
3. Wait for the imports to resolve (you'll see checkmarks)

### Step 4: Compile the Contract
1. Click the **"Solidity Compiler"** icon (left sidebar, looks like "S")
2. Select compiler version: **0.8.20**
3. Click **"Compile HedgehogsToken.sol"**
4. Wait for compilation to complete (green checkmark)

### Step 5: Connect MetaMask to Polygon
1. Open MetaMask extension
2. Click the network dropdown at the top
3. Select **"Polygon Mainnet"**
   - If you don't see it, click "Add Network" and add Polygon manually:
     - Network Name: Polygon Mainnet
     - RPC URL: https://polygon-rpc.com
     - Chain ID: 137
     - Currency Symbol: MATIC
     - Block Explorer: https://polygonscan.com
4. Make sure you have at least **0.5 MATIC** for gas fees

### Step 6: Deploy the Contract
1. Click the **"Deploy & Run Transactions"** icon (left sidebar, looks like Ethereum logo)
2. In **ENVIRONMENT**, select: **"Injected Provider - MetaMask"**
3. MetaMask will pop up - click **"Connect"** and approve
4. Verify the **ACCOUNT** shows your wallet address
5. Verify **CONTRACT** dropdown shows: **"HedgehogsToken - contracts/HedgehogsToken.sol"**
6. In the **Deploy** section, you'll see a field for constructor arguments:
   - Enter your **rescue fund wallet address** (or use your own wallet address)
   - Format: `0x...` (42 characters)
7. Click the orange **"Deploy"** button
8. MetaMask will pop up with transaction details
9. **Review gas fees** and click **"Confirm"**
10. Wait for the transaction to be mined (30-60 seconds)

### Step 7: Get Your Contract Address
1. After deployment, look at the **"Deployed Contracts"** section at the bottom
2. You'll see your contract with an address like: `0x1234...5678`
3. Click the **copy icon** next to the address
4. **SAVE THIS ADDRESS** - you'll need it!

### Step 8: Verify Contract on PolygonScan
1. Go to https://polygonscan.com
2. Search for your contract address
3. Click the **"Contract"** tab
4. Click **"Verify and Publish"**
5. Fill in the form:
   - Compiler Type: **Solidity (Single file)**
   - Compiler Version: **v0.8.20+commit...**
   - Open Source License Type: **MIT**
6. Click **"Continue"**
7. Paste the **entire contract code** (including imports)
8. Constructor Arguments (ABI-encoded):
   - Go back to Remix
   - In the deployed contract, find the constructor arguments
   - Or use: https://abi.hashex.org/ to encode your rescue fund address
9. Click **"Verify and Publish"**

### Step 9: Update Your Project
1. Open `.env.local` in your project
2. Add the contract address:
   ```
   NEXT_PUBLIC_HOGS_TOKEN_ADDRESS=0xYourContractAddressHere
   ```
3. Save the file

### Step 10: Add Token to MetaMask
1. Open MetaMask
2. Click **"Import tokens"**
3. Enter:
   - Token Contract Address: `<your_contract_address>`
   - Token Symbol: **HOGS**
   - Token Decimal: **18**
4. Click **"Add Custom Token"**
5. You should now see your 1 billion HOGS tokens!

## Troubleshooting

### "Gas estimation failed"
- Make sure you have enough MATIC (at least 0.5)
- Try increasing gas limit manually

### "Invalid address" in constructor
- Make sure the address starts with `0x`
- Make sure it's exactly 42 characters long
- Use a valid Ethereum/Polygon address

### Contract verification fails
- Make sure you're using the exact same Solidity version (0.8.20)
- Include ALL the code, including OpenZeppelin imports
- Use the flattened contract (Remix can flatten it for you)

## Next Steps After Deployment

1. ✅ Contract is deployed and verified
2. ✅ Contract address is in `.env.local`
3. ✅ Token is in MetaMask
4. 🔄 Deploy staking contract (later)
5. 🔄 Add liquidity to DEX (QuickSwap/Uniswap)
6. 🔄 Update frontend to interact with contract

---

**Ready to deploy?** Follow these steps and let me know your contract address when it's deployed! 🚀
