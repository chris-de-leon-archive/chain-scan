import * as readline from "readline/promises"
import { Command, Flags } from "@oclif/core"
import * as fs from "node:fs/promises"

export default class Clean extends Command {
  static description = "Deletes the CLI's cache and config directories"

  static override flags = {
    force: Flags.boolean({ default: false }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Clean)

    const configDir = this.config.configDir
    const cacheDir = this.config.cacheDir
    const remover = {
      rmConfigDir: async () => {
        await fs.rm(configDir, { recursive: true, force: true })
      },
      rmCacheDir: async () => {
        await fs.rm(cacheDir, { recursive: true, force: true })
      },
    }

    if (flags.force) {
      await remover.rmConfigDir()
      await remover.rmCacheDir()
      return
    }

    let answer = ""
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })

    answer = await rl.question(`Remove "${configDir}"? (y/n): `)
    if (answer === "y") {
      await remover.rmConfigDir()
      this.log(`Removed "${configDir}"`)
    }

    answer = await rl.question(`Remove "${cacheDir}"? (y/n): `)
    if (answer === "y") {
      await remover.rmCacheDir()
      this.log(`Removed "${cacheDir}"`)
    }

    rl.close()
  }
}
