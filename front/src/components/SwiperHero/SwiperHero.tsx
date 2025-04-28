"use client";
import React from "react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-fade";
import { HeroDataType } from "@/app/type";
export default function SwiperHero({ data }: { data: HeroDataType[] }) {
  if (!data || !data[0]?.img) return;
  return (
    <Swiper
      spaceBetween={30}
      effect={"fade"}
      pagination={{
        clickable: true,
      }}
      autoplay
      loop={true}
      modules={[EffectFade, Pagination, Autoplay]}
      className="mySwiper"
    >
      {data?.map((i, index) => (
        <SwiperSlide key={index}>
          <section
            className="w-full h-[550px] bg-image relative"
            style={{ backgroundImage: `url(${i?.img})` }}
          >
            <div className="absolute top-2/3 w-11/12 right-1/2 translate-x-1/2 md:top-1/3 md:w-1/2 md:right-1/3 transform -translate-y-1/2 bg-gray-800/80 p-3 rounded-xl shadow-md">
              <h3 className="text-gray-50 mb-5 text-xl">{i?.title}</h3>
              <p className="text-gray-200">{i?.text}</p>
            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
