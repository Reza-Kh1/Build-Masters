import { Button } from "@mui/material";
import AboutMe from "../../components/AboutMe/AboutMe";
import React, { useState } from "react";
import { IoMdEye, IoIosEyeOff } from "react-icons/io";
import Faqs from "../../components/Faqs/Faqs";
import Footer from "../../components/Footer/Footer";
import HomePage from "../../components/HomePage/HomePage";
export default function PageInfo() {
  const [open, setOpen] = useState<string[]>([])
  const TitlePage = ({ title, page }: { title: string, page: React.ReactNode }) => {
    return (
      <>
        <div className="flex items-center justify-between shadow-md bg-slate-100 border p-2 rounded-md">
          <h1 className="text-xl font-semibold">{title}</h1>
          <Button
            onClick={() => setOpen(open.includes(title) ? open.filter((i) => i !== title) : [...open, title])}
            variant="contained"
            color={open.includes(title) ? "warning" : "info"}
            endIcon={open.includes(title) ? <IoIosEyeOff /> : <IoMdEye />}
          >
            {open.includes(title) ? "بستن اطلاعات" : " مشاهده اطلاعات"}
          </Button>
        </div>
        {open.includes(title) ?
          page
          : null}
      </>
    )
  }
  return (
    <div className="w-full flex flex-col gap-4">
      <TitlePage title="صفحه اصلی" page={<HomePage />} />
      <TitlePage title="فوتر" page={<Footer />} />
      <TitlePage title="درباره ما" page={<AboutMe />} />
      <TitlePage title="صفحه سوالات متداول" page={<Faqs />} />
    </div>
  );
}
