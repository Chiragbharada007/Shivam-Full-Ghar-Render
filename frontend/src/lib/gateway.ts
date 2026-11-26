const GATEWAY_BASE = (
  process.env.GATEWAY_URL ||
  process.env.NEXT_PUBLIC_GATEWAY_URL ||
  "http://localhost:4000"
).replace(/\/+$/, "");

export async function gatewayFetch<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T | null> {
  const url = path.startsWith("http") ? path : `${GATEWAY_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      ...options,
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function getGatewayUrl(): string {
  return GATEWAY_BASE;
}
