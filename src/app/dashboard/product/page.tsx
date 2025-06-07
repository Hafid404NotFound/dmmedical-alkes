"use server";
import Button from "@/components/Button";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import IconButton from "@/components/IconButton";
import PageTitle from "@/components/PageTitle";
import Table, { ITableColumn } from "@/components/Table";
import { IProduct } from "@/types/IProduct";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import {
  MdInfo,
  MdMedicalServices,
  MdLocalHospital,
  MdInventory,
  MdCalendarToday,
} from "react-icons/md";

export default async function ProductPage() {
  const supabase = createClient();
  const query = await (await supabase).from("product").select(`
      *,
      category (
        id,
        name
      )
    `);
  const data: IProduct[] = query?.data || [];

  const tableColumn: ITableColumn<IProduct>[] = [
    {
      headerTitle: "Nama Alat Kesehatan",
      component: (e) => (
        <div className="flex items-center gap-2 py-1.5 px-2 sm:py-2 sm:px-3 sm:min-w-[300px]">
          <div className="relative w-[30px] h-[30px] sm:w-[50px] sm:h-[50px] rounded-md sm:rounded-lg border border-primary-main/20 overflow-hidden flex-shrink-0">
            <Image
              src={e.image_url}
              alt={e.name}
              fill
              style={{ objectFit: "cover" }}
              sizes="(max-width: 640px) 30px, 50px"
            />
          </div>
          <div className="flex-grow overflow-hidden">
            <div className="font-semibold text-primary-main text-[11px] sm:text-sm whitespace-normal">
              {e?.name}
            </div>
            <div className="text-[9px] sm:text-xs text-gray-500 flex items-center gap-0.5 sm:gap-1 whitespace-normal">
              <MdMedicalServices className="text-secondary-main w-2.5 h-2.5 sm:w-4 sm:h-4 flex-shrink-0" />
              <span>{e.category?.name}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal Update",
      component: (e) => (
        <div className="py-1.5 px-2 sm:py-2 sm:px-3 sm:min-w-[180px]">
          <div className="text-[10px] sm:text-xs text-gray-600 flex items-start gap-1 sm:gap-1.5">
            <MdCalendarToday className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-main flex-shrink-0 mt-[1px] sm:mt-0.5" />
            <div>
              <span className="block whitespace-normal leading-tight">
                {new Date(e.created_at).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="block whitespace-normal text-gray-500 leading-tight">
                {new Date(e.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      headerTitle: "Detail",
      component: (e) => (
        <div className="py-1.5 px-2 sm:py-2 sm:px-3 text-center sm:min-w-[60px]">
          <Link href={`/dashboard/product/${e.id}`}>
            <IconButton className="hover:bg-primary-main/10 text-primary-main p-0.5 sm:p-1">
              <MdInfo className="text-sm sm:text-xl" />
            </IconButton>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-2 sm:gap-4 flex-grow">
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg flex-shrink-0">
                <MdLocalHospital className="text-lg sm:text-2xl text-white" />
              </div>
              <div className="flex-grow">
                <PageTitle
                  title="KATALOG ALAT KESEHATAN"
                  className="text-base sm:text-xl"
                />
                <p className="text-gray-500 text-[10px] sm:text-sm">
                  Kelola inventaris alat kesehatan dan peralatan medis
                </p>
              </div>
            </div>

            <Link
              href={"/dashboard/product/new"}
              className="w-full sm:w-auto flex-shrink-0"
            >
              <Button className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-primary-main hover:bg-primary-dark text-[10px] sm:text-sm p-2 sm:px-4 sm:py-2">
                <MdInventory className="w-3 h-3 sm:w-5 sm:h-5" />
                Tambah Alat Kesehatan
              </Button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-1.5 sm:p-6">
            <Table column={tableColumn} data={data} />
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
