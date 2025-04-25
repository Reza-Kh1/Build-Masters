import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchReview } from "../../services/review";
import Pagination from "../../components/Pagination/Pagination";
import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Switch, TextField, Tooltip } from "@mui/material";
import { AllReviewType, ReviewType } from "../../type";
import { FaCheck, FaEye, FaPen } from "react-icons/fa6";
import { useLocation } from "react-router-dom";
import { MdClose, MdDataSaverOn } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import DontData from "../../components/DontData/DontData";
import SearchBox from "../../components/SearchBox/SearchBox";
import PendingApi from "../../components/PendingApi/PendingApi";
import { AgGridReact } from "ag-grid-react";
import { myThemeTable } from "../../main";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { IoMdTrash } from "react-icons/io";
type FormReviewType = {
  name: string;
  content: string;
  phone?: string;
  replie: string;
  rating: number
};
export default function Reviews() {
  const jsonData = localStorage.getItem(import.meta.env.VITE_PUBLIC_COOKIE_KEY)
  if (!jsonData) return
  const local = JSON.parse(jsonData)
  const [searchQuery, setSearchQuery] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const { handleSubmit, register, setValue, getValues } = useForm<FormReviewType>();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [review, setReview] = useState<ReviewType | null>(null);
  const query = useQueryClient();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<AllReviewType>({
    queryKey: ["AllReview", searchQuery],
    queryFn: () => fetchReview(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: isPendingUpdate, mutate: reviewUpdate } = useMutation({
    mutationFn: async ({ replie, ...other }: FormReviewType) => {
      try {
        if (isUpdate) {
          const body = {
            ...other,
          };
          body.rating = Number(getValues('rating'))
          await axios.put(`comment/${review?.id}`, body);
        }
        if (replie) {
          const body = {
            name: local?.name,
            phone: local?.phone || '',
            content: replie,
            postId: review?.postId,
            commentReply: review?.id
          };
          await axios.post(`comment`, body);
        }
        const accept = {
          id: review?.id,
          postId: review?.postId,
          rating: Number(getValues('rating')),
          isPublished: true,
          contractorId: review?.contractorId
        };
        return axios.put(`comment`, accept);
      } catch (err: any) {
        throw new Error(err);
      }
    },
    onSuccess: () => {
      closeHandler();
      query.invalidateQueries({ queryKey: ["AllReview"] });
      toast.success("کامنت ثبت شد");
      setValue("replie", "");
    },
    onError: (err) => {
      console.log(err);
      toast.warning("با خطا روبرو شدیم");
    },
  });
  const { isPending: isPendingCheck, mutate: publishedHandler } = useMutation({
    mutationFn: async (form: ReviewType) => {
      const body = {
        id: form.id,
        rating: form.rating,
        postId: form.postId,
        isPublished: !form.isPublished,
        contractorId: form.contractorId
      };
      return axios.put('comment', body);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["AllReview"] });
      toast.success("کامنت آپدیت شد");
    },
    onError: (err) => {
      console.log(err);
      toast.warning("دوباره تلاش کنید");
    },
  });
  const { isPending: isPendingDelete, mutate: reviewDelete } = useMutation({
    mutationFn: async (form: ReviewType) => {
      const body = {
        id: form.id,
        rating: form.rating,
        postId: form.postId,
        isPublished: form.isPublished,
        contractorId: form.contractorId
      };
      return axios.post('comment/delete', body);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["AllReview"] });
      toast.success("کامنت آپدیت شد");
    },
    onError: (err) => {
      console.log(err);
      toast.warning("دوباره تلاش کنید");
    },
  });
  const openUpdate = (value: ReviewType) => {
    setValue("name", value.name || "");
    setValue("phone", value.phone || "");
    setValue("content", value.content || "");
    setReview(value);
    setOpen(true);
  };
  const closeHandler = () => {
    setOpen(false);
    setIsUpdate(false)
  };
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  const columnDefs: ColDef[] = [
    { field: "name", headerName: "نام", flex: 1 },
    { field: "content", headerName: "متن", flex: 2 },
    {
      field: "id", headerName: "برای", flex: 1, cellRenderer: ({ data }: ICellRendererParams) => {
        return data.postId ? (
          <Tooltip title={data.Post?.name} placement="top" arrow>
            <Button
              color="primary"
              variant="outlined"
              endIcon={<FaEye size={13} />}
              size="small"
            >
              پست
            </Button>
          </Tooltip>
        ) : data.contractorId ? (
          <Tooltip title={data?.name} placement="top" arrow>
            <Button
              color="success"
              variant="outlined"
              endIcon={<FaEye size={13} />}
              size="small"
            >
              مجری
            </Button>
          </Tooltip>
        ) :
          <Button
            color="info"
            variant="outlined"
            endIcon={<FaEye size={13} />}
            size="small"
          >
            پاسخ
          </Button>
      }
    },
    {
      field: "roleType", flex: 1, headerName: "سطح کاربری", valueFormatter: (p) => {
        if (p.value === "ADMIN") {
          return 'ادمین'
        } else if (p.value === "AUTHOR") {
          return 'نویسنده'
        } else if (p.value === 'CONTRACTOR') {
          return 'مجری'
        } else {
          return 'کاربر'
        }
      }
    },
    { field: "createdAt", headerName: "تاریخ", flex: 1, valueFormatter: p => new Date(p.value).toLocaleDateString("fa") },
    { field: "id", headerName: "وضعیت", flex: 1, valueFormatter: ({ data }) => data.isPublished ? '✅' : '❌' },
    {
      headerName: "عملیات",
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center">
          {params.data.isPublished ? (
            <Button
              onClick={() => publishedHandler(params.data)}
              color="warning"
              loading={isPendingDelete}
              variant="contained"
              endIcon={<MdClose size={12} />}
              disabled={isPendingCheck}
            >
              رد
            </Button>
          ) : (
            <Button
              onClick={() => publishedHandler(params.data)}
              color="success"
              variant="contained"
              loading={isPendingDelete}
              endIcon={<FaCheck size={12} />}
              disabled={isPendingCheck}
            >
              تایید
            </Button>
          )}
          <Button
            onClick={() => openUpdate(params.data)}
            color="primary"
            variant="contained"
            endIcon={<FaPen size={12} />}
            disabled={isPendingUpdate}
          >
            ویرایش
          </Button>
          <Button
            disabled={isPendingDelete}
            onClick={() => reviewDelete(params.data)}
            color="error"
            loading={isPendingDelete}
            endIcon={<IoMdTrash />}
            variant="contained"
          >
            حذف
          </Button>
          {/* <DeleteButton id={params.value} keyQuery="AllReview" urlAction="comment" headerText="حذف کامنت" /> */}
        </div>
      ),
      field: "id",
      width: 200,
      filter: false,
      sortable: false, flex: 2
    },
  ]
  return (
    <>
      <div className="w-full">
        {isPendingCheck && <PendingApi />}
        <SearchBox notTag checker />
        {data?.pages[0].data.length ? (
          <>
            <div className="my-4 w-full h-[450px] [--ag-font-size:16px] [--ag-font-family:iranSans]">
              <AgGridReact
                enableRtl
                rowData={data?.pages[0]?.data}
                columnDefs={columnDefs}
                rowHeight={55}
                theme={myThemeTable}
                defaultColDef={{
                  cellStyle: { direction: 'rtl' },
                  headerStyle: { direction: 'rtl' },
                  filter: true,
                  sortable: true,
                  resizable: true,
                }}
              />
            </div>
            <Pagination pager={data?.pages[0].pagination} />
          </>
        ) : <DontData text="هیچ کامنتی یافت نشد" />}
      </div>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={closeHandler}
      >
        <DialogContent>
          <div className="flex gap-2">
            <form className="w-1/2">
              <TextField
                className="shadow-md"
                autoComplete="off"
                label={"پاسخ کامنت"}
                fullWidth
                multiline
                rows={9}
                {...register("replie")}
              />
            </form>
            <form className="w-1/2">
              <div className="grid grid-cols-3 gap-2 mb-3">
                <TextField
                  disabled={!isUpdate}
                  className="shadow-md"
                  autoComplete="off"
                  label={"اسم کاربر"}
                  fullWidth
                  {...register("name")}
                />
                <TextField
                  disabled={!isUpdate}
                  className="shadow-md"
                  autoComplete="off"
                  label={"شماره تلفن"}
                  fullWidth
                  {...register("phone")}
                />
                <TextField
                  disabled={!isUpdate}
                  className="shadow-md"
                  autoComplete="off"
                  label={"امتیاز"}
                  fullWidth
                  {...register("rating")}
                  onChange={({ target }) => {
                    target.value = Number(
                      target.value.replace(/[^0-9]/g, "")
                    ).toLocaleString()
                  }}
                />
              </div>
              <TextField
                disabled={!isUpdate}
                className="shadow-md"
                autoComplete="off"
                label={"متن کامنت"}
                fullWidth
                multiline
                rows={6}
                {...register("content")}
              />
            </form>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-between">
            <Button
              variant="contained"
              endIcon={<MdDataSaverOn />}
              className="w-2/12"
              color="success"
              onClick={handleSubmit((data) => reviewUpdate(data))}
              disabled={isPendingUpdate}
            >
              ذخیره
            </Button>
            <FormControlLabel
              control={<Switch value={isUpdate} />}
              onChange={() => setIsUpdate((prev) => !prev)}
              label="ویرایش اطلاعات کاربر"
            />
            <Button
              variant="contained"
              color="warning"
              className="w-2/12"
              endIcon={<MdClose />}
              onClick={closeHandler}
            >
              بستن
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
