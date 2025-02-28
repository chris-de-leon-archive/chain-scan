import { formatJSON, FormattedValidationError } from "../../../lib/utils/mod.ts"
import { ChainClient } from "../../../lib/client/mod.ts"
import { ChainType } from "../../../lib/enums/mod.ts"
import { EnumType } from "@cliffy/command"
import { transactions } from "../mod.ts"
import { z } from "zod"

const zOptionsSchema = z.object({
  limit: z.number().int().min(1).default(1),
  chain: z.nativeEnum(ChainType),
  url: z.string().url(),
})

export const list = transactions.command("list")
  .type("chaintype", new EnumType(ChainType))
  .option(
    "-l, --limit [limit:integer]",
    "The maximum number of blocks to scan",
  )
  .option("-c, --chain <chain:chaintype>", "The chain to query")
  .option("-u, --url <url:string>", "The chain URL")
  .action(async (options, ..._args) => {
    const { data: opts, error, success } = zOptionsSchema.safeParse(options)
    if (!success) {
      throw FormattedValidationError(error)
    }

    await ChainClient
      .build(opts.chain, opts)
      .getLatestTransactions(opts.limit)
      .then((res) => console.log(formatJSON(res)))
      .then(() => Deno.exit(0))
  })
