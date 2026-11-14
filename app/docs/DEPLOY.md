# DEPLOYMENT & OPERATION CHECKLIST: RAGA PROTOCOL

> **Environment**: NEAR Testnet  
> **Prerequisites**: Rust 1.76+, `cargo-near` 0.6+, Node.js 18+, `near-cli-rs`

---

## 1. Rust Smart Contract Deployment

### Step 1: Toolchain Verification
Ensure your environment has the `wasm32-unknown-unknown` target installed:

```bash
rustup target add wasm32-unknown-unknown
cargo near --version
```

### Step 2: Build & Optimize Wasm Binary
Navigate to `contracts/` and build the contract binary:

```bash
cd contracts
cargo near build non-reproducible-wasm
```

This generates `target/wasm32-unknown-unknown/release/raga_contracts.wasm` with size optimized under 250 KB.

### Step 3: Deploy to NEAR Testnet
Deploy the compiled Wasm to the protocol account:

```bash
near deploy raga-protocol-mw93m309.testnet \
  target/wasm32-unknown-unknown/release/raga_contracts.wasm
```

### Step 4: Contract Initialization (`new`)
Initialize the contract state with metadata and root owner:

```bash
near call raga-protocol-mw93m309.testnet new '{
  "owner_id": "raga-protocol-mw93m309.testnet",
  "metadata": {
    "spec": "nft-1.0.0",
    "name": "RAGA Autonomous AI Agents",
    "symbol": "RAGA",
    "icon": null,
    "base_uri": null,
    "reference": null,
    "reference_hash": null
  }
}' --accountId raga-protocol-mw93m309.testnet
```

---

## 2. Storage Staking & Account Economics

NEAR Protocol enforces a storage-staking model where accounts must stake approximately $1 \text{ NEAR}$ per $100 \text{ KB}$ of on-chain state.

### Storage Allocation Guidelines
- **Contract Code & Core State**: $\sim 3.5 \text{ NEAR}$ minimum balance maintained in `raga-protocol-mw93m309.testnet`.
- **Per-Agent Storage Cost**: $\approx 0.015 \text{ NEAR}$ per minted agent token (covers `TokenMetadata`, sub-account references, and approval entries).
- **Sub-Account Creation Reserve**: When creating `<token_id>.raga-protocol-...`, allocate at least $0.05 \text{ NEAR}$ initial transfer to cover the sub-account's native storage footprint.

---

## 3. Worker Daemon Deployment (`worker-daemon`)

The worker daemon runs as an autonomous service responsible for background workload attestation and telemetry heartbeat.

### Step 1: Configure Environment Variables
Inside `worker-daemon/`, create `.env`:

```env
NEAR_NETWORK=testnet
NEAR_NODE_URL=https://rpc.testnet.near.org
NEAR_FALLBACK_URL=https://near-testnet.drpc.org
CONTRACT_ID=raga-protocol-mw93m309.testnet
OPERATOR_ACCOUNT_ID=raga-operator-mw94dqty.testnet
OPERATOR_PRIVATE_KEY=ed25519:...
POLL_INTERVAL_MS=15000
```

### Step 2: Build & Execute Daemon
```bash
cd worker-daemon
npm install
npm run build
npm run start
```

### Step 3: PM2 Process Management (Production Deployment)
```bash
npm install -g pm2
pm2 start dist/worker.js --name "raga-worker-daemon"
pm2 save
pm2 startup
```

---

## 4. Next.js Frontend Deployment on Vercel

The frontend dApp is built with Next.js 14 App Router and is fully deployable to **Vercel** with zero external database dependencies.

### Step 1: Import to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New... -> Project"**.
2. Select your public GitHub repository (`raga-nearhack`).
3. In the **"Configure Project"** screen:
   - **Root Directory**: Click **Edit** and select **`app`**.
   - **Framework Preset**: Vercel automatically detects **Next.js**.
   - **Build Command**: `next build` (default).
   - **Output Directory**: `.next` (default).

### Step 2: Environment Variables (Optional)
The dApp comes with working defaults pre-configured in `near.config.ts`. If you wish to override the RPC provider or network, you can optionally set:

```env
NEXT_PUBLIC_NEAR_NETWORK=testnet
NEXT_PUBLIC_NEAR_NODE_URL=https://near-testnet.drpc.org
NEXT_PUBLIC_CONTRACT_ID=raga-protocol-mw93m309.testnet
```

### Step 3: Deploy
Click **"Deploy"**. Within ~60 seconds, your dApp will be live with a global CDN URL (e.g. `https://raga-protocol.vercel.app`). All on-chain functions, NEAR RPC proxies, cryptographic proof generation, and documentation pages will function 100% out of the box.

---

## 5. Local Execution Alternative (`app`)

---

## 5. Verification & Health Check Script

Run the automated verification suite to confirm connectivity across all system components:

```bash
# 1. Verify contract response & agent supply
near view raga-protocol-mw93m309.testnet nft_total_supply '{}'

# 2. Verify registered agent tokens
near view raga-protocol-mw93m309.testnet nft_tokens '{"from_index": "0", "limit": 10}'

# 3. Test RPC proxy health endpoint
curl http://localhost:3001/api/rpc -X POST -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"health","method":"status","params":[]}'
```
