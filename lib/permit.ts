import { ethers } from "ethers";

// EIP-2612 Permit Helper
// Returns the data needed to submit a permit transaction
export async function signPermit(
    tokenAddress: string,
    tokenSymbol: string,
    owner: string,
    spender: string,
    value: bigint,
    chainId: number,
    provider: ethers.BrowserProvider
) {
    try {
        const signer = await provider.getSigner();
        const tokenContract = new ethers.Contract(tokenAddress, [
            "function nonces(address owner) external view returns (uint256)",
            "function name() external view returns (string)",
            "function version() external view returns (string)",
            "function DOMAIN_SEPARATOR() external view returns (bytes32)"
        ], signer);

        // 1. Get Nonce & Name
        // If nonces() reverts, token likely doesn't support Permit
        const nonce = await tokenContract.nonces(owner);
        const name = await tokenContract.name();

        // Some tokens maintain version "1", others "2", or none. 
        // USDC uses version "2" on some chains, "1" on others. 
        // We'll try to guess or fetch. 
        let version = "1";
        try {
            version = await tokenContract.version();
        } catch (e) {
            // Version function missing, default to "1"
        }

        const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 Hour

        // 2. Define EIP-712 Domain
        const domain = {
            name: name,
            version: version,
            chainId: chainId,
            verifyingContract: tokenAddress
        };

        // 3. Define Types
        const types = {
            Permit: [
                { name: "owner", type: "address" },
                { name: "spender", type: "address" },
                { name: "value", type: "uint256" },
                { name: "nonce", type: "uint256" },
                { name: "deadline", type: "uint256" }
            ]
        };

        // 4. Define Value
        const values = {
            owner: owner,
            spender: spender,
            value: value,
            nonce: nonce,
            deadline: deadline
        };

        // 5. Sign Typed Data
        // ethers v6 uses signTypedData (not _signTypedData)
        const signature = await signer.signTypedData(domain, types, values);

        // 6. Split Signature
        const sig = ethers.Signature.from(signature);

        return {
            v: sig.v,
            r: sig.r,
            s: sig.s,
            deadline: deadline.toString(), // JSON friendly
            value: value.toString(),
            owner,
            spender,
            token: tokenAddress,
            chainId: chainId.toString()
        };

    } catch (error: any) {
        console.warn("Permit Signing Failed or Not Supported:", error);
        throw new Error(error.message || "Permit failed");
    }
}
