export const toString = (buf: Uint8Array) => {
  const s = Buffer.from(buf).toString("hex")
  return {
    withoutPrefix: () => withoutPrefix(s),
    withPrefix: () => withPrefix(s),
  }
}

export const toBuffer = (s: string) => {
  return Buffer.from(withoutPrefix(s), "hex")
}

export const withoutPrefix = (s: string) => {
  return s.startsWith("0x") ? s.slice(2) : s
}

export const withPrefix = (s: string) => {
  return s.startsWith("0x") ? s : "0x".concat(s)
}
