import { NextRequest, NextResponse } from "next/server";

const RPC_ENDPOINTS = [
  "https://near-testnet.drpc.org",
  "https://test.rpc.fastnear.com",
  "https://rpc.testnet.near.org",
];

async function fetchWithTimeout(url: string, bodyJson: string, timeoutMs = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: bodyJson,
      signal: controller.signal,
    });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(req: NextRequest) {
  const errors: any[] = [];
  try {
    const body = await req.json();
    const bodyString = JSON.stringify(body);

    for (const endpoint of RPC_ENDPOINTS) {
      // Try each endpoint with up to 2 attempts for the primary endpoint
      const maxAttempts = endpoint === RPC_ENDPOINTS[0] ? 2 : 1;

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          const response = await fetchWithTimeout(endpoint, bodyString, 8000);
          const status = response.status;
          const text = await response.text();

          let data: any;
          try {
            data = JSON.parse(text);
          } catch {
            data = text;
          }

          if (response.ok) {
            // Check for rate limits or deprecated notifications in JSON-RPC payload
            if (!data.error || (data.error.code !== -429 && data.error.code !== 403)) {
              return NextResponse.json(data);
            }
          }

          errors.push({ endpoint, attempt, status, data });
        } catch (err) {
          errors.push({ endpoint, attempt, error: (err as Error).message });
        }

        // Brief delay before retry on attempt 1
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 250));
        }
      }
    }

    console.error("[RPC Proxy] All endpoints failed:", JSON.stringify(errors));
    return NextResponse.json(
      { error: "All NEAR RPC endpoints failed", details: errors },
      { status: 502 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
