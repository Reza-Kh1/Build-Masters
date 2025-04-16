import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { TbPhotoCirclePlus } from "react-icons/tb";
import { toast } from "react-toastify";
import { FaEye, FaTrash, FaUpload } from "react-icons/fa6";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { fetchImageDBaas } from "../../services/media";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { IoEyeOff } from "react-icons/io5";
type AllImageType = {
  urls: string[];
  next: string | null;
};
type ShowImageType = {
  setUrl?: (value: string) => void;
  setClose?: (value: boolean) => void;
};
export default function ShowDBaaS({ setUrl, setClose }: ShowImageType) {
  const [open, setOpen] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const query = useQueryClient();
  const [viewImage, setViewImage] = useState<string>();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<AllImageType>({
      queryKey: ["mediaDBaaS"],
      queryFn: fetchImageDBaas,
      getNextPageParam: (lastPage) => lastPage.next || undefined,
      staleTime: 1000 * 60 * 60 * 24,
      gcTime: 1000 * 60 * 60 * 24,
      initialPageParam: "",
      enabled: isFetching
    });
  const deleteImage = useMutation({
    mutationFn: (i: string) => {
      return axios.delete(`media?url=${i}`);
    },
    onSuccess: () => {
      toast.success("عکس با موفقیت حذف شد");
      query.invalidateQueries({ queryKey: ['mediaDB'] });
      query.invalidateQueries({ queryKey: ['mediaDBaaS'] });
    },
    onError: () => {
      toast.warning("عکس حذف نشد");
    },
  });
  return (
    <>
      <div className="w-full mt-5 border-t-2 pt-5 border-dashed">
        <Button onClick={() => setIsFetching((prev) => !prev)} variant="contained" color="secondary" endIcon={!isFetching ? < BsDatabaseFillAdd /> : <IoEyeOff />}>
          دیتابیس ابری
        </Button>
        <div className={`grid grid-cols-5 gap-5 ${isFetching ? "mt-5" : ""}`}>
          {isFetching && data?.pages?.map((item, index) => {
            if (item.urls === undefined) {
              return <span key={index} className="bg-blue-300  text-white p-2 rounded-md shadow-md">
                هیچ اطلاعاتی یافت نشد !
              </span>
            }
            return item?.urls?.map((i, index) => (
              <figure key={index} className="relative h-52 group">
                <img
                  alt=""
                  src={i}
                  className="shadow-md rounded-md bg-cover w-full h-full"
                />
                <span
                  className="absolute bottom-2 cursor-pointer left-2"
                  onClick={() => deleteImage.mutate(i)}
                >
                  <IconButton>
                    <FaTrash size={20} color="red" />
                  </IconButton>
                </span>
                {setUrl ? (
                  <span
                    className="absolute bottom-2 cursor-pointer right-2"
                    onClick={() => {
                      if (setClose) {
                        setClose(false);
                      }
                      navigator.clipboard.writeText(i)
                      toast.success("آدرس کپی شد")
                      setUrl(i);
                    }}
                  >
                    <IconButton className="!bg-[#000000de]">
                      <FaUpload size={20} color="white" />
                    </IconButton>
                  </span>
                ) : null}
                <span
                  className="absolute transform bg-[#000000d4] p-3 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 group-hover:inline hidden cursor-pointer left-1/2"
                  onClick={() => {
                    setViewImage(i);
                    setOpen(true);
                  }}
                >
                  <FaEye size={35} color="white" />
                </span>
              </figure>
            ));
          })}
        </div>
        {hasNextPage && isFetching && (
          <Button
            onClick={() => fetchNextPage()}
            color="success"
            className="!mt-5"
            variant="contained"
            disabled={isFetchingNextPage}
            endIcon={<TbPhotoCirclePlus />}
          >
            {isFetchingNextPage ? "در حال بارگزاری..." : "نمایش بیشتر"}
          </Button>
        )}
      </div >
      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogContent>
          <figure>
            <img alt="" src={viewImage} className="shadow-md rounded-md" />
          </figure>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
          >
            بستن
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
