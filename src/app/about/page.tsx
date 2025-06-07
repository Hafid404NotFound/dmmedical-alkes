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
    <div className="min-h-screen bg-gray-50/50">
      <ActionButtonWa />
      <TopBar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b to-primary-main/95 from-secondary-main/95 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="absolute w-full h-full flex items-center justify-center z-10">
          <div className="text-center space-y-4 px-4 transform hover:scale-105 transition-all duration-500">
            <h1 className="font-bold text-4xl lg:text-5xl text-white mb-4">
              Tentang Kami
            </h1>
            <div className="w-20 h-1 bg-white/30 mx-auto rounded-full"></div>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
              Selamat Datang! Kenal lebih dekat bersama kami DM Medical Alkes
            </p>
          </div>
        </div>

        <Image
          src="/about_img.jpg"
          width={1000}
          height={1000}
          className="w-full h-[60vh] object-cover opacity-50"
          alt="about"
        />
      </div>

      <div className="grid gap-24 py-20">
        {/* Visi Section */}
        <PageContainer>
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-6">
              <h2 className="text-4xl font-bold text-primary-main inline-block">
                VISI
              </h2>
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-secondary-main/30 rounded-full"></div>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Menjadi perusahaan multinasional nomor 1 di Indonesia yang
              menjalin hubungan baik dengan pelanggan dan pengembangan manajemen
              yang unggul dan terpercaya.
            </p>
          </div>
        </PageContainer>

        {/* Misi Section */}
        <PageContainer>
          <div className="max-w-4xl ml-auto">
            <div className="flex flex-col items-end text-end">
              <div className="relative mb-6">
                <h2 className="text-4xl font-bold text-primary-main inline-block">
                  MISI
                </h2>
                <div className="absolute -bottom-2 right-0 w-20 h-1 bg-secondary-main/30 rounded-full"></div>
              </div>
              <div className="space-y-6">
                {missionData.map((e, i) => (
                  <div
                    key={i}
                    className="group hover:bg-white/80 p-6 rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    <p
                      className={twMerge(
                        "text-gray-700 leading-relaxed text-lg",
                        i === missionData.length - 1
                          ? ""
                          : "border-b border-b-gray-200 pb-6"
                      )}
                    >
                      {e}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>

        {/* Features Section */}
        <PageContainer>
          <div className="grid lg:grid-cols-3 gap-8">
            {dataImage.map((e, i) => (
              <div
                key={i}
                className="group hover:transform hover:scale-105 transition-all duration-500"
              >
                <div
                  className="bg-gradient-to-b gap-6 p-8 rounded-2xl h-64 
                             from-secondary-main to-primary-main 
                             flex flex-col items-center justify-between
                             relative overflow-hidden shadow-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative transform group-hover:scale-110 transition-all duration-500">
                    <div className="absolute -inset-4 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
                    <Image
                      className="w-32 h-auto relative z-10 drop-shadow-xl"
                      alt={e.description}
                      width={200}
                      height={200}
                      src={e.image}
                    />
                  </div>

                  <h3 className="text-xl font-semibold text-white relative z-10">
                    {e.label}
                  </h3>
                </div>
                <div className="text-center mt-6 px-4">
                  <p className="text-gray-700">{e.description}</p>
                </div>
              </div>
            ))}
          </div>
        </PageContainer>
      </div>

      {/* Review Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50/50 to-white">
        <PageContainer>
          <ReviewSectionHome />
        </PageContainer>
      </div>

      <FooterComponent />
    </div>
  );
}
