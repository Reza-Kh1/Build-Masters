import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchReview } from "../../services/review";
import Pagination from "../../components/Pagination/Pagination";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
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
import { FaCheck, FaEye, FaPen, FaTrash } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { MdClose, MdDataSaverOn } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import { useForm } from "react-hook-form";
import queryString from "query-string";
import DontData from "../../components/DontData/DontData";
import SearchBox from "../../components/SearchBox/SearchBox";
import PendingApi from "../../components/PendingApi/PendingApi";
import { BiSolidMessageAltCheck } from "react-icons/bi";
import deleteCache from "../../services/revalidate";
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
    getNextPageParam: (lastPage) => lastPage.paginate.nextPage || undefined,
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
  const { isPending: isPendingDelete, mutate: reviewDelete } = useMutation({
    mutationFn: async () => {
      if (cachePage) {
        await deleteCache({ path: `/post/${cachePage.replace(/ /g, "-")}` });
        setCachepage("")
      }
      if (!review?.data.Post) {
        await deleteCache({ tag: "comment" });
      }
      return axios.delete(`comment/${review?.data?.id}`);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["AllReview"] });
      toast.success("کامنت حذف شد");
      closeHandler();
    },
    onError: (err) => {
      console.log(err);
      closeHandler();
      toast.warning("دوباره تلاش کنید");
    },
  });
  const { isPending: isPendingCheck, mutate: reviewCheck } = useMutation({
    mutationFn: async (form: ReviewType) => {
      if (cachePage) {
        await deleteCache({ path: `/post/${cachePage.replace(/ /g, "-")}` });
        setCachepage("")
      }
      if (!form.Post) {
        await deleteCache({ tag: "comment" });
      }
      const body = {
        postId: form.Post?.id,
        status: true,
      };
      return axios.put(`comment/${form?.id}`, body);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["AllReview"] });
      toast.success("کامنت تایید شد");
    },
    onError: (err) => {
      console.log(err);
      toast.warning("دوباره تلاش کنید");
    },
  });
  const { isPending: isPendingMinus, mutate: reviewMinus } = useMutation({
    mutationFn: async (form: ReviewType) => {
      if (cachePage) {
        await deleteCache({ path: `/post/${cachePage.replace(/ /g, "-")}` });
        setCachepage("")
      }
      if (!form.Post) {
        await deleteCache({ tag: "comment" });
      }
      const body = {
        postId: form.Post?.id,
        status: false,
      };
      return axios.put(`comment/${form?.id}`, body);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["AllReview"] });
      toast.success("کامنت رد شد");
    },
    onError: (err) => {
      console.log(err);
      toast.warning("دوباره تلاش کنید");
    },
  });
  const openUpdate = (value: ReviewType) => {
    setValue("email", value.email || "");
    setValue("name", value.name || "");
    setValue("phone", value.phone || "");
    setValue("text", value.text || "");
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
  return (
    <>
      <div className="w-full">
        {isPendingDelete ||
          isPendingCheck ||
          (isPendingMinus && <PendingApi />)}
        <SearchBox notTag checker />
        <DontData
          text={
            data?.pages[0].count
              ? data?.pages[0].count + " کامنت"
              : "کامنتی یافت نشد!"
          }
        />
        {data?.pages[0].rows.length ? (
          <>
            <TableContainer className="my-6" component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">حذف کش</StyledTableCell>
                    <StyledTableCell align="center">نام</StyledTableCell>
                    <StyledTableCell align="center">موقعیت</StyledTableCell>
                    <StyledTableCell align="center">
                      شماره تلفن / ایمیل
                    </StyledTableCell>
                    <StyledTableCell align="center">کامنت</StyledTableCell>
                    <StyledTableCell align="center">آدرس پست</StyledTableCell>
                    <StyledTableCell align="center">تاریخ</StyledTableCell>
                    <StyledTableCell align="center">وضعیت</StyledTableCell>
                    <StyledTableCell align="center">عملیات</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.pages[0]?.rows.map((i, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        <Checkbox checked={i.Post?.title === cachePage} onChange={() => setCachepage(cachePage === i.Post?.title ? "" : i.Post?.title || "")} />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <p className="text-sm cutline cutline-2">{i?.name}</p>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <p className="text-sm cutline cutline-2">
                          {i?.position}
                        </p>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <p className="text-sm cutline cutline-2">
                          {i?.phone || i?.email}
                        </p>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <p className="text-sm cutline cutline-3">{i.text}</p>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {i.Post?.id ? (
                          <Tooltip title={i.Post?.title} placement="top" arrow>
                            <Link to={`/home/posts/${i?.Post?.title}`}>
                              <Button
                                color="primary"
                                variant="outlined"
                                endIcon={<FaEye size={13} />}
                                size="small"
                              >
                                پست
                              </Button>
                            </Link>
                          </Tooltip>
                        ) : (
                          <Button
                            color="success"
                            variant="outlined"
                            endIcon={<BiSolidMessageAltCheck size={13} />}
                            size="small"
                          >
                            نظر
                          </Button>
                        )}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(i?.createdAt).toLocaleDateString("fa")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <IconButton color={i.status ? "success" : "error"}>
                          {i.status ? <FaCheck /> : <MdClose />}
                        </IconButton>
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex justify-evenly gap-2">
                          {i.status ? (
                            <Button
                              onClick={() => reviewMinus(i)}
                              color="warning"
                              variant="outlined"
                              endIcon={<MdClose size={12} />}
                              size="small"
                              disabled={isPendingMinus}
                            >
                              رد
                            </Button>
                          ) : (
                            <Button
                              onClick={() => reviewCheck(i)}
                              color="success"
                              variant="outlined"
                              endIcon={<FaCheck size={12} />}
                              size="small"
                              disabled={isPendingCheck}
                            >
                              تایید
                            </Button>
                          )}
                          <Button
                            onClick={() => {
                              setOpen(true),
                                setReview({
                                  data: i,
                                  position: false,
                                });
                            }}
                            color="error"
                            variant="outlined"
                            endIcon={<FaTrash size={12} />}
                            size="small"
                            disabled={isPendingDelete}
                          >
                            حذف
                          </Button>
                          <Button
                            onClick={() => openUpdate(i)}
                            color="success"
                            variant="outlined"
                            endIcon={<FaPen size={12} />}
                            size="small"
                            disabled={isPendingUpdate}
                          >
                            ویرایش
                          </Button>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Pagination pager={data?.pages[0].paginate} />
          </>
        ) : null}
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
                        {review?.data?.phone || review?.data?.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <p className="text-sm cutline cutline-3">
                          {review?.data.text}
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
            ) : (
              <Button
                variant="contained"
                endIcon={<FaTrash />}
                color="error"
                onClick={() => reviewDelete()}
                className="w-2/12"
                disabled={isPendingDelete}
              >
                حذف
              </Button>
            )}
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
