import { NextResponse } from "next/server";

// Helper function to generate fallback data for the last 7 days
function generateFallbackData(startDate: string, endDate: string) {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    data.push({
      date: current.toISOString().split("T")[0],
      pageViews: 0,
      visitors: 0,
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delay = 1000
) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }

      // If we get a 429 (rate limit) or 508 (timeout), wait and retry
      if (response.status === 429 || response.status === 508) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
        continue;
      }

      // For other errors, throw immediately
      throw new Error(`API responded with status: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error("Max retries reached");
}

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();

    // Debug log
    console.log("[Analytics API] Request received:", { startDate, endDate });
    console.log("[Analytics API] Environment:", {
      hasToken: !!process.env.VERCEL_API_TOKEN,
      hasProjectId: !!process.env.VERCEL_PROJECT_ID,
      projectId: process.env.VERCEL_PROJECT_ID,
      env: process.env.NODE_ENV,
    });

    if (!process.env.VERCEL_API_TOKEN || !process.env.VERCEL_PROJECT_ID) {
      console.warn(
        "[Analytics API] Missing environment variables, returning fallback data"
      );
      return NextResponse.json(generateFallbackData(startDate, endDate));
    }

    // URL untuk Vercel Analytics API
    const apiUrl = `https://api.vercel.com/v9/analytics/stats/site`;

    // Query parameters
    const params = new URLSearchParams({
      startTime: startDate,
      endTime: endDate,
      projectId: process.env.VERCEL_PROJECT_ID,
      type: "site",
    });

    console.log("[Analytics API] Fetching from:", `${apiUrl}?${params}`);

    const response = await fetch(`${apiUrl}?${params}`, {
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("[Analytics API] Vercel API error:", {
        status: response.status,
        statusText: response.statusText,
      });

      // If we get a 401 or 403, likely an auth issue
      if (response.status === 401 || response.status === 403) {
        throw new Error("Token autentikasi tidak valid");
      }

      // If we get a 404, the project ID might be wrong
      if (response.status === 404) {
        throw new Error("Project ID tidak valid");
      }

      // For 429 rate limit or 508 timeout, throw specific error
      if (response.status === 429 || response.status === 508) {
        throw new Error("RETRY_NEEDED");
      }

      throw new Error(
        `Error dari Vercel API: ${response.status} ${response.statusText}`
      );
    }

    const rawData = await response.json();
    console.log("[Analytics API] Raw data received:", rawData);

    if (!rawData || !Array.isArray(rawData.metrics)) {
      console.warn("[Analytics API] Invalid data format, returning fallback");
      return NextResponse.json(generateFallbackData(startDate, endDate));
    }

    const transformedData = rawData.metrics
      .map((metric: any) => ({
        date: new Date(metric.timestamp).toISOString().split("T")[0],
        pageViews: metric.pageViews || 0,
        visitors: metric.uniques || 0,
      }))
      .sort((a: any, b: any) => a.date.localeCompare(b.date));

    console.log("[Analytics API] Transformed data:", transformedData);

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("[Analytics API] Error:", error);

    // If retry is needed, send specific status code
    if (error instanceof Error && error.message === "RETRY_NEEDED") {
      return NextResponse.json(
        { error: "Temporary error, please retry", retryNeeded: true },
        { status: 503 }
      );
    }

    // For other errors, return fallback data
    const { startDate, endDate } = await request.json();
    return NextResponse.json(generateFallbackData(startDate, endDate), {
      status: 200,
    });
  }
}
