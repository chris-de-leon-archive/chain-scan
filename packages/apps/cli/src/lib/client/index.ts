import type { Chain } from "@chain-scan/types"
import { AssertUnreachable } from "../utils"
import { ChainType } from "../enums"

export interface ChainClientOptions {
  url: string
}

export const buildChainClient = async (
  chain: ChainType,
  opts: ChainClientOptions,
): Promise<Chain<unknown, unknown>> => {
  switch (chain) {
    case ChainType.STARKNET:
      return await import("@chain-scan/chains-starknet").then(
        ({ Starknet }) => new Starknet(opts.url),
      )
    case ChainType.SOLANA:
      return await import("@chain-scan/chains-solana").then(
        ({ Solana }) => new Solana(opts.url),
      )
    case ChainType.APTOS:
      return await import("@chain-scan/chains-aptos").then(
        ({ Aptos }) => new Aptos(opts.url),
      )
    case ChainType.TRON:
      return await import("@chain-scan/chains-tron").then(
        ({ Tron }) => new Tron(opts.url),
      )
    case ChainType.FLOW:
      return await import("@chain-scan/chains-flow").then(
        ({ Flow }) => new Flow(opts.url),
      )
    case ChainType.ETH:
      return await import("@chain-scan/chains-eth").then(
        ({ Eth }) => new Eth(opts.url),
      )
    default:
      return AssertUnreachable(chain)
  }
}
