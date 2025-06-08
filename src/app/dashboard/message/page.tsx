import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import Table, { ITableColumn } from "@/components/Table";
import { IQuestion } from "@/types/IQuestion";
import DateHelper from "@/utils/date-helper";
import { createClient } from "@/utils/supabase/server";
import { MdMailOutline, MdPhone, MdCalendarToday } from "react-icons/md";

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
        <div className="p-2 sm:p-3 min-w-[250px] space-y-1">
          <div className="font-semibold text-primary-main text-sm sm:text-base">
            {e.name}
          </div>
          <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5">
            <MdMailOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>{e.email}</span>
          </div>
          {e.phone && (
            <div className="text-gray-600 text-xs sm:text-sm flex items-center gap-1.5">
              <MdPhone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{e.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      headerTitle: "Pesan",
      component: (e) => (
        <div className="p-2 sm:p-3 min-w-[300px]">
          <div className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {e.message}
          </div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal",
      component: (e) => (
        <div className="p-2 sm:p-3 min-w-[180px] flex items-center gap-1.5">
          <MdCalendarToday className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary-main flex-shrink-0" />
          <span className="text-gray-600 text-xs sm:text-sm">
            {e.created_at
              ? dateHelper.toFormatDate(e.created_at, "dd LLLL, yyyy - HH:mm")
              : "-"}
          </span>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="py-3 sm:py-4">
          <PageTitle title="Pesan yang Masuk" />
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {data.length} pesan ditemukan
          </p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/80 overflow-hidden">
          <div className="overflow-x-auto w-full">
            <Table data={data} column={tableColumn} />
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
