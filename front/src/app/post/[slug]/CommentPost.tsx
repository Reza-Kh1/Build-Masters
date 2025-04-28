"use client"
import Comments from '@/components/Comments/Comments'
import React, { useState } from 'react'
import { CommentsType } from '../../type'
import CustomButton from '@/components/CustomButton/CustomButton'
import { TbMessageSearch } from 'react-icons/tb'
import { fetchApi } from '@/action/fetchApi'
import toast from 'react-hot-toast'
type CommentPostType = {
    comments: CommentsType[]
    postId?: number
    totalComments: number
}
export default function CommentPost({ comments, postId, totalComments }: CommentPostType) {
    const [allComments, setAllComments] = useState<CommentsType[]>(comments || [])
    const [page, setPage] = useState<number | null>(2)
    const [loading, setLoading] = useState<boolean>(false)
    const getComments = () => {
        setLoading(true)
        toast.loading("...صبر کنید", { id: "loadPage", position: "bottom-center" })
        fetchApi({ url: `comment/${postId}?page=${page}` }).then((data) => {
            const coments = data?.comments?.rows ? [...allComments, ...data?.comments?.rows] : []
            setAllComments(coments)
            setPage(data?.paginate?.nextPage || null)
        }).catch(() => {
            toast.error("با خطا مواجه شدیم")
        }).finally(() => {
            toast.dismiss("loadPage")
            setLoading(false)
        })
    }
    return (
        <div>
            <Comments comments={allComments} postId={postId} />
            {totalComments > 5 && page ?
                <div className='flex justify-center my-5'>
                    <CustomButton
                        onClick={getComments}
                        className='w-1/4'
                        name='نمایش بیشتر'
                        color='primary'
                        type='button'
                        iconEnd={<TbMessageSearch />}
                        disable={loading}
                    />
                </div>
                : null}
        </div>
    )
}
