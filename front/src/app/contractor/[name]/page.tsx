import { fetchApi } from "@/action/fetchApi";
import { ExpertType } from "@/app/type";
import BannerCallUs from "@/components/BannerCallUs/BannerCallUs";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import ImgTag from "@/components/ImgTag/ImgTag";
import Link from "next/link";
import React from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import SwiperCards from "@/components/SwiperCards/SwiperCards";
import { IoIosCheckmarkCircleOutline, IoLogoTwitter } from "react-icons/io";
import { FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa6";
import { BiLogoInternetExplorer } from "react-icons/bi";
import { Metadata } from "next";
import Script from "next/script";
import { dataApi } from "@/data/tagsName";
import { notFound } from "next/navigation";
const dataSocialMedia = [
  {
    value: "whatsapp",
    icon: <FaWhatsapp className="text-2xl text-green-700" />,
  },
  {
    value: "telegram",
    icon: <FaTelegram className="text-2xl text-sky-500" />,
  },
  {
    value: "instagram",
    icon: <FaInstagram className="text-2xl text-red-500" />,
  },
  {
    value: "phone",
    icon: <FaPhone className="text-xl text-green-400" />,
  },
  {
    name: "Website",
    value: "web",
    icon: <BiLogoInternetExplorer className="text-2xl text-indigo-500" />,
  },
  {
    value: "twitter",
    icon: <IoLogoTwitter className="text-2xl text-sky-400" />,
  },
  {
    value: "linkedin ",
    icon: <FaLinkedin className="text-2xl text-blue-700" />,
  },
];
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
const getData = async (name: string) => {
  const url = dataApi.singleExpert.url + "/" + name.replace(/-/g, " ");
  const data = await fetchApi({ url, next: dataApi.singleExpert.cache });
  if (data.error) return notFound();
  return data
};
export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  const { data }: { data: ExpertType } = await getData(params.name);
  const baseUrl = process.env.NEXTAUTH_URL;
  const urlPage = data.name.replace(/ /g, "-");
  const tags = data.Tags?.map(i => i.name) || ""
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
    title: `${data.name} | ${nameSite}`,
    description: `آشنایی با متخصص ${data.name} در حوزه ساخت و ساز و معماری. خدمات و تجارب حرفه‌ای ${data.name} را مشاهده کنید و برای پروژه‌های خود از آنها مشاوره بگیرید.`,
    keywords: [data.name, ...tags],
    robots: "noindex,nofollow",
    openGraph: {
      type: "profile",
      url: `${baseUrl}/experts/${urlPage}`,
      title: `${data.name} | ${nameSite}`,
      description: `آشنایی با خدمات و تجارب ${data.name} در زمینه ساخت و ساز و معماری. برای پروژه‌های خود از تخصص این متخصص استفاده کنید.`,
      images: [
        {
          url: `${baseUrl}/experts/${data.name.toLowerCase().replace(/ /g, "-")}-profile.jpg`,
          width: 1200,
          height: 630,
          alt: `پروفایل ${data.name} مجری ساخت و ساز`,
        },
      ],
      siteName: nameSite,
      locale: "fa_IR",
    },
    twitter: {
      card: 'summary_large_image',
      creator: "@buildMasters",
      site: "@buildMasters"
    },
    alternates: {
      canonical: `${baseUrl}/experts/${urlPage}`,
    },
  };
}
export default async function page({ params }: { params: { name: string } }) {
  const { data }: { data: ExpertType } = await getData(params.name);
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "profile",
    "name": data?.name || "نام فرد",
    "description": data?.description || "بیوگرافی فرد",
    "image": data?.image || `${process.env.NEXTAUTH_URL}/comments/image-admin.png`,
    "url": `${process.env.NEXTAUTH_URL}/profile/${data?.name.replace(/ /g, "-")}`,
    "sameAs": data.socialMedia.map((i) => i.link) || []
    ,
    "jobTitle": data?.Tags ? data.Tags[0].name : "عنوان شغلی",
    "worksFor": {
      "@type": "Organization",
      "name": data?.name || "نام شرکت",
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": data?.address || "مکان",
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "telephone": data?.phone || "+98-9390199977",
      "areaServed": "IR",
      "availableLanguage": "fa"
    },
  };
  return (
    <>
      <Script
        type="application/ld+json"
        id="jsonld-product"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <Breadcrums className="mt-4 md:mt-6" />
      <div className="classDiv flex flex-col md:flex-row gap-5 text-white">
        <div className="bg-gradient-to-t dark:to-[#363e4a] dark:from-[#1b1b1f] dark:hover:shadow-none transition-all dark:shadow-full-dark from-blue-500 to-slate-200 rounded-md shadow-md w-full md:w-1/3 p-4 flex flex-col gap-3 justify-evenly items-center">
          <section aria-labelledby="name-expert" className="flex justify-between dark:bg-info-dark dark:text-s-dark dark:shadow-low-dark items-center w-full bg-slate-50 shadow-md rounded-md text-black gap-2 p-2">
            <h1 id="name-exper" className="text-right font-semibold md:text-xl">{data.name}</h1>
            <span className="flex text-sm md:text-base items-center gap-1 md:gap-2 w-1/3">
              مورد تایید
              <IoIosCheckmarkCircleOutline className="text-green-500 text-xl" />
            </span>
          </section>
          <ImgTag
            alt={data.name}
            src={data.image}
            width={300}
            height={300}
            className="rounded-full shadow-md w-40 h-40 object-cover mx-auto"
          />
          <Link
            aria-label="شماره تلفن"
            href={"tel:" + data.phone}
            className="flex gap-3 items-center dark:text-p-dark py-2 px-4 hover:bg-blue-400/70 hover:shadow-md rounded-md"
          >
            <FaPhone />
            <p>{data.phone}</p>
          </Link>
          <div className="text-sm dark:text-s-dark hover:bg-blue-400/70 hover:shadow-md py-2 px-4 rounded-md text-white">
            عضویت :{" "}
            <span>{new Date(data.createdAt).toLocaleDateString("fa")}</span>
          </div>
          <section aria-labelledby="tags-expert" className="w-full justify-start md:justify-center dark:text-p-dark text-white flex flex-wrap gap-0 items-center">
            <p>تخصص :</p>
            {data?.Tags?.map((i, index) => {
              if (index + 1 === data.Tags?.length) {
                return (
                  <Link
                    id="tags-expert"
                    key={index}
                    className="hover:bg-blue-400/70 hover:shadow-md py-1 px-2 rounded-md"
                    href={"/search?tags=" + i.name}
                  >
                    {i.name}
                  </Link>
                );
              }
              return (
                <div key={index} className="flex items-center">
                  <Link
                    id="tags-expert"
                    className="hover:bg-blue-400/70 hover:shadow-md py-1 px-2 rounded-md"
                    href={"/search?tags=" + i.name}
                  >
                    {i.name}
                  </Link>
                  <span> ، </span>
                </div>
              );
            })}
          </section>
          <Link
            href={`tel:${data.phone}`}
            className="text-gray-600 mx-auto dark:shadow-full-dark dark:hover:shadow-none hover:text-blue-400 hover:shadow-blue-300 flex items-center px-5 bg-gray-50 dark:bg-info-dark dark:text-h-dark  shadow-md p-1 rounded-md text-[17px] gap-1"
          >
            <i>
              <FaPhone />
            </i>
            <span className="inline-block">تماس بگیرید</span>
          </Link>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-5">
          {data?.description || data?.address ?
            <section aria-labelledby="information-expert" className="bg-gradient-to-br to-blue-500 dark:to-[#363e4a] dark:from-[#1b1b1f] transition-all dark:shadow-full-dark dark:hover:shadow-none from-slate-300 rounded-md shadow-md p-4">
              <h2 className="text-lg dark:text-h-dark md:text-xl mb-3 block ">معرفی</h2>
              <p id="information-expert" className="dark:text-p-dark">{data?.description || "ثبت نشده"}</p>
              <h3 className="text-lg dark:text-h-dark md:text-xl my-3 block ">آدرس</h3>
              <p className="dark:text-p-dark">{data?.address || "ثبت نشده"}</p>
            </section>
            : null}
          {
            data.socialMedia.length ?
              <div className="bg-gradient-to-tr to-blue-500 dark:to-[#363e4a] dark:from-[#1b1b1f] transition-all dark:shadow-full-dark dark:hover:shadow-none from-slate-300 rounded-md shadow-md p-4">
                <h2 className="text-lg dark:text-h-dark  md:text-xl mb-3 block">شبکه های اجتماعی</h2>
                <section aria-labelledby="social-media" className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
                  {data.socialMedia.map((i, index) => (
                    <Link
                      href={i.link}
                      key={index}
                      className="flex bg-slate-50 dark:bg-info-dark dark:text-p-dark hover:shadow-blue-300 dark:shadow-low-dark  dark:hover:shadow-none hover:text-blue-300 p-2 md:p-3 shadow-md text-gray-900 gap-2 rounded-md items-center"
                    >
                      <i>
                        {
                          dataSocialMedia?.find((item) => item.value === i.type)
                            ?.icon
                        }
                      </i>
                      <span className="text-sm md:text-base">{i.text}</span>
                    </Link>
                  ))}
                </section>
              </div>
              : null
          }
        </div>
      </div>
      <BannerCallUs />
      <div className="classDiv">
        <SwiperCards
          isProject
          title="پروژه های بیشتر"
          url={`/project/experts/${data.name.replace(/ /g,"-")}?page=1&order=createdAt-DESC&expert=${data.id}`}
          data={data.Projects}
        />
      </div>
    </>
  );
}