# HOGS Token Deployment Guide

## Prerequisites

Before deploying the HOGS token, ensure you have:

1. **Wallet with MATIC**: You need MATIC tokens on Polygon to pay for gas fees
   - Get MATIC from exchanges (Binance, Coinbase, etc.)
   - Bridge from Ethereum using [Polygon Bridge](https://wallet.polygon.technology/polygon/bridge)

2. **API Keys**: Update `.env.local` with your actual API keys:
   - `PRIVATE_KEY`: Your wallet's private key (from MetaMask)
   - `POLYGONSCAN_API_KEY`: Get from [PolygonScan](https://polygonscan.com/myapikey)
   - `WALLETCONNECT_PROJECT_ID`: Get from [Reown Cloud](https://cloud.reown.com/)

## Deployment Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile the Contract

```bash
npx hardhat compile
```

### 3. Test Locally (Optional but Recommended)

```bash
npx hardhat test
```

### 4. Deploy to Polygon Mumbai Testnet (Testing)

```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### 5. Deploy to Polygon Mainnet (Production)

```bash
npx hardhat run scripts/deploy.js --network polygon
```

## Post-Deployment

After successful deployment:

1. **Update Environment Variables**:
   - Copy the contract address from the deployment output
   - Add to `.env.local`: `NEXT_PUBLIC_HOGS_TOKEN_ADDRESS=<contract_address>`

2. **Verify Contract** (if auto-verification failed):
   ```bash
   npx hardhat verify --network polygon <CONTRACT_ADDRESS> <RESCUE_FUND_WALLET>
   ```

3. **Add Liquidity to DEX**:
   - Go to [QuickSwap](https://quickswap.exchange/) or [Uniswap](https://app.uniswap.org/)
   - Create a liquidity pool for HOGS/MATIC or HOGS/USDC
   - Add initial liquidity

4. **Deploy Staking Contract** (coming soon)

## Security Checklist

- [ ] Private key is secure and never committed to Git
- [ ] `.env.local` is in `.gitignore`
- [ ] Contract has been audited (recommended for production)
- [ ] Rescue fund wallet address is correct
- [ ] Sufficient MATIC for gas fees
- [ ] Tested on Mumbai testnet first

## Useful Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Deploy to Polygon mainnet
npx hardhat run scripts/deploy.js --network polygon

# Verify contract
npx hardhat verify --network polygon <ADDRESS> <CONSTRUCTOR_ARGS>

# Check contract size
npx hardhat size-contracts
```

## Troubleshooting

### "Insufficient funds for gas"
- Ensure you have enough MATIC in your wallet
- Check current gas prices on [PolygonScan](https://polygonscan.com/gastracker)

### "Nonce too high"
- Reset your MetaMask account: Settings > Advanced > Reset Account

### "Contract verification failed"
- Wait a few minutes and try manual verification
- Ensure you're using the exact same compiler version and settings

## Support

For issues or questions:
- Check [Hardhat Documentation](https://hardhat.org/docs)
- Visit [Polygon Documentation](https://docs.polygon.technology/)
- Join the Hedgehogs community Discord
