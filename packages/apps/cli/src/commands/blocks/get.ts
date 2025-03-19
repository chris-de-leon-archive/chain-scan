import { buildChainClient } from "../../lib/client"
import { Args, Command, Flags } from "@oclif/core"
import { formatJSON } from "../../lib/utils"
import { ChainType } from "../../lib/enums"
import { cache } from "../../lib/cache"
import { z } from "zod"

export default class BlocksGet extends Command {
  static description = "Gets a block by its height (or slot number for Solana)"

  static override flags = {
    chain: Flags.string({ options: Object.values(ChainType), required: true }),
    url: Flags.url({ required: true }),
  }

  static override args = {
    height: Args.integer({ required: false }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(BlocksGet)

    const chainType = z.nativeEnum(ChainType).parse(flags.chain)
    const chainOpts = { url: flags.url.href }

    const client = await buildChainClient(chainType, chainOpts)
    await cache
      .setdir(this.config.cacheDir)
      .connect(client)
      .getBlockByNumber(args.height)
      .withTransactions()
      .then((res) => this.logJson(formatJSON(res)))
  }
}
