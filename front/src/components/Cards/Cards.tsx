import React from "react";
import ImgTag from "../ImgTag/ImgTag";
import Link from "next/link";
import { FaAngleLeft, FaCalendarDays, FaComments } from "react-icons/fa6";
import { FaPhotoVideo } from "react-icons/fa";
import { CardPostType } from "@/app/type";
export default function Cards({ props }: { props: CardPostType[] }) {
  if (!props?.length) return
  return props.map((i, index) => (
    <section key={index}>
      <Link
        href={`/post/${i.title.replace(/ /g, "-")}`}
        className="card-box w-full group max-w-7xl flex gap-3 md:gap-5 my-2 lg:my-3 hover:bg-[#f1f9ff] dark:hover:bg-[#4d4d4d21] hover:shadow-lg dark:shadow-low-dark p-1 lg:p-3 rounded-md transition-all"
      >
        <div className="w-2/5 lg:w-1/3 order-1">
          <ImgTag alt={i.title} height={200} src={i.image} width={450} className="w-44 md:w-80 md:h-56 lg:w-[450px] lg:h-56 h-36 object-cover rounded-md shadow-md" />
        </div>
        <div className="w-3/5 lg:w-2/3 order-2 flex justify-evenly md:justify-between flex-col md:py-2 gap-1">
          <span className="text-xs lg:text-sm text-c-orange dark:text-p-dark">{i?.Category?.name}</span>
          <h3 className="text-sm lg:text-lg text-c-blue font-bold dark:text-h-dark cutline cutline-1">{i.title}</h3>
          <div className="flex gap-1 text-sm md:text-base lg:gap-5 text-gray-600 dark:text-s-dark">
            <p className="flex gap-2">
              <i>
                <FaCalendarDays />
              </i>
              <span>{new Date(i.updatedAt).toLocaleDateString("fa")}</span>
            </p>
            |
            <p className="flex gap-2">
              <i>
                <FaComments />
              </i>
              <span>{i.totalComments}</span>
            </p>
            |
            <i>
              <FaPhotoVideo />
            </i>
          </div>
          <p className="text-xs lg:text-sm text-gray-700 cutline cutline-3 text-justify dark:text-p-dark">
            {i.description}</p>
          <div className="hidden md:!block">
            <button type="button" title={i.title} className="p-[6px] text-xs md:text-base lg:p-2 custom-button-card relative flex items-center bg-gradient-to-b from-orange-300 dark:to-zinc-900 dark:from-slate-600 dark:group-hover:to-zinc-900 dark:group-hover:from-slate-600 to-orange-600 rounded-full group-hover:from-orange-500/70 shadow-md  group-hover:to-orange-600/90 text-white">
              <span className="group-hover:block ">مشاهده مقاله</span>
              <i>
                <FaAngleLeft />
              </i>
            </button>
          </div>
        </div>
      </Link>
    </section>
  )
  );
}
