import Link from 'next/link'
import React from 'react'

export default function BannerCallUs() {
    return (
        <div className="w-full my-6 lg:my-10 py-4 bg-gradient-to-tl to-orange-low dark:shadow-zinc-950 dark:from-slate-700 dark:to-zinc-900 from-orange-full shadow-[#b7b7b7] shadow-md flex items-center gap-2 justify-center relative">
            <span className="text-white text-xs md:text-base">
                آیا میخواهید خانه رویایی خود را با ما بسازید ؟
            </span>
            <Link href={"/contact-us"} className="text-white font-semibold text-sm md:text-base hover:text-gray-950 dark:hover:text-blue-400">
                با ما تماس بگیرید
            </Link>
        </div>
    )
}
