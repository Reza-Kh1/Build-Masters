import { fetchApi } from "@/action/fetchApi";
import React, { Suspense } from "react";
import { AllExpertType, FilterQueryType, TagsType } from "../type";
import CardExperts from "@/components/CardExperts/CardExperts";
import Pagination from "@/components/Pagination/Pagination";
import DontData from "@/components/DontData/DontData";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import { Metadata } from "next";
import { dataApi } from "@/data/tagsName";
import { notFound } from "next/navigation";
import SelectTag from "@/components/SelectTag/SelectTag";
import TagInfo from "@/components/TagInfo/TagInfo";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || "";
const getData = async (query: FilterQueryType) => {
  const url = dataApi.experts.url + "?" + new URLSearchParams(query);
  const data = await fetchApi({
    url,
    next: dataApi.experts.cache,
    tags: dataApi.experts.tags,
  });
  if (data.error) return notFound();
  return data;
};
const getTags = () => {
  return fetchApi({
    url: dataApi.tags.url,
    next: dataApi.tags.cache,
    tags: dataApi.tags.tags,
  });
};
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `مجریان | ${nameSite}`,
  description:
    "با مجری های برتر حوزه ساخت و ساز آشنا شوید. در این صفحه می‌توانید پروفایل مجری های ما را مشاهده کنید و برای پروژه‌های خود از آنها مشاوره و خدمات دریافت کنید.",
  keywords: [
    "متخصصان ساختمانی",
    "مشاورین ساخت و ساز",
    "پیمانکاران حرفه‌ای",
    "متخصص ساخت و ساز",
    "خدمات ساختمانی",
    "پروژه‌های ساخت و ساز",
    "مشاوره پروژه ساختمانی",
  ],
  openGraph: {
    title: `مجری ها | ${nameSite}`,
    description:
      "با متخصصان برتر حوزه ساخت و ساز آشنا شوید. در این صفحه می‌توانید پروفایل متخصصان ما را مشاهده کنید و برای پروژه‌های خود از آنها مشاوره و خدمات دریافت کنید.",
    url: `${process.env.NEXT_PUBLIC_URL + "/experts"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
        width: 800,
        height: 600,
        alt: `پروفایل متخصصان ${nameSite}`,
      },
    ],
    type: "website",
    locale: "fa_IR",
    siteName: "اساتید ساخت و ساز",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@buildMasters",
    site: "@buildMasters",
  },
  robots: "noindex,nofollow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL + "/about-us"}`,
  },
};
export default async function page({searchParams }: {searchParams: FilterQueryType;}) {
  const { data: dataTags }: { data: TagsType[] } = await getTags();
  const data: AllExpertType = await getData(searchParams);
  return (
    <>
      <Breadcrums />
      <div className="classDiv">
        <section className="flex items-center justify-between">
          <h1 className="font-semibold lg:text-xl dark:text-h-dark text-c-blue">
            مجریان
          </h1>
          <nav aria-label="منوی دسته بندی ها برای مجری ها" className="w-2/6">
            <SelectTag urlPage="experts" dataTags={dataTags} />
          </nav>
        </section>
        <TagInfo categoryName="" searchData={searchParams} text="تمام مجریان در این صفحه فهرست شده اند."/>
        {data?.rows?.length ? (
          <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-6">
            {data.rows.map((items, index) => (
              <CardExperts key={index} {...items} />
            ))}
          </div>
        ) : (
          <DontData name="هیچ مجری یافت نشد!" />
        )}
        <Suspense fallback={"در حال بارگیری ..."}>
          <Pagination pagination={data.paginate} />
        </Suspense>
      </div>
      <ContactSocialMedia />
    </>
  );
}
