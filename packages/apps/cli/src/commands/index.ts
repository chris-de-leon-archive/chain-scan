import { transactions } from "./transactions"
import { blocks } from "./blocks"

import Version from "./version"
import Paths from "./paths"
import Clean from "./clean"

export default {
  ...transactions,
  ...blocks,
  version: Version,
  paths: Paths,
  clean: Clean,
}
