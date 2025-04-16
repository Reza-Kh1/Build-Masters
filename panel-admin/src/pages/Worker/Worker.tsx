import { Button } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MdOutlinePersonAdd } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { fetchWorker } from "../../services/worker";
import queryString from "query-string";
import { AllWorkerType } from "../../type";
import Pagination from "../../components/Pagination/Pagination";
import { FaShare } from "react-icons/fa6";
import SearchBox from "../../components/SearchBox/SearchBox";
import DontData from "../../components/DontData/DontData";

export default function Worker() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<AllWorkerType>({
    queryKey: ["AllWorker", searchQuery],
    queryFn: () => fetchWorker(searchQuery),
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
      <Link to={"create-worker"}>
        <Button
          endIcon={<MdOutlinePersonAdd />}
          startIcon={<MdOutlinePersonAdd />}
          color="primary"
          fullWidth
          variant="contained"
        >
          ایجاد مجری
        </Button>
      </Link>
      <div>
        <SearchBox />
      </div>
      <DontData
        text={
          data?.pages[0].count
            ? data?.pages[0].count + " مجری"
            : "مجری ای یافت نشد!"
        }
      />
      {data?.pages[0].rows.length ?
        <>
          <div className="grid grid-cols-4 gap-3 my-5 items-center justify-between">
            {data?.pages[0].rows.map((i, index) => (
              <div key={index} className="group shadow-md relative gap-3 p-3 border rounded-md bg-slate-200 hover:bg-gray-200 flex">
                <figure>
                  <img src={i.image || "/notfound.webp"} onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "/notfound.webp";
                  }} className="w-24 rounded-full p-1 bg-slate-100 border h-24 object-cover" alt={i.name} />
                </figure>
                <div className="flex flex-col justify-evenly">
                  <span className="text-slate-700">{i.name}</span>
                  <span className="text-lg text-slate-800">{i.phone}</span>
                  <span className="text-xs">{new Date(i.createdAt).toLocaleDateString("fa")}</span>
                </div>
                <Link to={"create-worker?worker=" + i.name.replace(/ /g, "-")} className="top-0 opacity-0 group-hover:opacity-100 transition-all left-3 transform translate-y-1/2 text-xl hover:bg-slate-700 text-blue-500 bg-slate-300 rounded-full p-3 shadow-md absolute">
                  <FaShare />
                </Link>
              </div>
            ))}
          </div>
        </>
        : null}
      <Pagination pager={data?.pages[0].paginate} />
    </div>
  );
}
