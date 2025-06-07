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
        <div className="lg:grid lg:grid-cols-2 gap-12 mt-20">
          {/* Video Section */}
          <div className="w-full">
            <div className="relative z-[99] w-full h-auto aspect-video rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
              <ParallaxScrollScrubVideo value={data.video_url} />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 lg:pl-4 mt-8 lg:mt-0 space-y-8">
            <div className="space-y-4">
              {data.category && (
                <div className="text-primary-main/80 font-medium">
                  {data.category.name}
                </div>
              )}
              <h1 className="text-4xl font-semibold text-gray-800 leading-tight">
                {data.name}
              </h1>
            </div>

            <div className="prose prose-gray max-w-none">
              <CKEditorPreview content={data.description} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.tokopedia_link && (
                <Link target="_blank" href={data.tokopedia_link}>
                  <div className="bg-[#4D9E0B] hover:bg-[#458d0a] flex items-center gap-4 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <Image
                      src="/1tokopedia.png"
                      alt="tokopedia"
                      height={50}
                      width={50}
                      className="h-10 w-auto"
                    />
                    <div className="text-white font-medium">
                      Beli via Tokopedia
                    </div>
                  </div>
                </Link>
              )}

              {data.shopee_link && (
                <Link target="_blank" href={data.shopee_link}>
                  <div className="bg-[#DA9B3D] hover:bg-[#c58935] flex items-center gap-4 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <Image
                      src="/shopee.png"
                      alt="shopee"
                      height={50}
                      width={50}
                      className="h-10 w-auto"
                    />
                    <div className="text-white font-medium">
                      Beli via Shopee
                    </div>
                  </div>
                </Link>
              )}

              {data.wa_link && (
                <Link target="_blank" href={data.wa_link}>
                  <div className="bg-green-600 hover:bg-green-700 flex items-center gap-4 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    <MdWhatsapp className="text-white text-3xl" />
                    <div className="text-white font-medium">
                      Beli via WhatsApp
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <div className="space-y-6">
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardBody className="p-6">
                  <div className="flex gap-3 items-center text-primary-main">
                    <MdStarOutline className="text-2xl" />
                    <h3 className="font-semibold text-lg">
                      Perlindungan Pembeli
                    </h3>
                  </div>
                </CardBody>
                <Divider />
                <CardBody className="p-6 space-y-4">
                  <div className="flex gap-3 items-start group">
                    <MdCheck className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      Full refund jika pesanan tidak diterima
                    </div>
                  </div>
                  <div className="flex gap-3 items-start group">
                    <MdCheck className="text-green-500 text-xl mt-1 flex-shrink-0" />
                    <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      Refund atau tetap miliki produk yang tidak sesuai dengan
                      deskripsi
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-all duration-300">
                <CardBody className="p-6">
                  <h3 className="font-semibold text-lg text-primary-main">
                    Untuk Info Hubungi:
                  </h3>
                </CardBody>
                <Divider />
                <CardBody className="p-6">
                  <div className="flex items-center gap-3 group">
                    <MdWhatsapp className="text-green-500 text-xl" />
                    <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
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
