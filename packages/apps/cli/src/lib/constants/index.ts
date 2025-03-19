import { version } from "../version"
import * as path from "node:path"

export const CLI_DIR = version.withPrefix()

export const CACHE_PATH = path.join(CLI_DIR, "local.cache")
export const CACHE_NAME = "chain-scan"
export const CACHE_SIZE = 100
