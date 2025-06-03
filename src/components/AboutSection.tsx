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
      <div className="bg-secondary-main py-4 lg:py-16 text-white" id="about">
        <PageContainer>
          <div className="lg:flex">
            <div className="text-4xl lg:min-w-xs font-bold  text-white pb-8 ">
              Tentang <br />
              DM medical
            </div>
            <div className="grid gap-2">
              <p className="">
                Dm Medical Alkes adalah penyedia penyedia alat kesehatan yang
                terpercaya dan berkualitas di Indonesia.
              </p>
              <p className="">
                Dm Medical Alkes fokus pada penjualan alat kesehatan, kerjasama
                operasional, dan mendepankan kualitas produk.
              </p>
              <div className="grid lg:grid-cols-3 gap-4 ">
                {dataAbout.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-b from-0% to-primary-main flex flex-col items-center justify-center text-center px-8 py-12  gap-5 rounded-md"
                  >
                    <Image
                      className="h-20 w-20"
                      src={"/about_" + (i + 1) + ".png"}
                      alt={item}
                      height={200}
                      width={200}
                    />
                    <div>{item}</div>
                  </div>
                ))}
                <Link href={"/about"}>
                  <Button className="mt-7">Selengkapnya</Button>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </div>
      <div className="py-8 lg:py-16">
        <PageContainer>
          <div className="flex lg:mb-20  flex-col justify-center items-center text-center">
            <div className="lg:text-5xl text-3xl text-secondary-main font-semibold">
              Kebutuhan anda Kami Miliki
            </div>
            <p className="font-bold italic text-[#2CA580] lg:text-5xl text-2xl mt-2">
              Asli, aman, berkualitas!
            </p>
            <div className="grid  gap-4 mt-10 lg:grid-cols-2">
              <DownloadCatalogButton />
              <Link href={"/get-question"}>
                <Button variant="secondary">GET QUESTION</Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </div>
    </div>
  );
}
