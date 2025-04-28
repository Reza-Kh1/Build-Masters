"use client";
import React, { CSSProperties, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import ImgTag from "../ImgTag/ImgTag";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { ImageType } from "@/app/type";
import { MdClose } from "react-icons/md";
import { BsFullscreen } from "react-icons/bs";
import "swiper/css/free-mode";
import "swiper/css/thumbs";
export default function SwiperGallery({
  imagesSrc,
}: {
  imagesSrc?: ImageType[];
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [open, setOpen] = useState<boolean>(false)
  const [thumbzoom, setThumbZoom] = useState<any>(null)
  if (!imagesSrc?.length) return;
  return (
    <>
      <Swiper
        style={
          {
            "--swiper-navigation-color": "#1a1c1c",
            "--swiper-pagination-color": "#1a1c1c",
          } as CSSProperties
        }
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={thumbsSwiper ? { swiper: thumbsSwiper } : undefined}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper2"
      >
        {imagesSrc.map((i, index) => (
          <SwiperSlide key={index}>
            <div className="w-full relative h-full">
              <ImgTag
                width={450}
                height={300}
                classPlus="h-56 w-[350px] cursor-pointer lg:h-72 lg:w-96 object-cover"
                alt={i?.alt}
                src={i?.url}
              />
              <button type="button" aria-label="fullscreen"
                onClick={() => setOpen(true)}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 shadow-md -translate-y-1/2 bg-black/40 text-lg text-white p-2 rounded-lg"><BsFullscreen aria-label="تمام صفحه" title="تمام صفحه" /></button>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        breakpoints={{
          330: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          380: {
            slidesPerView: 3,
            spaceBetween: 10
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 10
          },
        }}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="!py-2 !mt-4"
        loop={true}
      >
        {imagesSrc.map((i, index) => (
          <SwiperSlide key={index}>
            <ImgTag
              width={160}
              height={115}
              classPlus="cursor-pointer h-24 w-36 md:h-28 md:w-40 object-cover"
              alt={i?.alt}
              src={i?.url}
            />
          </SwiperSlide>
        ))}
      </Swiper >
      <div className={`${open ? "opacity-100 z-50" : "opacity-0 -z-20"} scroll-y fixed flex flex-col justify-between bg-black/80 top-0 left-0 w-full h-full`}>
        <div >
          <button type="button" aria-label="close dialog" className="bg-gray-200 dark:text-gray-800 z-50 cursor-pointer hover:text-red-600 shadow-md absolute top-2 md:top-5 right-2 md:right-5 rounded-full inline-block p-2 md:p-3 text-xl" onClick={() => setOpen(false)}><MdClose aria-label="بستن" title="بستن باکس" /></button>
        </div>
        <div className="">
          <Swiper
            style={
              {
                "--swiper-navigation-color": "#ddd",
                "--swiper-pagination-color": "#ddd",
              } as CSSProperties
            }
            loop={true}
            spaceBetween={10}
            navigation={true}
            thumbs={thumbzoom ? { swiper: thumbzoom } : undefined}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
          >
            {imagesSrc.map((i, index) => (
              <SwiperSlide key={index} onClick={() => setOpen(true)}>
                <ImgTag
                  width={450}
                  height={300}
                  classPlus="h-72 w-full lg:h-96 lg:w-full object-contain"
                  alt={i?.alt}
                  src={i?.url}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="p-2 md:p-3 bg-black/50">
          <Swiper
            onSwiper={setThumbZoom}
            breakpoints={{
              330: {
                slidesPerView: 3,
                spaceBetween: 10
              },
              380: {
                slidesPerView: 3,
                spaceBetween: 10
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 10
              },
            }}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="!py-2"
            loop={true}
          >
            {imagesSrc.map((i, index) => (
              <SwiperSlide key={index} className="">
                <ImgTag
                  width={160}
                  height={115}
                  classPlus="cursor-pointer h-16 md:h-40 rounded-md w-full object-contain"
                  alt={i?.alt}
                  src={i?.url}
                />
              </SwiperSlide>
            ))}
          </Swiper >
        </div>
      </div>
    </>
  );
}
