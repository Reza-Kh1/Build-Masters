import Link from "next/link";
import React from "react";
import { FaInstagram, FaPhone, FaTelegram } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import "./style.css";
const data = [
  {
    title: "تلگرام",
    icon: <FaTelegram className="text-xl md:text-3xl" />,
    url: "https://telegram.me/Reza_kh666",
    span: "Reza_kh666@",
  },
  {
    title: "تماس با ما",
    icon: <FaPhone className="text-xl md:text-3xl" />,
    url: "tel:09121975658",
    span: "09121975658",
  },
  {
    title: "اینستاگرام",
    icon: <FaInstagram className="text-xl md:text-3xl" />,
    url: "instagram.com/_u/Reza_kha.ni",
    span: "Reza_kha.ni",
  },
  {
    title: "ایمیل",
    icon: <MdEmail className="text-xl md:text-3xl" />,
    url: "mailto:r.khani1385.66@gmail.com",
    span: "R.khani1385.66@gmail.com",
  },
];
export default function ContactSocialMedia({
  classDiv,
}: {
  classDiv?: string;
}) {
  return (
    <section
      aria-labelledby="link-social-media"
      className={
        "grid grid-cols-4 px-2 md:px-4 pb-2 overflow-auto my-6 md:mb-10 md:mt-6 gap-1 justify-center md:gap-5 w-full max-w-7xl mx-auto pt-6 md:pt-10 " +
        classDiv
      }
    >
      {data.map((i, index) => (
        <div
          key={index}
          className="border border-slate-300 dark:shadow-low-dark dark:border-bg-dark shadow-md rounded-md text-center p-1 md:p-3 flex flex-col md:gap-3 relative pt-6 md:pt-12"
        >
          <Link
            aria-label={i.title}
            href={i.url}
            title={i.title}
            className="absolute link-contact-us dark:to-[#363e4a] dark:from-[#1b1b1f] text-blue-400 dark:bg-custom-dark dark:text-h-dark bg-slate-200 rounded-full p-2 md:p-4 hover:text-white hover:bg-gradient-to-tl hover:to-blue-400 hover:from-slate-300 left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2"
          >
            {i.icon}
          </Link>
          <span className="text-[9px] md:text-xl">{i.title}</span>
          <div className="overflow-auto">
            <span className="text-[8px]  md:text-base text-gray-700 dark:text-p-dark">{i.span}</span>
          </div>
        </div>
      ))}
    </section>
  );
}
