import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { fetchUser } from "../../services/user";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  styled,
  tableCellClasses,
} from "@mui/material";
import { UserArrayType, UserType } from "../../type";
import { FaMinus, FaPen, FaPlus, FaTrash, FaUserPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import PendingApi from "../../components/PendingApi/PendingApi";
import Pagination from "../../components/Pagination/Pagination";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { dataRole } from "../../data/selectData";
import DontData from "../../components/DontData/DontData";
import SearchBox from "../../components/SearchBox/SearchBox";
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
type DataUSerType = {
  data: UserType;
  position: boolean;
};
export default function Users() {
  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    reset,
  } = useForm<UserType>();
  const [open, setOpen] = useState<boolean>(false);
  const [openBox, setOpenBox] = useState<boolean>(false);
  const [dataUser, setDataUser] = useState<DataUSerType | null>();
  const [searchQuery, setSearchQuery] = useState<any>("");
  const query = useQueryClient();
  const { search } = useLocation();
  const { data } = useInfiniteQuery<UserArrayType>({
    queryKey: ["getUsers", searchQuery],
    queryFn: () => fetchUser(searchQuery),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage || undefined,
    initialPageParam: "",
  });
  const { isPending: updatePending, mutate: updateUser } = useMutation({
    mutationFn: (form: UserType) => {
      return axios.put(`user/${dataUser?.data.id}`, form);
    },
    onSuccess: () => {
      setOpen(false);
      closeHandler();
      query.invalidateQueries({ queryKey: ["getUsers"] });
    },
    onError: (err) => {
      toast.success("خطا در اجرای عملیات");
      console.log(err);
    },
  });
  const { isPending: deletePending, mutate: deleteUser } = useMutation({
    mutationFn: (id?: string) => {
      return axios.delete(`user/${id}`);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getUsers"] });
      closeHandler();
      toast.success("کاربر با موفقیت حذف شد");
    },
    onError: (err) => {
      toast.success("خطا در اجرای عملیات");
      console.log(err);
    },
  });
  const { isPending: createPending, mutate: createUser } = useMutation({
    mutationFn: (form: UserType) => {
      return axios.post("user", form);
    },
    onSuccess: () => {
      toast.success("کاربر اضافه شد");
      query.invalidateQueries({ queryKey: ["getUsers"] });
      closeHandler();
    },
    onError: (err) => {
      toast.success("خطا در اجرای عملیات");
      console.log(err);
    },
  });
  const openUpdate = (item: UserType) => {
    setDataUser({
      position: true,
      data: item,
    });
    setValue("name", item?.name);
    setValue("email", item?.email);
    setValue("password", item?.password);
    setValue("phone", item?.phone);
    setValue("role", item?.role);
    setOpen(true);
  };
  const closeHandler = () => {
    setOpen(false);
    reset();
    setDataUser(null);
  };
  const FormUser = () => {
    return (
      <form className="w-full grid grid-cols-4 gap-4 mt-5">
        <TextField
          autoComplete="off"
          className="shadow-md"
          label={"نام کاربر"}
          fullWidth
          required
          {...register("name")}
        />
        <TextField
          autoComplete="off"
          className="shadow-md"
          label={"ایمیل کاربر"}
          fullWidth
          required
          {...register("email")}
        />
        <TextField
          autoComplete="off"
          className="shadow-md"
          label={"شماره تلفن کاربر"}
          fullWidth
          required
          {...register("phone")}
        />
        <TextField
          autoComplete="off"
          className="shadow-md"
          label={"پسورد کاربر"}
          required
          fullWidth
          {...register("password")}
        />
        <TextField
          fullWidth
          autoComplete="off"
          select
          className="shadow-md"
          label="تمام دسته ها"
          id="evaluationField"
          defaultValue={getValues("role") || "USER"}
          inputProps={{
            inputRef: (ref: HTMLInputElement | null) => {
              if (!ref) return;
              setValue("role", ref.value);
            },
          }}
        >
          {dataRole?.map((i, index) => (
            <MenuItem key={index} value={i.value}>
              {i.name}
            </MenuItem>
          ))}
        </TextField>
      </form>
    );
  };
  useEffect(() => {
    const query = queryString.parse(search);
    setSearchQuery(query);
  }, [search]);
  return (
    <>
      {(createPending || updatePending || deletePending) && <PendingApi />}
      <div className="w-full">
        <div>
          {openBox && <FormUser />}
          <div className="flex justify-between items-center my-5">
            {openBox && (
              <Button
                endIcon={<FaUserPlus />}
                variant="contained"
                disabled={createPending}
                className="!w-1/5"
                color="warning"
                onClick={handleSubmit((data) => createUser(data))}
              >
                افزودن کاربر
              </Button>
            )}
            <Button
              variant="outlined"
              disabled={createPending}
              className={`${openBox ? "!w-1/5" : "!w-full"}  `}
              color="primary"
              onClick={() => setOpenBox((prev) => !prev)}
              endIcon={openBox ? <FaMinus /> : <FaPlus />}
            >
              {openBox ? "بستن باکس" : "افزودن کاربر"}
            </Button>
          </div>
        </div>
        <SearchBox isUser notTag />
        <DontData
          text={
            data?.pages[0].count
              ? data?.pages[0].count + " کاربر"
              : "کاربری یافت نشد!"
          }
        />
        {data?.pages[0]?.data.length ? (
          <div className="my-4">
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">نام</StyledTableCell>
                    <StyledTableCell align="center">شماره تلفن</StyledTableCell>
                    <StyledTableCell align="center">ایمیل</StyledTableCell>
                    <StyledTableCell align="center">سطح کاربری</StyledTableCell>
                    <StyledTableCell align="center">
                      تاریخ عضویت
                    </StyledTableCell>
                    <StyledTableCell align="center">عملیات</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.pages[0]?.data.map((i, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        {i?.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {i?.phone}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {i?.email}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {i?.role === "ADMIN"
                          ? "ادمین"
                          : i?.role === "AUTHOR"
                            ? "نویسنده"
                            : "کاربر"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(i?.createdAt).toLocaleDateString("fa")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex justify-evenly">
                          <Button
                            onClick={() => {
                              setDataUser({
                                data: i,
                                position: false,
                              }),
                                setOpen(true);
                            }}
                            color="error"
                            variant="outlined"
                            endIcon={<FaTrash size={15} />}
                            disabled={i.role === "ADMIN" || deletePending}
                          >
                            حذف
                          </Button>
                          <Button
                            onClick={() => openUpdate(i)}
                            color="success"
                            variant="outlined"
                            endIcon={<FaPen size={15} />}
                            disabled={updatePending}
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
            <Pagination pager={data?.pages[0].pagination} />
          </div>
        ) : null}
      </div>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={closeHandler}
      >
        <DialogContent>
          {dataUser?.position ? (
            <FormUser />
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">نام</StyledTableCell>
                    <StyledTableCell align="center">شماره تلفن</StyledTableCell>
                    <StyledTableCell align="center">ایمیل</StyledTableCell>
                    <StyledTableCell align="center">سطح کاربری</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {dataUser?.data?.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {dataUser?.data?.email}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {dataUser?.data?.phone}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {dataUser?.data?.role === "ADMIN"
                        ? "ادمین"
                        : dataUser?.data?.role === "AUTHOR"
                          ? "نویسنده"
                          : "کاربر"}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-between">
            {dataUser?.position ? (
              <Button
                variant="text"
                color="success"
                onClick={handleSubmit((data) => updateUser(data))}
                disabled={updatePending}
              >
                ذخیره
              </Button>
            ) : (
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  deleteUser(dataUser?.data.id);
                }}
                disabled={deletePending}
              >
                حذف
              </Button>
            )}
            <Button variant="text" color="primary" onClick={closeHandler}>
              بستن
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
