"use client";

import { Card, CardBody } from "@/components/Card";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { FiPackage, FiMessageCircle, FiStar, FiClock } from "react-icons/fi";

interface Activity {
  id: string;
  type: 'product' | 'message' | 'review';
  title: string;
  created_at: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function fetchActivities() {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('activity_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        if (mounted) {
          setActivities(data || []);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchActivities();

    // Set up real-time subscription
    const subscription = supabase
      .channel('activity_logs')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'activity_logs' 
        }, 
        payload => {
          setActivities(current => [payload.new as Activity, ...current].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    const iconProps = "w-5 h-5";
    switch (type) {
      case 'product':
        return <FiPackage className={`${iconProps} text-blue-500`} />;
      case 'message':
        return <FiMessageCircle className={`${iconProps} text-green-500`} />;
      case 'review':
        return <FiStar className={`${iconProps} text-yellow-500`} />;
      default:
        return <FiClock className={`${iconProps} text-gray-500`} />;
    }
  };

  const getActivityText = (activity: Activity) => {
    switch (activity.type) {
      case 'product':
        return `Produk baru ditambahkan: ${activity.title}`;
      case 'message':
        return `Pesan baru: ${activity.title}`;      case 'review':
        return activity.title;
      default:
        return activity.title;
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <Card>
              <CardBody>
                <div className="flex space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center text-gray-500 py-6">
            <FiClock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>Belum ada aktivitas terbaru</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardBody>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 rounded-full">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">
                  {getActivityText(activity)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(activity.created_at), {
                    addSuffix: true,
                    locale: id
                  })}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
