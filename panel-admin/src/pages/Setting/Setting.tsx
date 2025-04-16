import { Button, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { FaUserEdit } from "react-icons/fa";
import { fetchGteProfile } from "../../services/user";
import { toast } from "react-toastify";
import axios from "axios";
import PendingApi from "../../components/PendingApi/PendingApi";
import { useEffect } from "react";
import { FaUser } from "react-icons/fa6";
const cookieKey = import.meta.env.VITE_PUBLIC_COOKIE_KEY
type ProfileType = {
  email: string;
  id: string;
  name: string;
  phone: string;
  role: string;
  password?: string;
  repPassword?: string;
};
export default function Setting() {
  const { register, handleSubmit, setValue } = useForm<ProfileType>();
  const { data } = useQuery<ProfileType>({
    queryKey: ["profile"],
    queryFn: fetchGteProfile,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const queryClient = useQueryClient();
  const { isPending, mutate: updateHandler } = useMutation({
    mutationFn: (form: ProfileType) => {
      if (form.password !== form.repPassword) throw new Error();
      const body = {
        ...form,
      };
      return axios.put(`user/${data?.id}`, body);
    },
    onSuccess: ({ data }) => {
      const body = {
        name: data.name,
        role: data.role,
        id: data.id,
      };
      localStorage.setItem(cookieKey, JSON.stringify(body));
      toast.success("پروفایل با موفقیت آپدیت شد");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: ({ response }: any) => {
      if (response === undefined) {
        toast.warning("رمز جدید خود را به درستی تکرار کنید");
      } else {
        toast.warning(response?.data?.message || "خطایی رخ داد!");
      }
    },
  });
  const syncdata = () => {
    setValue("name", data?.name || "");
    setValue("email", data?.email || "");
    setValue("phone", data?.phone || "");
  };
  useEffect(() => {
    if (data) {
      syncdata();
    }
  }, [data]);
  if (!data) return;
  return (
    <div className="w-full py-20">
      {isPending && <PendingApi />}
      <div className="w-4/5 mx-auto bg-slate-100 p-14 rounded-md shadow-md">
        <div className="flex justify-center w-full mb-8">
          <i className="inline-block">
            <FaUser className=" w-36 p-1 h-36 rounded-full bg-slate-300 shadow-md" />
          </i>
        </div>
        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit((data) => updateHandler(data))}
        >
          <div className="grid grid-cols-2 gap-5 items-center justify-between">
            <TextField
              autoComplete="off"
              defaultValue={data?.name}
              label={"نام کاربری"}
              fullWidth
              {...register("name", { required: true })}
            />
            <TextField
              autoComplete="off"
              defaultValue={data?.phone}
              label={"شماره تلفن"}
              fullWidth
              {...register("phone", { required: true })}
            />
            <TextField
              autoComplete="off"
              label={"ایمیل"}
              fullWidth
              defaultValue={data?.email}
              {...register("email", { required: true })}
            />
            <TextField
              autoComplete="off"
              label={"سطح کاربر"}
              fullWidth
              defaultValue={data?.role || ""}
              disabled
            />
          </div>
          <div className="grid grid-cols-2 gap-5 items-center justify-between">
            <TextField
              autoComplete="off"
              label={"رمز عبور جدید"}
              fullWidth
              {...register("password")}
            />
            <TextField
              autoComplete="off"
              label={"تکرار رمز عبور"}
              fullWidth
              {...register("repPassword")}
            />
          </div>
          <Button
            fullWidth
            onClick={handleSubmit((data) => updateHandler(data))}
            disabled={isPending}
            color="primary"
            variant="contained"
            endIcon={<FaUserEdit />}
          >
            ذخیره کردن
          </Button>
        </form>
      </div>
    </div>
  );
}
