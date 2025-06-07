import { NextResponse } from "next/server";
import { analyticsConfig, getApiHeaders } from "@/utils/analytics-config";

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();

    // Log request details
    console.log("Fetching analytics for:", { startDate, endDate });

    // Define the API URL for Web Analytics (using v2 API)
    const baseUrl = "https://api.vercel.com";
    const statsEndpoint = "/v2/stats";

    // Get project stats
    const statsUrl = `${baseUrl}${statsEndpoint}?from=${startDate}&to=${endDate}&projectId=${analyticsConfig.projectId}`;

    console.log("Fetching from:", statsUrl);

    const response = await fetch(statsUrl, {
      headers: getApiHeaders(),
      next: { revalidate: 0 }, // Disable cache to get fresh data
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vercel API Error:", {
        status: response.status,
        text: errorText,
        url: statsUrl,
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw analytics data:", data);

    // Get detailed page views
    const pageViewsUrl = `${baseUrl}/v2/web-analytics/page-views?from=${startDate}&to=${endDate}&projectId=${analyticsConfig.projectId}`;
    const pageViewsResponse = await fetch(pageViewsUrl, {
      headers: getApiHeaders(),
      next: { revalidate: 0 },
    });

    const pageViewsData = await pageViewsResponse.json();
    console.log("Page views data:", pageViewsData);

    // Transform and combine the data
    const transformedData = pageViewsData.pageViews
      .map((item: any) => ({
        date: new Date(item.timestamp).toISOString().split("T")[0],
        pageViews: item.value || 0,
        visitors: item.uniques || 0,
      }))
      .sort((a: any, b: any) => a.date.localeCompare(b.date));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
