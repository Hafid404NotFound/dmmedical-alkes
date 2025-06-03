"use client";
import PageContainer from "./PageContainer";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
import { IProduct } from "@/types/IProduct";
import { Fragment, useEffect, useState } from "react";
import Button from "./Button";
import Link from "next/link";

export default function ProductSection() {
  const [data, setData] = useState<IProduct[]>([]);
  const supabase = createClient();
  useEffect(() => {
    supabase
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
      .then((e) => {
        setData(e.data as any);
      });
  }, []);

  return (
    <div className="my-24" id="product">
      <div className="flex flex-col items-center my-8 gap-2 ">
        <h1 className="w-full text-center font-semibold text-3xl">PRODUCT</h1>
        <Image
          alt="logo"
          src={"/logo.png"}
          width={200}
          height={200}
          className="h-10 w-auto"
        />
      </div>
      <PageContainer>
        <div className="grid gap-4 lg:grid-cols-4 grid-cols-2 max-w-full lg:max-xl:">
          {data.map((item, i) => (
            <Fragment key={i}>
              {i <= 3 && (
                <div key={i} className="lg:w-full lg:max-xl">
                  {item.image_url && (
                    <Image
                      alt={item.name}
                      width={200}
                      src={item.image_url}
                      height={200}
                      className="aspect-square w-full lg:w-full max-w-xl"
                    />
                  )}
                  {item.category?.name && (
                    <p className="text-gray-400">{item?.category?.name}</p>
                  )}
                  <div className="mt-3 font-semibold line-clamp-2">
                    {item.name}
                  </div>
                  <Link
                    href={`/product/${item.id}`}
                    className="mt-3 text-primary-main hover:underline cursor-pointer"
                  >
                    Lihat detail
                  </Link>
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className="flex items-center justify-center mt-5">
          <Link href={"/product"}>
            <Button>SELENGKAPNYA</Button>
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
