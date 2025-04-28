"use client"
import { PaginationType } from "@/app/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
type PaginationComponentsType = {
    pagination: PaginationType | undefined;
};
export default function Pagination({ pagination }: PaginationComponentsType) {
    const searchParams = useSearchParams() as any
    if (!pagination || !pagination.allPage) return;
    let { page, ...otherQuery } = Object.fromEntries(searchParams.entries());
    page = page || 1
    const newQuery = new URLSearchParams(otherQuery).toString()
    const startPage = Math.max(1, Number(page) - 2);
    const endPage = Math.min(pagination.allPage, Number(page) + 2);
    return (
        <div className="w-full mx-auto md:w-7/12 flex gap-1 sm:gap-2 items-center justify-center mt-12 md:mt-14">
            {Number(page) > 3 && (
                <>
                    <Link aria-label={"1"} href={{ query: newQuery + `&page=${1}` }}>
                        <button title={'1'} type="button" className={"w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md bg-pagination dark:shadow-low-dark dark:hover:shadow-none"}>
                            <span className="text-white pt-1">
                                1
                            </span>
                        </button>
                    </Link>
                    <span>...</span>
                </>
            )}
            {pagination.allPage
                ? Array.from(
                    { length: Math.min(11, endPage - startPage +1 ) },
                    (_, i) => startPage + i
                ).map((i) => {                
                    return i === Number(page) ?
                        <button aria-label={`${i}`} title={`${i}`} type="button" key={i} disabled={Number(page) === i} className={`w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md ${i === Number(page) ? "!bg-slate-400 dark:!bg-[#313132]" : " bg-pagination dark:shadow-low-dark dark:hover:shadow-none"}`}>
                            <span className="text-white pt-1">
                                {i}
                            </span>
                        </button>
                        :
                        <Link aria-label={`${i}`} href={{ query: newQuery + `&page=${i}` }} key={i}>
                            <button title={`${i}`} type="button" className={"w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md bg-pagination dark:!bg-slate-700 dark:shadow-low-dark dark:hover:shadow-none"}>
                                <span className="text-white pt-1">
                                    {i}
                                </span>
                            </button>
                        </Link>
                })
                : null}
            {pagination.allPage - Number(page) > 2 && (
                <>
                    <span>...</span>
                    <Link aria-label={`${pagination.allPage}`} href={{ query: newQuery + `&page=${pagination.allPage}` }}>
                        <button title={`${pagination.allPage}`} type="button" className={"w-9 h-9 md:w-12 md:h-12 flex items-center justify-center rounded-full shadow-md bg-pagination dark:shadow-low-dark dark:hover:shadow-none"}>
                            <span className="text-white pt-1">
                                {pagination.allPage}
                            </span>
                        </button>
                    </Link>
                </>
            )}
        </div>
    );
}