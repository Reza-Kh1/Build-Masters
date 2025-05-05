import { fetchApi } from "@/action/fetchApi";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import CustomButton from "@/components/CustomButton/CustomButton";
import OurServices from "@/components/OurServices/OurServices";
import SwiperCards from "@/components/SwiperCards/SwiperCards";
import SwiperHero from "@/components/SwiperHero/SwiperHero";
import { FaPhone } from "react-icons/fa6";
import { AllContractorType, AllPostType, AllProjectType, HomePageType } from "./type";
import { dataApi } from "@/data/tagsName";
import TabsComponent from "@/components/Tabs/Tabs";
import ImgTag from "@/components/ImgTag/ImgTag";
import { servicesData } from "@/data/dataService";
import Link from "next/link";

const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
const getData = (): Promise<HomePageType> => {
  return fetchApi({ url: dataApi.home.url, tags: dataApi.home.tags, next: dataApi.home.cache })
}
const getProject = (): Promise<AllProjectType> => {
  return fetchApi({ url: dataApi.projects.url, tags: dataApi.projects.tags, next: dataApi.projects.cache })
}
const getPosts = (): Promise<AllPostType> => {
  return fetchApi({ url: dataApi.posts.url, tags: dataApi.posts.tags, next: dataApi.posts.cache })
}
const getContractor = (): Promise<AllContractorType> => {
  return fetchApi({ url: dataApi.contractor.url, tags: dataApi.contractor.tags, next: dataApi.contractor.cache })
}
export async function metadata() {
  const meta = await getData()
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
    title: meta?.title,
    description: meta?.description,
    keywords: meta?.keyword,
    openGraph: {
      title: meta?.title,
      description: meta?.description,
      url: `${process.env.NEXT_PUBLIC_URL}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL + "/about-us.jpg"}`,
          width: 1200,
          height: 630,
          alt: `صفحه اصلی ${nameSite}`,
        },
      ],
      type: 'website',
      locale: "fa_IR",
      siteName: nameSite,
    },
    twitter: {
      card: 'summary_large_image',
      creator: "@buildMasters",
      site: "@buildMasters",
    },
    robots: "index,follow",
    alternates: {
      canonical: meta?.canonicalUrl,
    },
  }
};

export default async function Home() {
  const projects = await getProject()
  const posts = await getPosts()
  const contractor = await getContractor()
  const data = await getData()
  return (
    <>
      {data && <SwiperHero data={data?.content?.heroData} />}
      <div className="p-3 md:p-5 my-3 md:my-6 bg-gradient-to-t to-blue-low from-blue-full dark:from-[#242b36] dark:to-[#232528] shadow-md">
        <div className="max-w-7xl w-full flex gap-5 justify-between items-center mx-auto">
          <div className="flex flex-col gap-1 md:gap-2">
            <span className="font-semibold text-gray-200 dark:text-p-dark block mb-2 text-xs md:text-base">
              آماده‌ایم تا با شروع این همکاری، رویاهای ساخت و ساز شما را به
              واقعیت تبدیل کنیم – با هم، از ایده تا اجرا پیش خواهیم رفت!
            </span>
            <span className="text-gray-300 dark:text-s-dark text-xs md:text-sm hidden md:block">
              با ما، خانه‌ رویایی‌تان را از پایه بسازید – کیفیت، ایمنی و زیبایی
              در هر قدم از ساخت!
            </span>
            <Link aria-label="با ما تماس بگیرید"
              title="تماس بگیرید" className="block md:hidden w-1/3 mx-auto" href="/contact-us">
              <CustomButton
                className="!text-xs"
                name="تماس بگیرید"
                type="button"
                color="orange"
                iconEnd={<FaPhone />}
              />
            </Link>
          </div>
          <div className="hidden md:block md:w-1/6">
            <Link href="/contact-us" aria-label="تماس بگیرید">
              <CustomButton
                className="!text-xs md:!text-base"
                name="تماس بگیرید"
                type="button"
                color="orange"
                iconEnd={<FaPhone />}
              />
            </Link>
          </div>
        </div>
      </div>
      <OurServices />
      <div className="classDiv">
        <SwiperCards
          isProject
          data={projects.data}
          title="پروژه های ما"
          url="/blog?order=createdAt-DESC&page=1"
        />
        {data && <TabsComponent tabs={data?.content?.tabs} image={data?.content?.tabImage} />}
        <SwiperCards
          isPost
          data={posts.data}
          title="آخرین پست های منتشر شده"
          url="/blog?order=createdAt-DESC&page=1"
        />
      </div>
      <div className="bg-gradient-to-t to-blue-full from-blue-low dark:from-[#242b36] dark:to-[#232528] py-3 shadow-md">
        <div className="classDiv flex-col gap-3 md:gap-5 items-center ">
          <h2 className="text-lg font-bold mb-5 dark:text-h-dark text-gray-100">مزایای خدمات ما</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {servicesData.map((i, index) => (
              <section key={index} className='flex w-full items-center gap-3'>
                <ImgTag src={i.img} figureClass="inline" className='w-20 h-auto' alt={""} width={96} height={96} />
                <div className="flex flex-col gap-1 w-11/12">
                  <h3 className="text-c-orange font-bold dark:text-p-dark text-sm md:text-base">
                    {i.title}
                  </h3>
                  <p className="text-gray-400 text-sm md:text-base text-justify dark:text-s-dark">
                    {i.text}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className="classDiv">
        <SwiperCards
          isExpert
          data={contractor?.data}
          title="مجریان تیم"
          url="/blog?order=createdAt-DESC&page=1"
        />
      </div>
      <ContactSocialMedia />
    </>
  );
}
