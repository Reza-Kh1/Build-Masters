import ImgTag from "@/components/ImgTag/ImgTag";
import React from "react";
import { FaPhotoVideo, FaTags } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import ScollComment from "./ScollComment";
import FormComments from "@/components/FormComments/FormComments";
import BannerCallUs from "@/components/BannerCallUs/BannerCallUs";
import { fetchApi } from "@/action/fetchApi";
import { Metadata } from "next";
import { CardPostType, CardProjectsType, PostType } from "@/app/type";
import Script from "next/script";
import parse from "html-react-parser";
import CommentPost from "./CommentPost";
import { notFound } from "next/navigation";
import SwiperCards from "@/components/SwiperCards/SwiperCards";
import Breadcrums from "@/components/Breadcrums/Breadcrums";
import { dataApi } from "@/data/tagsName";
import Link from "next/link";
type DataPostPageType = {
  data: PostType;
  posts: CardPostType[];
  projects: CardProjectsType[];
};
const getData = async (name: string) => {
  const data = await fetchApi({
    url: `${dataApi.singlePost.url}/${name.replace(/-/g, " ")}`,
    next: dataApi.singlePost.cache,
  });
  if (data?.error) {
    return notFound();
  }
  return data;
};
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data }: DataPostPageType = await getData(params.slug);
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    ),
    title: data?.DetailPost?.title,
    description: data?.description,
    keywords: data?.DetailPost?.keyword,
    openGraph: {
      url:
        process.env.NEXTAUTH_URL + "/post/" + data?.title?.replace(/ /g, "-"),
      title: data?.DetailPost?.title,
      description: data?.description,
      images: [
        {
          url: data?.image,
          width: 1200,
          height: 800,
          alt: data?.title,
        },
      ],
      siteName: "اساتید ساخت و ساز",
      locale: "fa_IR",
    },
    twitter: {
      card: 'summary_large_image',
      creator: "@buildMasters",
      site: "@buildMasters"
    },
    robots: "noindex,nofollow",
  };
}
export default async function page({ params }: { params: { slug: string } }) {
  const { data, posts, projects }: DataPostPageType = await getData(params.slug);
  const jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data?.title || "عنوان مقاله",
    image: data?.image || "آدرس تصویر",
    description: data?.description || "توضیحات مقاله",
    author: {
      "@type": "Person",
      name: data?.User.name || "نام نویسنده",
    },
    datePublished: data?.updatedAt || "تاریخ انتشار",
    articleBody: data?.DetailPost?.text || "متن مقاله",
    keywords: data?.DetailPost?.keyword?.join(", ") || "کلمات کلیدی",
    articleSection: data.Category.name,
    url:
      `${process.env.NEXTAUTH_URL}/blog/${data?.title.replace(/ /g, "-")}` ||
      "آدرس مقاله",
  };
  const LinkTagPost = data.Tags[data.Tags.length - 1].name.replace(/ /g,"-") 
  return (
    <>
      <Script
        type="application/ld+json"
        id="jsonld-product"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonld) }}
      />
      <div className="w-full mx-auto relative">
        <ImgTag
          width={1450}
          height={450}
          alt={data?.title}
          src={data?.image}
          className="h-96 object-cover w-full md:max-h-[600px] md:h-auto md:min-h-[450px]"
        />
        <section
          aria-labelledby="post-name"
          className="bg-gray-50 dark:bg-info-dark dark:shadow-low-dark py-3 md:py-6 rounded-md w-11/12 md:w-3/4 shadow-lg text-center absolute bottom-12 md:bottom-20 left-1/2 transform -translate-x-1/2 translate-y-full"
        >
          <h1
            id="post-name"
            className="lg:text-xl text-c-blue text-sm cutline cutline-1 font-bold dark:text-h-dark"
          >
            {data?.title}
          </h1>
          <div className="flex text-gray-500 px-1 dark:text-s-dark text-sm items-center justify-center gap-2 md:gap-4 mt-4 md:mt-7">
            <div className="hidden md:flex gap-4">
              <div className="flex text-sm md:text-base items-center gap-2">
                <FaTags />
                {data.Tags.map((i, index) => (
                  <Link
                    key={index}
                    className="hover:text-blue-600"
                    href={"/search?tags=" + i.name}
                  >
                    {i.name}
                    {data.Tags.length !== Number(index + 1) ? " ،" : null}
                  </Link>
                ))}
              </div>
              <span className="border-r border-dashed border-black dark:border-bg-dark h-6 w-1"></span>
            </div>
            <span>
              <FaPhotoVideo />
            </span>
            <span className="border-r border-dashed border-black dark:border-bg-dark h-6 w-1"></span>
            <ScollComment totalComments={100} />
            <span className="border-r border-dashed border-black dark:border-bg-dark h-6 w-1"></span>
            <h2 className="cutline cutline-1">
              <IoPerson className="inline ml-1" />
              {data?.User?.name}
            </h2>
            <span className="border-r border-dashed border-black dark:border-bg-dark h-6 w-1"></span>
            <span className="flex gap-1 md:gap-2 items-center">
              <FaCalendarDays />
              {new Date(data?.updatedAt).toLocaleDateString("fa")}
            </span>
          </div>
        </section>
      </div>
      <Breadcrums className="mt-14 md:!mt-20" />
      <section className="classDiv md:hidden">
        <h2 className="inline">
          <FaTags className="inline ml-1" />
          تگ ها :
        </h2>
        <div className="inline text-sm md:text-base">
          {data.Tags?.map((i, index) => (
            <React.Fragment key={index}>
              <Link
                key={index}
                className="hover:text-blue-600 mx-1 dark:text-blue-400"
                href={"/search?tags=" + i.name}
              >
                {i.name}
              </Link>
              {data.Tags.length !== Number(index + 1) ? " ،" : null}
            </React.Fragment>
          ))}
        </div>
      </section>
      <article className="classDiv !max-w-3xl mx-auto text-justify !leading-8 dark:text-p-dark text-gray-700">
        {data?.DetailPost?.text && parse(data?.DetailPost?.text)}
      </article>
      <BannerCallUs />
      <div id="comments-section" className="classDiv !max-w-3xl">
        <CommentPost
          comments={data.Comments}
          postId={data.id}
          totalComments={data.totalComments}
        />
        <div className="my-6">
          <FormComments postId={data.id} />
        </div>
      </div>
      <div className="classDiv" aria-labelledby="related-posts">
        <SwiperCards
          title="پست های مشابه"
          isPost
          data={posts}
          url={`/blog/tags/${LinkTagPost}?page=1&tags=${LinkTagPost}`}
        />
        <SwiperCards
          title="پروژه های مشابه"
          isProject
          data={projects}
          url={`/project?page=1&tags=${data.Tags[data.Tags.length - 1].name}`}
        />
      </div>
    </>
  );
}
