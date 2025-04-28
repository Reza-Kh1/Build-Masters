import React from 'react'
import ImgTag from '../ImgTag/ImgTag'
import { CommentsType } from '@/app/type'
import ResComment from '../ResComment/ResComment'
export default function Comments({ comments, postId }: { comments: CommentsType[], postId?: number }) {
    const ReplyComments = ({ data }: { data: CommentsType }) => {
        return <>
            <article itemProp="review" itemScope itemType="http://schema.org/Review" key={data?.id} className='relative'>
                <div className='w-12 lg:w-14 absolute right-0 transform translate-x-1/2 top-1 lg:top-3 p-1 dark:border-bg-dark dark:bg-custom-dark bg-slate-200 border rounded-full'>
                    <ImgTag width={40} height={40} className='rounded-full w-full h-auto shadow-md' src={data.position === "ADMIN" ? "/comments/image-admin.png" : "/comments/semicolon-image.png"} alt={data?.name} />
                </div>
                <div className='border border-gray-300 dark:border-bg-dark my-2 rounded-sm shadow-sm dark:shadow-full-dark pr-7 lg:pr-10 pl-2 lg:pl-3 py-2 lg:py-5'>
                    <div className='flex w-full justify-between mb-3'>
                        <header className='flex flex-col'>
                            <h3 itemProp="author" className='text-sm lg:text-base text-gray-700 dark:text-h-dark'>{data?.name}</h3>
                            <time itemProp="datePublished" dateTime={new Date(data?.createdAt).toLocaleDateString("fa")} className='text-[0.60rem] lg:text-xs text-gray-500 italic dark:text-s-dark'>{new Date(data?.createdAt).toLocaleDateString("fa")}</time>
                        </header>
                        <ResComment comment={data} postId={postId} />
                    </div>
                    <div className='text-justify text-sm text-gray-700 pl-5 dark:text-p-dark'>
                        <p itemProp="reviewBody">{data?.text}</p>
                    </div>
                </div>
            </article>
            {data?.replies?.length ?
                <div className='mr-6 lg:mr-8 relative'>
                    {data?.replies?.map((i, index) => (
                        <ReplyComments data={i} key={index} />
                    ))}
                </div>
                : null}
        </>
    }
    return (
        <section aria-labelledby="user-comments" className='comments mb-3' id='comments'>
            <h2 className='lg:text-lg mb-3 text-gray-700 dark:text-p-dark font-bold'><span className='text-blue-700 dark:text-blue-400'>کامنت</span> کاربران</h2>
            {comments.length ?
                <div className='mr-6 lg:mr-8 relative'>
                    {comments.map((i, index) => (
                        <ReplyComments data={i} key={index} />
                    ))}
                </div>
                : <span className='text-sm block  lg:text-xl dark:text-p-dark text-gray-600'>هیچ کامنتی ثبت نشده !</span>}
        </section>
    )
}
