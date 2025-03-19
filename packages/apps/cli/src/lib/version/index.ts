const v = "1.0.0"

export const version = {
  withoutPrefix: () => v,
  withPrefix: () => `v${v}`,
}
