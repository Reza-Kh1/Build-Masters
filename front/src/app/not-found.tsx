import ImgTag from "@/components/ImgTag/ImgTag";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full not-found" style={{ backgroundImage: "url('/sky-image.webp')" }}>
      <div className="absolute transform -translate-x-1/2 top-16 left-1/2 w-full flex justify-center">
        <span className="text-gray-200 md:text-lg font-bold block">صفحه مورد نظر شما یافت نشد!</span>
      </div>
      <div className="w-2/3 md:w-1/3 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute transform">
        <ImgTag alt={"notfound"} src={"/404.png"} width={350} height={300} className="w-full h-auto" />
      </div>
      <div className=" absolute transform bg-purple-400/20 shadow-md rounded-md p-3 px-5 w-11/12 md:w-1/4 text-center translate-x-1/2 md:-translate-x-1/3 md:translate-y-1/3 bottom-4 md:bottom-1/2 right-1/2 md:right-0">
        <span className="block mb-2 text-gray-200 font-bold text-sm md:text-base">خطای 404 رخ داده است به دلایل زیر :</span>
        <p className="text-gray-300 text-xs md:text-base">صفحه ای که به دنبالش هستید پاک شده باشد !</p>
        <p className="text-gray-300 text-xs md:text-base">آدرسی که وارد کرده اید اشتباه باشد.</p>
      </div>
      <div className=" absolute transform -translate-x-1/2 bottom-28 md:bottom-16 left-1/2">
        <Link href={"/"} className="flex w-auto hover:shadow-none shadow-low-dark text-gray-200 bg-purple-400/40 shadow-md rounded-md p-2 justify-center items-center gap-3">
          بازگشت به خانه
          <i>
            <FaHome />
          </i>
        </Link>
      </div>
    </div>
  );
}