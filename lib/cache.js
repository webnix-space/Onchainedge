const cache = new Map();

export function getCached(key, ttl = 60_000) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.time > ttl) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

export function setCached(key, data) {
  cache.set(key, { data, time: Date.now() });
}
