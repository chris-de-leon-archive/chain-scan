import { Args, Command, Flags } from "@oclif/core"
import { ChainClient } from "../../lib/client"
import { formatJSON } from "../../lib/utils"
import { ChainType } from "../../lib/enums"
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
    const chainUrl = { url: flags.url.href }

    await ChainClient.build(chainType, chainUrl)
      .getTransactionByID(args.id)
      .then((res) => this.log(formatJSON(res)))
  }
}
