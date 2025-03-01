export const AssertUnreachable = (v: never) => {
  throw new Error(`unreachable check failed: ${v}`)
}

export const formatJSON = (obj: unknown) => {
  return JSON.stringify(
    obj,
    (_, v) => {
      switch (typeof v) {
        case "bigint":
          return v.toString()
        case "object":
          if (v instanceof Uint8Array) {
            return "0x".concat(Buffer.from(v).toString("hex"))
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
