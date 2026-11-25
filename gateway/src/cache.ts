interface CacheEntry {
  status: number;
  contentType: string;
  body: Buffer;
  expiresAt: number;
}

class MemoryCache {
  private store = new Map<string, CacheEntry>();

  get(key: string): CacheEntry | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry;
  }

  set(key: string, entry: Omit<CacheEntry, "expiresAt">, ttlMs: number): void {
    this.store.set(key, {
      ...entry,
      expiresAt: Date.now() + ttlMs,
    });
  }

  clearAll(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

export const gatewayCache = new MemoryCache();
