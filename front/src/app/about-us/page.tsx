import Breadcrums from "@/components/Breadcrums/Breadcrums";
import React from "react";
import ImgTag from "@/components/ImgTag/ImgTag";
import { FaCheck } from "react-icons/fa6";
import SwiperGallery from "@/components/SwiperGallery/SwiperGallery";
import BannerCallUs from "../../components/BannerCallUs/BannerCallUs";
import { fetchApi } from "@/action/fetchApi";
import { AboutUsType, AllProjectType } from "../type";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import SwiperCards from "@/components/SwiperCards/SwiperCards";
import { dataApi } from "@/data/tagsName";
import OurServices from "@/components/OurServices/OurServices";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
const getData = async () => {
  const data = await fetchApi({ url: dataApi.aboutUs.url, next: dataApi.aboutUs.cache, tags: dataApi.aboutUs.tags });
  if (data.error) return notFound();
  return data;
};
const getProjects = async () => {
  const data = await fetchApi({ url: dataApi.projects.url, next: dataApi.projects.cache, tags: dataApi.projects.tags });
  if (data.error) return notFound();
  return data
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `درباره ما | ${nameSite}`,
  description: 'آماده ایم تا با شروع این همکاری ،رویاهای ساخت و ساز شما را به واقعیت تبدیل کنیم - با هم ، از ایده تا اجرا پیش خواهیم رفت.',
  keywords: ['پروژه‌های ساختمانی', 'مشاوره ساخت‌وساز', nameSite, 'خدمات پیمانکاری'],
  openGraph: {
    siteName:nameSite,
    title: `درباره ما | ${nameSite}`,
    description: 'آماده ایم تا با شروع این همکاری ،رویاهای ساخت و ساز شما را به واقعیت تبدیل کنیم - با هم ، از ایده تا اجرا پیش خواهیم رفت.',
    url: `${process.env.NEXT_PUBLIC_URL + "/about-us"}`,
    images: [
      {
        type:"image/png",
        url: "/about-us.jpg",
        width: 800,
        height: 450,
        alt: `درباره ما سایت ${nameSite}`,
      },
    ],
    type: 'website',
    locale:"fa_IR",    
  },
  twitter: {
    card: 'summary_large_image',
    creator:"@buildMasters",
    site:"@buildMasters"
  },
  robots: "noindex,nofollow",
  alternates: {
    canonical: "/about-us",
  },
};
export default async function page() {
  const { data }: AboutUsType = await getData();
  const projects: AllProjectType = await getProjects()
  return (
    <>
      <Breadcrums />
      <section className="classDiv">
        <h1 className="lg:text-xl mb-2 font-semibold dark:text-h-dark text-c-blue">درباره ما</h1>
        <span className="text-xs lg:text-base text-gray-700 dark:text-s-dark">
          صفحه ای کوچک درباره خدمات ما
        </span>
        <span className="w-full border block my-4 lg:my-6 dark:border-bg-dark"></span>
      </section>
      <div className="classDiv flex flex-col md:flex-row gap-4 md:gap-3">
        <section className="w-full md:w-1/2">
          <h2 className="lg:text-lg font-semibold dark:text-h-dark">{data?.text?.title1}</h2>
          <p className="!leading-8 mt-3 text-justify text-sm lg:text-base text-gray-800 dark:text-p-dark">
            {data?.text?.text1}
          </p>
        </section>
        <div className="w-full md:w-1/2">
          <SwiperGallery imagesSrc={data?.text?.imgArry} />
        </div>
      </div>
      <OurServices />
      <div className="classDiv">
        <SwiperCards data={projects.rows} isProject title="پروژه های ما" url="/project" />
      </div>
      <BannerCallUs />
      <div className="classDiv flex flex-col md:flex-row gap-3 items-center">
        <section className="w-full md:w-1/2">
          <h3 className="lg:text-xl mb-3 font-semibold dark:text-h-dark">{data?.text?.title2}</h3>
          <h4 className="text-sm text-gray-700 mb-3 dark:text-s-dark">{data?.text?.text2}</h4>
          {data?.text?.textArry.length ? (
            <ul className="flex flex-col gap-1 lg:gap-2">
              {data?.text?.textArry.map((i, index) => (
                <li key={index} className="flex text-gray-800 items-center gap-2 lg:gap-3 dark:text-p-dark">
                  <i>
                    <FaCheck />
                  </i>
                  <span className="text-sm md:text-base">{i.text}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
        <div className="w-full md:w-1/2">
          <ImgTag
            src={"/about-us (2).jpg"}
            alt={"about-us"}
            width={500}
            height={450}
          />
        </div>
      </div>
      <ContactSocialMedia />
    </>
  );
}