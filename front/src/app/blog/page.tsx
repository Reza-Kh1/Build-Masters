import { fetchApi } from "@/action/fetchApi";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import Cards from "@/components/Cards/Cards";
import Pagination from "@/components/Pagination/Pagination";
import React, { Suspense } from "react";
import { AllPostType, FilterQueryType } from "../type";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import { Metadata } from "next";
import { dataApi } from "@/data/tagsName";
import DontData from "@/components/DontData/DontData";
import { notFound } from "next/navigation";
import SelectTag from "@/components/SelectTag/SelectTag";
import TagInfo from "@/components/TagInfo/TagInfo";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || "";

const getData = async (query?: FilterQueryType): Promise<AllPostType> => {
  const url = "post?" + new URLSearchParams(query);
  const data = await fetchApi({
    url,
    next: dataApi.posts.cache,
    tags: dataApi.posts.tags,
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
  title: `بلاگ | ${nameSite}`,
  description:
    "ما برای افزایش آگاهی شما مقالاتی را نوشتیم که میتواند در انتخاب هاتون بهتون کمک کند.",
  keywords: [
    "پروژه‌های ساختمانی",
    "مشاوره ساخت‌وساز",
    "خدمات پیمانکاری",
    nameSite,
  ],
  openGraph: {
    type: "website",
    siteName: nameSite,
    locale: "fa_IR",
    title: `وبلاگ | ${nameSite}`,
    description:
      "ما برای افزایش آگاهی شما مقالاتی را نوشتیم که میتواند در انتخاب هاتون بهتون کمک کند.",
    url: `${process.env.NEXT_PUBLIC_URL + "/blog"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL}/category.jpg`,
        width: 600,
        height: 350,
        alt: `صفحه وبلاگ سایت ${nameSite}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@buildMasters",
    site: "@buildMasters",
  },
  robots: "noindex,nofollow",
  alternates: {
    canonical: "/blog",
  },
};
export default async function page(props: { searchParams?: FilterQueryType }) {
  const searchParams = await props.searchParams;
  const data: AllPostType = await getData(searchParams);
  const dataTags = await getTags();
  return (
    <>
      <Breadcrums />
      <div className="classDiv">
        <section className="flex w-full items-center justify-between">
          <h1 className="font-semibold lg:text-xl text-c-blue">وبلاگ</h1>
          <nav aria-label="منوی دسته بندی ها برای وبلاگ" className="w-2/6">
            <SelectTag urlPage="blog" dataTags={dataTags} />
          </nav>
        </section>
        <TagInfo text="تمام مطالب در همین صفحه فهرست شده اند." categoryName="مطالب" searchData={searchParams} />
        <div className="my-5">
          {data.data.length ? (
            <Cards props={data.data} />
          ) : (
            <DontData name="هیچ پستی یافت نشد!" />
          )}
        </div>
        <Suspense fallback={"در حال بارگیری ..."}>
          <Pagination pagination={data.pagination} />
        </Suspense>
      </div>
      <ContactSocialMedia />
    </>
  );
}
