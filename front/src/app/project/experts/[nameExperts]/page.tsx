import Breadcrums from "@/components/Breadcrums/Breadcrums";
import CardProjects from "@/components/CardProjects/CardProjects";
import LoadingSearch from "@/components/LoadingSearch/LoadingSearch";
import Pagination from "@/components/Pagination/Pagination";
import React, { Suspense } from "react";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import { fetchApi } from "@/action/fetchApi";
import { AllProjectType, FilterQueryType, TagsType } from "@/app/type"
import { Metadata } from "next";
import { dataApi } from "@/data/tagsName";
import DontData from "@/components/DontData/DontData";
import { notFound } from "next/navigation";
import SelectTag from "@/components/SelectTag/SelectTag";
import BannerCallUs from "@/components/BannerCallUs/BannerCallUs";
import TagInfo from "@/components/TagInfo/TagInfo";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
type PageComponentType = {
    params: { nameExperts: 'set' }, searchParams: FilterQueryType
}
type ExpertNameType = {
    name: string;
    id: string;
};
const getData = async (query: FilterQueryType) => {
    if (query.tags) {
        query.tags = query.tags?.replace(/-/g, " ")
    }
    const url = dataApi.projects.url + "?" + new URLSearchParams(query);
    const data = await fetchApi({ url, tags: dataApi.projects.tags, next: dataApi.projects.cache });

    if (data.error) return notFound();
    return data
};
const getTags = () => {
    return fetchApi({
        url: dataApi.tags.url,
        next: dataApi.tags.cache,
        tags: dataApi.tags.tags,
    });
};
const getExpertName = () => {
    return fetchApi({ url: dataApi.expertName.url, next: dataApi.expertName.cache, tags: dataApi.expertName.tags });
};
export async function generateMetadata(query: PageComponentType): Promise<Metadata> {
    const expert = decodeURIComponent(query.params?.nameExperts.replace(/-/g, " ")) || "پروژه ها";
    const title = `${"پروژه های " + expert} | ${nameSite}`;
    const desc = `در این صفحه می‌توانید با پروژه‌های انجام شده توسط متخصص ${expert} آشنا شوید. پروژه‌های ساختمانی ما شامل انواع خدمات ساخت و ساز، معماری و پیمانکاری می‌باشند.`
    return {
        metadataBase: new URL(
            process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
        ),
        title: title,
        description: desc,
        keywords: [
            expert,
            title,
            'پروژه‌های ساختمانی',
            'پروژه‌های ساخت و ساز',
            'پیمانکاری',
            'ساخت و ساز',
            'معماری',
            'پروژه‌های معماری',
            'پروژه‌های عمرانی',
            nameSite,
        ],
        openGraph: {
            type: "website",
            siteName: nameSite,
            locale: "fa_IR",
            title: title,
            description: desc,
            url: `${process.env.NEXT_PUBLIC_URL}/project/experts/${decodeURIComponent(query.params?.nameExperts)}?${new URLSearchParams(query.searchParams)}}`,
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_URL}/category.jpg`,
                    width: 600,
                    height: 350,
                    alt: `صفحه وبلاگ با دسته ${expert} در سایت ${nameSite}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            creator: "@buildMasters",
            site: "@buildMasters",
        },
        robots: "noindex,nofollow",
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/project/experts/${decodeURIComponent(query.params?.nameExperts)}?${new URLSearchParams(query.searchParams)}}`,
        },
    };
}
export default async function page(query: PageComponentType) {
    const data: AllProjectType = await getData(query.searchParams);
    const { data: dataTags }: { data: TagsType[] } = await getTags();
    const { data: dataExpert }: { data: ExpertNameType[] } = await getExpertName();
    return (
        <>
            <Breadcrums />
            <div className="classDiv mb-20">
                <section className="mt-6 flex justify-between items-center">
                    <h1 className="lg:text-xl font-semibold">پروژه های {decodeURIComponent(query.params?.nameExperts.replace(/-/g, " "))}</h1>
                    <div className="w-1/2 flex gap-2">
                        <SelectTag urlPage="project" dataTags={dataTags} dataProject={dataExpert} />
                    </div>
                </section>
                <TagInfo categoryName="پروژه های" searchData={query.searchParams} text="تمام پروژه ها در این صفحه فهرست شده اند." />
                {data.rows.length ?
                    (
                        <div className="my-5 md:my-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                            {data.rows.map((item, index) => (
                                <CardProjects project={item} key={index} />
                            ))}
                        </div>
                    )
                    :
                    <DontData name="هیچ پروژه ای یافت نشد!" />
                }
                <div>
                    <Suspense fallback={<LoadingSearch />}>
                        <Pagination pagination={data.paginate} />
                    </Suspense>
                </div>
            </div>
            <BannerCallUs />
            <ContactSocialMedia />
        </>
    )
}