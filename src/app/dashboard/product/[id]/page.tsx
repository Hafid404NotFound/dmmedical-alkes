"use server";
import Button from "@/components/Button";
import { ButtonDeleteProduct } from "@/components/ButtonDeleteProduct";
import { Card, CardBody } from "@/components/Card";
import CKEditorPreview from "@/components/CkEditorPreview";
import DashboardContainer from "@/components/DashboardContainer";
import DashboardLayout from "@/components/DashboardLayout";
import PageTitle from "@/components/PageTitle";
import { IProduct } from "@/types/IProduct";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import {
  MdWhatsapp,
  MdEdit,
  MdLocalHospital,
  MdMedicalServices,
  MdDescription,
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
    .eq("id", params?.id as any)
    .single(); // Use .single() as we expect one product or null

  const data: IProduct | null = query?.data;

  if (!data) {
    // Handle case where product is not found, e.g., redirect or show a not found message
    // For now, returning a simple message within the layout
    return (
      <DashboardLayout>
        <DashboardContainer>
          <PageTitle title="Produk Tidak Ditemukan" />
          <p>Produk yang Anda cari tidak dapat ditemukan.</p>
          <Link href="/dashboard/product">
            <Button className="mt-4">Kembali ke Katalog</Button>
          </Link>
        </DashboardContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardContainer>
        <div className="space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-white p-3 sm:p-4 rounded-xl shadow-md">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary-main to-secondary-main flex items-center justify-center shadow-lg flex-shrink-0">
                <MdLocalHospital className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <PageTitle title="Detail Alat Kesehatan" />
                <p className="text-gray-500 text-xs sm:text-sm">
                  Informasi lengkap spesifikasi alat kesehatan
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              {params?.id && <ButtonDeleteProduct id={params?.id} />}{" "}
              {/* Removed className */}
              <Link
                href={`/dashboard/product/${params?.id}/edit`}
                className="w-full sm:w-auto"
              >
                <Button className="bg-primary-main hover:bg-primary-dark flex items-center justify-center gap-1.5 sm:gap-2 w-full">
                  <MdEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm">Edit Produk</span>
                </Button>
              </Link>
            </div>
          </div>

          <Card>
            <CardBody className="p-4 sm:p-6">
              <div className="space-y-6 sm:space-y-8">
                {/* Product Header: Image, Name, Category, Links */}
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="relative w-full md:w-[180px] lg:w-[200px] h-[180px] md:h-auto md:aspect-square rounded-xl border-2 border-primary-main/10 overflow-hidden flex-shrink-0 shadow-md">
                    <Image
                      src={data.image_url}
                      alt={data.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 180px, 200px"
                      style={{ objectFit: "cover" }}
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-secondary-main mb-1 sm:mb-2">
                      <MdMedicalServices className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-gray-600 text-sm sm:text-base">
                        {data.category?.name || "Alat Kesehatan"}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-primary-main mb-3 sm:mb-4 lg:mb-6">
                      {data.name}
                    </h1>

                    {/* Marketplace Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {data.tokopedia_link && (
                        <Link target="_blank" href={data.tokopedia_link}>
                          <div className="bg-[#4D9E0B] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
                            <Image
                              src="/1tokopedia.png"
                              alt="tokopedia"
                              height={28} // Adjusted size
                              width={28} // Adjusted size
                              className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                            />
                            <div className="text-white font-medium text-xs sm:text-sm">
                              Beli di Tokopedia
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.shopee_link && (
                        <Link target="_blank" href={data.shopee_link}>
                          <div className="bg-[#DA9B3D] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
                            <Image
                              src="/shopee.png"
                              alt="shopee"
                              height={28}
                              width={28}
                              className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                            />
                            <div className="text-white font-medium text-xs sm:text-sm">
                              Beli di Shopee
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.bukalapak_link && (
                        <Link target="_blank" href={data.bukalapak_link}>
                          <div className="bg-[#E31E52] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
                            <Image
                              src="/bukalapak.png"
                              alt="bukalapak"
                              height={28}
                              width={28}
                              className="h-6 w-6 sm:h-7 sm:w-7 object-contain"
                            />
                            <div className="text-white font-medium text-xs sm:text-sm">
                              Beli di Bukalapak
                            </div>
                          </div>
                        </Link>
                      )}
                      {data.wa_link && (
                        <Link target="_blank" href={data.wa_link}>
                          <div className="bg-[#25D366] rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-2.5">
                            <MdWhatsapp className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                            <div className="text-white font-medium text-xs sm:text-sm">
                              Konsultasi via WhatsApp
                            </div>
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>{" "}
                {/* Deskripsi Produk */}
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-gray-700 font-medium text-sm sm:text-base">
                    <MdDescription className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-main" />
                    Spesifikasi & Detail Produk
                  </div>
                  <div className="prose prose-sm sm:prose-base max-w-none p-2 sm:p-3 bg-gray-50 rounded-lg">
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
