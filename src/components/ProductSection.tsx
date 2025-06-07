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
    <div
      className="py-12 sm:py-24 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent"
      id="product"
    >
      {" "}
      <div className="flex flex-col items-center mb-8 sm:mb-16 gap-2 sm:gap-3 px-4 sm:px-0">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <div className="w-8 sm:w-10 h-[2px] bg-gradient-to-r from-primary-main to-secondary-main rounded-full"></div>
          <h2 className="text-gray-600 text-xs sm:text-sm uppercase tracking-wider">
            Our Products
          </h2>
          <div className="w-8 sm:w-10 h-[2px] bg-gradient-to-r from-secondary-main to-primary-main rounded-full"></div>
        </div>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-center bg-gradient-to-r from-primary-main to-secondary-main text-transparent bg-clip-text">
          Featured Medical Equipment
        </h1>
        <p className="text-sm sm:text-base text-gray-600 text-center max-w-2xl mx-auto mt-2">
          Discover our premium selection of medical equipment, designed to meet
          the highest standards of quality and reliability
        </p>
      </div>
      <PageContainer>
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-full px-4 sm:px-0">
          {data.map((item, i) => (
            <Fragment key={i}>
              {i <= 3 && (
                <div className="group relative bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    {item.image_url && (
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          alt={item.name}
                          width={400}
                          src={item.image_url}
                          height={400}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          quality={90}
                          priority={i <= 3} // Load first 4 images immediately
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 sm:p-4">
                    {item.category?.name && (
                      <p className="text-xs sm:text-sm text-secondary-main font-medium mb-1 sm:mb-2">
                        {item?.category?.name}
                      </p>
                    )}
                    <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 mb-2 sm:mb-3 group-hover:text-primary-main transition-colors">
                      {item.name}
                    </h3>
                    <Link
                      href={`/product/${item.id}`}
                      className="inline-flex items-center gap-1 sm:gap-2 text-sm sm:text-base text-primary-main font-medium hover:text-secondary-main transition-colors"
                    >
                      View Details
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="flex items-center justify-center mt-8 sm:mt-12 px-4 sm:px-0">
          <Link href={"/product"}>
            <Button className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-medium hover:scale-105 transform transition-transform duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto">
              <span className="flex items-center gap-2">
                View All Products
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
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
      </PageContainer>
    </div>
  );
}
