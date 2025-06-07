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
        <div className="flex items-center gap-3">
          <div className="relative w-[50px] h-[50px] rounded-lg border border-primary-main/20 overflow-hidden">
            <Image
              src={e.image_url}
              alt={e.name}
              width={50}
              height={50}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div>
            <div className="font-semibold text-primary-main">{e?.name}</div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <MdMedicalServices className="text-secondary-main" />
              {e.category?.name}
            </div>
          </div>
        </div>
      ),
    },
    {
      headerTitle: "Tanggal Update",
      component: (e) => (
        <div className="text-sm text-gray-600 flex items-center gap-2">
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
          {new Date(e.created_at).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      headerTitle: "Detail",
      component: (e) => (
        <Link href={"product/" + e.id}>
          <IconButton className="hover:bg-primary-main/10 text-primary-main">
            <MdInfo className="text-xl" />
          </IconButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
                <MdLocalHospital className="text-2xl text-white" />
              </div>
              <div>
                <PageTitle title="KATALOG ALAT KESEHATAN" />
                <p className="text-gray-500 text-sm">
                  Kelola inventaris alat kesehatan dan peralatan medis
                </p>
              </div>
            </div>

            <Link href={"/dashboard/product/new"}>
              <Button className="flex items-center gap-2 bg-primary-main hover:bg-primary-dark">
                <MdInventory />
                Tambah Alat Kesehatan
              </Button>
            </Link>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            <Table column={tableColumn} data={data} />
          </div>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
