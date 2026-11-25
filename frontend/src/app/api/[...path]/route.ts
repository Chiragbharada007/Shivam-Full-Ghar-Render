import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = (process.env.GATEWAY_URL || process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:4000").replace(
  /\/+$/,
  ""
);

async function proxyRequest(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const subPath = path.join("/");
  const search = req.nextUrl.search || "";
  const targetUrl = `${GATEWAY_URL}/api/${subPath}${search}`;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (lower !== "host" && lower !== "content-length") {
      headers.set(key, value);
    }
  });

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.arrayBuffer() : undefined;

  try {
    const upstream = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: body && body.byteLength > 0 ? body : undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const ct = upstream.headers.get("content-type");
    if (ct) responseHeaders.set("content-type", ct);
    const setCookie = upstream.headers.get("set-cookie");
    if (setCookie) responseHeaders.set("set-cookie", setCookie);
    const disp = upstream.headers.get("content-disposition");
    if (disp) responseHeaders.set("content-disposition", disp);

    const buf = await upstream.arrayBuffer();
    return new NextResponse(buf, {
      status: upstream.status,
      headers: responseHeaders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Express Gateway unreachable", error: err?.message },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
