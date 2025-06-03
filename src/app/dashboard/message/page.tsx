import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import Table, { ITableColumn } from "@/components/Table";
import { IQuestion } from "@/types/IQuestion";
import DateHelper from "@/utils/date-helper";
import { createClient } from "@/utils/supabase/server";

export default async function MessagePage() {
  const dateHelper = new DateHelper();
  const supabase = createClient();
  const query = await (await supabase)
    .from("question")
    .select()
    .order("id", { ascending: false });
  const data: IQuestion[] = query?.data || [];
  const tableColumn: ITableColumn<IQuestion>[] = [
    {
      headerTitle: "Pengirim",
      component: (e) => (
        <div>
          <div className="font-semibold">{e.name}</div>
          <div className="text-gray-500">{e.email}</div>
          {e.phone && <div className="text-gray-500">{e.phone}</div>}
        </div>
      ),
    },
    {
      headerTitle: "Pesan",
      component: (e) => (
        <div>
          <div>{e.message}</div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal",
      component: (e) => (
        <div>
          <div>
            {e.created_at
              ? dateHelper.toFormatDate(e.created_at, "dd LLLL, yyyy - HH:mm")
              : "-"}
          </div>
        </div>
      ),
    },
  ];
  return (
    <DashboardLayout>
      <DashboardContainer>
        <PageTitle title="Pesan yang masuk" />
        <Table data={data} column={tableColumn} />
      </DashboardContainer>
    </DashboardLayout>
  );
}
