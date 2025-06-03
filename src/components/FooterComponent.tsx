import { MdFacebook, MdMail, MdPhone, MdPinDrop } from "react-icons/md";
import PageContainer from "./PageContainer";
import { IoLogoInstagram } from "react-icons/io";
import { PiLinkedinLogo } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
export const dataContact = [
  {
    label:
      "Kp.Bojong Tua, Jl. Masjid Al-Ikhlas RT 003/RW 001 (Blok B No.18), Pondok Gede.",
    icon: <MdPinDrop />,
  },
  {
    label: "+62-21-78838951",
    icon: <MdPhone />,
  },
  {
    label: "marketing@Dm.co.id",
    icon: <MdMail />,
  },
];

const dataSosmed = [
  {
    url: "https://google.com",
    icon: MdFacebook,
  },
  {
    url: "https://www.instagram.com/dmmedical_alkes/",
    icon: IoLogoInstagram,
  },
  {
    url: "https://google.com",
    icon: PiLinkedinLogo,
  },
];

export default function FooterComponent() {
  return (
    <div className="py-24 lg:w-full lg:max-w-full bg-gradient-to-r max-w-xl from-primary-main to-secondary-main">
      <PageContainer>
        <div className="text-white grid lg:grid-cols-2">
          <div className="lg:grid gap-4 flex flex-col items-center justify-center lg:text-start text-center">
            <Image
              alt="logo"
              src={"/logo.png"}
              width={200}
              height={200}
              className="h-16 w-auto"
            />
            <p className="lg:w-md">
              Perusahaan penyedia alat kualitas terbaik dan pelayanan prima
              untuk customer.
            </p>
            <div className="font-semibold text-2xl">Powered by</div>
            <div>Follow Us</div>
            <div className="flex items-center gap-4 mt-3 text-3xl">
              {dataSosmed.map((e, i) => {
                const Icon = e.icon;
                return (
                  <Link key={i} href={e.url} target="__blank">
                    <Icon />
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="grid gap-4 mt-5 lg:mt-0">
            <div className="text-3xl font-semibold text-center lg:text-start">
              Contact Us
            </div>
            <div className="lg:grid gap-3 flex items-center justify-center text-center lg:text-start flex-col ">
              {dataContact.map((item, i) => (
                <div key={i} className="flex gap-4 ">
                  <div className="lg:block hidden">
                    <div className="bg-primary-dark w-8 h-8  items-center justify-center flex rounded-lg ">
                      {item.icon}
                    </div>
                  </div>

                  <p className="text-base">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full text-white text-center mt-10">
          <p>© 2025 PT Dm Medical Alkes. All Rights Reserved.</p>
        </div>
      </PageContainer>
    </div>
  );
}
