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
    <div>
      <ActionButtonWa />

      <TopBar />
      <PageContainer>
        <div className="mt-10 grid gap-5">
          <div className="flex items-center justify-between w-full">
            <PageTitle title="PRODUK" />
            <ProductCategoryList data={dataCategory} />
          </div>
          {data.length === 0 && <EmptyCardProduct />}

          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {data.map((item, i) => (
              <Card key={i} className="overflow-hidden">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  height={200}
                  width={200}
                  className="w-full"
                />
                <CardBody>
                  {item.category && (
                    <div className="text-gray-400">{item.category.name}</div>
                  )}
                  <div className="font-semibold">{item.name}</div>
                  <Link
                    href={`/product/${item.id}`}
                    className="mt-3 text-primary-main hover:underline cursor-pointer"
                  >
                    Lihat detail
                  </Link>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </PageContainer>
      <div className="mt-20 w-full">
        <FooterComponent />
      </div>
    </div>
  );
}
