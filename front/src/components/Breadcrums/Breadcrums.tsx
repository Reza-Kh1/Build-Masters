"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaHome } from "react-icons/fa";
export default function Breadcrums({ className }: { className?: string }) {
  const route = usePathname();
  const arry = route.split("/");
  const newArry = arry.map((i) => {
    if (!i) {
      return {
        name: "صفحه اصلی",
        url: "/",
      };
    }
    if (i === "search") {
      return {
        name: "جستجو",
        url: "/search/",
      };
    }
    if (i === "blog") {
      return {
        name: "بلاگ",
        url: "/blog",
      };
    }
    if (i === "tag") {
      return {
        name: "دسته",
        url: "",
      };
    }
    if (i === "post") {
      return {
        name: "پست ها",
      };
    }
    if (i === "about-us") {
      return {
        name: "درباره ما",
        url: "/about-us",
      };
    }
    if (i === "contact-us") {
      return {
        name: "ارتباط با ما",
        url: "/contact-us",
      };
    }
    if (i === "faqs") {
      return {
        name: "سوالات متداول",
        url: "/faqs",
      };
    }
    if (i === "request-project") {
      return {
        name: "محاسبه آنلاین هزینه",
        url: "/request-project",
      };
    }
    if (i === "project") {
      return {
        name: "پروژه ها",
        url: "/project",
      };
    }
    if (i === "comments") {
      return {
        name: "نظرات مشتریان",
        url: "/comments",
      };
    }
    if (i === "experts") {
      return {
        name: "مجریان تیم",
        url: "/experts",
      };
    }
    return {
      name: decodeURIComponent(i.replace(/-/g, " ")),
    };
  });
  return (
    <div className="classDiv">
      <div
        className={`my-3 gap-1 md:gap-2 lg:my-6 md:mx-3 p-2 lg:p-3 xl:mx-auto w-full max-w-7xl  bg-gradient-to-br text-white to-blue-500 from-slate-300  dark:text-gray-200 dark:to-slate-700 dark:from-zinc-800 shadow-md dark:shadow-low-dark rounded-md ${className}`}
      >
        {newArry.map((i, index) => (
          <React.StrictMode key={index}>
            {i.url ? (
              <Link href={i.url} className="hover:text-blue-500 text-xs md:text-sm items-center gap-1 inline">
                {i.name === "صفحه اصلی" ? <FaHome className="inline ml-1" size={18} /> : null}
                {i.name}
              </Link>
            ) : (
              <span className="text-xs md:text-sm mx-1">{i.name}</span>
            )}
            <span className="inline mx-1">
              {newArry.length - 1 === index ? null : "/"}
            </span>
          </React.StrictMode>
        ))}
      </div>
    </div>
  );
}
