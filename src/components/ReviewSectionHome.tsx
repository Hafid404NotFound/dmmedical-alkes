"use client";

import { useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import { IReview } from "@/types/IReview";
import { createClient } from "@/utils/supabase/client";
import { Card, CardBody } from "./Card";
import { MdPerson } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ReviewSectionHome() {
  const [data, setData] = useState<IReview[]>([]);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("review")
      .select()
      .then((query) => {
        const getData: IReview[] = query?.data || [];
        if (getData) {
          setData(getData);
        }
      });
  }, []);

  return (
    <PageContainer>
      <h1 className="text-center text-2xl font-bold pb-10">TESTIMONIAL</h1>

      <div className="relative overflow-hidden">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{ delay: 5000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {data.map((item, i) => (
            <SwiperSlide key={i}>
              <Card className="w-full min-h-24 h-full">
                <CardBody>
                  <div className="flex items-start gap-4">
                    <div>
                      <div className="border rounded-full w-10 h-10 border-gray-500 text-gray-500 flex items-center justify-center">
                        <MdPerson />
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <p className="text-sm text-gray-600">{item.message}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </PageContainer>
  );
}
