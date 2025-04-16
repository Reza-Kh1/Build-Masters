import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CategortType } from "../../type";
import { FaMinus, FaPen, FaPlus, FaTrash } from "react-icons/fa6";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCategory } from "../../services/category";
import { toast } from "react-toastify";
import PendingApi from "../../components/PendingApi/PendingApi";
import DontData from "../../components/DontData/DontData";
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
type FormCategoryType = {
  name: string;
  slug: string;
  categoryId?: string;
};
export default function Categorys() {
  const { register, handleSubmit, getValues, setValue, reset } =
    useForm<FormCategoryType>();
  const [openAddCategory, setOpenAddCategory] = useState<boolean>(false);
  const [singleCategory, setSingleCategory] = useState<{
    position: boolean;
    category: CategortType;
  } | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const query = useQueryClient();
  const { data } = useQuery<CategortType[]>({
    queryKey: ["getCategory"],
    queryFn: fetchCategory,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 24,
  });
  const { isPending: createPending, mutate: createCategory } = useMutation({
    mutationFn: async (form: FormCategoryType) => {
      const body = {
        ...form,
      };
      if (form.categoryId === "s") {
        delete body.categoryId;
      }
      await deleteCache({ tag:"category"});
      return axios.post("category", body);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getCategory"] });
      setOpenAddCategory(false);
      toast.success("دسته با موفقیت اضافه شد");
      reset();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "خطا در اضافه کردن دسته");
    },
  });
  const { isPending: updatePending, mutate: updateCategory } = useMutation({
    mutationFn: async (form: FormCategoryType) => {
      const body = {
        ...form,
      };
      if (form.categoryId === "s") {
        delete body.categoryId;
      }
      await deleteCache({ tag:"category"});
      return axios
        .put(`category/${singleCategory?.category.id}`, body)
        .then(() => {});
    },
    onSuccess: () => {
      closeHandler();
      query.invalidateQueries({ queryKey: ["getCategory"] });
    },
    onError: (err) => {
      console.log(err);
      closeHandler();
    },
  });
  const { isPending: deletePending, mutate: deleteCategory } = useMutation({
    mutationFn: async (id?: string) => {
      await deleteCache({ tag:"category"});
      return axios.delete(`category/${id}`);
    },
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["getCategory"] });
      toast.success("دسته با موفقیت حذف شد");
      closeHandler();
    },
    onError: (err) => {
      toast.warning("چک کنید دسته محصولاتی نداشته باشد");
      console.log(err);
    },
  });
  const openUpdate = (items: CategortType) => {
    setValue("name", items.name);
    setValue("slug", items.slug);
    setValue("categoryId", items?.parentCategoryId || "s");
    setSingleCategory({
      category: items,
      position: true,
    });
    setOpen(true);
  };
  const FormCategory = () => {
    return (
      <form className="flex gap-3 mb-3 mt-5">
        <TextField
          autoComplete="off"
          fullWidth
          className="shadow-md"
          {...register("name", { required: true })}
          label={"نام دسته را وارد کنید"}
        />
        <TextField
          autoComplete="off"
          fullWidth
          className="shadow-md"
          {...register("slug", { required: true })}
          label={"اسلاگ دسته را اضافه کنید"}
        />
        {data?.length ? (
          <TextField
            fullWidth
            autoComplete="off"
            select
            className="shadow-md"
            label="تمام دسته ها"
            id="evaluationField"
            defaultValue={getValues("categoryId") || "s"}
            inputProps={{
              inputRef: (ref: HTMLInputElement | null) => {
                if (!ref) return;

                setValue("categoryId", ref.value);
              },
            }}
          >
            <MenuItem value={"s"}>انتخاب کنید</MenuItem>
            {data?.map((i, index) => (
              <MenuItem key={index} value={i.id}>
                {i.name}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </form>
    );
  };
  const closeHandler = () => {
    setOpen(false);
    setSingleCategory(null);
    reset();
  };
  return (
    <>
      {(createPending || updatePending || deletePending) && <PendingApi />}
      <div>
        <div>
          {openAddCategory && <FormCategory />}
          <div className="flex justify-between">
            {openAddCategory && (
              <Button
                onClick={handleSubmit((data) => createCategory(data))}
                variant="contained"
                className="!w-1/6"
                color="warning"
                disabled={createPending}
                endIcon={<FaPlus />}
              >
                افزودن
              </Button>
            )}
            <Button
              onClick={() => setOpenAddCategory((prev) => !prev)}
              variant="outlined"
              className={openAddCategory ? "!w-1/6" : "w-full"}
              color="primary"
              endIcon={openAddCategory ? <FaMinus /> : <FaPlus />}
            >
              {openAddCategory ? "بستن باکس" : "افزودن دسته"}
            </Button>
          </div>
        </div>
        <div className="mt-5">
          {data?.length ? (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">#</StyledTableCell>
                    <StyledTableCell align="center">نام دسته</StyledTableCell>
                    <StyledTableCell align="center">اسلاگ</StyledTableCell>
                    <StyledTableCell align="center">دسته مادر</StyledTableCell>
                    <StyledTableCell align="center">تاریخ</StyledTableCell>
                    <StyledTableCell align="center">عملیات</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((items, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableCell align="center">
                        {index + 1}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {items.name}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {items.slug}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {items.parentCategory?.name || "---"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {new Date(items.createdAt).toLocaleDateString("fa")}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <div className="flex justify-evenly">
                          <Button
                            onClick={() => {
                              setSingleCategory({
                                category: items,
                                position: false,
                              }),
                                setOpen(true);
                            }}
                            color="error"
                            variant="outlined"
                            endIcon={<FaTrash size={15} />}
                            disabled={deletePending}
                          >
                            حذف
                          </Button>
                          <Button
                            onClick={() => openUpdate(items)}
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
          ) : (
            <DontData text="دسته ای یافت نشد!" />
          )}
        </div>
      </div>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={closeHandler}
      >
        <DialogTitle>حذف دسته</DialogTitle>
        <DialogContent>
          {singleCategory?.position ? (
            <FormCategory />
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">نام دسته</StyledTableCell>
                    <StyledTableCell align="center">اسلاگ</StyledTableCell>
                    <StyledTableCell align="center">دسته مادر</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell align="center">
                      {singleCategory?.category.name}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {singleCategory?.category.slug}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {singleCategory?.category.parentCategory?.name || "---"}
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <div className="w-full flex justify-between">
            {singleCategory?.position ? (
              <Button
                variant="text"
                color="success"
                onClick={handleSubmit((data) => updateCategory(data))}
                disabled={updatePending}
              >
                ذخیره
              </Button>
            ) : (
              <Button
                variant="text"
                color="error"
                onClick={() => {
                  deleteCategory(singleCategory?.category?.id);
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
