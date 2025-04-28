import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import { CardPostType, CardProjectsType, ExpertType } from "@/app/type";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import SwiperCards from "@/components/SwiperCards/SwiperCards";
import { fetchApi } from "@/action/fetchApi";
import React from "react";
import { Metadata } from "next";
import Script from "next/script";
import { dataApi } from "@/data/tagsName";
import { notFound } from "next/navigation";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
type pageType = {
  searchParams: { tags: string };
};
type DataSearchType = {
  projects: CardProjectsType[];
  posts: CardPostType[];
  workers: ExpertType[];
};
const getData = async (tagId: string) => {
  let url = dataApi.search.url + "?tags=" + tagId;
  console.log(url);
  
  const data = await fetchApi({ url, next:dataApi.search.cache,tags:dataApi.search.tags });
  if (data.error) return notFound();
  return data;
};
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `نتایج جستجو | ${nameSite}`,
  description: `در این صفحه نتایج جستجو برای پروژه‌ها، خدمات، یا مقالات مختلف تیم ${nameSite} را مشاهده خواهید کرد. از فیلترهای مختلف برای پیدا کردن دقیق‌تر موارد مورد نظر استفاده کنید.`,
  keywords: [
    'جستجو پروژه‌ها',
    'پروژه‌های ساختمانی',
    'خدمات ساختمانی',
    'مشاوره ساخت و ساز',
    'پروژه‌های عمرانی',
    'پیمانکاری',
  ],
  openGraph: {
    title: `نتایج جستجو | ${nameSite}`,
    description: `با استفاده از نتایج جستجو در ${nameSite}، پروژه‌ها و خدمات مختلف ساختمانی خود را بیابید.`,
    url: `${process.env.NEXT_PUBLIC_URL + "/search"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
        width: 800,
        height: 600,
        alt: `نتایج جستجو در سایت ${nameSite}`,
      },
    ],
    locale:"fa_IR",
    siteName:nameSite,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    creator:"@buildMasters",
    site:"@buildMasters"
  },
  robots: "noindex,nofollow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL + "/search"}`,
  },
};
export default async function page({ searchParams }: pageType) {
  const { projects, posts, workers }: DataSearchType = await getData(
    searchParams.tags
  );
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "name": `نتایج جستجو در ${nameSite}`,
    "url": `${process.env.NEXT_PUBLIC_URL + "/search"}`,
    "description": `نتایج جستجو برای پروژه‌های ساختمانی، خدمات مشاوره و طراحی در سایت ${nameSite}`,
    "query": "پروژه‌های ساختمانی",
    "mainEntity": {
      "@type": "WebPage",
      "url": `${process.env.NEXT_PUBLIC_URL + "/search"}`,
      "name": "نتایج جستجو",
      "description": `صفحه‌ای برای نمایش نتایج جستجوی پروژه‌ها و خدمات مختلف در ${nameSite}.`,
    },
    "image": `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
    "keywords": ["جستجو پروژه", "پروژه‌های ساختمانی", "خدمات ساخت و ساز", "پیمانکاری"],
  };
  return (
    <>
      <Script
        type="application/ld+json"
        id="jsonld-search-results"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <Breadcrums />
      <div className="classDiv">
        <section className="navbar-search flex md:my-6">
          <div className="w-2/3">
            <h1 className="text-lg my-3 text-c-blue">
              جستجو در دسته :
              <span className=" text-xl text-blue-400 mr-2">
                {searchParams.tags}
              </span>
            </h1>
          </div>
        </section>
        <SwiperCards
          data={posts}
          title="پست ها"
          url={`/blog?order=createdAt-DESC&page=1&tags=${searchParams.tags}`}
          isPost
        />
        <SwiperCards
          data={projects}
          title="پروژه ها"
          isProject
          url={`/project?order=createdAt-DESC&page=1&tags=${searchParams.tags}`}
        />
        <SwiperCards
          data={workers}
          title="مجریان"
          isExpert
          url={`/experts?order=createdAt-DESC&page=1&tags=${searchParams.tags}`}
        />
      </div>
      <ContactSocialMedia />
    </ >
  );
}
