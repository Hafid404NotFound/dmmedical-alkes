import { AboutSection } from "@/components/AboutSection";
import ActionButtonWa from "@/components/ActionButtonWa";
import Button from "@/components/Button";
import DownloadCatalogButton from "@/components/DownloadCatalogButton";
import FooterComponent from "@/components/FooterComponent";
import ProductSection from "@/components/ProductSection";
import ProductImageViewer from "@/components/ProductImageViewer";
import TopBar from "@/components/TopBar";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

export default function Home() {
  const dataListHomeOverview = [
    "Menampilkan detail produk interaktif",
    "Kepercayaan di utamakan",
    "Dm Medical Alkes",
  ];
  // Image filenames from public/gambar 360/
  const imageViewerFiles = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
    "11.png",
    "12.png",
    "13.png",
    "14.png",
    "15.png",
    "16.png",
    "17.png",
    "18.png",
    "19.png",
    "20.png",
    "21.png",
    "22.png",
    "23.png",
    "24.png",
    "26.png",
    "27.png",
    "28.png",
    "29.png",
    "30.png",
    "31.png",
    "32.png",
    "33.png",
    "34.png",
    "35.png",
    "36.png",
    "37.png",
  ];

  return (
    <div
      className="lg:bg-primary-main lg:h-[90vh] lg:max-w-full max-w-xl"
      id="home"
    >
      <ActionButtonWa />{" "}
      <div className="h-[12%] sm:h-[15%] text-white flex items-center">
        <TopBar />
      </div>{" "}
      <div className="grid lg:grid-cols-2 bg-gradient-to-b from-primary-main to-secondary-main flex-1 h-[100%] py-8">
        <div className="bg-transparent relative overflow-hidden w-full rounded-tr-[45px] sm:rounded-tr-[60px] lg:rounded-tr-[90px] flex items-center justify-center z-10 lg:ml-30 ">
          {/* Medical equipment decorative elements */}
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/10 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-white/10 rounded-full"></div>
          </div>
          <div className="absolute bottom-4 right-4 w-10 h-10 border-2 border-white/10 rounded-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-[2px] bg-white/10"></div>
              <div className="w-[2px] h-6 bg-white/10 absolute"></div>
            </div>
          </div>

          {/* Medical cross symbols */}
          <div className="absolute top-[20%] right-6 w-6 h-6">
            <div className="w-full h-[2px] bg-white/10 absolute top-1/2 -translate-y-1/2"></div>
            <div className="h-full w-[2px] bg-white/10 absolute left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="absolute bottom-[20%] left-6 w-4 h-4">
            <div className="w-full h-[2px] bg-white/10 absolute top-1/2 -translate-y-1/2"></div>
            <div className="h-full w-[2px] bg-white/10 absolute left-1/2 -translate-x-1/2"></div>
          </div>

          {/* Heartbeat line */}
          <div className="absolute top-8 left-1/4 right-1/4 h-[1px] bg-white/10">
            <div
              className="absolute left-1/3 -top-1 h-2 w-6 bg-white/10 
              clip-path-[polygon(0_100%,30%_100%,45%_0,55%_0,70%_100%,100%_100%,100%_90%,75%_90%,60%_0,40%_0,25%_90%,0_90%)]"
            ></div>
          </div>

          {/* Medical hexagon */}
          <div className="absolute bottom-12 right-12 w-16 h-16 border-2 border-white/10 rotate-45 hidden sm:block"></div>

          {/* Main content container */}
          <div className="w-full h-full flex items-center justify-center py-3 sm:py-4 lg:py-0">
            <div className="w-[85%] sm:w-[88%] lg:w-[90%] mx-auto relative">
              {" "}
              {/* Corner accents */}
              <div className="absolute -top-3 -left-3 w-6 h-6 border-l-2 border-t-2 border-white/10"></div>
              <div className="absolute -bottom-3 -right-3 w-6 h-6 border-r-2 border-b-2 border-white/10"></div>{" "}
              {/* 360 Image Text Overlay - Left corner */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20">
                <div className="inline-flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <div className="w-4 h-4 sm:w-6 sm:h-6 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3 h-3 sm:w-5 sm:h-5 text-white/80"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 2L2 7l10 5 10-5-10-5z" />
                      <path d="M2 17l10 5 10-5" />
                      <path d="M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <span className="text-white/90 font-medium sm:font-semibold text-xs sm:text-sm tracking-wide">
                    360° IMAGE
                  </span>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/60 rounded-full animate-pulse"></div>
                </div>
              </div>
              {/* Video container */}
              <div className="relative z-10">
                {/* <ParallaxScrollScrubVideo value="/video.mp4" /> */}
                <ProductImageViewer imageFilenames={imageViewerFiles} />
              </div>
            </div>
          </div>
        </div>{" "}
        <div className="flex items-start justify-star w-full pt-6 sm:pt-5 lg:pt-16 relative z-20">
          <div className="bg-white scale-80 p-6 sm:p-8 lg:rounded-3xl rounded-4xl flex flex-col gap-6 sm:gap-8 w-full lg:-translate-x-56 lg:-translate-y-8 shadow-[0_4px_20px_rgba(0,0,0,0.40)] hover:shadow-[0_8px_30px_rgba(1,0,0,0.5)] transition-shadow duration-300">
            <div className="grid lg:grid-cols-2">
              <div className="border-l h-full border-black py-3 sm:py-4 gap-3 grid">
                {dataListHomeOverview.map((item, i) => (
                  <div
                    key={i}
                    className={twMerge(
                      "h-fit  px-3 py-2 rounded-r-full text-xs lg:text-base text-white ",
                      i === 0 && "bg-[#979797] w-full ",
                      i === 2 && "bg-secondary-main w-[60%] ",
                      i === 1 && "bg-[#CCCCCC] text-black w-[80%]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {i === 2 && (
                        <Image
                          alt="logo"
                          src={"/logo.png"}
                          width={200}
                          height={200}
                          className="h-4 w-4"
                        />
                      )}
                      {item}
                    </div>
                  </div>
                ))}
              </div>
              <p className="lg:pl-10  mt-10 lg:mt-0 text-4xl  w-full ">
                <strong>Jaminan</strong> Informasi, Kepercayaan{" "}
                <span className="text-secondary-main font-bold">100% </span>
                di Setiap Pilihan!
              </p>
            </div>
            <div className="lg:w-full flex   flex-col lg:flex-row items-center gap-4 justify-center">
              <DownloadCatalogButton />
              <Link href={"/get-question"} className="w-full lg:w-fit">
                <Button className="w-full lg:w-fit" variant="secondary">
                  GET QUESTION
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ProductSection />
      <AboutSection />
      <FooterComponent />
    </div>
  );
}
