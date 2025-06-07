import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import DownloadCatalogButton from "./DownloadCatalogButton";
import PageContainer from "./PageContainer";

export function AboutSection() {
  const dataAbout = [
    "Penjualan Alat Kesehatan",
    "Kerjasama dengan rumah sakit umum",
    "Mengkedepankan Produk yang berkualitas",
  ];
  return (
    <div>
      <div
        className="relative bg-gradient-to-b from-primary-main to-secondary-main py-4 lg:py-16 text-white overflow-hidden"
        id="about"
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-main/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-main/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>

        <PageContainer>
          <div className="lg:flex relative">
            <div className="text-4xl lg:text-5xl lg:min-w-xs font-bold text-white pb-8 relative">
              <div className="relative z-10">
                <span className="relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-1/2 after:h-1 after:bg-white/50 after:rounded-full">
                  Tentang
                </span>
                <br />
                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  DM medical
                </span>
              </div>
            </div>

            <div className="grid gap-4">
              <p className="text-lg leading-relaxed text-white/90 backdrop-blur-sm">
                Dm Medical Alkes adalah penyedia penyedia alat kesehatan yang
                terpercaya dan berkualitas di Indonesia.
              </p>
              <p className="text-lg leading-relaxed text-white/90 backdrop-blur-sm">
                Dm Medical Alkes fokus pada penjualan alat kesehatan, kerjasama
                operasional, dan mendepankan kualitas produk.
              </p>

              <div className="grid lg:grid-cols-3 gap-6 mt-4">
                {dataAbout.map((item, i) => (
                  <div
                    key={i}
                    className="group bg-gradient-to-b from-white/10 to-primary-main/30 backdrop-blur-sm flex flex-col items-center justify-center text-center px-8 py-12 gap-5 rounded-xl hover:transform hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-primary-main/20"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary-main/20 rounded-full blur-xl transform scale-75 group-hover:scale-100 transition-transform duration-300"></div>
                      <Image
                        className="h-20 w-20 relative z-10 transform group-hover:scale-110 transition-transform duration-300"
                        src={"/about_" + (i + 1) + ".png"}
                        alt={item}
                        height={200}
                        width={200}
                      />
                    </div>
                    <div className="font-medium text-lg group-hover:text-white transition-colors duration-300">
                      {item}
                    </div>
                  </div>
                ))}
              </div>
              <Link href={"/about"} className="mt-8 inline-block">
                <Button className="transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  <span className="flex items-center gap-2">
                    Selengkapnya
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>

      <div className="py-8 lg:py-16 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-secondary-main/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        <PageContainer>
          <div className="flex lg:mb-20 flex-col justify-center items-center text-center relative">
            <div className="lg:text-5xl text-3xl text-secondary-main font-semibold mb-4 relative">
              <span className="relative inline-block">
                Kebutuhan anda Kami Miliki
                <span className="absolute -bottom-2 left-1/2 w-1/2 h-1 bg-secondary-main/30 rounded-full transform -translate-x-1/2"></span>
              </span>
            </div>
            <p className="font-bold italic text-[#2CA580] lg:text-5xl text-2xl mt-2 transform hover:scale-105 transition-all duration-300">
              Asli, aman, berkualitas!
            </p>
            <div className="grid gap-6 mt-10 lg:grid-cols-2 w-full max-w-2xl mx-auto">
              <div className="transform hover:scale-105 transition-all duration-300">
                <DownloadCatalogButton />
              </div>
              <Link
                href={"/get-question"}
                className="transform hover:scale-105 transition-all duration-300"
              >
                <Button
                  variant="secondary"
                  className="w-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  GET QUESTION
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
