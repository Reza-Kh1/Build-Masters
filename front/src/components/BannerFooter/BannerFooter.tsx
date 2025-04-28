import React from 'react'
import ImgTag from '../ImgTag/ImgTag'
import "./style.css"
import { servicesData } from '@/data/dataService'
export default function BannerFooter() {
    return (
        <section className='banner-footer w-full shadow-md py-4 md:py-4'>
            <ul className='flex w-full max-w-7xl mx-auto px-2 md:px-0 justify-between md:justify-evenly items-center gap-1 md:gap-3 text-gray-400'>
                {servicesData.map((i, index) => (
                    <li className='flex flex-col items-center gap-2 md:gap-3 justify-center' key={index}>
                        <ImgTag src={i.img} classPlus='md:w-12 w-10 h-auto' alt={""} width={96} height={96} />
                        <span className='text-[8px] md:text-base  text-center'>
                            {i.title}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    )
}