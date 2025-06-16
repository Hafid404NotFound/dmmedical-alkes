import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import { IQuestion } from "@/types/IQuestion";
import { createClient } from "@/utils/supabase/server";
import MessageTable from "./MessageTable";

export default async function MessagePage() {
  const supabase = createClient();
  const query = await (await supabase)
    .from("question")
    .select()
    .order("id", { ascending: false });
  const data: IQuestion[] = query?.data || [];

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="py-3 sm:py-4">
          <PageTitle title="Pesan yang Masuk" />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {data.length} pesan ditemukan
          </p>
        </div>
        <MessageTable initialData={data} />
      </DashboardContainer>
    </DashboardLayout>
  );
}
