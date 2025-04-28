"use client"
import { Button } from '@mui/material'
import React from 'react'
import { useFormStatus } from 'react-dom'
import { CgSpinner } from 'react-icons/cg'
type CustomButtonType = {
    iconEnd?: React.ReactNode
    iconStart?: React.ReactNode
    name: string,
    className?: string
    type: "submit" | "reset" | "button"
    color?: "warning" | "blue" | "primary" | "orange"
    disable?: boolean
    onClick?: (value: any) => void
}
export default function CustomButton({ type, disable, iconEnd, iconStart, name, className, color, onClick }: CustomButtonType) {
    const { pending } = useFormStatus()    
    let colorButton = ""
    if (color === "blue") {
        colorButton = "hover:to-[#1a99e7] hover:from-[#a9e0ff] from-[#acdcf7] to-[#58b2e9] w-full dark:from-slate-700 dark:to-zinc-900 dark:shadow-low-dark dark:hover:shadow-none"
    }
    if (color === "orange") {
        colorButton = "from-[#d04e0d] to-[#e95858] hover:to-[#ff1010] hover:from-[#ff8b20] w-full"
    }
    if (color === "warning") {
        colorButton = "from-[#fe9c65] to-[#e77e3a] hover:to-[#ff1010] hover:from-[#ff8b20] w-full  dark:from-slate-700 dark:to-zinc-900 dark:shadow-low-dark dark:hover:shadow-none"
    }
    colorButton = colorButton || "hover:from-blue-500/70 hover:to-blue-600/90 from-blue-400/70 to-blue-500 w-full dark:from-slate-700 dark:to-zinc-900 dark:shadow-low-dark dark:hover:shadow-none"
    return (
        <Button
            aria-labelledby={name}
            onClick={onClick}
            startIcon={iconStart}
            endIcon={pending || disable ? <CgSpinner className='animate-spin' /> : iconEnd}
            disabled={disable}
            type={type || "button"} className={"!text-gray-100 bg-gradient-to-tl rounded-lg shadow-md " + colorButton + " " + className}>
            {name}
        </Button>
    )
}
