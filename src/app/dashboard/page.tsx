"use server";

import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import LogoutButton from "@/components/LogoutButton";

import { createClient } from "@/utils/supabase/server";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-3 sm:p-4 rounded-xl shadow-md gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Dashboard
                </h1>
                <p className="text-sm sm:text-base text-gray-500">
                  Selamat datang, {data?.user?.email}
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <LogoutButton className="w-full sm:w-auto" />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Aktivitas Terbaru</h2>
            <RecentActivity />
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
