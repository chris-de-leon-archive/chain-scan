// https://oclif.io/docs/configuring_your_cli

/** @type {import('@oclif/core').Config} */
const config = {
  topicSeparator: " ",
  dirname: "chain-scan",
  bin: "cs",
  topics: {
    transactions: { description: "commands for reading transaction data" },
    blocks: { description: "commands for reading block data" },
  },
  commands: {
    strategy: "explicit",
    target: "./src/commands/index.ts",
  },
}

module.exports = config
