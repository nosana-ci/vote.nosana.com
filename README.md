# Nosana Voting UI

A web application for voting on Nosana Network Proposals (NNP). This application allows eligible NOS token holders and stakers to cast their votes on governance proposals using their Solana wallets.

## Overview

This is a Nuxt.js-based voting interface that enables token holders to participate in on-chain governance decisions. The current implementation supports voting on NNP-0001 Tokenomics proposal.

## Features

- Solana wallet integration for secure authentication
- Real-time voting status tracking (upcoming, active, ended)
- Voting power calculation based on token holdings and stake at snapshot
- Vote casting with Yes/No options
- Results display after voting period ends
- Responsive design using Bulma CSS framework

## Tech Stack

- **Framework**: Nuxt 4
- **Language**: TypeScript
- **Styling**: Bulma CSS, Sass
- **Blockchain**: Solana
- **Fonts**: Google Fonts (Outfit, Space Grotesk)

## Prerequisites

- Node.js 22 or higher
- npm, pnpm, yarn, or bun package manager

## Installation

Install project dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Building for Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Preview the production build locally:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

## Configuration

The application configuration is managed in `nuxt.config.ts`. Key runtime configuration options include:

- `network`: Solana network (mainnet/devnet)
- `apiUrl`: Voting distributor API endpoint
- `yesAddress`: Solana address for "Yes" votes
- `noAddress`: Solana address for "No" votes
- `snapshotIso`: Snapshot timestamp for eligibility determination

## Project Structure

```
voting-ui/
├── app/              # Nuxt application directory
│   └── pages/        # Vue page components
├── static/           # Static assets
├── nuxt.config.ts    # Nuxt configuration
├── package.json      # Dependencies and scripts
└── tsconfig.json     # TypeScript configuration
```

## Deployment

The build output is generated in `.output/public` directory.

For more information on Nuxt deployment, see the [Nuxt deployment documentation](https://nuxt.com/docs/getting-started/deployment).

## License

This project is private and proprietary.
