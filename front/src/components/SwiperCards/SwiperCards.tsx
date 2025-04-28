"use client";
import React from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Pagination } from "swiper/modules";
import CardProjects from "../CardProjects/CardProjects";
import CustomButton from "../CustomButton/CustomButton";
import Link from "next/link";
import { CardPostType, CardProjectsType, ExpertType } from "@/app/type";
import CardPost from "../CardPost/CardPost";
import { PiListPlus } from "react-icons/pi";
import CardExperts from "../CardExperts/CardExperts";
type SwiperCardsType = {
  data: CardProjectsType[] | CardPostType[] | ExpertType[];
  url: string;
  title: string;
  isExpert?: boolean;
  isProject?: boolean;
  isPost?: boolean;
};
export default function SwiperCards({
  data,
  url,
  isPost,
  title,
  isExpert,
  isProject,
}: SwiperCardsType) {
  if (!data.length) return;
  return (
    <>
      <div className="flex w-full mt-6 md:mt-10 justify-between items-center">
        <h2 className="md:text-xl text-gray-700 dark:text-p-dark">{title}</h2>
        <Link href={url} className="w-28 md:w-36" aria-labelledby={title}>
          <CustomButton
            name="نمایش بیشتر"
            className="!text-xs md:text-base"
            iconEnd={<PiListPlus />}
            type="button"
          />
        </Link>
      </div>
      {data.length ? (
        <Swiper
          breakpoints={{
            330: {
              slidesPerView: 1,
              spaceBetween: 15
            },
            380: {
              slidesPerView: 2,
              spaceBetween: 15
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30
            },
          }}
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          modules={[Pagination]}
          className="!py-5 md:!py-10"
        >
          {isPost &&
            data.map((item, index) => (
              <SwiperSlide key={index}>
                <CardPost post={item as CardPostType} />
              </SwiperSlide>
            ))}
          {isProject &&
            data.map((item, index) => (
              <SwiperSlide key={index}>
                <CardProjects project={item as CardProjectsType} />
              </SwiperSlide>
            ))}
          {isExpert &&
            data.map((item, index) => (
              <SwiperSlide key={index}>
                <CardExperts {...(item as ExpertType)} />
              </SwiperSlide>
            ))}
        </Swiper>
      ) : null}
    </>
  );
}
