import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import { fetchImage } from '../../services/media';
import { FaSearchengin, FaTrash } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button, ButtonGroup, IconButton } from '@mui/material';
import { MediaType, PaginationType } from '../../type';
import { TbPhotoCirclePlus } from "react-icons/tb";
import { IoIosImages } from 'react-icons/io';
import DontData from '../DontData/DontData';
type AllMediaType = {
    data: MediaType[]
    pagination: PaginationType;
};
type SearchFilterType = {
    order: "desc" | "asc";
    uploader: string;
    type: "IMAGE" | "VIDEO" | "";
}
type MediaBoxType = {
    setUrlImg?: (value: MediaType) => void
}
export default function MediaBox({ setUrlImg }: MediaBoxType) {
    const [searchQuery, setSearchQuery] = useState<SearchFilterType>({ order: "desc", type: "", uploader: "ADMIN" })
    const [search, setSearch] = useState<SearchFilterType>({ order: "desc", type: "", uploader: "ADMIN" })
    const query = useQueryClient();
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
        useInfiniteQuery<AllMediaType>({
            queryKey: ["mediaDB", searchQuery],
            queryFn: ({ pageParam = 1 }) => fetchImage({ pageParam, searchQuery }),
            getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
            staleTime: 1000 * 60 * 60 * 24,
            gcTime: 1000 * 60 * 60 * 24,
            initialPageParam: "",
        });
    const { mutate } = useMutation({
        mutationFn: (i: string) => {
            return axios.delete(`media?url=${i}`);
        },
        onSuccess: () => {
            toast.success("عکس با موفقیت حذف شد");
            query.invalidateQueries({ queryKey: ['mediaDB'] });
            query.invalidateQueries({ queryKey: ['mediaDBaaS'] });
        },
        onError: () => {
            toast.warning("عکس حذف نشد");
        },
    });
    return (
        <div className='w-full'>
            <div className='w-full flex flex-wrap gap-5 items-center mb-5 p-2 bg-blue-100 shadow-md rounded-md justify-evenly'>
                <div className='flex items-center gap-1'>
                    <span className='font-semibold'>نمایش :</span>
                    <ButtonGroup
                        disableElevation
                        variant="contained"
                        color='inherit'
                        aria-label="Disabled button group"
                    >
                        <Button color={search.type === "" ? "primary" : "inherit"} variant='contained' onClick={() => setSearch({ ...search, type: "" })}>همه</Button>
                        <Button color={search.type === "IMAGE" ? "primary" : "inherit"} variant='contained' onClick={() => setSearch({ ...search, type: "IMAGE" })}>عکس ها</Button>
                        <Button color={search.type === "VIDEO" ? "primary" : "inherit"} variant='contained' onClick={() => setSearch({ ...search, type: "VIDEO" })}>ویدئو ها</Button>
                    </ButtonGroup>
                </div>
                <div className='flex items-center gap-1'>
                    <span className='font-semibold'>آپلود شده توسط :</span>
                    <ButtonGroup
                        disableElevation
                        color='inherit'
                        variant="contained"
                        aria-label="Disabled button group"
                    >
                        <Button color={search.uploader === "ADMIN" ? "primary" : "inherit"} onClick={() => setSearch({ ...search, uploader: "ADMIN" })}>ادمین</Button>
                        <Button color={search.uploader === "" ? "primary" : "inherit"} onClick={() => setSearch({ ...search, uploader: "" })}>همه</Button>
                        <Button color={search.uploader === "USER" ? "primary" : "inherit"} onClick={() => setSearch({ ...search, uploader: "USER" })}>کاربر</Button>
                    </ButtonGroup>
                </div>
                <div className='flex items-center gap-1'>
                    <span className='font-semibold'>ترتیب :</span>
                    <ButtonGroup
                        disableElevation
                        color='inherit'
                        variant="contained"
                        aria-label="Disabled button group"
                    >
                        <Button color={search.order === "desc" ? "primary" : "inherit"} onClick={() => setSearch({ ...search, order: "desc" })}>جدید ترین</Button>
                        <Button color={search.order === "asc" ? "primary" : "inherit"} onClick={() => setSearch({ ...search, order: "asc" })}>قدیمی ترین</Button>
                    </ButtonGroup>
                </div>
                <div className='w-1/6'>
                    <Button variant='contained' disabled={isPending || isFetchingNextPage} fullWidth onClick={() => setSearchQuery(search)} endIcon={<FaSearchengin />} color={"primary"} >{isPending ? "در حال جستجو..." : "جستجو"}</Button>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-5">
                {data?.pages?.map((item, index) => {
                    if (!item.data.length) {
                        return <DontData key={index} text='اطلاعاتی یافت نشد!' />
                    }
                    return item?.data?.map((i, index) => (
                        <figure key={index} className="relative h-52 group">
                            {i.type === "IMAGE" ?
                                <img
                                    alt=""
                                    src={i.url}
                                    className="shadow-md rounded-md bg-cover w-full h-full"
                                /> :
                                <video width="600" controls>
                                    {
                                        i.url.search(".mp4") ?
                                            <source src={i.url} type="video/mp4" /> :
                                            <source src={i.url} type="video/webm" />
                                    }
                                    مرورگر شما از نمایش ویدیو پشتیبانی نمی‌کند.
                                </video>}
                            <span
                                className="absolute bottom-2 cursor-pointer left-2"
                                onClick={() => mutate(i.url)}
                            >
                                <IconButton>
                                    <FaTrash size={20} color="red" />
                                </IconButton>
                            </span>
                            {setUrlImg ? (
                                <span
                                    className="absolute bottom-2 cursor-pointer right-2"
                                    onClick={() => {
                                        navigator.clipboard.writeText(i.url)
                                        toast.success("آدرس کپی شد")
                                        setUrlImg(i);
                                    }}
                                >
                                    <IconButton className="!bg-black/60">
                                        <IoIosImages size={20} color="white" />
                                    </IconButton>
                                </span>
                            ) : null}
                        </figure>
                    ));
                })}
            </div>
            {hasNextPage && (
                <Button
                    onClick={() => fetchNextPage()}
                    color="primary"
                    className="!mt-5"
                    variant="contained"
                    disabled={isFetchingNextPage}
                    endIcon={<TbPhotoCirclePlus />}
                >
                    {isFetchingNextPage ? "در حال بارگزاری..." : "نمایش بیشتر"}
                </Button>
            )}
        </div>
    )
}
