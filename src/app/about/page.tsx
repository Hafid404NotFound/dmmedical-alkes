import ActionButtonWa from "@/components/ActionButtonWa";
import FooterComponent from "@/components/FooterComponent";
import PageContainer from "@/components/PageContainer";
import ReviewSectionHome from "@/components/ReviewSectionHome";
import TopBar from "@/components/TopBar";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function AboutPage() {
  const missionData = [
    `Bekerjasama dan berkolaborasi dengan mitra bisnis baik produsen hingga pelanggan diseluruh Indonesia untuk menghadirkan produk kesehatan dalam rangka meningkatkan kualitas pelayanan kesehatan masyarakat Indonesia.`,
    `Menerapkan teknologi informasi yang efektif dan terintegrasi untuk meningkatkan efisiensi penyaluran produk serta mengedepankan service terbaik.`,
    `Selalu menerapkan continuous improvement dalam berorganisasi agar tercipta suasana yang positif dalam bekerja di lingkungan  Dm Medical Alkes`,
    `Membangun etos kerja berdasarkan inovasi, proaktif, pengetahuan, integritas, dan kejujuran.`,
  ];

  const dataImage = [
    {
      image: "/about_4.png",
      label: "Kualitas Produk Terbaik",
      description: `Kualitas  Produk yang kami tawarkan tentunya memiliki Kuialitas yang terbaik dan terjamin`,
    },
    {
      image: "/about_5.png",
      label: "Pengiriman Terbaik",
      description: `Kami Selalu mengedepankan Kepuasan customer dengan memberi jangka waktu pengiriman yang cepat dan aman`,
    },
    {
      image: "/about_6.png",
      label: "Harga Bersaing",
      description: `Kami menawarkan harga yang bersaing dari kompetitor dan tentunya bisa menyesuaikan dengan budget yang ada`,
    },
  ];

  return (
    <div className="">
      <ActionButtonWa />

      <TopBar />
      <div className="grid gap-16">
        <div className="bg-gradient-to-b to-primary-main from-secondary-main relative">
          <div className="absolute text-white bottom-1/2 w-full text-center z-40">
            <div className="font-semibold text-4xl">Tentang Kami</div>
            <p>
              Selamat Datang! Kenal lebih dekat bersama kami DM Medical Alkes
            </p>
          </div>
          <Image
            src={"/about_img.jpg"}
            width={1000}
            height={1000}
            className="w-full h-[50vh] object-cover opacity-30"
            alt="about"
          />
        </div>
        <PageContainer>
          <div className="text-3xl font-bold text-primary-main">VISI</div>
          <p className="mt-4">
            Menjadi perusahaan multinasional nomor 1 di Indonesia yang menjalin
            hubungan baik dengan pelanggan dan pengembangan manajemen yang
            unggul dan terpercaya.
          </p>
        </PageContainer>
        <PageContainer>
          <div className="flex flex-col items-end justify-end text-end">
            <div className="text-3xl font-bold text-primary-main">MISI</div>
            {missionData.map((e, i) => (
              <p
                className={twMerge(
                  "py-4 border-b ",
                  i === missionData.length - 1
                    ? "border-b-transparent"
                    : "border-b-gray-300"
                )}
                key={e}
              >
                {e}
              </p>
            ))}
          </div>
        </PageContainer>

        <PageContainer>
          <div className="grid lg:grid-cols-3 gap-4">
            {dataImage.map((e, i) => (
              <div key={i}>
                <div className="bg-gradient-to-b gap-6 p-6 rounded-lg h-52  from-secondary-main to-primary-main grid  text-white text-center">
                  <div className="flex items-center justify-center relative">
                    <Image
                      className="w-32 h-auto"
                      alt={e.description}
                      width={200}
                      height={200}
                      src={e.image}
                    />
                  </div>
                  <p className="h-full flex items-end justify-center text-center">
                    {e.label}
                  </p>
                </div>
                <div className="text-center mt-8">{e.description}</div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>
      <div className="my-20 text-primary-main">
        <PageContainer>
          <ReviewSectionHome />
        </PageContainer>
      </div>
      <FooterComponent />
    </div>
  );
}
