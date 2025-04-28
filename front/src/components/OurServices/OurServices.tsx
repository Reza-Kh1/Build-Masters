import React from 'react'
import ImgTag from '../ImgTag/ImgTag';
import { dataBanner } from '@/data/dataBanner';
export default function OurServices() {
    return (
        <div className="w-full px-3 py-3 lg:py-0 flex flex-col md:flex-row gap-5 md:gap-3 bg-[#282828] shadow-md">
            <div className="w-full md:w-1/3 flex items-center">
                <ImgTag src={"/about-us.jpg"} alt={"test"} width={500} height={450} />
            </div>
            <div className="w-full md:w-2/3 grid grid-cols-2 gap-3 md:gap-5 lg:gap-8 lg:p-10">
                {dataBanner.map((props, index) => (
                    <section className="flex gap-3" key={index}>
                        <figure className="lg:mt-1">
                            <ImgTag
                                alt={""}
                                src={props.src}
                                className="md:w-14 w-32 h-auto object-contain"
                                width={68}
                                height={68}
                            />
                        </figure>
                        <div>
                            <span className="text-slate-50 text-sm lg:text-base">
                                {props.title}
                            </span>
                            <p className="text-slate-400 lg:text-sm mt-1 lg:mt-2 text-xs text-justify">
                                {props.text}
                            </p>
                        </div>
                    </section>
                ))}
            </div>
        </div>
    )
}
