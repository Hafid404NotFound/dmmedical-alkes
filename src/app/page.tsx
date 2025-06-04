import { AboutSection } from "@/components/AboutSection";
import ActionButtonWa from "@/components/ActionButtonWa";
import Button from "@/components/Button";
import DownloadCatalogButton from "@/components/DownloadCatalogButton";
import FooterComponent from "@/components/FooterComponent";
import ProductSection from "@/components/ProductSection";
import ParallaxScrollScrubVideo from "@/components/ScroolVideo";
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

  return (
    <div
      className="lg:bg-primary-main lg:h-[80vh] lg:max-w-full max-w-xl"
      id="home"
    >
      <ActionButtonWa />
      <div className="h-[20%]  text-white flex items-center ">
        <TopBar />
      </div>
      <div className="grid lg:grid-cols-2 bg-primary-main flex-1 h-[80%]  ">
        <div className="bg-secondary-main relative overflow-hidden w-full rounded-tr-[80px] flex items-center justify-center">
          <div className="w-full">
            <ParallaxScrollScrubVideo value="/video.mp4" />
          </div>
        </div>
        <div className="flex items-center justify-star w-full ">
          <div className="bg-white scale-75 p-8 lg:rounded-3xl rounded-4xl flex flex-col gap-10 w-full lg:-translate-x-56 shadow-[4px_0_10px_4px_rgba(0,0,0,0.25)]">
            <div className="grid  lg:grid-cols-2">
              <div className="border-l h-full border-black py-4 gap-3 grid">
                {dataListHomeOverview.map((item, i) => (
                  <div
                    key={i}
                    className={twMerge(
                      "h-fit  px-3 py-2 rounded-r-full text-xs lg:text-base text-white",
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
