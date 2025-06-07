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
        <div className="group p-2 hover:bg-blue-50/50 rounded-lg transition-all duration-300">
          <div className="font-semibold text-primary-main">{e.name}</div>
          <div className="text-gray-500 flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            {e.email}
          </div>
          {e.phone && (
            <div className="text-gray-500 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              {e.phone}
            </div>
          )}
        </div>
      ),
    },
    {
      headerTitle: "Pesan",
      component: (e) => (
        <div className="p-2 bg-gradient-to-r from-blue-50/30 to-green-50/30 rounded-lg border border-gray-100 shadow-sm">
          <div className="text-gray-700 leading-relaxed">{e.message}</div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal",
      component: (e) => (
        <div className="flex items-center gap-2 p-2 text-gray-600">
          <svg
            className="w-4 h-4 text-secondary-main"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
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
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <PageTitle title="Pesan yang Masuk" />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <Table data={data} column={tableColumn} />
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
