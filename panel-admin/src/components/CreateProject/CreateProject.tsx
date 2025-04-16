import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  InputAdornment,
  Switch,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { MdClose, MdDataSaverOn } from "react-icons/md";
import SelectMedia from "../SelectMedia/SelectMedia";
import { useEffect, useState } from "react";
import { DataMediaType, ProjectType } from "../../type";
import ImageComponent from "../ImageComponent/ImageComponent";
import { FaDollarSign, FaPenToSquare } from "react-icons/fa6";
import TagAutocomplete from "../TagAutocomplete/TagAutocomplete";
import WorkerSelector from "../WorkerSelector/WorkerSelector";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import PendingApi from "../PendingApi/PendingApi";
import { fetchSingleProject } from "../../services/project";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { BiMessageSquareEdit } from "react-icons/bi";
import DeleteButton from "../DeleteButton/DeleteButton";
import { GiPencilRuler } from "react-icons/gi";
import { IoLocation } from "react-icons/io5";
import deleteCache from "../../services/revalidate";
type ProjectFormType = {
  status: boolean;
  name: string;
  description: string;
  address: string;
  size: string;
  price: string;
};
export default function CreateProject() {
  const { register, setValue, getValues, watch } = useForm<ProjectFormType>({
    defaultValues: { status: false },
  });
  const queryClient = useQueryClient();
  const [videoProject, setVideoProject] = useState<DataMediaType | null>(null);
  const [image, setImage] = useState<DataMediaType | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [editImg, setEditImg] = useState<DataMediaType | null>(null);
  const [tagsProject, setTagsProject] = useState<{ name: string }[]>([]);
  const [workerId, setWorkerId] = useState<number>(0);
  const navigate = useNavigate();
  const [galleryProject, setGalleryProject] = useState<DataMediaType[] | []>(
    []
  );
  const { search } = useLocation();
  const test: { name?: string } = queryString.parse(search);
  const { data } = useQuery<ProjectType>({
    queryKey: ["projectSingle", test.name],
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    queryFn: () => fetchSingleProject(test?.name),
    enabled: test?.name ? true : false,
  });
  const { isPending: pendingCreate, mutate: createHandler } = useMutation({
    mutationFn: async () => {
      const body = {
        image: image?.url || null,
        gallery: galleryProject,
        video: videoProject?.url || null,
        alt: image?.alt || null,
        tags: tagsProject || [],
        workerId,
        name: getValues("name") || null,
        description: getValues("description"),
        address: getValues("address") || null,
        status: getValues("status"),
        size: getValues("size").replace(/[^0-9]/g, ""),
        price: getValues("price").replace(/[^0-9]/g, ""),
      };
      await deleteCache({ tag: "project" });
      return axios.post("project", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllProject"] });
      navigate("/home/projects?page=1&order=createdAt-DESC&search=&tags=");
      toast.success("پروژه با موفقیت ایجاد شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const { isPending: pendingUpdate, mutate: updateHandler } = useMutation({
    mutationFn: async () => {
      const body = {
        image: image?.url || null,
        gallery: galleryProject,
        video: videoProject?.url || null,
        alt: image?.alt || null,
        tags: tagsProject || [],
        workerId,
        name: getValues("name") || null,
        description: getValues("description"),
        address: getValues("address") || null,
        status: getValues("status"),
        size: getValues("size").replace(/[^0-9]/g, ""),
        price: getValues("price").replace(/[^0-9]/g, ""),
      };            
      await deleteCache({ path: `/project/${test.name}`, tag: "project" });
      return axios.put(`project/${data?.id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllProject"] });
      queryClient.invalidateQueries({ queryKey: ["projectSingle", test.name] });
      toast.success("پروژه با موفقیت ویرایش شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const { isPending: pendingDelete, mutate: deleteHandler } = useMutation({
    mutationFn: async () => {
      await deleteCache({ tag: "project" });
      return axios.delete(`project/${data?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllProject"] });
      queryClient.invalidateQueries({ queryKey: ["projectSingle", test.name] });
      navigate("/home/projects?page=1&order=createdAt-DESC&search=&tags=");
      toast.success("پروژه با موفقیت ویرایش شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const syncData = () => {
    setValue("address", data?.address || "");
    setValue("size", data?.size || "");
    setValue("price", data?.price || "");
    setValue("status", data?.status ? true : false);
    setValue("name", data?.name || "");
    setValue("description", data?.description || "");
    setTagsProject(data?.Tags || []);
    setWorkerId(data?.workerId || 0);
    setImage(data?.image ? { url: data?.image, alt: data?.alt } : null);
    setGalleryProject(data?.gallery || []);
    setVideoProject(data?.video ? { url: data?.video, alt: "" } : null);
  };
  useEffect(() => {
    if (search && data) {
      syncData();
    }
  }, [data]);
  const statusProject = watch("status");
  if (search && !data) return;
  let isPending = false;
  if (pendingCreate || pendingUpdate || pendingDelete) {
    isPending = true;
  }
  return (
    <>
      {isPending && <PendingApi />}
      <h1 className="bg-blue-500 shadow-md p-2 rounded-md mb-5 text-gray-50">
        ایجاد پروژه
      </h1>
      <form name="off" className="flex flex-col gap-3">
        <div className="flex gap-3 items-center">
          <TextField
            autoComplete="off"
            autoSave="off"
            className=" w-2/3"
            label={"نام"}
            helperText={"نام تکراری وارد نکنید!"}
            {...register("name", { required: true })}
          />
          <div className="w-1/3">
            <WorkerSelector setWorker={setWorkerId} worker={workerId} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 items-start">
          <TextField
            multiline
            rows={6}
            autoComplete="off"
            fullWidth
            className="shadow-md"
            label={"توضیحات"}
            {...register("description", { required: true })}
          />
          <div className="flex">
            <div className="flex flex-col items-start w-1/2 gap-3">
              <span>تصویر پروژه</span>
              <SelectMedia
              textHelp="ابعاد تصویر 450*1450"
                addMedia={(alt, image) => setImage({ alt, url: image.url })}
              />
            </div>
            <div className="w-1/2">
              <ImageComponent
                deleteHandler={() => setImage(null)}
                img={image}
              />
            </div>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <TextField
            autoComplete="off"
            className="shadow-md w-1/2"
            label={"آدرس"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoLocation />
                </InputAdornment>
              ),
            }}
            {...register("address", { required: true })}
          />
          <div className="w-1/2">
            <TagAutocomplete
              name="افزودن تگ"
              setTags={setTagsProject}
              tags={tagsProject}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TextField
            fullWidth
            autoComplete="off"
            className="shadow-md w-1/2"
            label={"بودجه پروژه (تومان)"}
            {...register("price", { required: true })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaDollarSign />
                </InputAdornment>
              ),
            }}
            onChange={({ target }) => {
              target.value = Number(
                target.value.replace(/[^0-9]/g, "")
              ).toLocaleString();
            }}
          />
          <TextField
            fullWidth
            autoComplete="off"
            className="shadow-md w-1/2"
            label={"متراژ"}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <GiPencilRuler />
                </InputAdornment>
              ),
            }}
            {...register("size", { required: true })}
            onChange={({ target }) => {
              target.value = Number(
                target.value.replace(/[^0-9]/g, "")
              ).toLocaleString();
            }}
          />
        </div>
        <div className="flex gap-3 ">
          <div className="flex flex-col w-1/3 gap-3">
            <div className="flex flex-col gap-3">
              <span>ویدئو پروژه</span>
              <SelectMedia
                addMedia={(alt, image) =>
                  setVideoProject({ alt, url: image.url })
                }
              />
            </div>
            <div className="">
              <ImageComponent
                img={videoProject}
                deleteHandler={() => setVideoProject(null)}
              />
            </div>
          </div>
          <div className="flex w-2/3 flex-col gap-3">
            <div className="flex flex-col gap-3">
              <span>گالری پروژه</span>
              <SelectMedia
              textHelp="ابعاد تصوری 288*384"
                addMedia={(alt, image) => {
                  const newGallery = [
                    ...galleryProject,
                    { alt, url: image.url },
                  ];
                  setGalleryProject(newGallery);
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {galleryProject.map((i, index) => (
                <ImageComponent
                  key={index}
                  img={i}
                  editHandler={({ url, alt }) => {
                    setOpen(true);
                    setEditImg({ url, alt });
                  }}
                  deleteHandler={(img) => {
                    const newDetail = galleryProject.filter((i) => {
                      return i.url !== img.url;
                    });
                    setGalleryProject(newDetail);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          {search && data ? (
            <>
              <div className="flex gap-3 w-1/3">
                <Button
                  color="success"
                  disabled={pendingUpdate}
                  variant="contained"
                  onClick={() => updateHandler()}
                  className="w-1/5"
                  endIcon={<BiMessageSquareEdit />}
                >
                  ویرایش
                </Button>
                <DeleteButton
                  deletePost={deleteHandler}
                  pendingDelete={pendingDelete}
                  text="حذف پروژه"
                />
              </div>
            </>
          ) : (
            <Button
              color="primary"
              disabled={!workerId || pendingCreate}
              variant="contained"
              onClick={() => createHandler()}
              className="w-1/5"
              endIcon={<MdDataSaverOn />}
            >
              ذخیره
            </Button>
          )}
          <FormControlLabel
            control={
              <Switch
                color="success"
                checked={statusProject ? true : false}
                onChange={() => setValue("status", !statusProject)}
              />
            }
            label="انتشار پروژه"
          />
        </div>
      </form>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const alt = formJson.alt;
            const src = formJson.image;
            const newArry = galleryProject.map((i) => {
              if (i.url === editImg?.url) {
                i.alt = alt;
                i.url = src;
              }
              return i;
            });
            setGalleryProject(newArry);
            setOpen(false);
          },
        }}
      >
        <DialogTitle>ویرایش عکس</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            defaultValue={editImg?.url}
            id="image"
            name="image"
            label="آدرس عکس"
            type="text"
            fullWidth
            variant="standard"
            autoComplete="false"
          />
          <TextField
            autoFocus
            defaultValue={editImg?.alt}
            margin="dense"
            id="alt"
            autoComplete="false"
            name="alt"
            label="ویرایش عنوان"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <div className="flex justify-between items-center w-full">
            <Button
              type="submit"
              color="success"
              variant="contained"
              endIcon={<FaPenToSquare />}
            >
              ذخیره
            </Button>
            <Button
              color="error"
              variant="contained"
              endIcon={<MdClose />}
              onClick={() => setOpen(false)}
            >
              بستن
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
