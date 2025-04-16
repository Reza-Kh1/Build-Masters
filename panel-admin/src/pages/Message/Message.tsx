import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { forwardRef, useEffect, useState } from "react";
import { AllMessageType, MessageType } from "../../type";
import Pagination from "../../components/Pagination/Pagination";
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
import { FaCheck, FaPhone } from "react-icons/fa6";
import { IoEye, IoTrashBin } from "react-icons/io5";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import { toast } from "react-toastify";
import { SiSubtitleedit } from "react-icons/si";
import { FaCalendarAlt } from "react-icons/fa";
import { fetchMessage } from "../../services/message";
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
export default function Message() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<MessageType>();
  const { search } = useLocation();
  const queryClient = useQueryClient();
  const { data } = useInfiniteQuery<AllMessageType>({
    queryKey: ["Message", searchQuery],
    queryFn: () => fetchMessage(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.paginate.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: isUpdate, mutate: checkMessage } = useMutation({
    mutationFn: () => {
      return axios.put(`message/${singleData?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Message"] });
      toast.success("اطلاعات ذخیره شد");
      setOpen(false);
    },
    onError: (err) => {
      toast.warning("با خطا مواجه شدیم");
      console.log(err);
      setOpen(false);
    },
  });
  const { isPending: isDelete, mutate: deleteMessage } = useMutation({
    mutationFn: () => {
      return axios.delete(`message/${singleData?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Message"] });
      toast.info("پیام حذف شد");
      setOpen(false);
    },
    onError: (err) => {
      toast.warning("با خطا مواجه شدیم");
      console.log(err);
      setOpen(false);
    },
  });
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  return (
    <div className="w-full">
      <SearchBox checker notSearch notTag />
      <DontData
        text={
          data?.pages[0].count
            ? data?.pages[0].count + " درخواست"
            : "درخواستی یافت نشد!"
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
                  <StyledTableCell align="center">متن</StyledTableCell>
                  <StyledTableCell align="center">وضعیت</StyledTableCell>
                  <StyledTableCell align="center">تاریخ</StyledTableCell>
                  <StyledTableCell align="center">عملیات</StyledTableCell>
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
                      <p className="cutline cutline-3">{row.text}</p>
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
                        onClick={() => {
                          setSingleData(row), setOpen(true);
                        }}
                        disabled={isDelete || isUpdate}
                      >
                        نمایش
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
        maxWidth="md"
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <span className="text-sm">متن ارسال شده از </span>
          <span className="text-blue-500 font-semibold">
            {singleData?.name}
          </span>
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-4 gap-5">
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
          <div className="mt-4">
            <span className="font-semibold">توضیحات :</span>
            <p className="p-2 rounded-md bg-blue-100/80">{singleData?.text}</p>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isDelete || isUpdate}
              variant="contained"
              color={singleData?.status ? "warning" : "primary"}
              onClick={() => checkMessage()}
              endIcon={<FaCheck />}
            >
              {singleData?.status ? "لغو تایید" : "تایید شود"}
            </Button>
            <Button
              disabled={isDelete || isUpdate}
              variant="contained"
              color="error"
              onClick={() => deleteMessage()}
              endIcon={<IoTrashBin />}
            >
              حذف
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
