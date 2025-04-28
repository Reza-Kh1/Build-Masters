"use client";
import { fetchApi } from "@/action/fetchApi";
import React, { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { MdClose, MdManageSearch } from "react-icons/md";
import LoadingSearch from "../LoadingSearch/LoadingSearch";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import CustomButton from "../CustomButton/CustomButton";
import { AllCardPostType, AllExpertType, AllProjectType, CardPostType, CardProjectsType, ExpertType, FilterQueryType } from "@/app/type";
import CardPost from "../CardPost/CardPost";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormControl, MenuItem, Select } from "@mui/material";
import CardProjects from "../CardProjects/CardProjects";
import CardExperts from "../CardExperts/CardExperts";
export default function SearchBox() {
  const [filterName, setFilterName] = useState<"post" | "project" | "expert" | string>("post")
  const [isShow, setIsShow] = useState<boolean>(false);
  const [valSearch, setValSearch] = useState<string>("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [timerLoading, setTimerLoading] = useState<NodeJS.Timeout | null>(null);
  const [data, setData] = useState<AllCardPostType | AllProjectType | AllExpertType | null>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false)
  const ref = useRef<HTMLInputElement>(null);
  const paramasPath: string = usePathname()
  const route = useRouter()
  const searchParams = useSearchParams()
  const paramsQuery: FilterQueryType = Object.fromEntries(searchParams.entries());
  paramsQuery.page = "1"
  paramsQuery.order = paramsQuery.order === "createdAt-DESC" ? "createdAt-ASC" : "createdAt-DESC"
  const createLink = (filter: string) => {
    paramsQuery.search = valSearch
    let url
    if (filter === "post") {
      url = `blog?${new URLSearchParams(paramsQuery)}`;
    }
    if (filter === "project") {
      if (paramsQuery.expert) {
        const expertFilter = paramasPath.split("/")[3] ? decodeURIComponent(paramasPath?.split("/")[3]) : null
        url = `project/experts/${expertFilter || ""}?${new URLSearchParams(paramsQuery)}`;
      } else {
        url = `project?${new URLSearchParams(paramsQuery)}`;
      }
    }
    return url || `experts?${new URLSearchParams(paramsQuery)}`
  }
  useEffect(() => {
    setIsShow(false)
    const search = Object.fromEntries(
      searchParams.entries()
    );
    if (search?.search) {
      setValSearch(search.search)
    } else {
      setValSearch("")
    }
    const filterNameParam = paramasPath.split("/")[1] === "experts" ? "expert" : paramasPath.split("/")[1] === "project" ? "project" : "post"
    setFilterName(filterNameParam)
  }, [paramasPath, searchParams])
  useEffect(() => {
    if (isShow && ref.current) {
      ref.current.focus();
    }
  }, [isShow]);
  const timerSearch = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    const value = target.value;
    setValSearch(value);
    if (timerLoading) {
      clearTimeout(timerLoading);
    }
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      searchHandler(value);
    }, 1500);
    if (target.value) {
      const newTimerLoading = setTimeout(() => {
        setLoading(true);
      }, 200);
      setTimerLoading(newTimerLoading);
    }
    setLoading(false);
    setTimer(newTimer);
    setIsSearch(false)
  };
  const searchHandler = async (searchValue: string) => {
    if (!searchValue) return;
    setLoading(false);
    let url
    if (filterName === "post") {
      url = `post?search=${searchValue}&order=createdAt-DESC`;
    }
    if (filterName === "project") {
      url = `project?order=createdAt-DESC&search=${searchValue}`;
    }
    if (filterName === "expert") {
      url = `worker?order=createdAt-DESC&search=${searchValue}`;
    }
    if (!url) return
    fetchApi({ url, method: "GET" })
      .then((data) => {
        setData(data);
      })
      .catch(() => {
        toast.error("به مشکل برخوردیم !");
      })
      .finally(() => {
        setLoading(false);
        setIsSearch(true)
      });
  };
  return (
    <>
      <div className="w-2/12 flex items-center">
        <div className="mr-3 text-gray-200 dark:text-gray-300 flex">
          <button type="button" aria-label="جستجو" onClick={() => setIsShow(true)} className="cursor-pointer">
            <BsSearch className="text-xl lg:text-2xl" />
          </button>
        </div>
      </div>
      <div
        className={`w-full px-1 xl:px-0 absolute transition-all right-0 top-36 ${isShow ? "opacity-100 z-20 !top-24 md:!top-28" : "opacity-0 -z-20 pointer-events-none"}`}
      >
        <div className="max-w-7xl gap-2  md:gap-5 transition-all rounded-xl p-2 px-1 lg:p-3 mx-auto flex justify-between items-center bg-gradient-to-br to-blue-300/70 from-gray-100/60 dark:to-slate-700/70 dark:from-zinc-900/70 backdrop-blur-lg">
          <div className="w-full relative bg-white dark:bg-input-dark p-1 lg:p-2 rounded-full shadow-md">
            <input
              ref={ref}
              value={valSearch}
              onChange={timerSearch}
              type="text"
              onKeyDown={(props) => {
                if (props.key === "Enter") {
                  let url
                  paramsQuery.search = valSearch
                  if (filterName === "post") {
                    url = `blog?${new URLSearchParams(paramsQuery)}`;
                  }
                  if (filterName === "project") {
                    if (paramsQuery.expert) {
                      const expertFilter = paramasPath.split("/")[3] ? decodeURIComponent(paramasPath?.split("/")[3]) : null
                      url = `/project/experts/${expertFilter || ""}?${new URLSearchParams(paramsQuery)}`;
                    } else {
                      url = `project?${new URLSearchParams(paramsQuery)}`;
                    }
                  }
                  if (filterName === "expert") {
                    url = `experts?${new URLSearchParams(paramsQuery)}`;
                  }
                  if (!url) return
                  route.push(url)
                }
              }}
              className="text-xs md:text-base dark:text-p-dark p-2 bg-transparent w-8/12 md:w-10/12 border-b-black focus-visible:outline-none"
              placeholder="جستجوی هوشمند..."
            />
            {loading && (
              <i className="absolute text-xs left-24 md:left-32 flex p-1 md:p-2 top-1/2 xl:text-xl transform -translate-y-1/2">
                <LoadingSearch />
              </i>
            )}
            < Link aria-label="جستجو" title="جستجو" href={createLink(filterName)} className="absolute lg:text-xl left-1 md:left-2 transform top-1/2 -translate-y-1/2">
              <i className="p-2 lg:p-3 rounded-full shadow-md block hover:bg-blue-600/70 bg-blue-400/90 text-white">
                <FaSearch />
              </i>
            </Link>
            <div className="absolute left-9 lg:left-14 transform top-1/2 -translate-y-1/2">
              <FormControl className="!text-xs" size="small">
                <span className="hidden" aria-hidden="true" id="demo-select-small">نوع فیلتر ها</span>
                <Select
                  title="نوع فیلتر"
                  size="small"
                  className="!text-sm md:!text-base"
                  id="demo-select-small"
                  value={filterName}
                  variant="standard"
                  onChange={({ target }) => {
                    setData(null)
                    setValSearch("")
                    setFilterName(target.value)
                  }}
                >
                  <MenuItem value="post">
                    پست ها
                  </MenuItem>
                  <MenuItem value="project">
                    پروژه ها
                  </MenuItem>
                  <MenuItem value="expert">
                    مجری ها
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <span className=" text-left flex justify-end">
            <button type="button"
              aria-label="بستن"
              onClick={() => setIsShow(false)}
              className="cursor-pointer bg-blue-500/50 hover:bg-blue-600/70 text-white shadow-md transition-all rounded-full p-2 lg:p-3"
            >
              <MdClose size={20} />
            </button>
          </span>
        </div>
      </div >
      <div
        className={`-z-20 px-1 xl:px-0 h-screen opacity-0 absolute w-full top-52 left-0 flex justify-center transition-all ${valSearch && isShow ? "z-20 opacity-100 top-[160px] md:top-52" : "invisible"
          }`}
      >
        <div className="max-w-7xl h-3/4 overflow-y-auto w-full bg-gradient-to-tr dark:to-slate-700/70 dark:from-zinc-900/70  from-blue-300/60 backdrop-blur-md to-gray-100/60 shadow-md p-2 md:p-4 rounded-lg">
          {!isSearch ? null : isSearch && data?.rows?.length ?
            <>
              {filterName === "project" ?
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {data.rows.map((item, index) => (
                    <CardProjects project={item as CardProjectsType} key={index} />
                  ))}
                </div>
                : filterName === "expert" ?
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {data.rows.map((item, index) => (
                      <CardExperts {...item as ExpertType} key={index} />
                    ))}
                  </div> :
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {data.rows.map((item, index) => (
                      <CardPost post={item as CardPostType} key={index} />
                    ))}
                  </div>
              }
              <Link className="mt-4 block w-full md:w-1/6 mx-auto" href={createLink(filterName)}>
                <CustomButton
                  name="مشاهده همه"
                  type="button"
                  iconEnd={<MdManageSearch className="text-xl" />}
                />
              </Link>
            </>
            :
            <span className="text-xs md:text-xl text-gray-700 dark:text-h-dark">
              هیچ اطلاعاتی با کلمه جستجوی شما یافت نشد !!!
            </span>
          }
        </div>
      </div>
    </>
  );
}