import { FilterQueryType } from '@/app/type'
import React from 'react'
type TagInfoType = {
    searchData: FilterQueryType
    text: string
    categoryName: string
}
export default function TagInfo({ searchData, text, categoryName }: TagInfoType) {
    const { search, tags } = searchData
    return (
        <section>
            {tags ?
                <h2 className="text-sm mt-5 md:text-lg text-c-orange dark:text-p-dark flex items-center gap-2">
                    <i className="w-3 h-3 dark:bg-gray-300 bg-blue-full animate-bounce rounded-full inline-block"></i>
                    {search ?
                        <>دسته انتخاب شده : <b className='text-gray-800 dark:text-p-dark'>{tags}</b></>
                        :
                        `تمام ${categoryName} مرتبط با دسته "${tags}" در این صفحه فهرست شده‌اند.`
                    }
                </h2>
                :
                null}
            {!tags ?
                <h2 className="text-sm mt-5 md:text-lg text-c-orange dark:text-p-dark flex items-center gap-2">
                    <i className="w-3 h-3 dark:bg-gray-300 bg-blue-full animate-bounce rounded-full inline-block"></i>
                    {
                        search ?
                            <>کلمه جستجو شده : <b className='text-gray-800 dark:text-p-dark'>{search}</b></>
                            :
                            text
                    }
                </h2>
                :
                search && tags ?
                    <span className="text-sm mt-5 md:text-lg text-c-orange dark:text-p-dark flex items-center gap-2">
                        <i className="w-3 h-3 dark:bg-gray-300 bg-blblue-fbg-blue-fullnimate-bounce rounded-full inline-block"></i>
                        کلمه جستجو شده : <b className='text-gray-800 dark:text-p-dark'>{search}</b>
                    </span>
                    : null
            }
        </section>
    )
}
