import { CardPostType } from '@/app/type'
import Link from 'next/link'
import React from 'react'
import { FaArrowLeft, FaComments, FaPhotoVideo } from 'react-icons/fa'
import { FaCalendarDays } from 'react-icons/fa6'

export default function CardPost({ post }: { post?: CardPostType }) {
    return (
        <section>
            <Link href={`/post/${post?.title}`}>
                <div className="shadow-md group hover:shadow-slate-600 dark:shadow-full-dark dark:hover:shadow-none transition-all w-full relative rounded-lg bg-cover bg-center min-h-52 md:min-h-80 bg-no-repeat" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, .8), rgba(0, 0, 0, .4)), url(${post?.image || "/errorImage.webp"})` }}>
                    <div className="z-10 absolute flex flex-col justify-between md:justify-evenly h-full p-3">
                        <span className="text-xs text-gray-300">{post?.Category?.name}</span>
                        <h3 className="text-sm md:text-xl font-semibold text-gray-50">{post?.title}</h3>
                        <div className="flex text-gray-300 text-xs md:text-sm items-center gap-1 md:gap-3 justify-start">
                            <div className="flex gap-1 md:gap-2 items-center">
                                <i>
                                    <FaCalendarDays />
                                </i>
                                <span>{post?.updatedAt ? new Date(post.updatedAt).toLocaleDateString("fa") : null}</span>
                            </div>
                            |
                            <div className="flex gap-1 md:gap-2  items-center">
                                <i>
                                    <FaComments />
                                </i>
                                <span>{post?.totalComments}</span>
                            </div>
                            |
                            <div>
                                <i>
                                    <FaPhotoVideo />
                                </i>
                            </div>
                        </div>
                        <p className="text-justify text-gray-200 text-sm md:text-base cutline cutline-3">
                            {post?.description}</p>
                        <div className="h-8">
                            <span className="opacity-0 absolute transition-all -bottom-3 group-hover:bottom-2 md:group-hover:bottom-4 flex pt-3 group-hover:pt-0 group-hover:opacity-100">
                                <i className="p-3 bg-white hover:shadow-black transition-all text-gray-900 rounded-full shadow-md shadow-slate-400">
                                    <FaArrowLeft className='text-sm md:text-base' />
                                </i>
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    )
}
