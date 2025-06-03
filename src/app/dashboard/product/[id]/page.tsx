"use server";
import Button from "@/components/Button";
import { ButtonDeleteProduct } from "@/components/ButtonDeleteProduct";
import { Card, CardBody } from "@/components/Card";
import CKEditorPreview from "@/components/CkEditorPreview";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import ParallaxScrollScrubVideo from "@/components/ScroolVideo";
import { IProduct } from "@/types/IProduct";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function DetailProductPage({ params }: any) {
  const supabase = createClient();
  const query = await (
    await supabase
  )
    .from("product")
    .select(
      `
    *,
    category (
      id,
      name
    )
  `
    )
    .eq("id", params?.id as any);
  const getdata: IProduct[] = query?.data || [];
  const data = getdata[0];
  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="flex items-center justify-between">
          <PageTitle title="Detail Produk" />
          <div className="flex items-center gap-2">
            {params?.id && <ButtonDeleteProduct id={params?.id} />}

            <Link href={`/dashboard/product/${params?.id}/edit`}>
              <Button>Edit Produk</Button>
            </Link>
          </div>
        </div>
        <Card>
          <CardBody>
            <div className="flex gap-4">
              <Image
                src={data.image_url}
                alt={data.name}
                height={180}
                width={180}
              />
              <div>
                <p>{data.category?.name || "-"}</p>
                <h1 className="text-3xl font-semibold">{data.name}</h1>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {data.tokopedia_link && (
                    <Link target="_blank" href={data.tokopedia_link}>
                      <div className="bg-[#4D9E0B] flex items-center gap-3 px-4">
                        <Image
                          src={"/1tokopedia.png"}
                          alt="tokopedia"
                          height={50}
                          width={50}
                          className="h-10 w-auto"
                        />
                        <div className="text-white">Beli via tokopedia</div>
                      </div>
                    </Link>
                  )}
                  {data.shopee_link && (
                    <Link target="_blank" href={data.shopee_link}>
                      <div className="bg-[#DA9B3D] flex items-center gap-3 px-4">
                        <Image
                          src={"/shopee.png"}
                          alt="tokopedia"
                          height={50}
                          width={50}
                          className="h-10 w-auto"
                        />
                        <div className="text-white">Beli via tokopedia</div>
                      </div>
                    </Link>
                  )}
                  {data.bukalapak_link && (
                    <Link target="_blank" href={data.bukalapak_link}>
                      <div className="bg-pink-300 flex items-center gap-3 px-4">
                        <Image
                          src={"/bukalapak.png"}
                          alt="bukalaopan"
                          height={50}
                          width={50}
                          className="h-10 w-auto"
                        />
                        <div className="text-white">Beli via Bukalapak</div>
                      </div>
                    </Link>
                  )}
                  {data.wa_link && (
                    <Link target="_blank" href={data.wa_link}>
                      <div className="bg-pink-300 flex items-center gap-3 px-4">
                        <Image
                          src={"/bukalapak.png"}
                          alt="bukalaopan"
                          height={50}
                          width={50}
                          className="h-10 w-auto"
                        />
                        <div className="text-white">Beli via Whatsapp</div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
            {data.video_url && (
              <div className="relative z-[99] mt-10 w-full aspect-video">
                <ParallaxScrollScrubVideo value={data.video_url} />
              </div>
            )}

            <div className="mt-10">
              <CKEditorPreview content={data.description} />
            </div>
          </CardBody>
        </Card>
      </DashboardContainer>
    </DashboardLayout>
  );
}
