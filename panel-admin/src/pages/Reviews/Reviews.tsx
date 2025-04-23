import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchReview } from "../../services/review";
import Pagination from "../../components/Pagination/Pagination";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  styled,
  tableCellClasses,
} from "@mui/material";
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
import deleteCache from "../../services/revalidate";
import { AgGridReact } from "ag-grid-react";
import { myThemeTable } from "../../main";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { ColDef, ICellRendererParams } from "ag-grid-community";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
type FormReviewType = {
  name: string;
  text: string;
  email: string;
  phone?: string;
  replie: string;
};
export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const { handleSubmit, register, setValue } = useForm<FormReviewType>();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [cachePage, setCachepage] = useState<string>("");
  const query = useQueryClient();
  const { search } = useLocation();
  const [review, setReview] = useState<{
    position: boolean;
    data: ReviewType;
  } | null>(null);
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
      if (!review?.data.Post) {
        await deleteCache({ tag: "comment" });
      }
      if (cachePage) {
        await deleteCache({ path: `/post/${cachePage.replace(/ /g, "-")}` });
        setCachepage("")
      }
      try {
        if (isUpdate) {
          const body = {
            ...other,
            status: true,
            postId: review?.data.Post?.id,
          };
          await axios.put(`comment/${review?.data.id}`, body);
        }
        if (replie) {
          const body = {
            text: replie,
            replies: review?.data.id,
            postId: review?.data.Post?.id,
          };
          await axios.post(`comment`, body);
        }
        const check = {
          status: true,
          postId: review?.data.Post?.id,
        };
        return axios.put(`comment/${review?.data?.id}`, check);
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
  const openUpdate = (value: ReviewType) => {
    setValue("name", value.name || "");
    setValue("phone", value.phone || "");
    setValue("text", value.content || "");
    setReview({
      data: value,
      position: true,
    });
    setOpen(true);
  };
  const closeHandler = () => {
    setOpen(false);
    setIsUpdate(false)
    setCachepage("")
    setIsUpdate(false);
    // setReview(null);
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
      field: "role", flex: 1, headerName: "سطح کاربری", valueFormatter: (p) => {
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
          <DeleteButton id={params.value} keyQuery="GetUsers" urlAction="comment" headerText="حذف کامنت" />
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
        maxWidth={review?.position ? "lg" : "md"}
        open={open}
        onClose={closeHandler}
      >
        <DialogContent>
          {review ? (
            !review?.position ? (
              <TableContainer component={Paper}>
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell align="center">نام</StyledTableCell>
                      <StyledTableCell align="center">
                        تلفن / ایمیل
                      </StyledTableCell>
                      <StyledTableCell align="center">کامنت</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <StyledTableRow>
                      <StyledTableCell align="center">
                        {review?.data.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {review?.data?.phone}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <p className="text-sm cutline cutline-3">
                          {review?.data.content}
                        </p>
                      </StyledTableCell>
                    </StyledTableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
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
                      label={"ایمیل"}
                      fullWidth
                      {...register("email")}
                    />
                    <TextField
                      disabled={!isUpdate}
                      className="shadow-md"
                      autoComplete="off"
                      label={"شماره تلفن"}
                      fullWidth
                      {...register("phone")}
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
                    {...register("text")}
                  />
                </form>
              </div>
            )
          ) : null}
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-between">
            {review?.position ? (
              <>
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
              </>
            ) : null}
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
