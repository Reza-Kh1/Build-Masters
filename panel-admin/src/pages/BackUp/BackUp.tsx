import { Button } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { fetchBackUp } from "../../services/backUp";
import { BackUpAllType } from "../../type";
import { BsDatabaseSlash } from "react-icons/bs";
import { LuDatabaseBackup } from "react-icons/lu";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { IoMdDownload } from "react-icons/io";
import PendingApi from "../../components/PendingApi/PendingApi";
import DontData from "../../components/DontData/DontData";
import { IoCloudUploadSharp } from "react-icons/io5";
import { GiCloudUpload } from "react-icons/gi";
import { useState } from "react";

export default function BackUp() {
  const query = useQueryClient();
  let pending = false;
  const { data } = useQuery<BackUpAllType>({
    queryKey: ["BackUp"],
    queryFn: fetchBackUp,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(60);
  const { mutate: uploadBackUp } = useMutation({
    mutationFn: async (event: React.ChangeEvent<HTMLInputElement>) => {
      setLoading(true);
      const newFile = event.target.files;
      if (!newFile?.length)
        return Promise.reject(new Error("هیچ فایل انتخاب نشده است"));
      const formData = new FormData();
      formData.append("backUp", newFile[0]);
      const { data } = await axios.post("backUp", formData, {
        onUploadProgress: (event) => {
          if (event.lengthComputable && event.total) {
            const percentComplete = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percentComplete);
          }
        },
      });
      return data;
    },
    onSuccess: () => {
      toast.success("اطلاعات دیتابیس بازگردانی شد");
      query.invalidateQueries({ queryKey: ["BackUp"] });
      setLoading(false);
    },
    onError: (err) => {
      toast.warning(err.message || "با خطا روبرو شدیم!");
      setLoading(false);
    },
  });
  const { mutate: deleteSingleBackUp, isPending: pendingFile } = useMutation({
    mutationFn: (key: string) => {
      return axios.delete(`backUp/delete?key=${key}`);
    },
    onSuccess: () => {
      toast.success("بک آپ حذف شد");
      query.invalidateQueries({ queryKey: ["BackUp"] });
    },
    onError: (err) => {
      toast.warning("با خطا روبرو شدیم!");
      console.log(err);
    },
  });
  const { mutate: deleteBackUp, isPending: pendingDelete } = useMutation({
    mutationFn: () => {
      return axios.delete("backUp");
    },
    onSuccess: () => {
      toast.success("تمام اطلاعات دیتابیس حذف شد");
    },
    onError: (err) => {
      toast.warning("با خطا روبرو شدیم!");
      console.log(err);
    },
  });
  const { mutate: createBackUp, isPending: pendingCreate } = useMutation({
    mutationFn: () => {
      return axios.get("backUp/create");
    },
    onSuccess: () => {
      toast.success("با موفقیت بک آپ تهیه شد");
      query.invalidateQueries({ queryKey: ["BackUp"] });
    },
    onError: (err) => {
      toast.warning("با خطا روبرو شدیم!");
      console.log(err);
    },
  });
  const downloadBackUp = (url: string, time: Date) => {
    axios
      .get(url, { responseType: "blob" })
      .then(({ data }) => {
        const href = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          `backUp${new Date(time).toLocaleDateString("fa")}.dump`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (pendingCreate || pendingDelete || pendingFile) {
    pending = true;
  }
  return (
    <div className="w-full my-5">
      {pending && <PendingApi />}
      <div className="flex gap-5 mb-8">
        <div className="w-1/6">
          <span className="mb-2 block">آپلود بک آپ</span>
          <label
            htmlFor="upload"
            className={`transition-all group p-3 bg-gradient-to-tr from-slate-600 hover:from-slate-700 hover:to-sky-500 to-sky-400 shadow-md border-black flex items-center justify-center rounded-md border-dashed border h-32 w-full ${!loading ? "cursor-pointer" : ""
              }`}
          >
            <input
              onChange={uploadBackUp}
              type="file"
              hidden
              id="upload"
              disabled={loading}
            />
            {loading ? (
              <i className="text-white flex gap-3">
                <IoCloudUploadSharp className="text-2xl" /> % {progress}
              </i>
            ) : (
              <i className="text-3xl text-white ">
                <GiCloudUpload />
              </i>
            )}
          </label>
        </div>
        <div className="flex justify-end gap-5 items-start text-end w-full">
          <Button
            endIcon={<LuDatabaseBackup />}
            variant="contained"
            onClick={() => createBackUp()}
            className="!py-1"
          >
            گرفتن بک آپ
          </Button>
          <DeleteButton
            endIcon={<BsDatabaseSlash />}
            deletePost={() => deleteBackUp()}
            pendingDelete={pendingDelete}
            text="حذف کامل دیتابیس"
          />
        </div>
      </div>
      {data?.backups.length ? 
      <>
        <span>مرتب سازی بر اساس جدید ترین</span>
        <div className="grid grid-cols-5 gap-3 mt-3">
          {data.backups.map((i, index) => (
            <section
              key={index}
              className="bg-blue-200 rounded-md p-3 shadow-md flex flex-col gap-5 items-center justify-center relative"
            >
              <div className="bg-slate-100 w-12 h-12 flex justify-center items-center rounded-full shadow-md">
                <span className="">{index + 1}</span>
              </div>
              <time className="text-gray-700" dir="ltr">
                {new Date(i.lastModified).toLocaleString("fa")}
              </time>
              <div className="w-full flex items-center justify-evenly">
                <Button
                  color="info"
                  className="!p-1 !px-3"
                  endIcon={<IoMdDownload />}
                  variant="contained"
                  onClick={() => downloadBackUp(i.url, i.lastModified)}
                >
                  دانلود
                </Button>
                <DeleteButton
                  text="حذف"
                  deletePost={() => deleteSingleBackUp(i.key)}
                  pendingDelete={pendingFile}
                />
              </div>
            </section>
          ))}
        </div>
      </>
        : <div className="flex flex-col w-full gap-5">
          <DontData text="تا به حال بک آپ گرفته نشده است" />
          <span>پیشنهاد میشود هر چه سریع تر بک آپ پشتیبانی کرفته شود.</span>
        </div>
      }

    </div>
  );
}
