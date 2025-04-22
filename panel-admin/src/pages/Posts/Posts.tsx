import { Button } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FaCheck } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { fetchPost } from "../../services/post";
import { useEffect, useState } from "react";
import { AllPostType } from "../../type";
import Pagination from "../../components/Pagination/Pagination";
import queryString from "query-string";
import { MdClose } from "react-icons/md";
import { LuCopyPlus } from "react-icons/lu";
import SearchBox from "../../components/SearchBox/SearchBox";
import DontData from "../../components/DontData/DontData";
export default function Posts() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<AllPostType>({
    queryKey: ["AllPost", searchQuery],
    queryFn: () => fetchPost(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  return (
    <div>
      <Link to={"create-post"} className="w-full">
        <Button color="info" variant="contained" fullWidth startIcon={<LuCopyPlus />} endIcon={<LuCopyPlus />}>
          ایجاد پست
        </Button>
      </Link>
      <SearchBox status />
      
      <div className="flex flex-col gap-3 mt-3">
        {data?.pages[0].data.length ? (
          data.pages[0].data.map((i, index) => (
            <Link
              to={i.name.replace(/ /g, "-")}
              key={index}
              className="bg-gray-200 p-2 shadow-md flex rounded-md"
            >
              <div className="w-5/6 flex ">
                <div className="grid grid-cols-2 w-4/6">
                  <span className="cutline cutline-2">نام : {i.name}</span>
                  <span className="cutline cutline-2">
                    دسته : {i.Category?.name}
                  </span>
                  <span className="cutline cutline-3">
                    توضیحات : {i.description}
                  </span>
                </div>
                <div className="grid grid-cols-1 justify-stretch gap-2 w-2/6">
                  <span>
                    آپدیت : {new Date(i.updatedAt).toLocaleDateString("fa")}
                  </span>
                  <span>تعداد کامنت ها : {i.totalComment || 0}</span>
                  <div>
                    <Button
                      color={i.isPublished ? "success" : "error"}
                      endIcon={i.isPublished ? <FaCheck /> : <MdClose />}
                      className="!cursor-default"
                      variant="outlined"
                    >
                      {i.isPublished ? "منتشر شده" : "منتشر نشده"}
                    </Button>
                  </div>
                </div>
              </div>
              <figure className="w-1/6 h-40">
                <img
                  className="w-full rounded-md object-cover shadow-md h-full"
                  src={i.image || "/notfound.webp"}
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "/notfound.webp";
                  }}
                  alt="test"
                />
              </figure>
            </Link>
          ))
        ) : <DontData text="پستی یافت نشد!" />}
      </div>
      <Pagination pager={data?.pages[0].pagination} />
    </div>
  );
}
