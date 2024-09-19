export function createTags(strings: string[]): string[] {
  return strings.map((_, index) => strings.slice(0, index + 1).join(":"));
}
