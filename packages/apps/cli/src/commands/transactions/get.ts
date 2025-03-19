import { buildChainClient } from "../../lib/client"
import { Args, Command, Flags } from "@oclif/core"
import { formatJSON } from "../../lib/utils"
import { ChainType } from "../../lib/enums"
import { cache } from "../../lib/cache"
import { z } from "zod"

export default class TransactionsGet extends Command {
  static description = "Gets a transaction by its ID"

  static override flags = {
    chain: Flags.string({ options: Object.values(ChainType), required: true }),
    url: Flags.url({ required: true }),
  }

  static override args = {
    id: Args.string({ required: true }),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(TransactionsGet)

    const chainType = z.nativeEnum(ChainType).parse(flags.chain)
    const chainOpts = { url: flags.url.href }

    const client = await buildChainClient(chainType, chainOpts)
    await cache
      .setdir(this.config.cacheDir)
      .connect(client)
      .getTransactionByID(args.id)
      .then((res) => this.logJson(formatJSON(res)))
  }
}
