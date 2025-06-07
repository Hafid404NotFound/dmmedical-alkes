"use server";

import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import LogoutButton from "@/components/LogoutButton";
import RecentActivity from "@/components/RecentActivity";
import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5M8 8v8m-4-5v5m16-5v5M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">
                  Selamat datang, {data?.user?.email}
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
