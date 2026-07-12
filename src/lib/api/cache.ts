const cache = new Map<string, unknown>();

export async function cachedFetch<T>(url: string): Promise<T> {
  if (cache.has(url)) {
    return cache.get(url) as T;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${url}`);
  const data: T = await res.json();
  cache.set(url, data);
  return data;
}
