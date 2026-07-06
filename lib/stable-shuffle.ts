export function stableHash(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number): () => number {
  let state = seed || 1;
  return () => {
    state = Math.imul(state, 1664525) + 1013904223;
    return ((state >>> 0) / 4294967296);
  };
}

export function pickStable<T>(items: T[], seedText: string): T | undefined {
  if (items.length === 0) return undefined;
  return items[stableHash(seedText) % items.length];
}

export function stableShuffle<T>(items: T[], seedText: string): T[] {
  const result = [...items];
  const random = seededRandom(stableHash(seedText));

  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}
