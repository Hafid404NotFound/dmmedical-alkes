import { NextResponse } from "next/server";
import { analyticsConfig, getApiHeaders, isAnalyticsEnabled } from "@/utils/analytics-config";

// Generate sample data for development or when analytics is not configured
function generateDemoData(startDate: string, endDate: string) {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    data.push({
      date: current.toISOString().split("T")[0],
      pageViews: Math.floor(Math.random() * 100),
      visitors: Math.floor(Math.random() * 50),
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
}

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();

    // For development or when analytics is not configured, return demo data
    if (!isAnalyticsEnabled()) {
      console.log("Analytics not configured, using demo data");
      return NextResponse.json(generateDemoData(startDate, endDate));
    }

    // Log configuration for debugging
    console.log("Analytics config:", {
      hasToken: !!analyticsConfig.apiToken,
      projectId: analyticsConfig.projectId,
      environment: analyticsConfig.environment,
    });

    // Define the API URL for Web Analytics
    const apiUrl = new URL("https://api.vercel.com/v1/web/analytics");
    apiUrl.searchParams.append("projectId", analyticsConfig.projectId);
    apiUrl.searchParams.append("from", startDate);
    apiUrl.searchParams.append("to", endDate);

    console.log("Fetching analytics from:", apiUrl.toString());

    const response = await fetch(apiUrl, {
      headers: getApiHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Analytics API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Raw analytics data:", data);

    // Transform the data into our expected format
    const transformedData = Object.entries(data.pageviews || {})
      .map(([date, pageViews]) => ({
        date,
        pageViews: Number(pageViews) || 0,
        visitors: Number(data.uniques?.[date]) || 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Analytics API error:", error);

    // In case of error in production, return empty data
    // In development, return demo data
    if (process.env.NODE_ENV === "development") {
      const { startDate, endDate } = await request.json();
      return NextResponse.json(generateDemoData(startDate, endDate));
    }

    return NextResponse.json([]);
  }
}
