import React from "react";
import { FaStar } from "react-icons/fa6";
import FormRequest from "./FormRequest";
import { PiWarningDiamondFill } from "react-icons/pi";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import { Metadata } from "next";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `درخواست محاسبه آنلاین | ${nameSite}`,
  description: 'برای محاسبه آنلاین هزینه پروژه‌های ساختمانی خود می‌توانید از این صفحه استفاده کنید. با وارد کردن اطلاعات پروژه خود، برآورد دقیقی از هزینه‌ها و زمان تحویل دریافت کنید.',
  keywords: [
    'محاسبه آنلاین پروژه',
    'هزینه پروژه ساختمانی',
    'محاسبه هزینه ساخت و ساز',
    'درخواست محاسبه پروژه',
    'پروژه‌های ساختمانی',
  ],
  openGraph: {
    title: `درخواست محاسبه آنلاین | ${nameSite}`,
    description: 'با استفاده از فرم درخواست محاسبه آنلاین، می‌توانید هزینه و زمان تحویل پروژه‌های ساختمانی خود را به راحتی محاسبه کنید.',
    url: `${process.env.NEXT_PUBLIC_URL + "/request-project"}`,
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
        width: 800,
        height: 600,
        alt: `درخواست محاسبه آنلاین پروژه‌های ${nameSite}`,
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
    canonical: `${process.env.NEXT_PUBLIC_URL + "/request-project"}`,
  },
};
export default function page() {
  return (
    <>
      <Breadcrums />
      <div className="classDiv">
        <section>
          <h1 className="lg:text-lg font-semibold mb-3 text-c-blue dark:text-h-dark">
            محاسبه آنلاین هزینه ساخت
          </h1>
          <div className="flex items-start md:items-center gap-2">
            <i className="text-yellow-300 text-xl">
              <FaStar />
            </i>
            <h2 className="text-sm md:text-base text-justify dark:text-s-dark text-gray-700">
              چگونه می‌توانید به صورت آنلاین هزینه ساخت را محاسبه کنید؟
            </h2>
          </div>
          <div className="flex items-start md:items-center gap-2">
            <i className="text-yellow-300 text-xl">
              <FaStar />
            </i>
            <p className="text-sm md:text-base text-justify dark:text-s-dark text-gray-700">
              در این صفحه می‌توانید با بارگذاری تصاویر از محیط کار یا پروژه خود،
              و تکمیل فرم‌های خواسته شده، درخواست قیمت‌دهی آنلاین ثبت کنید.
              تیم ما در کمتر از ۶ ساعت پاسخ شما را آماده خواهد کرد و اطلاعات کامل را در اختیارتان قرار می‌دهد.
            </p>
          </div>
        </section>
        <div className="font-semibold my-8 md:my-16 text-center flex gap-3 items-center justify-center mb-5">
          <i className="text-orange-400 text-2xl">
            <PiWarningDiamondFill />
          </i>
          <span className="text-red-500 dark:text-red-700 text-sm md:text-base">
            اگر عکس یا فیلم شما حجم بیش از 10 مگابایت دارد لطفا در شبکه های
            اجتماعی برای ما ارسال کنید
          </span>
          <i className="text-orange-400 text-2xl">
            <PiWarningDiamondFill />
          </i>
        </div>
        <span className="text-sm md:text-base block mb-3 dark:text-h-dark">فیلد های ستاره دار الزامی هستند.</span>
        <FormRequest />
        <p className="mt-5 flex items-start md:items-center gap-2 dark:text-p-dark text-gray-700">
          <i className="text-orange-400 text-2xl">
            <PiWarningDiamondFill />
          </i>
          میتوانید در شبکه های اجتماعی برای ما مشخصات پروژه خود را
          ارسال کنید.
        </p>
      </div>
      <ContactSocialMedia />
    </>
  );
}
