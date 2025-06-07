import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { startDate, endDate } = await request.json();

    const response = await fetch(
      `https://api.vercel.com/v1/web/analytics?startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch analytics data");
    }

    const data = await response.json();

    // Transform data to match our interface
    const transformedData = data.data.map((item: any) => ({
      date: item.date,
      pageViews: item.pageViews,
      visitors: item.visitors,
    }));

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
