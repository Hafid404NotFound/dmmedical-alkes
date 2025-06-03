"use client";
import Image from "next/image";
import PageContainer from "./PageContainer";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { MdClose, MdMenu } from "react-icons/md";
import Divider from "./Divider";
import { useState } from "react";

export default function TopBar(props: IProps) {
  const [show, setShow] = useState<boolean>(false);
  const dataNavbar = [
    {
      label: "home",
      key: "/",
    },
    {
      label: "product",
      key: "/product",
    },
    {
      label: "about",
      key: "/#about",
    },
    {
      label: "contact us",
      key: "/get-question",
    },
  ];

  return (
    <div
      className={twMerge(
        "w-full  py-3",
        !props.transparent && "bg-primary-main"
      )}
    >
      <div
        className={twMerge(
          "h-screen w-full lg:hidden bg-white fixed top-0 right-0 duration-700",
          show ? "translate-x-0" : "-translate-x-[999px]"
        )}
        style={{ zIndex: 9999 }}
      >
        <PageContainer>
          <div className="grid py-10">
            <div className="flex justify-between">
              <Link href={"/"}>
                <Image
                  alt="logo"
                  src={"/logo.png"}
                  width={200}
                  height={200}
                  className="h-16 w-auto"
                />
              </Link>
              <div
                onClick={() => setShow(false)}
                className="text-gray-600 text-3xl cursor-pointer"
              >
                <MdClose />
              </div>
            </div>
            <div className="my-3">
              <Divider />
            </div>
            <div className="grid gap-4">
              {dataNavbar.map((item, i) => (
                <Link
                  onClick={() => setShow(false)}
                  className="capitalize lg:text-base text-primary-main text-xl border-b pb-4 hover:text-secondary-main"
                  href={item.key}
                  key={i}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </PageContainer>
      </div>
      <PageContainer>
        <div className=" items-center  text-white w-full flex justify-between">
          <Link href={"/"}>
            <Image
              alt="logo"
              src={"/logo.png"}
              width={200}
              height={200}
              className="h-16 w-auto"
            />
          </Link>
          <div
            className="text-3xl lg:hidden cursor-pointer"
            onClick={() => setShow(true)}
          >
            <MdMenu />
          </div>
          <div className="lg:text-2xl hidden  text-xs lg:flex gap-2  lg:gap-10">
            {dataNavbar.map((item, i) => (
              <Link
                className="capitalize lg:text-base text-xs hover:text-secondary-main"
                href={item.key}
                key={i}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

interface IProps {
  transparent?: boolean;
  className?: string;
}
