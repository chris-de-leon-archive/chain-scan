# Chain Scan

## Archive Notice

Chain Scan is a universal block explorer for both EVM and non-EVM chains. Users can log into the app, connect to one or more chains, and explore both the block and transaction data for the chains that they connected to. There is also a corresponding CLI tool provided as well in case users prefer more of a lower-level experience. While there are several parts missing, the app comes with authentication baked in and out-of-the-box support for several popular EVM and non-EVM chains. There were also thoughts of eventually adding a dashboard feature as well so that users can create their own visualizations (similar to Grafana but geared more towards blockchain).

For now, I've decided to pause development on this project due to work. This app was mostly meant to be an experiment with some new tools that I've been meaning to learn: BetterAuth, Svelte, and Bun. The overall developer experience was very pleasant for all these tools and I can see myself using both of them more in the future.

## Setup

1. Enter a Nix shell

   ```sh
   nix develop
   ```

1. Install dependencies

   ```sh
   bun install
   ```

## CLI

1. Navigate to `./packages/apps/cli`

1. The CLI can be invoked using:

   ```sh
   bun run dev
   ```

1. A production build can be created using:

   ```sh
   bun run build
   ```

## Web UI

1. Navigate to `./packages/apps/web`

1. Create a `.env` file with the following format:

   ```text
   PUBLIC_BETTER_AUTH_URL="http://127.0.0.1:5173"
   BETTER_AUTH_SECRET="..."
   DATABASE_URL="local.db"
   CACHE_NAME="chain-scan"
   CACHE_URL="local.cache"
   CACHE_LIM=1000
   ```

1. Setup the DB:

   ```sh
   bun run db:init
   ```

1. Start the app:

   ```sh
   bun run dev --host=0.0.0.0
   ```

1. Make an account and sign into the app to explore
