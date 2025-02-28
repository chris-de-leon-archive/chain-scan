import { formatJSON, FormattedValidationError } from "../../../lib/utils/mod.ts"
import { ChainClient } from "../../../lib/client/mod.ts"
import { ChainType } from "../../../lib/enums/mod.ts"
import { EnumType } from "@cliffy/command"
import { blocks } from "../mod.ts"
import { z } from "zod"

const zOptionsSchema = z.object({
  chain: z.nativeEnum(ChainType),
  url: z.string().url(),
})

// NOTE: for Solana, pass in the slot number not the block height
export const get = blocks
  .command("get")
  .type("chaintype", new EnumType(ChainType))
  .option("-c, --chain <chain:chaintype>", "The chain to query")
  .option("-u, --url <url:string>", "The chain URL")
  .arguments("[height:integer]")
  .action(async (options, ...args) => {
    const [height] = args

    const { data: opts, error, success } = zOptionsSchema.safeParse(options)
    if (!success) {
      throw FormattedValidationError(error)
    }

    await ChainClient
      .build(opts.chain, opts)
      .getBlockByHeight(height)
      .then((res) => console.log(formatJSON(res)))
      .then(() => Deno.exit(0))
  })
