import { unstable_cache } from "next/cache";
import { parse, stringify } from "superjson";

type CacheConfig = {
  revalidate: number;
  tags: string[];
};

export async function createUnstableCache<T>(
  fn: () => Promise<T>,
  keyParts: string[] = [],
  options: CacheConfig = { revalidate: 180, tags: [] },
  enabled = true,
): Promise<T> {
  if (process.env.TONNER_CACHE === "true" && enabled) {
    const cacheKey = [...keyParts].join(":");

    const cachedFn = unstable_cache(
      async () => {
        const result = await fn();
        // Serialize data using SuperJSON before caching
        const serializedResult = stringify(result);
        return serializedResult;
      },
      [cacheKey],
      options,
    );

    const cachedResult = await cachedFn();

    // Deserialize data using SuperJSON after retrieving from cache
    const deserializedResult = parse(cachedResult);
    return deserializedResult as T;
  }

  // If caching is not enabled, just call the function
  return await fn();
}
