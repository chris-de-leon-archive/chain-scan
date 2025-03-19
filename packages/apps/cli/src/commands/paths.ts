import { CLI_DIR } from "../lib/constants"
import { Command } from "@oclif/core"
import * as path from "node:path"

export default class Paths extends Command {
  static description =
    "Prints the path to the CLI's config and cache directories"

  public async run(): Promise<void> {
    this.logJson(
      JSON.stringify(
        {
          config: path.join(this.config.configDir, CLI_DIR),
          cache: path.join(this.config.cacheDir, CLI_DIR),
        },
        null,
        2,
      ),
    )
  }
}
