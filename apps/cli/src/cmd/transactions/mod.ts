import { Command } from "@cliffy/command"
import { root } from "../mod.ts"

export const transactions = new Command().action(() => {
  transactions.showHelp()
})

root.command("transactions", transactions)
