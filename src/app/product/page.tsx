"use server";
import ActionButtonWa from "@/components/ActionButtonWa";
import { Card, CardBody } from "@/components/Card";
import EmptyCardProduct from "@/components/EmptyCardProduct";
import FooterComponent from "@/components/FooterComponent";
import PageContainer from "@/components/PageContainer";
import PageTitle from "@/components/PageTitle";
import ProductCategoryList from "@/components/ProductCategoryList";
import TopBar from "@/components/TopBar";
import { ICategory } from "@/types/ICategory";
import { IProduct } from "@/types/IProduct";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ searchParams }: any) {
  const supabase = createClient();
  const category = searchParams?.category || undefined;
  console.log(category);
  const query = await (await supabase).from("product").select(
    `
    *,
    category (
      id,
      name
    )
  `
  );

  let data: IProduct[] = query?.data || [];
  if (category) {
    data = data.filter((e) => parseInt(e.category_id) === parseInt(category));
  }
  const queryCategory = await (await supabase).from("category").select();
  const dataCategory: ICategory[] = queryCategory?.data || [];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <ActionButtonWa />
      <TopBar />

      <PageContainer>
        <div className="mt-10 space-y-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 w-full">
            <div className="relative">
              <PageTitle title="PRODUK" />
              <div className="absolute -bottom-2 left-0 w-20 h-1 bg-primary-main/30 rounded-full"></div>
            </div>
            <ProductCategoryList data={dataCategory} />
          </div>

          {/* Empty State */}
          {data.length === 0 && <EmptyCardProduct />}

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((item, i) => (
              <Link
                href={`/product/${item.id}`}
                key={i}
                className="group hover:transform hover:scale-[1.02] transition-all duration-300"
              >
                <Card className="overflow-hidden border border-gray-100 hover:border-primary-main/20 hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative aspect-square overflow-hidden bg-gray-50">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      height={400}
                      width={400}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  <CardBody className="p-5 space-y-3">
                    {item.category && (
                      <div className="text-sm text-primary-main/80 font-medium">
                        {item.category.name}
                      </div>
                    )}
                    <h3 className="font-semibold text-gray-800 group-hover:text-primary-main transition-colors duration-300 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="pt-2 flex items-center gap-2 text-primary-main group-hover:text-secondary-main transition-colors duration-300">
                      <span className="text-sm font-medium">Lihat detail</span>
                      <svg
                        className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </PageContainer>

      <div className="mt-20">
        <FooterComponent />
      </div>
    </div>
  );
}
