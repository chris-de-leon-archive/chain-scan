import { ValidationError } from "@cliffy/command"
import { encodeHex } from "@std/encoding/hex"
import type { ZodError } from "zod"

export const AssertUnreachable = (v: never) => {
  throw new Error(`unreachable check failed: ${v}`)
}

export const FormattedValidationError = <T>(err: ZodError<T>) => {
  const issue = err.issues.at(0)
  return new ValidationError(
    issue != null
      ? JSON.stringify({
        code: issue.code,
        message: issue.message,
        path: issue.path.join("."),
      })
      : err.message,
    { exitCode: 1 },
  )
}

export const formatJSON = (
  obj: unknown,
) => {
  return JSON.stringify(
    obj,
    (_, v) => {
      switch (typeof v) {
        case "bigint":
          return v.toString()
        case "object":
          if (v instanceof Uint8Array) {
            return "0x".concat(encodeHex(v))
          } else {
            return v
          }
        default:
          return v
      }
    },
    2,
  )
}
