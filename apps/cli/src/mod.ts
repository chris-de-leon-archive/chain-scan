import "./cmd/transactions/init.ts"
import "./cmd/blocks/init.ts"

if (import.meta.main) {
  const { root } = await import("./cmd/mod.ts")
  await root.parse(Deno.args)
}
