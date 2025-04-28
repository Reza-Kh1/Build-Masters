import { fetchApi } from "@/action/fetchApi";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import Comments from "@/components/Comments/Comments";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import FormComments from "@/components/FormComments/FormComments";
import React, { Suspense } from "react";
import { CommentsPage } from "../type";
import Pagination from "@/components/Pagination/Pagination";
import { Metadata } from "next";
import { dataApi } from "@/data/tagsName";
import { notFound } from "next/navigation";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
const getData = async (page: number) => {
  const data = await fetchApi({ url: `${dataApi.comments.url}?page=${page || 1}`, next: dataApi.comments.cache, tags: dataApi.comments.tags })
  if (data.error) return notFound();
  return data
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `نظرات مشتریان | ${nameSite}`,
  description: 'نظرات واقعی مشتریان ما درباره خدمات ساخت و ساز و پیمانکاری. بخوانید که مشتریان از تجربه همکاری با ما چه می‌گویند.',
  keywords: [
    'نظرات مشتریان',
    'بازخورد مشتریان',
    'رضایت مشتریان',
    'تجربیات مشتریان',
    'نقد و بررسی خدمات ساختمانی',
    `کیفیت خدمات ${nameSite}`,
    'پیمانکاری و ساخت‌وساز',
  ],
  openGraph: {
    title: `نظرات مشتریان | ${nameSite}`,
    description: 'نظرات واقعی مشتریان ما درباره خدمات ساخت و ساز و پیمانکاری. بخوانید که مشتریان از تجربه همکاری با ما چه می‌گویند.',
    url: `${process.env.NEXT_PUBLIC_URL + "/comments"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
        width: 800,
        height: 600,
        alt: `نظرات مشتریان سایت ${nameSite}`,
      },
    ],
    type: 'website',
    locale:"fa_IR",
    siteName:nameSite,
  },
  twitter: {
    card: 'summary_large_image',
    creator:"@buildMasters",
    site:"@buildMasters"
  },
  robots: "noindex,nofollow",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL + "/comments"}`,
  },
};
export default async function page({ searchParams }: { searchParams: { page: number } }) {
  const data: CommentsPage = await getData(searchParams.page)
  return (
    <>
      <Breadcrums />
      <div className="classDiv">
        <section aria-labelledby="comments-title">
          <h1 id="comments-title" className="lg:text-xl font-semibold mb-3 md:mb-6 dark:text-h-dark text-c-blue">نظرات مشتریان نسبت به ما</h1>
          <span className="text-sm lg:text-base dark:text-p-dark">
            {data.countNull} {" "}
            نظر تا اکنون ثبت شده
          </span>
          <p className="text-sm lg:text-base dark:text-p-dark">
            تجربه همکاری و یا خدماتی که از ما داشتید را میتوانید اینجا به اشتراک بگذارید
          </p>
        </section>
        <div className="max-w-4xl mx-auto my-8">
          <Comments comments={data.comments.rows} />
        </div>
        <Suspense fallback={"در حال بارگیری ..."}>
          <Pagination pagination={data.paginate} />
        </Suspense>
        <div className="max-w-4xl mx-auto mt-8">
          <FormComments />
        </div>
        <ContactSocialMedia />
      </div>
    </>
  );
}
