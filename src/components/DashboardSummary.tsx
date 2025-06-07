"use client";

import { Card, CardBody } from "@/components/Card";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { format } from "date-fns";
import { FiPackage, FiMessageCircle, FiStar, FiEye } from "react-icons/fi";

interface StatsData {
  totalProducts: number;
  totalMessages: number;
  totalReviews: number;
  totalViews: number;
}

export default function DashboardSummary() {
  const [stats, setStats] = useState<StatsData>({
    totalProducts: 0,
    totalMessages: 0,
    totalReviews: 0,
    totalViews: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact' });

        // Fetch messages count
        const { count: messagesCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact' });

        // Fetch reviews count
        const { count: reviewsCount } = await supabase
          .from('reviews')
          .select('*', { count: 'exact' });

        // Fetch analytics for views
        const { data: viewsData } = await supabase
          .from('analytics')
          .select('count')
          .eq('type', 'view')
          .single();

        setStats({
          totalProducts: productsCount || 0,
          totalMessages: messagesCount || 0,
          totalReviews: reviewsCount || 0,
          totalViews: viewsData?.count || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Produk",
      value: stats.totalProducts,
      icon: FiPackage,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Pesan",
      value: stats.totalMessages,
      icon: FiMessageCircle,
      color: "text-green-500",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Review",
      value: stats.totalReviews,
      icon: FiStar,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Total Pengunjung",
      value: stats.totalViews,
      icon: FiEye,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardBody>
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
