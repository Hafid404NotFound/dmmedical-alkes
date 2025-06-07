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
import { format } from "date-fns";
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

export default function DashboardAnalytics() {
  const [visitorData, setVisitorData] = useState<any[]>([]);
  const [loginData, setLoginData] = useState<any[]>([]);
  const supabase = createClient();

  // Fetch analytics data
  useEffect(() => {
    const fetchData = async () => {
      // Get visitor analytics
      const { data: visitors } = await supabase
        .from("analytics")
        .select("*")
        .eq("type", "visit")
        .order("created_at", { ascending: true })
        .limit(7);

      // Get login analytics
      const { data: logins } = await supabase
        .from("analytics")
        .select("*")
        .eq("type", "login")
        .order("created_at", { ascending: true })
        .limit(7);

      setVisitorData(visitors || []);
      setLoginData(logins || []);
    };

    fetchData();
  }, []);

  // Prepare data for visitor chart
  const visitorChartData = {
    labels: visitorData.map((item) =>
      format(new Date(item.created_at), "dd MMM")
    ),
    datasets: [
      {
        label: "Pengunjung Website",
        data: visitorData.map((item) => item.count),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Prepare data for login chart
  const loginChartData = {
    labels: loginData.map((item) =>
      format(new Date(item.created_at), "dd MMM")
    ),
    datasets: [
      {
        label: "Login Admin",
        data: loginData.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

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
          stepSize: 1,
        },
      },
    },
  };

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
