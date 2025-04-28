import Link from 'next/link'
import React from 'react'
import { FaPhone } from 'react-icons/fa6'

export default function Calling() {
    return (
        <div>
            <Link aria-label='تماس بگیرید' title='تماس بگیرید' href="tel:09121975658" className="fixed p-3 text-lg bg-green-500/80 lg:text-2xl shadow-md md:animate-pulse z-50 left-2 lg:left-4 bottom-2 lg:bottom-5 rounded-full text-white">
                <FaPhone />
            </Link>
        </div>
    )
}
