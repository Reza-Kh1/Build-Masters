"use client";
import React, { Suspense, useEffect, useState } from "react";
import { IoIosArrowUp } from "react-icons/io";
import { CategoryType } from "@/app/type";
import Link from "next/link";
import {
  FaAngleDoubleDown,
  FaAngleLeft,
  FaHome,
  FaPhone,
} from "react-icons/fa";
import DarkMode from "../DarkMode/DarkMode";
import SearchBox from "../SearchBox/SearchBox";
import Image from "next/image";
import NavlinkHeader from "./NavlinkHeader";
import { Drawer, IconButton } from "@mui/material";
import {
  MdMapsHomeWork,
  MdMenuOpen,
  MdOutlineQuestionMark,
} from "react-icons/md";
import { GrArticle, GrUserWorker } from "react-icons/gr";
import { FaRegComments, FaUsersViewfinder } from "react-icons/fa6";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import IconSocialMedia from "../IconSocialMedia/IconSocialMedia";
import { usePathname } from "next/navigation";
const menuTitle = [
  {
    name: "پروژه ها",
    url: "/project?order=createdAt-DESC&page=1",
    icon: <MdMapsHomeWork className="text-gray-200 dark:text-s-dark" />,
  },
  {
    name: "وبلاگ",
    url: "/blog?order=createdAt-DESC&page=1",
    icon: <GrArticle className="text-gray-200 dark:text-s-dark" />,
  },
  {
    name: "ارتباط با ما",
    url: "/contact-us",
    icon: <FaPhone className="text-gray-200 dark:text-s-dark" />,
  },
  {
    name: "نظرات مشتریان",
    url: "/comments?page=1",
    icon: <FaRegComments className="text-gray-200 dark:text-s-dark" />,
  },
  {
    name: "مجریان",
    url: "/experts?order=createdAt-DESC&page=1",
    icon: <GrUserWorker className="text-gray-200 dark:text-s-dark" />,
  },
  {
    name: "محاسبه آنلاین هزینه",
    url: "/request-project",
    icon: (
      <LiaFileInvoiceDollarSolid className="text-gray-200 dark:text-s-dark" />
    ),
  },
];
export default function HeaderSticky({
  category,
}: {
  category: CategoryType[];
}) {
  const [scroll, setScroll] = useState<Number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const [scrollTop, setScrollTop] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [showCategory, setShowCategory] = useState<string | null>();
  const MenuComponents = ({ props }: { props: CategoryType[] }) => {
    if (!props.length) return;
    return props.map((i, index) => (
      <li key={index}>
        <Link
          className="flex w-full justify-between items-center py-2 px-3"
          href={"/blog/" + i.slug.replace(/ /g, "-")}
        >
          {i.name}
          {i.subCategory?.length ? (
            <i>
              <FaAngleLeft />
            </i>
          ) : null}
        </Link>
        {i.subCategory?.length ? (
          <ul>
            <MenuComponents props={i.subCategory} />
          </ul>
        ) : null}
      </li>
    ));
  };
  const params = usePathname();
  useEffect(() => {
    setOpenMenu(false);
  }, [params]);
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY as Number;
      const sizePage = document.body.scrollHeight;
      const scrollPage = window.scrollY + window.innerHeight;
      const mathLocation = Math.floor((scrollPage / sizePage) * 100);
      if (mathLocation > 50) {
        if (currentScroll > scroll) {
          setScrollTop(false);
        } else {
          setScrollTop(true);
        }
      } else {
        setScrollTop(false);
      }
      if (currentScroll > scroll) {
        setVisible(false);
      } else if (Number(currentScroll) < 65) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      setScroll(currentScroll);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scroll]);
  return (
    <>
      <div
        className={`header-sticky shadow-shadow-header shadow-[#17315a] dark:shadow-low-dark bg-blue-color/90 dark:bg-zinc-900/80 ${visible
          ? "header-show bg-blue-color/90 dark:!bg-zinc-900/80"
          : "header-hidden"
          } `}
      >
        <div className="max-w-7xl w-full py-1 md:py-3 px-3 xl:px-0 flex mx-auto">
          <div className="w-full flex justify-between items-center">
            <div className="w-1/3 md:w-1/12  flex items-center menu-mobile" aria-label="menu mobile">
              <div className="md:hidden">
                <IconButton
                  onClick={() => setOpenMenu(true)}
                  type="button"
                  aria-label="open menu"
                >
                  <MdMenuOpen className="text-gray-200"/>
                </IconButton>
                <Drawer
                  anchor={"left"}
                  open={openMenu}
                  onClose={() => setOpenMenu(false)}
                >
                  <nav className="px-4 dark:bg-zinc-900/80 h-full bg-blue-color overflow-scroll flex justify-between flex-col">
                    <div>
                      <Link
                        href={"/"}
                        aria-label="لوگو وب سایت"
                        title="بازگشت به خانه"
                      >
                        <figure className="flex justify-center items-end">
                          <Image
                            src={"/logofooter.png"}
                            className="w-48 h-auto"
                            width={96}
                            height={96}
                            alt="لوگو وبسایت اساتید ساخت و ساز"
                            loading="eager"
                          />
                        </figure>
                      </Link>
                      <ul className="flex flex-col gap-5 mt-3 justify-evenly text-slate-200 dark:text-s-dark w-full">
                        <li className="hover:text-c-orange flex items-center gap-2">
                          <FaHome className="text-gray-200 dark:text-s-dark" />
                          <NavlinkHeader title="صفحه اصلی" url="/" />
                        </li>
                        <li className="hover:text-c-orange flex items-center gap-2">
                          <FaUsersViewfinder className="text-gray-200 dark:text-s-dark" />
                          <NavlinkHeader title="درباره ما" url="/about-us" />
                        </li>
                        <li className="hover:text-c-orange flex items-center gap-2">
                          <MdOutlineQuestionMark className="text-gray-200 dark:text-s-dark" />
                          <NavlinkHeader title="سوالات متداول" url="/faqs" />
                        </li>
                        {menuTitle.map((i, index) => (
                          <li key={index} className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                {i.icon}
                                <NavlinkHeader
                                  title={i.name}
                                  url={i.url}
                                  className="group-hover:text-c-orange"
                                />
                              </div>
                              {i.name === "وبلاگ" && category?.length ? (
                                <button
                                  aria-label="دسته بندی ها"
                                  type="button"
                                  onClick={() =>
                                    setShowCategory(
                                      showCategory !== i.name ? i.name : null
                                    )
                                  }
                                >
                                  <FaAngleDoubleDown
                                    size={14}
                                    className={`transition-all ${i.name === showCategory
                                      ? "text-c-orange rotate-180"
                                      : ""
                                      }`}
                                  />
                                </button>
                              ) : null}
                            </div>
                            <ul
                              className={`hidden ${showCategory === i.name ? "!block" : ""
                                }`}
                            >
                              {category.length
                                ? category.map((item, ind) => (
                                  <li key={ind} className="my-1">
                                    <Link
                                      className="flex w-full gap-2 items-center"
                                      href={
                                        "blog/" + item.slug.replace(/ /g, "-")
                                      }
                                    >
                                      <span className="w-[6px] h-[1px] bg-gray-100"></span>
                                      {item.name}
                                    </Link>
                                  </li>
                                ))
                                : null}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-8 flex justify-center pb-5">
                      <IconSocialMedia size="!text-2xl"/>
                    </div>
                  </nav>
                </Drawer>
              </div>
              <DarkMode />
            </div>
            <div className="w-1/3 md:w-1/12 flex justify-center md:justify-start">
              <Suspense fallback={<div>loading...</div>}>
                <SearchBox />
              </Suspense>
            </div>
            <nav className="hidden md:w-8/12 md:flex items-center mt-1 menu-header">
              <ul className="flex justify-evenly text-slate-600 dark:text-gray-300 w-full">
                {menuTitle.map((i, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 group relative"
                  >
                    <NavlinkHeader
                      title={i.name}
                      url={i.url}
                      className="group-hover:text-c-orange text-gray-200 dark:text-p-dark hover:scale-105 py-3 transition-all scale-1 flex items-center"
                    />
                    {i.name === "وبلاگ" && category?.length ? (
                      <>
                        <ul>
                          <MenuComponents props={category} />
                        </ul>
                        <i>
                          <FaAngleDoubleDown
                            size={14}
                            className="group-hover:text-c-orange text-gray-200 group-hover:rotate-180 transition-all"
                          />
                        </i>
                      </>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="w-1/3 md:w-2/12 flex items-center justify-end">
              <Link href={"/"}>
                <figure className="flex justify-end items-end">
                  <Image
                    src={"/logofooter.png"}
                    className="rounded-md w-28 md:w-48 h-auto"
                    width={200}
                    height={200}
                    alt="لوگو وبسایت اساتید ساخت و ساز"
                    loading="eager"
                  />
                </figure>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        aria-label="رفتن به بالا"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`p-3 lg:p-3 cursor-pointer fixed z-50 right-3 lg:right-5 rounded-full shadow-md bg-slate-500/70 text-white transition-all ${scrollTop ? "bottom-3 lg:bottom-5" : "-bottom-12"
          }`}
      >
        <i>
          <IoIosArrowUp />
        </i>
      </button>
    </>
  );
}
