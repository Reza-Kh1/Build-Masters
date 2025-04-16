import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { forwardRef, useEffect, useState } from "react";
import { fetchOnlinePrice } from "../../services/onlinePrice";
import { AllonlinePriceType, OnlinePriceType } from "../../type";
import Pagination from "../../components/Pagination/Pagination";
import { GiPencilRuler } from "react-icons/gi";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Slide,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { MdClose } from "react-icons/md";
import { FaCheck, FaPhone, FaSackDollar } from "react-icons/fa6";
import { IoEye, IoTrashBin } from "react-icons/io5";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import PendingApi from "../../components/PendingApi/PendingApi";
import { toast } from "react-toastify";
import { SiSubtitleedit } from "react-icons/si";
import { FaCalendarAlt } from "react-icons/fa";
import DontData from "../../components/DontData/DontData";
import SearchBox from "../../components/SearchBox/SearchBox";
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
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
export default function OnlinePrice() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<OnlinePriceType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showImg, setShowImg] = useState<string>("")
  const { search } = useLocation();
  const queryClient = useQueryClient();
  const { data } = useInfiniteQuery<AllonlinePriceType>({
    queryKey: ["Onlineprice", searchQuery],
    queryFn: () => fetchOnlinePrice(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.paginate.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: isUpdate, mutate: checkPrice } = useMutation({
    mutationFn: () => {
      return axios.put(`onlineprice/${singleData?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Onlineprice"] });
      toast.success("اطلاعات ذخیره شد");
      setOpen(false);
    },
    onError: (err) => {
      toast.warning("با خطا مواجه شدیم");
      console.log(err);
      setOpen(false);
    },
  });
  const { isPending: isDelete, mutate: deletePrice } = useMutation({
    mutationFn: () => {
      return axios.delete(`onlineprice/${singleData?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Onlineprice"] });
      toast.info("آیتم مورد نظر حذف شد");
      setOpen(false);
    },
    onError: (err) => {
      toast.warning("با خطا مواجه شدیم");
      console.log(err);
      setOpen(false);
    },
  });
  const getSingleData = (id: number) => {
    setIsLoading(true);
    axios
      .get(`onlineprice/${id}`)
      .then(({ data }) => {
        setSingleData(data?.data);
      })
      .catch(() => {
        toast.error("با خطا مواجه شدیم!");
      })
      .finally(() => {
        setOpen(true);
        setIsLoading(false);
      });
  };
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  return (
    <div className="w-full">
      {isLoading ? <PendingApi /> : null}
      <SearchBox checker notTag notSearch />
      <DontData
        text={
          data?.pages[0].count
            ? data?.pages[0].count + " درخواست"
            : "هیچ درخواستی ثبت نشده است!"
        }
      />
      {data?.pages[0].rows.length ? (
        <div className="mt-3">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">نام</StyledTableCell>
                  <StyledTableCell align="center">شماره تلفن</StyledTableCell>
                  <StyledTableCell align="center">موضوع</StyledTableCell>
                  <StyledTableCell align="center">تاریخ</StyledTableCell>
                  <StyledTableCell align="center">وضعیت</StyledTableCell>
                  <StyledTableCell align="center">نمایش</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.pages[0].rows?.map((row, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell align="center">{row.name}</StyledTableCell>
                    <StyledTableCell align="center">
                      {row.phone}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {row.subject}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton color={row.status ? "success" : "error"}>
                        {row.status ? <FaCheck /> : <MdClose />}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(row.createdAt).toLocaleString("fa")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Button
                        color={"success"}
                        endIcon={<IoEye />}
                        variant="contained"
                        onClick={() => getSingleData(row.id)}
                        disabled={isLoading || isDelete || isUpdate}
                      >
                        نمایش اطلاعات
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      ) : null}
      <Pagination pager={data?.pages[0].paginate} />
      <Dialog
        maxWidth="lg"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <span className="text-sm">درخواست قیمت از طرف </span>
          <span className="text-blue-500 font-semibold">
            {singleData?.name}
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-3 gap-5">
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                شماره تلفن
                <FaPhone className="text-green-500" />
              </span>
              <span>{singleData?.phone}</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                موضوع
                <SiSubtitleedit />
              </span>
              <span>{singleData?.subject}</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                بودجه مورد نظر
                <FaSackDollar className="text-orange-400" />
              </span>
              <span>{singleData?.price}</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                متراژ پروژه
                <GiPencilRuler className="text-red-500" />
              </span>
              <span>{Number(singleData?.size).toLocaleString("fa")}</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                تاریخ درخواست
                <FaCalendarAlt className="text-blue-500" />
              </span>
              <span>
                {singleData?.createdAt
                  ? new Date(singleData?.createdAt).toLocaleString("fa")
                  : null}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="flex items-center gap-3">
                وضعیت
                <IconButton color={singleData?.status ? "success" : "error"}>
                  {singleData?.status ? <FaCheck /> : <MdClose />}
                </IconButton>
              </span>
            </div>
          </div>
          <div className="grid gap-5 grid-cols-3 my-5">
            {singleData?.images.map((item, index) => (
              <figure key={index} className={`${item === showImg ? "fixed z-10 p-16 bg-slate-800/80" : "relative"} image-container top-0 left-0 w-full h-full`}>
                <img className="w-full rounded-md object-cover shadow-md h-full"
                  src={item || "/notfound.webp"} alt="test"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null;
                    currentTarget.src = "/notfound.webp";
                  }}
                />
                {item === showImg ?
                  <i onClick={() => setShowImg("")} className="right-20 top-20 absolute cursor-pointer hover:bg-red-700 bg-red-500/70 text-white text-2xl rounded-full shadow-md p-3">
                    <MdClose />
                  </i> : <i onClick={() => setShowImg(item)} className="top-1/2 left-1/2 absolute cursor-pointer hover:bg-black -translate-x-1/2 -translate-y-1/2 bg-slate-700/80 text-white text-2xl rounded-full shadow-md p-3 transform">
                    <IoEye />
                  </i>
                }
              </figure>
            ))}
          </div>
          <div className="mt-4">
            <span className="font-semibold">توضیحات :</span>
            <p className="p-2 rounded-md bg-blue-100/80">
              {singleData?.description}
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isDelete || isUpdate}
              variant="contained"
              color={singleData?.status ? "warning" : "primary"}
              onClick={() => checkPrice()}
              endIcon={<FaCheck />}
            >
              {singleData?.status ? "لغو تایید" : "تایید شود"}
            </Button>
            <Button
              disabled={isDelete || isUpdate}
              variant="contained"
              color="error"
              onClick={() => deletePrice()}
              endIcon={<IoTrashBin />}
            >
              حذف
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div >
  );
}
