import React from 'react'
import ImgTag from '../ImgTag/ImgTag'
import Link from 'next/link'
import { FaPhone, FaRegUserCircle } from 'react-icons/fa'
import { ExpertType } from '@/app/type'
import { IoIosCheckmarkCircleOutline } from 'react-icons/io'
import { FaCalendar } from 'react-icons/fa6'

export default function CardExperts(props: ExpertType) {
  return (
    <section className='w-full shadow-md dark:shadow-full-dark dark:hover:shadow-none transition-all bg-gradient-to-b to-blue-full dark:to-slate-700 dark:from-zinc-900 from-blue-low rounded-md'>
      <div className='h-28 md:h-32 dark:bg-hight-dark bg-gray-50 shadow-md rounded-t-md'>
        <h3 className='font-semibold text-sm md:text-base gap-1 p-2 flex justify-between items-center dark:text-p-dark'>
          <span className='cutline cutline-1 w-2/3'>
            {props.name}
          </span>
          <span className='text-xs md:text-sm font-normal flex items-center gap-1 dark:text-s-dark'>
            مورد تایید<IoIosCheckmarkCircleOutline className='text-green-500 text-xl' />
          </span>
        </h3>
        <Link aria-label={props.name} title={props.name} href={"/experts/" + props?.name?.replace(/ /g, "-")} className='w-full flex justify-center'>
          <ImgTag figureClass='relative' alt={props.name} src={props?.image} width={300} height={300} className='rounded-full border-8 dark:border-[#262e3b] border-blue-full w-36 h-36 md:w-40 md:h-40 object-cover' />
        </Link>
      </div>
      <div className='mt-16 p-2 text-white'>
        <div className='flex flex-wrap gap-1 sm:gap-2 w-full md:px-2 sm:my-2'>
          <div className='flex flex-row items-start md:items-center justify-between w-full'>
            <Link aria-label='شماره تلفن' title={props.phone} href={"tel:" + props.phone} className='w-full hover:bg-orange-color hover:shadow-md p-1 px-2 rounded-md dark:text-p-dark text-white'>
              <div className='flex items-center gap-2'>
                <i className='text-gray-50 dark:text-p-dark'><FaPhone /></i>
                <span className='cutline cutline-1'>
                  {props.phone}
                </span>
              </div>
            </Link>
            <div className='w-full justify-end hover:bg-orange-color hover:shadow-md p-1 px-2 rounded-md dark:text-p-dark text-white flex items-center gap-2'>
              <FaCalendar className='text-gray-50 dark:text-p-dark' />
              <span>
                {new Date(props.createdAt).toLocaleDateString("fa")}
              </span>
            </div>
          </div>
          {props?.Tags?.length ?
            (
              <div className='w-full text-white px-2 flex dark:text-p-dark'>
                <p className='md:text-base block'>تخصص</p>
                <span className='text-sm md:text-base cutline cutline-1 pr-1'> : {" "} 
                  {props.Tags.map((i, index) => {
                    if ((index + 1) === props.Tags?.length) return i.name
                    return i.name + " ، "
                  })}
                </span>
              </div>
            )
            : null}
          <Link href={"/experts/" + props?.name?.replace(/ /g, "-")} className='text-sm md:text-base mt-3 text-gray-600 mx-auto hover:text-c-orange dark:bg-hight-dark dark:text-h-dark dark:shadow-low-dark dark:hover:shadow-none hover:shadow-orange-500 flex items-center px-5 bg-gray-50  shadow-md p-1 rounded-md text-[17px] gap-1'>
            <span className='inline-block'>
              پروفایل
            </span>
            <i>
              <FaRegUserCircle />
            </i>
          </Link>
        </div>
      </div>
    </section>
  )
}
