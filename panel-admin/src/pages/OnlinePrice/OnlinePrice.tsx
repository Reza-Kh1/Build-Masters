import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useEffect, useState } from "react";
import { fetchOnlinePrice } from "../../services/onlinePrice";
import { AllonlinePriceType, OnlinePriceType } from "../../type";
import Pagination from "../../components/Pagination/Pagination";
import { GiPencilRuler } from "react-icons/gi";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide } from "@mui/material";
import { MdClose } from "react-icons/md";
import { FaCheck, FaEye, FaPhone, FaSackDollar } from "react-icons/fa6";
import { IoEye, IoTrashBin } from "react-icons/io5";
import { TransitionProps } from "@mui/material/transitions";
import axios from "axios";
import PendingApi from "../../components/PendingApi/PendingApi";
import { toast } from "react-toastify";
import { SiSubtitleedit } from "react-icons/si";
import { FaCalendarAlt } from "react-icons/fa";
import DontData from "../../components/DontData/DontData";
import SearchBox from "../../components/SearchBox/SearchBox";
import { AgGridReact } from "ag-grid-react";
import { myThemeTable } from "../../main";
import DeleteButton from "../../components/DeleteButton/DeleteButton";
import { ColDef, ICellRendererParams } from "ag-grid-community";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OnlinePrice() {
  const [searchQuery, setSearchQuery] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [singleData, setSingleData] = useState<OnlinePriceType>();
  const [showImg, setShowImg] = useState<string>("")
  const { search } = useLocation();
  const queryClient = useQueryClient();
  const { data } = useInfiniteQuery<AllonlinePriceType>({
    queryKey: ["Onlineprice", searchQuery],
    queryFn: () => fetchOnlinePrice(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });

  const { isPending: pendingupdate, mutate: checkPrice } = useMutation({
    mutationFn: () => {
      return axios.put(`onlineprice/${singleData?.id}`, { isStatus: !singleData?.isStatus });
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
      return axios.delete(`onlinePrice/${singleData?.id}`);
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

  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  const columnDefs: ColDef[] = [
    { field: "name", headerName: "نام", flex: 1 },
    { field: "phone", headerName: "شماره تلفن", flex: 1 },
    { field: "subject", headerName: "دسته", flex: 1 },
    { field: "price", headerName: "قیمت", valueFormatter: (param) => param?.value ? Number(param.value).toLocaleString("fa") : 'ثبت نشده', flex: 1 },
    { field: "isStatus", headerName: "تایید شده", flex: 1 },
    { field: "createdAt", headerName: "تاریخ", valueFormatter: p => new Date(p.value).toLocaleDateString("fa"), flex: 1 },
    {
      headerName: "عملیات",
      field: "id",
      width: 200,
      filter: false,
      sortable: false,
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex gap-2 h-full items-center justify-center">
          <Button onClick={() => { setSingleData(params.data), setOpen(true) }} color="success" endIcon={<FaEye />} variant="contained">نمایش</Button>
          <DeleteButton id={params.value} keyQuery="Onlineprice" urlAction="onlinePrice" headerText="حذف درخواست" />
        </div>
      ),
    },
  ]
  return (
    <div className="w-full">
      {pendingupdate && <PendingApi />}
      <SearchBox checker notTag notSearch />
      {data?.pages[0].data.length ? (
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
      ) :
        <DontData text="هیچ درخواستی موجود نیست" />
      }
      <Pagination pager={data?.pages[0].pagination} />
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
                <IconButton color={singleData?.isStatus ? "success" : "error"}>
                  {singleData?.isStatus ? <FaCheck /> : <MdClose />}
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
              disabled={isDelete || pendingupdate}
              variant="contained"
              color={singleData?.isStatus ? "warning" : "primary"}
              onClick={() => checkPrice()}
              endIcon={<FaCheck />}
            >
              {singleData?.isStatus ? "لغو تایید" : "تایید شود"}
            </Button>
            <Button
              disabled={isDelete || pendingupdate}
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
