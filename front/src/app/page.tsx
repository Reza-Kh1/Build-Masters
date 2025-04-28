import { fetchApi } from "@/action/fetchApi";
import ContactSocialMedia from "@/components/ContactSocialMedia/ContactSocialMedia";
import CustomButton from "@/components/CustomButton/CustomButton";
import OurServices from "@/components/OurServices/OurServices";
import SwiperCards from "@/components/SwiperCards/SwiperCards";
import SwiperHero from "@/components/SwiperHero/SwiperHero";
import { FaPhone } from "react-icons/fa6";
import { AllExpertType, AllPostType, AllProjectType, HomePageType } from "./type";
import { dataApi } from "@/data/tagsName";
import TabsComponent from "@/components/Tabs/Tabs";
import ImgTag from "@/components/ImgTag/ImgTag";
import { servicesData } from "@/data/dataService";
import Link from "next/link";
import { Metadata } from "next";
const nameSite = process.env.NEXT_PUBLIC_NAME_SITE || ""
const getData = () => {
  return fetchApi({ url: dataApi.home.url, tags: dataApi.home.tags, next: dataApi.home.cache })
}
const getProject = () => {
  return fetchApi({ url: dataApi.projects.url, tags: dataApi.projects.tags, next: dataApi.projects.cache })
}
const getPosts = () => {
  return fetchApi({ url: dataApi.posts.url, tags: dataApi.posts.tags, next: dataApi.posts.cache })
}
const getExperts = () => {
  return fetchApi({ url: dataApi.experts.url, tags: dataApi.experts.tags, next: dataApi.experts.cache })
}
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "http://localhost:3000"),
  title: `${nameSite} | پیشرو در ساخت و ساز و بازسازی`,
  description: 'با ${nameSite}، پروژه‌های ساختمانی و بازسازی خود را با کیفیت بالا و در زمان کوتاه به انجام برسانید. از طراحی تا اجرا، ما همراه شما هستیم.',
  keywords: [
    'ساخت و ساز',
    'بازسازی ساختمان',
    'پروژه‌های ساختمانی',
    'کیفیت ساخت',
    'خدمات ساختمانی',
    'طراحی و اجرا',
  ],
  openGraph: {
    title: `${nameSite} | پیشرو در خدمات ساخت و ساز`,
    description: 'ما در ${nameSite} خدمات متنوعی از طراحی تا اجرای پروژه‌های ساختمانی ارائه می‌دهیم. کیفیت، زمان‌بندی و هزینه مناسب را با ما تجربه کنید.',
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
    canonical: `${process.env.NEXT_PUBLIC_URL}`,
  },
};
export default async function Home() {
  // const projects: AllProjectType = await getProject()
  // const posts: AllPostType = await getPosts()
  // const experts: AllExpertType = await getExperts()
  // const { data }: HomePageType = await getData()
  return (
    <>
      {/* <SwiperHero data={data?.text?.heroData} /> */}
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
        {/* <SwiperCards
          isProject
          data={projects.rows}
          title="پروژه های ما"
          url="/blog?order=createdAt-DESC&page=1"
        />
        <TabsComponent tabs={data?.text?.tabs} image={data?.text?.tabImage} />
        <SwiperCards
          isPost
          data={posts.rows}
          title="آخرین پست های منتشر شده"
          url="/blog?order=createdAt-DESC&page=1"
        /> */}
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
        {/* <SwiperCards
          isExpert
          data={experts.rows}
          title="مجریان تیم"
          url="/blog?order=createdAt-DESC&page=1"
        /> */}
      </div>
      <ContactSocialMedia />
    </>
  );
}
