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
    .eq("id", id);
  const data: IProduct = query?.data ? query?.data[0] : undefined;
  return (
    <div>
      <ActionButtonWa />

      <TopBar />
      <PageContainer>
        <div className="lg:grid-cols-2 grid mt-20">
          <div className="w-full">
            <div className="relative z-[99] w-full h-auto aspect-video ">
              <ParallaxScrollScrubVideo value={data.video_url} />
            </div>
          </div>
          <div className="flex-1 lg:pl-4 mt-5 lg:mt-0">
            <div className="text-4xl font-semibold">{data.name}</div>
            <div className="mt-4">
              <CKEditorPreview content={data.description} />
            </div>
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
                  <div className="bg-green-600 flex items-center gap-3 px-4">
                    <MdWhatsapp className="text-white text-3xl h-10" />
                    <div className="text-white">Beli via Whatsapp</div>
                  </div>
                </Link>
              )}
            </div>
            <div className="mt-16 grid gap-4">
              <Card>
                <CardBody>
                  <div className="flex gap-2 items-center ">
                    <MdStarOutline className="text-2xl" /> Perlindungan Pembeli
                  </div>
                </CardBody>
                <Divider />
                <CardBody>
                  <div className="flex items-center gap-3">
                    <MdCheck />
                    <div>
                      <strong>Full refund</strong> jika pesanan tidak diterima
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MdCheck />
                    <div>
                      <strong>
                        Refund atau tetap miliki produk yang tidak sesuai dengan
                        deskripsi
                      </strong>{" "}
                      Refund atau tetap miliki produk yang tidak sesuai dengan
                      deskripsi
                    </div>
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div> Untuk Info Hubungi:</div>
                </CardBody>
                <Divider />
                <CardBody>
                  <div className="flex items-center gap-2">
                    <MdWhatsapp />
                    <p> 0895366450806 (Bekasi)</p>
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
