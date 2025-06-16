import ActionButtonWa from "@/components/ActionButtonWa";
import { Card, CardBody } from "@/components/Card";
import CKEditorPreview from "@/components/CkEditorPreview";
import Divider from "@/components/Divider";
import FooterComponent from "@/components/FooterComponent";
import PageContainer from "@/components/PageContainer";
import ProductMediaViewer from "@/components/ProductMediaViewer";
import TopBar from "@/components/TopBar";
import { IProduct } from "@/types/IProduct";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { MdCheck, MdStarOutline, MdWhatsapp } from "react-icons/md";

export default async function DetailProductPage({ params }: any) {
  const { id } = await params;
  const supabase = createClient();
  const query = await (await supabase)
    .from("product")
    .select(`*, category (id, name)`)
    .eq("id", id);
  const data: IProduct = query?.data ? query?.data[0] : undefined;

  // Parse gallery_images dengan error handling yang robust
  if (data && data.gallery_images) {
    if (typeof data.gallery_images === "string") {
      try {
        data.gallery_images = JSON.parse(data.gallery_images);
      } catch (error) {
        console.error("Error parsing gallery_images:", error);
        data.gallery_images = [];
      }
    }
    // Ensure it's always an array
    if (!Array.isArray(data.gallery_images)) {
      data.gallery_images = [];
    }
  } else if (data) {
    data.gallery_images = [];
  }

  // Parse images360 dengan error handling yang robust
  if (data && data.images360) {
    if (typeof data.images360 === "string") {
      try {
        data.images360 = JSON.parse(data.images360);
      } catch (error) {
        console.error("Error parsing images360:", error);
        data.images360 = [];
      }
    }
    // Ensure it's always an array
    if (!Array.isArray(data.images360)) {
      data.images360 = [];
    }
  } else if (data) {
    data.images360 = [];
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ActionButtonWa />
      <TopBar />{" "}
      <PageContainer>
        {" "}
        <div className="lg:grid lg:grid-cols-2 gap-12 mt-6 sm:mt-8 lg:mt-12">
          {/* Enhanced Media Section - Video 360° and Gallery */}
          <div className="w-full space-y-6">
            {data ? (
              <ProductMediaViewer
                images360={Array.isArray(data.images360) ? data.images360 : []}
                mainImageUrl={data.image_url}
                galleryImages={
                  Array.isArray(data.gallery_images) ? data.gallery_images : []
                }
                productName={data.name}
              />
            ) : (
              <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                  <p>Loading product media...</p>
                </div>
              </div>
            )}
          </div>
          {/* Content Section */}
          <div className="flex-1 lg:pl-4 space-y-6 sm:space-y-8 mt-6 lg:mt-0">
            {" "}
            <div className="space-y-3 sm:space-y-4">
              {data.category && (
                <div className="text-primary-main/80 font-medium text-sm sm:text-base">
                  {data.category.name}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight">
                {data.name}
              </h1>
            </div>{" "}
            <div className="prose prose-gray max-w-none">
              <CKEditorPreview content={data.description} />
            </div>{" "}
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {data.tokopedia_link && (
                <Link
                  target="_blank"
                  href={data.tokopedia_link}
                  className="block"
                >
                  {" "}
                  <div className="bg-[#4D9E0B] hover:bg-[#458d0a] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <div className="w-8 sm:w-10 flex-shrink-0">
                      <Image
                        src="/1tokopedia.png"
                        alt="tokopedia"
                        height={50}
                        width={50}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base">
                      Beli via Tokopedia
                    </div>
                  </div>
                </Link>
              )}

              {data.shopee_link && (
                <Link target="_blank" href={data.shopee_link} className="block">
                  {" "}
                  <div className="bg-[#DA9B3D] hover:bg-[#c58935] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <div className="w-8 sm:w-10 flex-shrink-0">
                      <Image
                        src="/shopee.png"
                        alt="shopee"
                        height={50}
                        width={50}
                        className="w-full h-auto"
                      />
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base">
                      Beli via Shopee
                    </div>
                  </div>
                </Link>
              )}

              {data.wa_link && (
                <Link target="_blank" href={data.wa_link} className="block">
                  {" "}
                  <div className="bg-green-600 hover:bg-green-700 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <MdWhatsapp className="text-white text-2xl sm:text-3xl flex-shrink-0" />
                    <div className="text-white font-medium text-sm sm:text-base">
                      Beli via WhatsApp
                    </div>
                  </div>
                </Link>
              )}
            </div>
            {/* Cards Section */}
            <div className="space-y-4 sm:space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardBody className="p-4 sm:p-6">
                  <div className="flex gap-3 items-center text-primary-main">
                    <MdStarOutline className="text-xl sm:text-2xl" />
                    <h3 className="font-semibold text-base sm:text-lg">
                      Perlindungan Pembeli
                    </h3>
                  </div>
                </CardBody>
                <Divider />
                <CardBody className="p-4 sm:p-6 space-y-4">
                  <div className="flex gap-3 items-start group">
                    <MdCheck className="text-green-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                    <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base">
                      Full refund jika pesanan tidak diterima
                    </div>
                  </div>
                  <div className="flex gap-3 items-start group">
                    <MdCheck className="text-green-500 text-lg sm:text-xl mt-1 flex-shrink-0" />
                    <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base">
                      Refund atau tetap miliki produk yang tidak sesuai dengan
                      deskripsi
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardBody className="p-4 sm:p-6">
                  <h3 className="font-semibold text-base sm:text-lg text-primary-main">
                    Untuk Info Hubungi:
                  </h3>
                </CardBody>
                <Divider />
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 group">
                    <MdWhatsapp className="text-green-500 text-lg sm:text-xl flex-shrink-0" />
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base">
                      0895366450806 (Bekasi)
                    </p>
                  </div>
                </CardBody>
                <CardBody className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 group">
                    <MdWhatsapp className="text-green-500 text-lg sm:text-xl flex-shrink-0" />
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 text-sm sm:text-base">
                      081389037818 (Jakarta Selatan)
                    </p>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>{" "}
      </PageContainer>
      <div className="h-16 sm:h-24 lg:h-32"></div>
      <FooterComponent />
    </div>
  );
}
