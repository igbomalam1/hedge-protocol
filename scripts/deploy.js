const hre = require("hardhat");
require("dotenv").config({ path: ".env.local" });

async function main() {
    console.log("🦔 Deploying HOGS Token to Polygon...\n");

    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString(), "wei\n");

    // Set rescue fund wallet (use deployer address if not specified)
    const rescueFundWallet = process.env.RESCUE_FUND_WALLET || deployer.address;
    console.log("Rescue Fund Wallet:", rescueFundWallet, "\n");

    // Deploy the token
    console.log("Deploying HedgehogsToken contract...");
    const HedgehogsToken = await hre.ethers.getContractFactory("HedgehogsToken");
    const token = await HedgehogsToken.deploy(rescueFundWallet);

    await token.waitForDeployment();
    const tokenAddress = await token.getAddress();

    console.log("\n✅ HOGS Token deployed successfully!");
    console.log("📍 Contract Address:", tokenAddress);
    console.log("🔗 View on PolygonScan:", `https://polygonscan.com/address/${tokenAddress}`);

    // Get token details
    const name = await token.name();
    const symbol = await token.symbol();
    const totalSupply = await token.totalSupply();
    const decimals = await token.decimals();

    console.log("\n📊 Token Details:");
    console.log("   Name:", name);
    console.log("   Symbol:", symbol);
    console.log("   Decimals:", decimals.toString());
    console.log("   Total Supply:", hre.ethers.formatEther(totalSupply), symbol);

    console.log("\n⏳ Waiting for block confirmations...");
    await token.deploymentTransaction().wait(6); // Wait for 6 confirmations

    console.log("\n🔍 Verifying contract on PolygonScan...");
    try {
        await hre.run("verify:verify", {
            address: tokenAddress,
            constructorArguments: [rescueFundWallet],
        });
        console.log("✅ Contract verified successfully!");
    } catch (error) {
        console.log("⚠️  Verification failed:", error.message);
        console.log("   You can verify manually later using:");
        console.log(`   npx hardhat verify --network polygon ${tokenAddress} ${rescueFundWallet}`);
    }

    console.log("\n📝 Next Steps:");
    console.log("1. Update .env.local with:");
    console.log(`   NEXT_PUBLIC_HOGS_TOKEN_ADDRESS=${tokenAddress}`);
    console.log("2. Add liquidity to a DEX (QuickSwap, Uniswap, etc.)");
    console.log("3. Deploy the staking contract");
    console.log("4. Update the staking contract address in the token contract");
    console.log("\n🎉 Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
