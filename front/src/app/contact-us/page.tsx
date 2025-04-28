import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import ImgTag from "@/components/ImgTag/ImgTag";
import FormContactUs from "./FormContactUs";
import React from "react";
import { Metadata } from "next";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `ارتباط با ما | ${nameSite}`,
  description: `برای تماس با ${nameSite}، درخواست مشاوره یا هر سوال دیگری می‌توانید از فرم زیر استفاده کنید و یا از طریق شبکه‌های اجتماعی با ما ارتباط برقرار کنید.`,
  keywords: [
    'ارتباط با ما',
    `تماس با ${nameSite}`,
    'پشتیبانی مشتری',
    'مشاوره ساخت و ساز',
    'سوالات رایج',
    'پیمانکاری و ساخت‌وساز',
  ],
  openGraph: {
    title: `ارتباط با ما | ${nameSite}`,
    description: `برای تماس با ${nameSite}، درخواست مشاوره یا هر سوال دیگری می‌توانید از فرم زیر استفاده کنید و یا از طریق شبکه‌های اجتماعی با ما ارتباط برقرار کنید.`,
    url: `${process.env.NEXT_PUBLIC_URL + "/contact-us"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
        width: 800,
        height: 600,
        alt: `ارتباط با ما در سایت ${nameSite}`,
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
    canonical: `${process.env.NEXT_PUBLIC_URL + "/contact-us"}`,
  },
};
export default function page() {
  return (
    <>
      <Breadcrums />
      <div className="classDiv">
        <section className="mt-6">
          <h1 className="text-2xl mb-2 block font-semibold dark:text-h-dark text-c-blue">ارتباط با ما</h1>
          <h2 className="dark:text-s-dark text-gray-700">
            با ما در ارتباط باشید تا پروژه‌های ساختمانی خود را با راهکارهای
            حرفه‌ای و نوآورانه به واقعیت تبدیل کنید. تیم ما آماده پاسخگویی به
            سوالات و ارائه مشاوره‌های تخصصی است.
          </h2>
        </section>
        <div className="w-full flex flex-col md:flex-row gap-3 my-12 justify-around">
          <div className="md:w-1/2 w-full md:order-1 order-2">
            <p className="text-lg mb-5 dark:text-p-dark">پیام خود را برای ما ارسال کنید.</p>
            <FormContactUs />
          </div>
          <figure className="md:w-1/2 w-full md:order-2 order-1">
            <ImgTag
              src={"/contact-us.jpg"}
              alt={"contact-us"}
              classPlus="w-full max-h-[450px] object-cover"
              height={350}
              width={400}
            />
          </figure>
        </div>
      </div>
      <ContactSocialMedia />
    </>
  );
}
