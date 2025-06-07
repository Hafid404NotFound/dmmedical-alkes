import ActionButtonWa from "@/components/ActionButtonWa";
import { Card, CardBody } from "@/components/Card";
import CKEditorPreview from "@/components/CkEditorPreview";
import Divider from "@/components/Divider";
import FooterComponent from "@/components/FooterComponent";
import PageContainer from "@/components/PageContainer";
import ParallaxScrollScrubVideo from "@/components/ScroolVideo";
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

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ActionButtonWa />
      <TopBar />

      <PageContainer>
        <div className="lg:grid lg:grid-cols-2 gap-4 sm:gap-8 lg:gap-12 mt-12 sm:mt-16 lg:mt-20">
          {/* Media Section - Video or Image */}
          <div className="w-full space-y-4 sm:space-y-6">
            {data.video_url ? (
              <div className="relative w-full overflow-hidden bg-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-video">
                  <ParallaxScrollScrubVideo value={data.video_url} />
                </div>
              </div>
            ) : data.image_url ? (
              <div className="relative w-full overflow-hidden bg-gray-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-video">
                  <Image
                    src={data.image_url}
                    alt={data.name || "Product image"}
                    width={1280}
                    height={720}
                    className="w-full h-full object-contain"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                  />
                </div>
              </div>
            ) : null}
          </div>

          {/* Content Section */}
          <div className="flex-1 lg:pl-4 mt-8 lg:mt-0 space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              {data.category && (
                <div className="text-primary-main/80 font-medium text-sm sm:text-base">
                  {data.category.name}
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight">
                {data.name}
              </h1>
            </div>

            <div className="prose prose-gray max-w-none">
              <CKEditorPreview content={data.description} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.tokopedia_link && (
                <Link target="_blank" href={data.tokopedia_link} className="block">
                  <div className="bg-[#4D9E0B] hover:bg-[#458d0a] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
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
                  <div className="bg-[#DA9B3D] hover:bg-[#c58935] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
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
                  <div className="bg-green-600 hover:bg-green-700 flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
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
              </Card>
            </div>
          </div>
        </div>
      </PageContainer>

      <div className="h-32"></div>
      <FooterComponent />
    </div>
  );
}
