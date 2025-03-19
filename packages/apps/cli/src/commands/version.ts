import { Command, Flags } from "@oclif/core"
import { version } from "../lib/version"

export default class Version extends Command {
  static description = "Gets the current CLI version"

  static override flags = {
    withoutPrefix: Flags.boolean({ default: false }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Version)
    if (flags.withoutPrefix) {
      this.log(version.withoutPrefix())
    } else {
      this.log(version.withPrefix())
    }
  }
}
