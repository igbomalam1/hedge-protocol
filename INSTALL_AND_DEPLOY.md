# Node.js Installation & HOGS Token Deployment Guide

## Step 1: Install Node.js 22 LTS

1. **Download Node.js 22 LTS**:
   - Go to: https://nodejs.org/en/download
   - Download the **Windows Installer (.msi)** for the **LTS version** (22.x)
   - Choose 64-bit for most modern Windows systems

2. **Install Node.js**:
   - Run the downloaded `.msi` file
   - Follow the installation wizard
   - **IMPORTANT**: Check the box "Automatically install the necessary tools"
   - Complete the installation

3. **Verify Installation**:
   - Open a **NEW** PowerShell/Terminal window
   - Run: `node --version`
   - Should show: `v22.x.x`

## Step 2: Compile the HOGS Token Contract

After installing Node.js 22, open a new terminal in the project directory and run:

```bash
# Navigate to project
cd C:\Users\USER\Desktop\Projects\Legacy-Trace

# Compile the contract
npx hardhat compile --config hardhat.config.cjs
```

Expected output:
```
Compiled 1 Solidity file successfully
```

## Step 3: Deploy to Polygon Mainnet

**IMPORTANT**: Make sure you have:
- ✅ MATIC in your wallet for gas fees (at least 0.5 MATIC)
- ✅ All API keys filled in `.env.local`
- ✅ Your wallet private key in `.env.local`

Run the deployment:

```bash
npx hardhat run scripts/deploy.js --network polygon --config hardhat.config.cjs
```

## Step 4: After Deployment

1. **Copy the contract address** from the deployment output
2. **Update `.env.local`**:
   ```
   NEXT_PUBLIC_HOGS_TOKEN_ADDRESS=<your_contract_address>
   ```
3. **Verify on PolygonScan**: The script will auto-verify, or you can verify manually
4. **Add to MetaMask**: Import the token using the contract address

## Troubleshooting

### "Insufficient funds for gas"
- Add more MATIC to your wallet
- Check gas prices on PolygonScan

### "Invalid private key"
- Ensure your private key in `.env.local` doesn't have `0x` prefix
- Double-check the key is correct

### Compilation errors
- Make sure you're using Node.js 22.x: `node --version`
- Delete `node_modules` and run `npm install` again

## Next Steps After Deployment

1. Deploy staking contract
2. Add liquidity to DEX (QuickSwap/Uniswap)
3. Update frontend to interact with deployed contract
4. Test claiming and staking functionality

---

**Ready to deploy?** Follow the steps above and let me know when Node.js 22 is installed!
