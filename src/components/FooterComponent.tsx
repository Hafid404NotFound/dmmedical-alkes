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
    label: "+62 813-8903-7818",
    icon: <MdPhone />,
  },
  {
    label: "marketing@dm.co.id",
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
    <div className="relative py-24 bg-gradient-to-r from-primary-main to-secondary-main overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -left-20 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute -right-20 bottom-0 w-96 h-96 bg-primary-dark/10 rounded-full blur-3xl"></div>
      </div>

      <PageContainer>
        <div className="text-white grid lg:grid-cols-2 gap-12 relative">
          {/* Left Column */}
          <div className="lg:grid gap-6 flex flex-col items-center justify-center lg:text-start text-center">
            <div className="transform hover:scale-105 transition-all duration-300">
              <Image
                alt="logo"
                src={"/logo.png"}
                width={200}
                height={200}
                className="h-16 w-auto drop-shadow-lg"
              />
            </div>
            <p className="lg:w-md text-lg text-white/90 leading-relaxed max-w-lg">
              Perusahaan penyedia alat kualitas terbaik dan pelayanan prima
              untuk customer.
            </p>
            <div className="space-y-6">
              <div className="font-semibold text-2xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Powered by
              </div>
              <div className="relative">
                <div className="text-lg font-medium text-white/90 after:content-[''] after:absolute after:-bottom-2 after:left-1/2 after:w-12 after:h-0.5 after:bg-white/30 after:rounded-full after:transform after:-translate-x-1/2">
                  Follow Us
                </div>
              </div>
              <div className="flex items-center gap-6 mt-3">
                {dataSosmed.map((e, i) => {
                  const Icon = e.icon;
                  return (
                    <Link
                      key={i}
                      href={e.url}
                      target="__blank"
                      className="text-3xl text-white/90 hover:text-white transform hover:scale-110 hover:-translate-y-1 transition-all duration-300"
                    >
                      <Icon />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="grid gap-6 mt-5 lg:mt-0">
            <div className="text-3xl font-semibold text-center lg:text-start">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Contact Us
              </span>
            </div>
            <div className="lg:grid gap-6 flex items-center justify-center text-center lg:text-start flex-col">
              {dataContact.map((item, i) => (
                <div
                  key={i}
                  className="group flex gap-4 items-start transform hover:translate-x-2 transition-all duration-300"
                >
                  <div className="lg:block hidden">
                    <div className="bg-primary-dark/80 w-10 h-10 items-center justify-center flex rounded-xl shadow-lg backdrop-blur-sm group-hover:bg-primary-dark group-hover:scale-110 transition-all duration-300">
                      {item.icon}
                    </div>
                  </div>
                  <p className="text-base text-white/90 group-hover:text-white transition-colors duration-300 max-w-md">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-48 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          <div className="w-full text-white/80 text-center mt-10 pt-10 hover:text-white transition-colors duration-300">
            <p>© 2025 PT Dm Medical Alkes. All Rights Reserved.</p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
