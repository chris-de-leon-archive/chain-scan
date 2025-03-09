import { ChainType } from './enums'

export const chains = [
	{
		name: 'Ethereum',
		type: ChainType.ETH,
		img: 'ethereum-logo.svg',
		description:
			'Ethereum is an open-source blockchain that enables the use of smart contracts and decentralized applications (dApps). Launched in 2015, Ethereum has significantly contributed to the adoption of blockchain technology by providing a platform for developers to build and deploy dApps',
		datasources: [
			// TODO: add more

			// https://docs.arbitrum.io/build-decentralized-apps/reference/node-providers
			{ name: 'Arbitrum One', url: 'https://arb1.arbitrum.io/rpc' },
			{ name: 'Arbitrum Nova', url: 'https://nova.arbitrum.io/rpc' },
			{ name: 'Arbitrum Sepolia', url: 'https://sepolia-rollup.arbitrum.io/rpc' },

			// https://docs.moonbeam.network/builders/get-started/quick-start/
			{ name: 'Moonbeam', url: 'https://moonbeam.public.blastapi.io' },
		],
	},
	{
		name: 'Solana',
		type: ChainType.SOLANA,
		img: 'solana-logo.svg',
		description:
			'Solana is a blockchain platform designed to host decentralized, scalable applications. Founded in 2017, it is an open-source project currently run by the Solana Foundation based in Geneva, while the blockchain was built by San Francisco-based Solana Labs.',
		datasources: [
			// https://solana.com/docs/references/clusters#on-a-high-level
			{ name: 'Solana Devnet', url: 'https://api.devnet.solana.com' },
			{ name: 'Solana Testnet', url: 'https://api.testnet.solana.com' },
			{ name: 'Solana Mainet Beta', url: 'https://api.mainnet-beta.solana.com' },
		],
	},
	{
		name: 'Flow',
		type: ChainType.FLOW,
		img: 'flow-logo.svg',
		description:
			'Flow is a proof of stake blockchain designed to be the foundation of Web3 and the open metaverse, supporting consumer-scale decentralized applications, NFTs, DeFi, DAOs, PFP projects, and more. Powered by Cadence, an original programming language built specifically for digital assets, Flow empowers developers to innovate and push the limits that will bring the next billion to Web3.',
		datasources: [
			// https://developers.flow.com/networks/flow-networks
			{ name: 'Flow Testnet', url: 'https://testnet.onflow.org' },
			{ name: 'Flow Mainnet', url: 'https://mainnet.onflow.org' },
		],
	},
	{
		name: 'Aptos',
		type: ChainType.APTOS,
		img: 'aptos-logo.svg',
		description:
			'Aptos (APT) is a fast and scalable layer-one Proof-of-Stake (PoS) blockchain designed to provide high transaction speeds, security, and ease of use. It was founded by former Meta employees and utilizes the Move programming language, which ensures the integrity and control of digital assets. Aptos aims to support decentralized finance (DeFi) projects, non-fungible tokens (NFTs), and other applications, with a focus on speed, security, and scalability.',
		datasources: [
			// https://aptos.dev/en/network/nodes/networks
			{ name: 'Aptos Devnet', url: 'https://api.devnet.aptoslabs.com/v1' },
			{ name: 'Aptos Testnet', url: 'https://api.testnet.aptoslabs.com/v1' },
			{ name: 'Aptos Mainnet', url: 'https://api.mainnet.aptoslabs.com/v1' },
		],
	},
	{
		name: 'Tron',
		type: ChainType.TRON,
		img: 'tron-logo.svg',
		description:
			'Tron is a decentralized, proof-of-stake blockchain with smart contract functionality. It was founded in March 2014 by Justin Sun and since 2017 has been overseen and supervised by the TRON Foundation, a non-profit organization in Singapore, established in the same year. It is open-source software.',
		datasources: [
			// https://www.trongrid.io/documents
			{ name: 'Tron Shasta Testnet', url: 'https://api.shasta.trongrid.io' },
			{ name: 'Tron Nile Testnet', url: 'https://nile.trongrid.io' },

			// https://tron-rpc.publicnode.com/
			{ name: 'Tron Mainnet', url: 'https://tron-rpc.publicnode.com' },
		],
	},
	{
		name: 'Starknet',
		type: ChainType.STARKNET,
		img: 'starknet-logo.svg',
		description:
			'Starknet is a Validity-Rollup (aka ZK-Rollup) Layer 2 network that operates on top of Ethereum, enabling dApps to massively scale without compromising on security. It achieves this by bundling transactions into an off-chain computed STARK proof. This proof is then submitted to Ethereum as a single transaction, resulting in significantly higher throughput, faster processing times, and much lower costs, all while retaining the robust security of the Ethereum settlement layer.',
		datasources: [
			// https://blastapi.io/public-api/starknet
			{ name: 'Starknet Sepolia', url: 'https://starknet-sepolia.public.blastapi.io' },
			{ name: 'Starknet Mainnet', url: 'https://starknet-mainnet.public.blastapi.io' },
		],
	},
]
