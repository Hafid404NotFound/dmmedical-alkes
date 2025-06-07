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
import { format, eachDayOfInterval, subDays } from "date-fns";
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
  count: number;
  type: string;
}

export default function DashboardAnalytics() {
  const [visitorData, setVisitorData] = useState<AnalyticsData[]>([]);
  const [loginData, setLoginData] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get date range for last 7 days
        const endDate = new Date();
        const startDate = subDays(endDate, 6);

        // Generate all dates in range
        const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
        const dateStrings = dateRange.map((date) => format(date, "yyyy-MM-dd"));

        // Fetch analytics data
        const [visitorResult, loginResult] = await Promise.all([
          supabase
            .from("analytics")
            .select("*")
            .eq("type", "visit")
            .gte("date", format(startDate, "yyyy-MM-dd"))
            .order("date", { ascending: true }),
          supabase
            .from("analytics")
            .select("*")
            .eq("type", "login")
            .gte("date", format(startDate, "yyyy-MM-dd"))
            .order("date", { ascending: true }),
        ]);

        // Process visitor data with zero-filling
        const processedVisitorData = dateStrings.map((date) => {
          const record = visitorResult.data?.find((item) => item.date === date);
          return {
            date,
            count: record?.count || 0,
            type: "visit",
          };
        });

        // Process login data with zero-filling
        const processedLoginData = dateStrings.map((date) => {
          const record = loginResult.data?.find((item) => item.date === date);
          return {
            date,
            count: record?.count || 0,
            type: "login",
          };
        });

        setVisitorData(processedVisitorData);
        setLoginData(processedLoginData);
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
    labels: visitorData.map((item) => format(new Date(item.date), "dd MMM")),
    datasets: [
      {
        label: "Pengunjung Website",
        data: visitorData.map((item) => item.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
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
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Pengunjung:{" "}
            {visitorData.reduce((acc, curr) => acc + curr.count, 0)}
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
