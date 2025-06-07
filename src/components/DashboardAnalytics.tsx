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
import { useEffect, useState, useCallback } from "react";
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

interface LoginData {
  id: string;
  type: string;
  date: string;
  count: number;
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  },
};

export default function DashboardAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [loginData, setLoginData] = useState<LoginData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchAnalyticsData = useCallback(
    async (
      startDate: Date,
      endDate: Date,
      attempt = 1
    ): Promise<AnalyticsData[]> => {
      try {
        const response = await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate: format(startDate, "yyyy-MM-dd") + "T00:00:00.000Z",
            endDate: format(endDate, "yyyy-MM-dd") + "T23:59:59.999Z",
          }),
        });

        const result = await response.json();

        if (!response.ok && result.retryNeeded && attempt < 3) {
          // Wait for progressively longer times between retries
          await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
          return fetchAnalyticsData(startDate, endDate, attempt + 1);
        }

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch analytics data");
        }

        return result;
      } catch (error) {
        console.error(`Analytics fetch attempt ${attempt} failed:`, error);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
          return fetchAnalyticsData(startDate, endDate, attempt + 1);
        }
        throw error;
      }
    },
    []
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const endDate = new Date();
        const startDate = subDays(endDate, 6);

        const [analyticsResult, loginResult] = await Promise.all([
          fetchAnalyticsData(startDate, endDate),
          supabase
            .from("analytics")
            .select("*")
            .eq("type", "login")
            .gte("date", format(startDate, "yyyy-MM-dd"))
            .order("date", { ascending: true }),
        ]);

        setAnalyticsData(analyticsResult);

        if (loginResult.error) {
          console.error("Login data error:", loginResult.error);
        } else {
          setLoginData(loginResult.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Terjadi kesalahan saat memuat data"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchAnalyticsData]);

  const visitorChartData = {
    labels: analyticsData.map((item) => format(new Date(item.date), "dd MMM")),
    datasets: [
      {
        label: "Pengunjung Unik",
        data: analyticsData.map((item) => item.visitors),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.1,
      },
      {
        label: "Total Views",
        data: analyticsData.map((item) => item.pageViews),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
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
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const totalVisitors = analyticsData.reduce(
    (acc, curr) => acc + curr.visitors,
    0
  );
  const totalPageViews = analyticsData.reduce(
    (acc, curr) => acc + curr.pageViews,
    0
  );
  const averageDailyVisitors = Math.round(
    totalVisitors / Math.max(analyticsData.length, 1)
  );

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardBody>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-500 mb-2">Error</h3>
              <p className="text-gray-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">
              Total Pengunjung Unik
            </h3>
            <p className="text-3xl font-bold text-primary-main">
              {totalVisitors}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Rata-rata {averageDailyVisitors} per hari
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">Total Page Views</h3>
            <p className="text-3xl font-bold text-secondary-main">
              {totalPageViews}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total halaman yang dilihat
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <h3 className="text-lg font-semibold mb-2">Total Login Admin</h3>
            <p className="text-3xl font-bold text-emerald-600">
              {loginData.reduce((acc, curr) => acc + curr.count, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total login dalam 7 hari
            </p>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">Statistik Pengunjung</h3>
          <Line data={visitorChartData} options={chartOptions} />
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-lg font-semibold mb-4">Statistik Login Admin</h3>
          <Bar data={loginChartData} options={chartOptions} />
        </CardBody>
      </Card>
    </div>
  );
}
