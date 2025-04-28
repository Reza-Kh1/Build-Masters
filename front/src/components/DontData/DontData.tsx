import { IconButton, Tooltip } from '@mui/material'
import React from 'react'
import { BsFillInfoCircleFill } from 'react-icons/bs'
type DontDataType = {
    icon?: React.ReactNode
    name: string
    className?: string
}
export default function DontData({ name, icon, className }: DontDataType) {
    return (
        <div className='bg-gradient-to-br dark:shadow-low-dark from-slate-300 dark:from-zinc-900 dark:to-slate-700 to-blue-500 w-full flex p-2 md:p-3 my-6 items-center text-white rounded-md shadow-md'>
            <span className='text-sm md:text-base'>{name}</span>
            <Tooltip placement='top' title="هیچ اطلاعاتی در دیتابیس پیدا نشد!">
                <IconButton color='inherit' className='!text-sm md:!text-xl' >
                    <BsFillInfoCircleFill />
                </IconButton>
            </Tooltip>
        </div>
    )
}
