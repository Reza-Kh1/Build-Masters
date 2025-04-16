import { IoWarning } from "react-icons/io5";

export default function DontData({ text }: { text: string }) {
    return (
        <div className='w-full flex justify-between items-center p-2 text-gray-50 rounded-md shadow-md bg-gradient-to-l from-blue-400 to-orange-400'>
            <h1 className="">
                {text}
            </h1>
            <IoWarning className="text-3xl"/>
        </div>
    )
}
