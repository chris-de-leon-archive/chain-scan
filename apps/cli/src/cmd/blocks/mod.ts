import { Command } from "@cliffy/command"
import { root } from "../mod.ts"

export const blocks = new Command().action(() => {
  blocks.showHelp()
})

root.command("blocks", blocks)
