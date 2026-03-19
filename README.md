# Live Poll dApp

A visually stunning, production-ready dApp featuring a Soroban smart contract deployed on Stellar Testnet. This application boasts a **premium dark-themed glassmorphism Next.js frontend**, demonstrating multi-wallet support, transaction status tracking, and real-time on-chain event updates in a sleek, highly-polished interface.

## 🚀 Smart Contract

**Deployed Address**: `CCYUDN6DSM4YJ3KZ7NSGFSK4UWI76JTCYI6VPVH3WH6MX44T7C2PNB2K`  
**Network**: Stellar Testnet ("Test SDF Network ; September 2015")

### Contract Features
- `vote(option: u32, voter: Address)` - Cast a vote for a poll option
- `get_results()` - Retrieve current poll results
- Anti-double-vote protection via persistent storage
- Contract events emitted on each vote cast

### Storage
- Persistent `Vec<u32>` for vote counts per option
- Per-voter tracking to prevent multiple votes

## 💻 Frontend & UI Overhaul

**Tech Stack**: Next.js 16, React 19, @lumenkit/stellar-wallets, Tailwind CSS 4, Google Fonts (Outfit & JetBrains Mono)

The frontend recently underwent a **major cosmetic overhaul** consisting of:
- **Glassmorphism Design**: Semi-transparent interactive panels with blurred backgrounds.
- **Dynamic Animations**: Floating background orbs, pulse effects on live indicators, and smooth transition widths on vote progress bars.
- **Sleek Typography**: High-contrast, highly legible fonts bridging modern aesthetic with developer-centric monospace accents. 

### Components

#### WalletConnect (`src/components/WalletConnect.tsx`)
- Premium "Connect Wallet" buttons with animated hover states
- Vote buttons (Option A / Option B / Option C)
- Real-time transaction status display with colored success/pending/fail badges
- Sleek error toast notifications for wallet issues, rejection, and insufficient balance

#### ActivityFeed (`src/components/ActivityFeed.tsx`)
- Polls contract events every 5 seconds
- Displays live feedback submissions securely via a stylized monospace event terminal feed
- Auto-updates when new votes are cast

## ✅ Transaction Proof

```
https://stellar.expert/explorer/testnet/tx/9b220fbf5e2c268403830452d08d1de3e5586eee25371a543ec234ad604a83c3
```

**Status**: ✅ Success  

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Stellar CLI (for contract management)
- A funded Stellar testnet account

### Installation

```bash
cd contracts/hello-world
stellar contract build

cd ../../live-poll-ui
npm install
npm run dev

# Open http://localhost:3000 in your browser to experience the premium UI
```

## 📋 Level 2 Submission Checklist

- [x] Soroban smart contract deployed to testnet
- [x] Multi-wallet integration (LumenKit: Freighter, Albedo, and 8+ others)
- [x] Contract called from frontend (vote function)
- [x] Transaction status visible (pending/success/failed)
- [x] Error handling for 3+ scenarios
- [x] Real-time updates via contract events
- [x] Live activity feed polling events every 5 seconds
- [x] 2+ meaningful Git commits
- [x] README with contract address and proof
- [x] Premium Frontend UI Upgrade

## 🎯 Git Commits

```
commit 1: feat: add multi-wallet connection using StellarWalletsKit
commit 2: feat: add real-time contract event listener and live feed
commit 3: fix: simplify contract/events for demo ui - server running
commit 4: style: complete dark glassmorphic ui overhaul
```

## 🎨 Wallets

Supported via LumenKit: Freighter, Albedo, Rabet, LOBSTR, xBull, WalletConnect, Ledger, Trezor.

---

**Status**: ✅ Level 2 Complete - Production Ready