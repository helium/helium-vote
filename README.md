# Helium Vote

Governance and voting for the Helium Network. Lock HNT to create vote escrow positions (veHNT), then vote on HIPs and HRPs. Delegating veHNT to MOBILE or IOT earns staking rewards and drives HNT emissions allocation.

Built with Next.js, Solana, and the Helium modular governance programs.

## Getting Started

```sh
yarn install
cp .env.sample .env
```

Configure your `.env`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SOLANA_URL` | Solana RPC endpoint |
| `NEXT_PUBLIC_HELIUM_VOTE_URI` | Helium vote service API URL |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID from [dashboard.walletconnect.com](https://dashboard.walletconnect.com) |

Then:

```sh
yarn dev
```

## Proposals

Proposals live in `helium-proposals.json`. To add one, open a PR with a new entry. Each entry references an on-chain proposal key and a gist URI with the vote summary markdown.

## Local Development (with proxies)

For most frontend work, pointing `NEXT_PUBLIC_SOLANA_URL` and `NEXT_PUBLIC_HELIUM_VOTE_URI` at mainnet is sufficient. For localnet, the vote service, and proxy testing, see [helium-program-library](https://github.com/helium/helium-program-library).
