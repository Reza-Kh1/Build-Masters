import Breadcrums from "@/components/Breadcrums/Breadcrums";
import CardProjects from "@/components/CardProjects/CardProjects";
import LoadingSearch from "@/components/LoadingSearch/LoadingSearch";
import Pagination from "@/components/Pagination/Pagination";
import React, { Suspense } from "react";
import BannerCallUs from "../../components/BannerCallUs/BannerCallUs";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import { fetchApi } from "@/action/fetchApi";
import { AllProjectType, FilterQueryType, TagsType } from "../type";
import { Metadata } from "next";
import { dataApi } from "@/data/tagsName";
import DontData from "@/components/DontData/DontData";
import { notFound } from "next/navigation";
import SelectTag from "@/components/SelectTag/SelectTag";
import TagInfo from "@/components/TagInfo/TagInfo";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
const getData = async (query: FilterQueryType) => {
  const url = dataApi.projects.url + "?" + new URLSearchParams(query);
  const data = await fetchApi({ url, tags: dataApi.projects.tags, next: dataApi.projects.cache });
  if (data.error) return notFound();
  return data
};
const getTags = () => {
  return fetchApi({
    url: dataApi.tags.url,
    next: dataApi.tags.cache,
    tags: dataApi.tags.tags,
  });
};
const getExpertName = () => {
  return fetchApi({ url: dataApi.expertName.url, next: dataApi.expertName.cache, tags: dataApi.expertName.tags });
};
type ExpertNameType = {
  name: string;
  id: string;
};
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `پروژه‌ها | ${nameSite}`,
  description: `در این صفحه می‌توانید با پروژه‌های انجام شده توسط تیم ${nameSite} آشنا شوید. پروژه‌های ساختمانی ما شامل انواع خدمات ساخت و ساز، معماری و پیمانکاری می‌باشند.`,
  keywords: [
    'پروژه‌های ساختمانی',
    'پروژه‌های ساخت و ساز',
    'پیمانکاری',
    'ساخت و ساز',
    'معماری',
    'پروژه‌های معماری',
    'پروژه‌های عمرانی',
  ],
  openGraph: {
    title: `پروژه‌ها | ${nameSite}`,
    description: `با پروژه‌های مختلف و انجام شده توسط تیم ${nameSite} آشنا شوید. خدمات ما شامل مشاوره، طراحی و اجرای پروژه‌های مختلف ساختمانی و عمرانی می‌باشد.`,
    url: `${process.env.NEXT_PUBLIC_URL + "/project"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
        width: 800,
        height: 600,
        alt: `پروژه‌های ${nameSite}`,
      },
    ],
    type: 'website',
    locale: "fa_IR",
    siteName: nameSite,
  },
  twitter: {
    card: 'summary_large_image',
    creator: "@buildMasters",
    site: "@buildMasters"
  },
  robots: "noindex,nofollow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL + "/project"}`,
  },
};
export default async function page({ searchParams }: { searchParams: FilterQueryType; }) {
  const data: AllProjectType = await getData(searchParams);
  const { data: dataExpert }: { data: ExpertNameType[] } = await getExpertName();
  const { data: dataTags }: { data: TagsType[] } = await getTags();
  return (
    <>
      <Breadcrums />
      <div className="classDiv mb-20">
        <section className="mt-6 flex justify-between items-center">
          <h1 className="lg:text-xl font-semibold text-c-blue">پروژه ها</h1>
          <nav aria-label="منوی دسته بندی ها و نام مجری ها در پروژه ها" className="w-1/2">
            <SelectTag urlPage="project" dataTags={dataTags} dataProject={dataExpert} />
          </nav>
        </section>
        <TagInfo categoryName="پروژه های" searchData={searchParams} text="تمام پروژه ها در این صفحه فهرست شده اند." />
        {data.rows.length ?
          (
            <div className="my-5 md:my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {data.rows.map((item, index) => (
                <CardProjects project={item} key={index} />
              ))}
            </div>
          )
          :
          <DontData name="هیچ پروژه ای یافت نشد!" />
        }
        <div>
          <Suspense fallback={<LoadingSearch />}>
            <Pagination pagination={data.paginate} />
          </Suspense>
        </div>
      </div >
      <BannerCallUs />
      <ContactSocialMedia />
    </>
  );
}
