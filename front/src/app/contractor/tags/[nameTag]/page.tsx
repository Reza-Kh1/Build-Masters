import { fetchApi } from "@/action/fetchApi";
import React, { Suspense } from "react";
import { AllExpertType, FilterQueryType, TagsType } from "../../../type";
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
  if (query.tags) {
    query.tags = query.tags?.replace(/-/g, " ")
  }
  if (query.expert) {
    query.expert = query.expert?.replace(/-/g, " ")
  }
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
export async function generateMetadata({ searchParams }: { searchParams: FilterQueryType; }): Promise<Metadata> {
  const expert = searchParams?.tags || "مجریان";
  const title = `مجری های ${expert} | ${nameSite}`;
  const desc = `با مجری های برتر حوزه ساخت و ساز آشنا شوید. در این صفحه می‌توانید پروفایل تمام مجری های ما را در رابطه با دسته ${expert} مشاهده کنید و برای پروژه‌های خود از آنها مشاوره و خدمات دریافت کنید.`;
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ),
    title: title,
    description: desc,
    keywords: [
      expert,
      title,
      "متخصصان ساختمانی",
      "مشاورین ساخت و ساز",
      "پیمانکاران حرفه‌ای",
      "متخصص ساخت و ساز",
      "خدمات ساختمانی",
      "پروژه‌های ساخت و ساز",
      "مشاوره پروژه ساختمانی",
      nameSite,
    ],
    openGraph: {
      type: "website",
      siteName: nameSite,
      locale: "fa_IR",
      title: title,
      description: desc,
      url: `${process.env.NEXT_PUBLIC_URL}/experts/tags/${searchParams.tags}?tags=${searchParams.tags}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/category.jpg`,
          width: 600,
          height: 350,
          alt: `صفحه وبلاگ با دسته ${expert} در سایت ${nameSite}`,
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
      canonical: `${process.env.NEXT_PUBLIC_URL}/experts/tags/${searchParams.tags}?tags=${searchParams.tags}`,
    },
  };
}
export default async function page({
  searchParams,
}: {
  searchParams: FilterQueryType;
}) {
  const { data: dataTags }: { data: TagsType[] } = await getTags();
  const data: AllExpertType = await getData(searchParams);
  return (
    <>
      <Breadcrums />
      <div className="classDiv">
        <section className="flex w-full items-center justify-between">
          <h1 className="font-semibold lg:text-xl">مجری های {searchParams.tags}</h1>
          <div className="w-2/6 flex gap-2">
            <SelectTag urlPage="experts" dataTags={dataTags} />
          </div>
        </section>
        <TagInfo categoryName="مجریان" searchData={searchParams} text="" />
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
