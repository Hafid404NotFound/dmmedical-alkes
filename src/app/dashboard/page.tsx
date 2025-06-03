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
        <div className="flex items-center justify-between">
          {data?.user?.email}
          <LogoutButton />
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
