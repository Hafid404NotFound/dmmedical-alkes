"use client";

import { useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import { IReview } from "@/types/IReview";
import { createClient } from "@/utils/supabase/client";
import { MdCheckCircle, MdOutlineHourglassEmpty } from "react-icons/md";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Custom styles for Swiper navigation and pagination
const swiperStyles = `
  /* Styles for navigation buttons and pagination bullets can be removed or commented out */
  /* .swiper-button-next, .swiper-button-prev {
    color: #0EA5E9; 
    transform: scale(0.65) translateY(-12px);
    transition: color 0.3s ease, opacity 0.3s ease;
    opacity: 0.6;
  }
  .swiper-button-next:hover, .swiper-button-prev:hover {
    opacity: 1;
    color: #0284C7; 
  }
  .swiper-button-next:after, .swiper-button-prev:after {
    font-size: 2.9rem; 
  }
  .swiper-pagination {
    bottom: 2px !important; 
  }
  .swiper-pagination-bullet {
    background-color: #94A3B8; 
    opacity: 0.7;
    width: 9px;
    height: 9px;
    transition: background-color 0.3s ease, opacity 0.3s ease, transform 0.3s ease;
  }
  .swiper-pagination-bullet-active {
    opacity: 1;
    background-color: #0EA5E9; 
    transform: scale(1.2);
  } */
`;

export default function ReviewSectionHome() {
  const [data, setData] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const { data: reviews, error } = await supabase
          .from("review")
          .select("id, name, message, created_at")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching reviews:", error);
          setData([]);
        } else {
          setData(reviews || []);
        }
      } catch (error) {
        console.error("Client-side error fetching reviews:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [supabase]);

  return (
    <div className="py-16 md:py-24 bg-slate-50 dark:bg-gray-900/70">
      <PageContainer>
        <style>{swiperStyles}</style>
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <h2 className="text-4xl font-bold text-primary-main inline-block">
              Testimoni & Kepercayaan Pelanggan
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-secondary-main/30 rounded-full"></div>
          </div>
        </div>

        <div className="relative">
          <Swiper
            modules={[Autoplay]} // Only Autoplay module
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            loop={data.length > 2}
            breakpoints={{
              640: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="" // Removed pb-16 as pagination is hidden
          >
            {loading &&
              [1, 2, 3].map((idx) => (
                <SwiperSlide key={`skeleton-${idx}`}>
                  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl min-h-[250px] animate-pulse border-t-4 border-gray-300 dark:border-slate-700">
                    <div className="flex items-start mb-4">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-md mr-3"></div>
                      <div className="flex-1">
                        {" "}
                        {/* Corrected class to className */}
                        <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}

            {!loading && data.length === 0 && (
              <SwiperSlide>
                <div className="flex flex-col items-center justify-center min-h-[250px] text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-xl border-t-4 border-slate-300 dark:border-slate-700">
                  <MdOutlineHourglassEmpty
                    size={48}
                    className="mb-4 text-slate-400 dark:text-slate-500"
                  />
                  <p className="text-center text-lg">
                    Belum ada testimoni saat ini.
                  </p>
                </div>
              </SwiperSlide>
            )}

            {!loading &&
              data.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden min-h-[250px] h-full flex flex-col border-t-4 border-primary-main dark:border-primary-main group hover:shadow-2xl transition-shadow duration-300">
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-start mb-4">
                        <MdCheckCircle className="w-10 h-10 text-primary-main dark:text-sky-400 mr-3 shrink-0 group-hover:scale-110 transition-transform duration-300" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 dark:text-white text-lg">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {new Date(item.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-5 flex-grow">
                        {item.message}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </PageContainer>
    </div>
  );
}
