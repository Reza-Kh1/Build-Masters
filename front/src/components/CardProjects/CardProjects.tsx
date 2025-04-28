import Link from 'next/link'
import React from 'react'
import ImgTag from '../ImgTag/ImgTag'
import { FaPlay } from 'react-icons/fa'
import { CardProjectsType } from '@/app/type'
import { GrUserWorker } from "react-icons/gr";
import { SiGooglemaps } from "react-icons/si";
import { MdAddHomeWork } from 'react-icons/md'
import { FaCalendarDays } from 'react-icons/fa6'
export default function CardProjects({ project }: { project: CardProjectsType }) {    
    if (!project) return
    return (
        <section className='hover:shadow-md dark:shadow-full-dark rounded-md group   '>
            <Link href={"/project/" + project?.name?.replace(/ /g, "-")} className="relative group/image">
                <ImgTag
                    figureClass="relative w-full overflow-hidden rounded-md"
                    alt={"نمونه پروژه"}
                    src={project?.image}
                    width={400}
                    height={300}
                    classPlus="group-hover/image:scale-125 !w-full !h-auto hover-project"
                />
                <i className="absolute text-xs md:left-2 left-1 md:top-2 top-1 p-1 rounded-sm bg-slate-700/80 flex gap-1 items-center text-white ">
                    <FaCalendarDays  />
                    {new Date(project?.updatedAt).toLocaleDateString("fa")}
                </i>
                <i className="p-3 md:p-5 text-white group-hover:opacity-100  opacity-0 rounded-full backdrop-blur-md absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <FaPlay className=' md:text-xl' aria-label='بازکردن' title='نمایش' />
                </i>
            </Link>
            <div className="flex flex-col p-2 pb-4">
                <div className='flex'>
                    <Link href={"/project/" + project.name.replace(/ /g, "-")} className='flex text-gray-800 dark:text-h-dark group/name items-center gap-1'>
                        <MdAddHomeWork className='group-hover/name:text-blue-400 min-w-[20px]' />
                        <h3 className="group-hover/name:text-blue-400 md:text-xl cutline cutline-1">{project.name}</h3>
                    </Link>
                </div>
                <div className='flex md:mt-3'>
                    <Link href={"/experts/" + project.Worker?.name.replace(/ /g, "-")} className='group/expert dark:text-s-dark text-gray-600 flex items-center gap-1'>
                        <GrUserWorker className='group-hover/expert:text-blue-400 min-w-[20px]' />
                        <span className='md:text-sm group-hover/expert:text-blue-400 cutline cutline-1'>{project.Worker?.name}</span>
                    </Link>
                </div>
                <div className='flex items-center gap-1 mb-1 text-gray-600 dark:text-s-dark'>
                    <SiGooglemaps aria-label='آدرس' title='آدرس' className='min-w-[20px]' />
                    <span className="md:text-sm cutline cutline-1">
                        {project.address}
                    </span>
                </div>
            </div>
        </section>
    )
}