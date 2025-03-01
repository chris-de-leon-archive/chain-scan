import { Args, Command, Flags } from "@oclif/core"
import { ChainClient } from "../../lib/client"
import { formatJSON } from "../../lib/utils"
import { ChainType } from "../../lib/enums"
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
    const chainUrl = { url: flags.url.href }

    await ChainClient.build(chainType, chainUrl)
      .getBlockByHeight(args.height)
      .then((res) => this.log(formatJSON(res)))
  }
}
