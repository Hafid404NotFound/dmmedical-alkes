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
import {
  MdWhatsapp,
  MdEdit,
  MdLocalHospital,
  MdMedicalServices,
} from "react-icons/md";

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
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg">
                <MdLocalHospital className="text-2xl text-white" />
              </div>
              <div>
                <PageTitle title="Detail Alat Kesehatan" />
                <p className="text-gray-500 text-sm">
                  Informasi lengkap spesifikasi alat kesehatan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {params?.id && <ButtonDeleteProduct id={params?.id} />}
              <Link href={`/dashboard/product/${params?.id}/edit`}>
                <Button className="bg-primary-main hover:bg-primary-dark flex items-center gap-2">
                  <MdEdit />
                  Edit Produk
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardBody>
              <div className="space-y-8">
                {/* Header Produk */}
                <div className="flex gap-6">
                  <div className="relative w-[180px] h-[180px] rounded-xl border-2 border-primary-main/20 overflow-hidden">
                    <Image
                      src={data.image_url}
                      alt={data.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-secondary-main mb-2">
                      <MdMedicalServices />
                      <span className="text-gray-600">
                        {data.category?.name || "Alat Kesehatan"}
                      </span>
                    </div>
                    <h1 className="text-3xl font-semibold text-primary-main mb-6">
                      {data.name}
                    </h1>

                    <div className="grid grid-cols-2 gap-4">
                      {data.tokopedia_link && (
                        <Link target="_blank" href={data.tokopedia_link}>
                          <div className="bg-[#4D9E0B] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3 px-4 py-2">
                            <Image
                              src="/1tokopedia.png"
                              alt="tokopedia"
                              height={40}
                              width={40}
                              className="h-10 w-auto"
                            />
                            <div className="text-white font-medium">
                              Beli di Tokopedia
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.shopee_link && (
                        <Link target="_blank" href={data.shopee_link}>
                          <div className="bg-[#DA9B3D] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3 px-4 py-2">
                            <Image
                              src="/shopee.png"
                              alt="shopee"
                              height={40}
                              width={40}
                              className="h-10 w-auto"
                            />
                            <div className="text-white font-medium">
                              Beli di Shopee
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.bukalapak_link && (
                        <Link target="_blank" href={data.bukalapak_link}>
                          <div className="bg-[#E31E52] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3 px-4 py-2">
                            <Image
                              src="/bukalapak.png"
                              alt="bukalapak"
                              height={40}
                              width={40}
                              className="h-10 w-auto"
                            />
                            <div className="text-white font-medium">
                              Beli di Bukalapak
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.wa_link && (
                        <Link target="_blank" href={data.wa_link}>
                          <div className="bg-[#25D366] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-3 px-4 py-2">
                            <MdWhatsapp className="text-white text-3xl" />
                            <div className="text-white font-medium">
                              Konsultasi via WhatsApp
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Video Preview */}
                {data.video_url && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-secondary-main"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Video Demonstrasi Produk
                    </div>
                    <div className="relative z-[99] w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                      <ParallaxScrollScrubVideo value={data.video_url} />
                    </div>
                  </div>
                )}

                {/* Deskripsi Produk */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <svg
                      className="w-5 h-5 text-secondary-main"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Spesifikasi & Detail Produk
                  </div>
                  <div className="prose max-w-none">
                    <CKEditorPreview content={data.description} />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </DashboardContainer>
    </DashboardLayout>
  );
}
