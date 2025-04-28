import { fetchApi } from "@/action/fetchApi";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import Cards from "@/components/Cards/Cards";
import Pagination from "@/components/Pagination/Pagination";
import React, { Suspense } from "react";
import { AllPostType, FilterQueryType, TagsType } from "../../../type";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import { Metadata } from "next";
import { dataApi } from "@/data/tagsName";
import DontData from "@/components/DontData/DontData";
import { notFound } from "next/navigation";
import SelectTag from "@/components/SelectTag/SelectTag";
import TagInfo from "@/components/TagInfo/TagInfo";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
type PageType = { params: { category: string }, searchParams: FilterQueryType }
const getData = async (query: FilterQueryType) => {
    if (query.tags) {
        query.tags = query.tags?.replace(/-/g, " ")
    }
    if (query.expert) {
        query.expert = query.expert?.replace(/-/g, " ")
    }
    const url = "post?" + new URLSearchParams(query);
    const data = await fetchApi({ url, next: dataApi.posts.cache, tags: dataApi.posts.tags });
    if (data.error) return notFound();
    return data;
};
const getTags = () => {
    return fetchApi({ url: dataApi.tags.url, next: dataApi.tags.cache, tags: dataApi.tags.tags });
};
export async function generateMetadata({ searchParams }: PageType): Promise<Metadata> {
    const tag = searchParams?.tags || "وبلاگ";
    const title = `مقاله های ${tag} | ${nameSite}`
    const desc = `در این صفحه تمامی مقالات مرتبط با دسته ${tag} را مشاهده می‌کنید. این مقالات به شما در انتخاب بهتر و آگاهی بیشتر کمک می‌کنند.`
    return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
        title: title,
        description: desc,
        keywords: [
            tag,
            title,
            "پروژه‌های ساختمانی",
            "مشاوره ساخت‌وساز",
            "خدمات پیمانکاری",
            nameSite,
        ],
        openGraph: {
            type: 'website',
            siteName: nameSite,
            locale: "fa_IR",
            title: title,
            description: desc,
            url: `${process.env.NEXT_PUBLIC_URL}/blog/tags/${searchParams.tags}?tags=${searchParams.tags}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_URL}/category.jpg`,
                    width: 600,
                    height: 350,
                    alt: `صفحه وبلاگ با دسته ${tag} در سایت ${nameSite}`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            creator: "@buildMasters",
            site: "@buildMasters",
        },
        robots: "noindex,nofollow",
        alternates: {
            canonical: `/blog/tags/${searchParams.tags}?tags=${searchParams.tags}`,
        },
    };
}
export default async function page({ searchParams }: { searchParams: FilterQueryType; }) {
    const { data: dataTags }: { data: TagsType[] } = await getTags();
    const data: AllPostType = await getData(searchParams);
    return (
        <>
            <Breadcrums />
            <div className="classDiv">
                <section className="flex w-full items-center justify-between">
                    <h1 className="font-semibold lg:text-xl">مقاله های {searchParams.tags}</h1>
                    <div className="w-2/6 flex gap-2">
                        <SelectTag urlPage="blog" dataTags={dataTags} />
                    </div>
                </section>
                <TagInfo text="تمام مطالب در همین صفحه فهرست شده اند" categoryName="مطالب" searchData={searchParams} />
                <div className="my-5">
                    {
                        data.rows.length ?
                            <Cards props={data.rows} />
                            :
                            <DontData name="هیچ پستی یافت نشد!" />
                    }
                </div>
                <Suspense fallback={"در حال بارگیری ..."}>
                    <Pagination pagination={data.paginate} />
                </Suspense>
            </div>
            <ContactSocialMedia />
        </>
    );
}