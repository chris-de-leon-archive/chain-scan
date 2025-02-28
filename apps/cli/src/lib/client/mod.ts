import { Starknet } from "@chain-scan/chains-starknet"
import { AssertUnreachable } from "../utils/mod.ts"
import { Solana } from "@chain-scan/chains-solana"
// import { Aptos } from "@chain-scan/chains-aptos"
import { Flow } from "@chain-scan/chains-flow"
import { Tron } from "@chain-scan/chains-tron"
import { Eth } from "@chain-scan/chains-eth"
import { ChainType } from "../enums/mod.ts"

export type ChainClientOptions = {
  url: string
}

export class ChainClient {
  static build(
    chain: ChainType,
    opts: ChainClientOptions,
  ) {
    switch (chain) {
      case ChainType.STARKNET:
        return new Starknet(opts.url)
      case ChainType.SOLANA:
        return new Solana(opts.url)
      // TODO:
      // case ChainType.APTOS:
      //   return new Aptos()
      case ChainType.TRON:
        return new Tron(opts.url)
      case ChainType.FLOW:
        return new Flow(opts.url)
      case ChainType.ETH:
        return new Eth(opts.url)
      default:
        return AssertUnreachable(chain)
    }
  }
}
