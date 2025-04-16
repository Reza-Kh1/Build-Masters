import { Button } from "@mui/material";
import { PiStackPlusFill } from "react-icons/pi";
import { Link, useLocation } from "react-router-dom";
import Pagination from "../../components/Pagination/Pagination";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { fetchProject } from "../../services/project";
import { useInfiniteQuery } from "@tanstack/react-query";
import { AllProjectType } from "../../type";
import { FaCheck, FaPlay } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { MdAddHomeWork, MdClose } from "react-icons/md";
import SearchBox from "../../components/SearchBox/SearchBox";
import DontData from "../../components/DontData/DontData";
import { GrUserWorker } from "react-icons/gr";
export default function Projects() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<AllProjectType>({
    queryKey: ["AllProject", searchQuery],
    queryFn: () => fetchProject(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.paginate.nextPage || undefined,
    initialPageParam: "",
  });
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  return (
    <div className="w-full">
      <Link to={"create-project"}>
        <Button
          endIcon={<PiStackPlusFill />}
          startIcon={<PiStackPlusFill />}
          color="primary"
          fullWidth
          variant="contained"
        >
          ایجاد پروژه
        </Button>
      </Link>
      <div>
        <SearchBox status nameWorker />
      </div>
      <DontData
        text={
          data?.pages[0].count
            ? data?.pages[0].count + " پروژه"
            : "پروژه ای یافت نشد!"
        }
      />
      {
        data?.pages[0].rows.length ?
          <div className="w-full my-3 grid grid-cols-3 gap-3">
            {data?.pages[0].rows.map((i, index) => (
              <div key={index} className="shadow-md p-2 rounded-md">
                <figure className="relative group overflow-hidden">
                  <img
                    src={i.image || "/notfound.webp"}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src = "/notfound.webp";
                    }}
                    alt={i.alt}
                    className="object-cover w-full h-64 rounded-md"
                  />
                  <Link
                    to={"create-project?name=" + i.name.replace(/ /g, "-")}
                    className="absolute opacity-0 text-white bg-black/30 group-hover:opacity-100 transition-customer backdrop-blur-md p-5 shadow-md text-2xl rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  >
                    <FaPlay />
                  </Link>
                  <div className="-bottom-[100%] text-sm transition-customer box-shadow-customer absolute rounded-md w-full text-center bg-black/70 text-white py-2 group-hover:bottom-[0%]">
                    <span>عنوان عکس :{i.alt}</span>
                    <p>آدرس :{i.address}</p>
                  </div>
                  <div className="left-2 text-sm flex items-center gap-3 bg-black/50 px-3 py-1 text-white rounded-md top-2 absolute">
                    <i>
                      <FaCalendarAlt />
                    </i>
                    <span className="pt-1">
                      {new Date(i.updatedAt).toLocaleDateString("fa")}
                    </span>
                  </div>
                </figure>
                <div className="flex justify-between px-2 mt-3 items-center">
                  <p className="text-base font-semibold flex items-center gap-1">
                    <MdAddHomeWork />
                    {i.name}
                  </p>
                  {i.status ? (
                    <Button endIcon={<FaCheck />} color="success" size="small">
                      منتشر شده
                    </Button>
                  ) : (
                    <Button endIcon={<MdClose />} color="error" size="small">
                      منتشر نشده
                    </Button>
                  )}
                </div>
                <span className="text-gray-700 flex items-center gap-1">
                  <GrUserWorker />
                  {i.Worker.name}</span>
              </div>
            ))}
          </div>
          : null
      }
      <div>
        <Pagination pager={data?.pages[0].paginate} />
      </div>
    </div>
  );
}
