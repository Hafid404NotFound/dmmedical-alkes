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
      width: "30%",
      component: (e) => (
        <div className="group hover:bg-blue-50/50 rounded-lg transition-all duration-300">
          <div className="font-semibold text-primary-main truncate">
            {e.name}
          </div>
          <div className="text-gray-500 flex items-center gap-2 text-sm">
            <svg
              className="w-3.5 h-3.5 flex-shrink-0"
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
            <span className="truncate">{e.email}</span>
          </div>
          {e.phone && (
            <div className="text-gray-500 flex items-center gap-2 text-sm">
              <svg
                className="w-3.5 h-3.5 flex-shrink-0"
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
              <span className="truncate">{e.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      headerTitle: "Pesan",
      width: "50%",
      component: (e) => (
        <div className="bg-gradient-to-r from-blue-50/30 to-green-50/30 rounded-lg border border-gray-100 shadow-sm">
          <div className="text-gray-700 leading-relaxed line-clamp-3 p-3 text-sm">
            {e.message}
          </div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal",
      width: "20%",
      component: (e) => (
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <svg
            className="w-3.5 h-3.5 text-secondary-main flex-shrink-0"
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
          <div className="whitespace-nowrap">
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
          <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
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
              <div>
                <PageTitle title="Pesan yang Masuk" />
                <div className="text-sm text-gray-500">
                  {data.length} pesan ditemukan
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100/80">
            <div className="relative">
              {/* Scroll shadows - only show on smaller screens */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none z-10 lg:hidden" />
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none z-10 lg:hidden" />

              {/* Table with horizontal scroll on mobile */}
              <div className="min-w-[640px] p-4">
                <Table data={data} column={tableColumn} cellClassName="p-2" />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-main/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-main/5 rounded-full blur-3xl" />
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
