import React from "react";
import Image from "next/image";
import { FiPhoneCall } from "react-icons/fi";
import Link from "next/link";
import IconSocialMedia from "../IconSocialMedia/IconSocialMedia";
import { fetchApi } from "@/action/fetchApi";
import { Footertype } from "@/app/type";
import { FaAngleLeft } from "react-icons/fa";
import { dataApi } from "@/data/tagsName";
import "./style.css";
import BannerFooter from "../BannerFooter/BannerFooter";
const getData = async () => {
  return fetchApi({
    url: dataApi.footer.url,
    next: dataApi.footer.cache,
    tags: dataApi.footer.tags,
  });
};
const menuTitle = [
  { name: "صفحه اصلی", link: "/" },
  { name: "تماس با ما", link: "/contact-us" },
  { name: "درباره ما", link: "/about-us" },
  { name: "وبلاگ", link: "/blog" },
  { name: "پروژه ها", link: "/project" },
];
export default async function Footer() {
  const { data }: Footertype = await getData();
  return (
    <>
      <BannerFooter />
      <div className="bg-footer">
        <div className="w-full xl:w-4/5 mx-auto flex flex-wrap items-start p-3 lg:pt-8">
          <div className="w-full lg:w-3/5">
            <section className="w-full border-b border-b-slate-700 mb-5 pb-5 flex items-stretch gap-2 md:gap-5 text-slate-400">
              <figure className="flex w-2/5 md:w-1/4">
                <Link href={"/"} aria-label="logo site" className="flex items-center w-full h-full">
                  <Image
                    alt={"لوگو اساتید ساخت و ساز"}
                    src={"/logofooter.png"}
                    width={250}
                    className="h-auto object-contain w-full rounded-md"
                    height={150}
                    loading="lazy"
                  />
                </Link>
              </figure>
              <span className="border border-slate-500"></span>
              <p className="text-xs w-3/4 sm:text-base text-justify">
                {data?.text?.text}
              </p>
            </section>
            <nav
              aria-label="Main footer"
              className="w-full grid grid-cols-3 gap-3"
            >
              {data?.text?.menuLink.length
                ? data.text.menuLink.map((i, index) => (
                  <ul
                    key={index}
                    className="flex flex-col gap-1 md:gap-2 text-slate-400"
                  >
                    {i[0].name
                      ? i.map((item) => (
                        <li
                          key={item.id}
                          className="flex hover:pr-1 transition-all text-sm md:text-base"
                        >
                          <Link
                            href={item.link}
                            className="hover:text-slate-100 transition-all scale-1 flex items-center"
                          >
                            <i>
                              <FaAngleLeft />
                            </i>
                            <span className="mr-1 transition-shadow">
                              {item.name}
                            </span>
                          </Link>
                        </li>
                      ))
                      : null}
                  </ul>
                ))
                : null}
            </nav>
          </div>
          <div className="w-full lg:w-2/5 lg:pr-7 text-sm mt-5 lg:text-base lg:mt-0">
            <div className=" flex flex-col gap-2 mb-5">
              <span className="text-slate-400 mb-3">
                هرگونه سوال یا مشاوره ای خواستید ما به صورت رایگان در خدمتیم می
                توانید با شماره های زیر تماس حاصل کنید :
              </span>
              <address className="text-slate-400 text-sm">
                آدرس : تهران
              </address>
              <p className="text-slate-400 text-sm">
                ایمیل :{" "}
                <Link
                  href="mailto:R.khani1385.66@gmail.com"
                  className="hover:text-blue-400"
                >
                  R.khani1385.66@gmail.com
                </Link>
              </p>
              {/* <p className="text-slate-400 text-sm">
                تلفن :{" "}
                <Link href="tel:02122087279" className="hover:text-blue-400">
                  22087279-021
                </Link>
              </p> */}
              <div className="text-blue-100 mt-3 flex justify-evenly lg:justify-between items-center text-sm">
                <Link
                  href="tel:09390199977"
                  className="bg-[#1c2124] text-xs lg:text-sm hover:bg-gray-950 items-center gap-2 p-2 flex rounded-md shadow-custom-dark"
                >
                  09390199977
                  <i>
                    <FiPhoneCall color="green" />
                  </i>
                </Link>
                <Link
                  href="tel:09121975658"
                  className="bg-[#1c2124] text-xs lg:text-sm hover:bg-gray-950 items-center gap-2 p-2 flex rounded-md shadow-custom-dark"
                >
                  09121975658
                  <i>
                    <FiPhoneCall color="green" />
                  </i>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="after-overlay py-6 md:py-8">
          <div className="w-full md:w-4/5 relative z-10 mx-auto gap-5 md:gap-7 flex flex-col">
            <div className="flex flex-wrap items-center justify-between">
              <ul className="flex gap-2 md:gap-3 w-full flex-wrap justify-center md:justify-start md:w-1/2 text-gray-500">
                {menuTitle.map((i, index) => (
                  <li key={index}>
                    <a
                      href={i.link}
                      className="hover:text-white ml-1 md:ml-2 text-sm transition-all"
                    >
                      {i.name}
                    </a>
                    {menuTitle.length === index + 1 ? null : <span>/</span>}
                  </li>
                ))}
              </ul>
              <div className="text-2xl w-full md:w-1/2 flex justify-center md:justify-end mt-5 md:mt-0">
                <IconSocialMedia />
              </div>
            </div>
            <div className="lg:w-1/3 w-full text-slate-500 mx-auto text-xs md:text-base text-center">
              <p>©️ کلیه حقوق این سایت متعلق به Build Masters است .</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
