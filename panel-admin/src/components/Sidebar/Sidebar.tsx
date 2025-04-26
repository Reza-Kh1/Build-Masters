import { Button } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";
import { FaSearchDollar } from "react-icons/fa";
import { FaPaintbrush, FaUsers } from "react-icons/fa6";
import { GrUserWorker } from "react-icons/gr";
import { TiMessages } from "react-icons/ti";
import { MdImage, MdOutlineCategory, MdOutlinePostAdd, MdSettings } from "react-icons/md";
import { BsDatabaseCheck, BsFillBuildingsFill } from "react-icons/bs";
import { BiSolidDashboard } from "react-icons/bi";
import { useState } from "react";
import PendingApi from "../PendingApi/PendingApi";
import { LinkSidebarType } from "../../type";
import { IoMdPricetags } from "react-icons/io";
import Cookies from "js-cookie"
const cookieKey = import.meta.env.VITE_PUBLIC_COOKIE_KEY
const dataLink = [
  { name: "داشبورد", url: "/home/dashboard", icon: <BiSolidDashboard />, type: 'ALL' },
  { name: "صفحات سایت", url: "/home/page-info", icon: <FaPaintbrush />, type: 'ADMIN' },
  {
    name: "پست ها",
    url: "/home/posts?page=1&order=desc",
    icon: <MdOutlinePostAdd />, type: 'AUTHOR'
  },
  {
    name: "کامنت ها",
    url: "/home/reviews?page=1&order=desc",
    icon: <TiMessages />, type: 'AUTHOR'
  },
  {
    name: "کاربران",
    url: "/home/users?page=1&order=desc",
    icon: <FaUsers />, type: 'ADMIN'
  },
  {
    name: "پروژه ها",
    url: "/home/projects?page=1&order=desc",
    icon: <BsFillBuildingsFill />, type: 'CONTRACTOR'
  },
  {
    name: "مجری ها",
    url: "/home/contractor?page=1&order=desc",
    icon: <GrUserWorker />, type: 'CONTRACTOR'
  },
  {
    name: "تعیین قیمت",
    url: "/home/online-price?page=1&order=desc&status=false",
    icon: <FaSearchDollar />, type: 'ADMIN'
  },
  { name: "دسته بندی", url: "/home/categorys", icon: <MdOutlineCategory />, type: 'AUTHOR' },
  { name: "تگ ها", url: "/home/tags", icon: <IoMdPricetags />, type: 'AUTHOR' },
  { name: "رسانه ها", url: "/home/image", icon: <MdImage />, type: 'AUTHOR' },
  { name: "بک آپ", url: "/home/back-up", icon: <BsDatabaseCheck />, type: 'ADMIN' },
  { name: "تنظیمات", url: "/home/setting", icon: <MdSettings />, type: 'ALL' },
];
export default function Sidebar() {
  if (!localStorage.getItem(cookieKey)) return
  const navigate = useNavigate();
  const [load, setLaod] = useState<Boolean>(false);
  const logOutUser = () => {
    setLaod(true);
    navigate("/");
    localStorage.setItem(cookieKey, "");
    Cookies.remove(cookieKey);
  };
  const LinkSidebar = ({ url, name, icon }: LinkSidebarType) => {
    return (
      <NavLink
        to={url}
        className={({ isActive }) =>
          `inline-block w-11/12 mr-0 ${!isActive ? "" : "mr-5"}`
        }
      >
        <Button
          className="!bg-[#4889f7]"
          fullWidth
          variant="contained"
          startIcon={icon}
        >
          {name}
        </Button>
      </NavLink>
    );
  };
  const { role } = JSON.parse(localStorage.getItem(cookieKey) as any);
  return (
    <div className="w-full p-2 right-0 sidebar-site top-0 sticky">
      {load && <PendingApi />}
      <ul className="bg-gray-100 p-3 rounded-md flex flex-col gap-3">
        <li className="flex justify-center items-center">
          <img src="/logosite.png" className="w-40" alt="logo site" />
        </li>
        {dataLink.map((i, index) => {
          if (role === i.type || i.type === 'ALL' || role === 'ADMIN') {
            return <li key={index}>
              <LinkSidebar name={i.name} url={i.url} icon={i.icon} />
            </li>
          }
        })}
        <li className="w-11/12">
          <Button
            onClick={logOutUser}
            fullWidth
            color="error"
            variant="contained"
            startIcon={<IoLogOutOutline />}
          >
            خروج
          </Button>
        </li>
      </ul>
    </div>
  );
}
