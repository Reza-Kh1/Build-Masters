"use client";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import CustomButton from "@/components/CustomButton/CustomButton";
import Link from "next/link";
import { FaHome } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { MdOutlineErrorOutline } from "react-icons/md";
export default function Error({ error }: { error: Error }) {
  return (
    <div className="classDiv">
      <div className="w-full flex justify-center gap-1 md:gap-3 items-center">
        <MdOutlineErrorOutline className="text-red-500 text-lg md:text-2xl" />
        <h1 className="md:text-lg font-bold text-gray-700 dark:text-p-dark">
          خطایی رخ داده و ما به مشکل برخوردیم
        </h1>
        <MdOutlineErrorOutline className="text-red-500 text-lg md:text-2xl" />
      </div>
      <div className="flex justify-center w-full md:w-11/12 bg-gradient-to-bl mx-auto dark:shadow-low-dark shadow-md my-4 md:my-10 py-5 px-2 from-blue-400 to-slate-200 dark:from-zinc-900 dark:to-slate-700 rounded-md">
        <p className="text-gray-700 dark:text-p-dark text-sm text-center">
          برای پیگیری و رفع خطا به مدیر وبسایت حتما اطلاع بدهید تا ما بتوانیم در
          سریع ترین زمان ممکن خطا را رفع کنیم.
        </p>
      </div>
      <div className="flex justify-center flex-col items-center gap-5">
        <Link href="tel:09390199977">
          <CustomButton
            className="!w-auto !px-12"
            name="همین الان تماس بگیرید"
            type="button"
            iconEnd={<FaPhone />}
          />
        </Link>
        <Link href="/">
          <CustomButton
            className="!w-auto !px-12"
            name="بازگشت به خانه"
            type="button"
            iconEnd={<FaHome />}
          />
        </Link>
      </div>
      <div className="md:w-10/12 mx-auto my-4 md:my-10">
        <span className="font-bold dark:text-s-dark text-gray-900">
          متن خطا :
        </span>
        <p
          className="bg-gray-500/20 shadow-md rounded-md p-5 md:p-7 mt-2 dark:text-p-dark text-gray-800"
          dir="ltr"
        >
          {error.message}
        </p>
      </div>
      <ContactSocialMedia />
    </div>
  );
}
