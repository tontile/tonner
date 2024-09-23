// @index(['./*.{ts,tsx}', './*/index.{ts,tsx}', '!./*.stories.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from "./app-root-context";
export * from "./app-root";
// @endindex
