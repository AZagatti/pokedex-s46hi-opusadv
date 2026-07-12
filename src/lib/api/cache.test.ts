import { describe, it, expect, vi, beforeEach } from "vitest";
import { cachedFetch } from "./cache.js";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("cachedFetch", () => {
  it("fetches and returns data", async () => {
    const mockData = { name: "pikachu" };
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    } as Response);

    const result = await cachedFetch<{ name: string }>("https://example.com/test-1");
    expect(result).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("returns cached data on second call", async () => {
    const mockData = { name: "bulbasaur" };
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    } as Response);

    const url = "https://example.com/test-cache-hit";
    await cachedFetch<{ name: string }>(url);
    await cachedFetch<{ name: string }>(url);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("throws on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 404,
    } as Response);

    await expect(cachedFetch("https://example.com/test-error")).rejects.toThrow(
      "Fetch failed: 404",
    );
  });
});
