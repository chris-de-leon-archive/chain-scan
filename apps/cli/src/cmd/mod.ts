import { Command } from "@cliffy/command"

export const root = new Command()
  .name("cs")
  .version("0.0.1")
  .description("Query the data of any blockchain using a single CLI tool")
  .action(() => {
    root.showHelp()
  })
