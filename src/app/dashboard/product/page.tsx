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
import { MdInfo } from "react-icons/md";

export default async function ProductPage() {
  const supabase = createClient();
  const query = await (await supabase).from("product").select();
  const data: IProduct[] = query?.data || [];

  const tableColumn: ITableColumn<IProduct>[] = [
    {
      headerTitle: "Nama",
      component: (e) => (
        <div className="flex items-center gap-3">
          <Image src={e.image_url} height={50} width={50} alt={e.name} />
          <div className="font-semibold">{e?.name}</div>
        </div>
      ),
    },

    {
      headerTitle: "Created Date",
      component: (e) => (
        <div>
          <div>{new Date(e.created_at).toLocaleString()}</div>
        </div>
      ),
    },
    {
      component: (e) => (
        <Link href={"product/" + e.id}>
          <IconButton>
            <MdInfo />
          </IconButton>
        </Link>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="flex items-center justify-between">
          <PageTitle title="PRODUK" />

          <Link href={"/dashboard/product/new"}>
            <Button>Buat Produk</Button>
          </Link>
        </div>
        <div>
          <Table column={tableColumn} data={data} />
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
