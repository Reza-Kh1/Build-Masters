import React, { useState } from 'react'
import ImgTag from '../ImgTag/ImgTag'
import toast from 'react-hot-toast'
import axios from 'axios'
import { FaTrashAlt, FaUpload } from 'react-icons/fa'
import { IconButton } from '@mui/material'
import { FaTrash, FaTrashCanArrowUp } from 'react-icons/fa6'
type UploadImageType = {
    mediaArry: string[]
    setMediaArry: (value: string[]) => void
}
export default function UploadImage({ mediaArry, setMediaArry }: UploadImageType) {
    const [progress, setProgress] = useState<number | null>(null);
    const deleteImage = (src: string) => {
        const newImages = mediaArry.filter((item) => item !== src)
        setMediaArry(newImages)
    }
    const UploadMedia = async (event: React.ChangeEvent<HTMLInputElement>) => {
        let resultSize = 0
        const maxSize = 10 * 1024 * 1024
        const newFile = event.target.files;
        if (!newFile?.length) return;
        const formData = new FormData();
        Array.from(newFile).forEach((file) => {
            resultSize = resultSize + file.size
            formData.append("media", file);
        });
        if (resultSize > maxSize) {
            setProgress(null);
            return toast.error("!حجم فایل نباید بیش از 10 مگابایت باشد")
        }
        const uploadPromise = async () => {
            const { data } = await axios.post("media/user", formData, {
                onUploadProgress: (event) => {
                    if (event.lengthComputable && event.total) {
                        const percentComplete = Math.round(
                            (event.loaded * 100) / event.total
                        );
                        setProgress(percentComplete);
                    }
                },
            })
            const getUrl = data.url.map((i: any) => i.url)
            setMediaArry([...mediaArry, ...getUrl])
            setProgress(null)
        }
        toast.promise(uploadPromise(), {
            loading: "...درحال آپلود",
            error: "با خطا مواجه شدیم",
            success: "با موفقیت آپلود شد"
        }, { position: "bottom-center" })
    };
    return (
        <div className="flex flex-wrap">
            <div className="w-full md:w-1/3 md:pl-3">
                <span className="block mb-3">عکس های خود را آپلود کنید</span>
                <label
                    htmlFor="upload"
                    className="w-1/2 md:w-1/3 h-32 cursor-pointer dark:bg-[#444e54] dark:shadow-full-dark dark:hover:shadow-none bg-blue-200/80 block rounded-md shadow-md relative"
                >
                    <input
                        onChange={UploadMedia}
                        type="file"
                        multiple
                        placeholder="upload"
                        id="upload"
                        hidden
                        tabIndex={-1}
                    />
                    {progress ?
                        <i className="absolute flex items-center justify-center w-14 h-14 bg-green-500/80 hover:bg-orange-500 transition-all shadow-md border border-white text-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {progress}%
                        </i>
                        :
                        <i className="absolute p-3 bg-green-500/80 hover:bg-orange-500 transition-all shadow-md border border-white text-white rounded-full left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <FaUpload />
                        </i>
                    }
                </label>
            </div>
            <div className="w-full md:w-2/3 grid gap-4 grid-cols-2 mt-5 md:mt-0 md:grid-cols-4">
                {mediaArry.map((i, index) => (
                    <div key={index} className="relative">
                        <ImgTag
                            figureClass="w-full h-full"
                            src={i}
                            className="object-cover w-full h-full shadow-md dark:shadow-full-dark rounded-md p-1"
                            alt={"عکس آپلود شد"}
                            width={300}
                            height={300}
                        />
                        <button aria-label='حذف' type='button' onClick={() => deleteImage(i)} className="absolute left-3 top-3 bg-slate-400/80 rounded-full ">
                            <IconButton color="error" size="small">
                                <FaTrashAlt />
                            </IconButton>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}
