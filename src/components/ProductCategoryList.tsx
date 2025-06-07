"use client";
import { ICategory } from "@/types/ICategory";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";
import Dropdown from "./Dropdown";
import Button from "./Button";
import { ListGroup, ListItem } from "./List";
import { MdArrowCircleDown, MdArrowDownward, MdClose } from "react-icons/md";
import { div } from "framer-motion/client";

function ProductCategoryListContent(props: IProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category"); // will be "5"

  function navigate(id: number) {
    if (!id) return;

    const current = parseInt(category ?? "");
    if (!isNaN(current) && id === current) {
      router.push("/product");
    } else {
      router.push(`/product?category=${id}`);
    }
  }
  const findCategory = props.data.find((e) => e.id.toString() === category);
  return (
    <div className="flex items-center gap-3">
      <Dropdown
        toggle={
          <div className="flex items-center gap-3">
            <div
              className={twMerge(
                "px-3 gap-4 flex items-center py-1 border border-gray-400 rounded-md",
                findCategory &&
                  "text-primary-main border-primary-main bg-primary-100"
              )}
            >
              <div> {findCategory ? findCategory.name : "Pilih Category"}</div>
              <div>
                <MdArrowCircleDown />
              </div>
            </div>
          </div>
        }
      >
        <ListGroup>
          {props.data.map((item) => (
            <ListItem
              active={item.id.toString() === category}
              onClick={() => navigate(item.id)}
              key={item.id}
              label={item.name}
            />
          ))}
        </ListGroup>
      </Dropdown>
      {findCategory && (
        <MdClose
          onClick={() => {
            router.push("/product");
          }}
        />
      )}
    </div>
  );
}

export default function ProductCategoryList(props: IProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductCategoryListContent {...props} />
    </Suspense>
  );
}

interface IProps {
  data: ICategory[];
}
