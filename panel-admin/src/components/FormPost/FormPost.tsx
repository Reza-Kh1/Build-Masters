import {
  Autocomplete,
  Button,
  Chip,
  FormControlLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import { SiReaddotcv } from "react-icons/si";
import { LuFileEdit } from "react-icons/lu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { CategortType, DataMediaType, FormPostType, SinglePostType } from "../../type";
import { useEffect, useState } from "react";
import { fetchCategory } from "../../services/category";
import { FaShare } from "react-icons/fa6";
import { MdEditNote, MdPostAdd } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import JoditForm from "../JoditEditor/JoditEditor";
import TagAutocomplete from "../TagAutocomplete/TagAutocomplete";
import SelectMedia from "../SelectMedia/SelectMedia";
import ImageComponent from "../ImageComponent/ImageComponent";
import DeleteButton from "../DeleteButton/DeleteButton";
import PendingApi from "../PendingApi/PendingApi";
import deleteCache from "../../services/revalidate";
export default function FormPost({ dataPost }: { dataPost?: SinglePostType }) {  
  const { register, handleSubmit, watch, setValue, getValues } =
    useForm<FormPostType>({
      defaultValues: {
        categoryId: dataPost?.Category?.id || "s",
        status: dataPost?.status || false,
      },
    });
  const { pathname } = useLocation();
  const [tagPost, setTagPost] = useState<{ name: string }[]>([])
  const slug = pathname.split("/home/posts/")[1];
  const categoryValue = watch("categoryId");
  const statusValue = watch("status");
  const queryClient = useQueryClient();
  const [imagePost, setImagePost] = useState<DataMediaType | null>(null);
  const [keyword, setKeyword] = useState<string[]>([]);
  const [editorText, setEditorText] = useState<string>("");
  const [postId, setPostId] = useState<string>("");
  const [isUpdateDetail, setIsUpdateDetail] = useState<boolean>(false);
  const navigate = useNavigate()
  const { data: dataCategory } = useQuery<CategortType[]>({
    initialData: () => queryClient.getQueryData(["getCategory"]),
    queryKey: ["getCategory"],
    queryFn: fetchCategory,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const { isPending: isPendingPost1, mutate: createPost } = useMutation({
    mutationFn: async (form: FormPostType) => {
      const body = {
        image: imagePost?.url,
        ...form,
        tags: tagPost || []
      };
      await deleteCache({ tag: `category` });
      await deleteCache({ tag: "post" });
      return axios.post("post", body);
    },
    onSuccess: ({ data }) => {
      setPostId(data.id);
      queryClient.invalidateQueries({ queryKey: ["AllPost"] });
      queryClient.invalidateQueries({ queryKey: ["siglePost", slug] });
      toast.success("پست با موفقیت ثبت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const { isPending: isPendingPost2, mutate: updatePost } = useMutation({
    mutationFn: async (form: FormPostType) => {
      const body = {
        image: imagePost?.url,
        ...form,
        tags: tagPost || []
      };
      await deleteCache({ tag: `category` });
      await deleteCache({ tag: "post" });
      return axios.put(`post/${postId}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllPost"] });
      queryClient.invalidateQueries({ queryKey: ["siglePost", slug] });
      toast.success("پست با موفقیت آپدیت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  });
  const { isPending: pendingDelete, mutate: deletePost } = useMutation({
    mutationFn: async () => {
      if (!postId) {
        throw new Error("آیدی پست یافت نشد!")
      }
      await deleteCache({ tag: `category` });
      await deleteCache({ tag: "post" });
      return axios.delete(`post/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["AllPost", slug] });
      navigate("/home/posts")
      toast.success("اطلاعات با موفقیت آپدیت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  }
  );
  const { isPending: isPendingDetail1, mutate: createDetailPost } = useMutation({
    mutationFn: async () => {
      const body = {
        keyword,
        title: getValues("titleDetail"),
        text: editorText,
      };
      await deleteCache({ path: `/post/${slug}` });
      return axios.post(`detail/${postId}`, body);
    },
    onSuccess: () => {
      toast.success("اطلاعات با موفقیت دخیره شد");
      queryClient.invalidateQueries({ queryKey: ["siglePost", slug] });
      setIsUpdateDetail(true);
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  }
  );
  const { isPending: isPendingDetail2, mutate: updateDetailPost } = useMutation({
    mutationFn: async () => {
      const body = {
        keyword,
        title: getValues("titleDetail"),
        text: editorText,
      };
      await deleteCache({ path: `/post/${slug}` });
      return axios.put(`detail/${postId}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siglePost", slug] });
      toast.success("اطلاعات با موفقیت آپدیت شد");
    },
    onError: (err: any) => {
      toast.warning(err?.response?.data?.message || "با خطا مواجه شدیم");
      console.log(err);
    },
  }
  );
  const syncData = () => {
    if (!dataPost) return;
    setValue("title", dataPost.title);
    setValue("description", dataPost.description);
    setValue("status",dataPost.status ? true : false)
    setImagePost(dataPost.image ? { url: dataPost.image, alt: dataPost.title } : null);
    setPostId(dataPost.id);
    setTagPost(dataPost.Tags)
    if (
      dataPost?.DetailPost?.title ||
      dataPost?.DetailPost?.text ||
      dataPost?.DetailPost?.keyword
    ) {
      setKeyword(dataPost.DetailPost.keyword || []);
      setEditorText(dataPost.DetailPost.text || "");
      setValue("titleDetail", dataPost?.DetailPost?.title || "");
      setIsUpdateDetail(true);
    }
  };
  useEffect(() => {
    syncData();
  }, [dataPost]);
  let truePending = false
  if (isPendingPost1 ||
    isPendingPost2 ||
    isPendingDetail1 ||
    isPendingDetail2 ||
    pendingDelete) truePending = true
  return (
    <div>
      {truePending && <PendingApi />}
      <form>
        <div className="grid grid-cols-[37%_37%_20%] gap-2 mt-3 items-center">
          <TextField
            autoComplete="off"
            label={"نام پست"}
            fullWidth
            {...register("title", { required: true })}
            helperText="نام تکراری وارد نکنید!"
          />
          <TagAutocomplete setTags={setTagPost} tags={tagPost} name="تگ های مربوط به پست" />
          {dataCategory?.length ? (
            <TextField
              autoComplete="off"
              select
              className="shadow-md"
              label="دسته پست"
              id="evaluationField"
              value={categoryValue || "s"}
              onChange={({ target }) => setValue("categoryId", target.value)}
            >
              <MenuItem value={"s"}>انتخاب کنید</MenuItem>
              {dataCategory?.map((i) => (
                <MenuItem key={i.id} value={i.id}>
                  {i.name}
                </MenuItem>
              ))}
            </TextField>
          ) :
            <Link to={"/home/categorys"}>
              <Button endIcon={<FaShare />} variant="outlined">
                هیچ دسته ای در دیتابیس ذخیره نشده لطفا دسته ایجاد کنید!
              </Button>
            </Link>
          }
        </div>
        <div className="flex mt-3  gap-3">
          <div className="w-1/2">
            <TextField
              fullWidth
              autoComplete="off"
              className="shadow-md"
              label={"توضیحات"}
              rows={6}
              multiline
              {...register("description", { required: true })}
            />
          </div>
          <div className="w-1/2 flex gap-3 items-start">
            <div className="w-1/3">
              <SelectMedia textHelp="ابعاد تصویر 450*1450" addMedia={(alt, img) => setImagePost({ url: img.url, alt })} />
            </div>
            <div className="w-2/3 text-center">
              <ImageComponent deleteHandler={() => setImagePost(null)} img={imagePost} />
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          {postId ? (
            <Button
              onClick={handleSubmit((data) => updatePost(data))}
              color="primary"
              variant="contained"
              endIcon={<MdEditNote />}
              disabled={isPendingPost2}
            >
              ویرایش اطلاعات
            </Button>
          ) : (
            <Button
              onClick={handleSubmit((data) => createPost(data))}
              color="success"
              variant="contained"
              disabled={isPendingPost1}
              endIcon={<SiReaddotcv />}
            >
              ذخیره اطلاعات
            </Button>
          )}
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                // value={statusValue}
                checked={statusValue ? true : false}
                onChange={() => setValue("status", !getValues("status"))}
              />
            }
            label="انتشار پست"
          />
        </div>
      </form>
      {postId && (
        <form>
          <TextField
            className="shadow-md !w-1/3 !mt-5"
            autoComplete="off"
            label={"سربرگ صفحه"}
            fullWidth
            {...register("titleDetail")}
          />
          <div className="my-3">
            <Autocomplete
              multiple
              className="shadow-md"
              id="tags-filled"
              options={[].map((option) => option)}
              defaultValue={[]}
              freeSolo
              onChange={(_, newValue) => setKeyword(newValue)}
              value={keyword}
              renderTags={(value: readonly string[], getTagProps) =>
                value.map((option: string, index: number) => {
                  const { key, ...tagProps } = getTagProps({ index });
                  return (
                    <Chip
                      variant="outlined"
                      label={option}
                      key={key}
                      {...tagProps}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  autoComplete="off"
                  {...params}
                  label="کلمات کلیدی"
                  placeholder="اینتر بزنید..."
                />
              )}
            />
          </div>
          <div>
            <JoditForm setEditor={setEditorText} editor={editorText} />
          </div>
          <div className="mt-5 flex justify-between">
            {isUpdateDetail ? (
              <Button
                disabled={isPendingDetail2}
                onClick={() => updateDetailPost()}
                color="primary"
                endIcon={<LuFileEdit />}
                variant="contained"
              >
                ویرایش اطلاعات پست
              </Button>
            ) : (
              <Button
                disabled={isPendingDetail1}
                onClick={() => createDetailPost()}
                color="success"
                endIcon={<MdPostAdd />}
                variant="contained"
              >
                ذخیره اطلاعات پست
              </Button>
            )}
            <DeleteButton deletePost={deletePost} pendingDelete={pendingDelete} text="حذف پست" />
          </div>
        </form>
      )}
    </div>
  );
}
