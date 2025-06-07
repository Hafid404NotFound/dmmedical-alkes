"use client";

import { Card, CardBody } from "@/components/Card";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { format, subDays } from "date-fns";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalyticsData {
  date: string;
  pageViews: number;
  visitors: number;
}

export default function DashboardAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loginData, setLoginData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get date range for last 7 days
        const endDate = new Date();
        const startDate = subDays(endDate, 6);

        // Fetch Vercel Analytics data
        const response = await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: format(startDate, "yyyy-MM-dd"),
            endDate: format(endDate, "yyyy-MM-dd"),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }

        const data = await response.json();
        setAnalyticsData(data);

        // Fetch login data from Supabase
        const { data: logins } = await supabase
          .from("analytics")
          .select("*")
          .eq("type", "login")
          .gte("date", format(startDate, "yyyy-MM-dd"))
          .order("date", { ascending: true });

        setLoginData(logins || []);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const visitorChartData = {
    labels: analyticsData.map((item) => format(new Date(item.date), "dd MMM")),
    datasets: [
      {
        label: "Pengunjung Website",
        data: analyticsData.map((item) => item.visitors),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
      {
        label: "Page Views",
        data: analyticsData.map((item) => item.pageViews),
        fill: false,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const loginChartData = {
    labels: loginData.map((item) => format(new Date(item.date), "dd MMM")),
    datasets: [
      {
        label: "Login Admin",
        data: loginData.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-64 bg-gray-100 rounded"></div>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const totalVisitors = analyticsData.reduce(
    (acc, curr) => acc + curr.visitors,
    0
  );
  const totalPageViews = analyticsData.reduce(
    (acc, curr) => acc + curr.pageViews,
    0
  );

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Statistik Pengunjung Website
          </h3>
          <div className="h-80">
            <Line data={visitorChartData} options={chartOptions} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
            <div className="p-2 bg-blue-50 rounded-lg">
              <div className="font-semibold text-blue-600">
                Total Pengunjung
              </div>
              <div className="text-blue-900">{totalVisitors}</div>
            </div>
            <div className="p-2 bg-green-50 rounded-lg">
              <div className="font-semibold text-green-600">
                Total Page Views
              </div>
              <div className="text-green-900">{totalPageViews}</div>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Statistik Login Admin
          </h3>
          <div className="h-80">
            <Bar data={loginChartData} options={chartOptions} />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Login: {loginData.reduce((acc, curr) => acc + curr.count, 0)}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
