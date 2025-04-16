import { Button, TextField } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PendingApi from "../../components/PendingApi/PendingApi";
import Cookies from "js-cookie"
const cookieKey = import.meta.env.VITE_PUBLIC_COOKIE_KEY

type FormType = {
  password: string;
  phone: string;
  email: string;
  name: string;
};

export default function Auth() {
  const [err, setErr] = useState<number>(0);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { register, handleSubmit } = useForm<FormType>();
  const navigate = useNavigate();
  const { isPending, mutate: loginHandler } = useMutation({
    mutationFn: (form: FormType) => {
      if (isLogin) {
        return axios.post("user", form);
      } else {
        return axios.put("user", form);
      }
    },
    onSuccess: ({ data }) => {
      Cookies.set(cookieKey, data.token, { expires: 7 });
      const body = {
        id: data.data.id,
        name: data.data.name,
        role: data.data.role,
      };      
      localStorage.setItem(cookieKey, JSON.stringify(body));
      const name = `خوش آمدید ${data?.name}`;
      toast.success(name);
      navigate("home/dashboard");
    },
    onError: ({ response }: any) => {
      setErr((prev) => prev + 1);
      toast.warning(response?.data?.msg);
    },
  });
  useEffect(() => {
    const infoLocal = localStorage.getItem(cookieKey);
    if (infoLocal) {
      toast.success(`خوش آمدید`);
      navigate("home/dashboard");
    }
  }, []);
  return (
    <div className="w-full h-screen flex justify-center items-center">
      {isPending && <PendingApi />}
      <div className="p-5 w-1/3 rounded-md bg-gray-200 shadow-md">
        <div className="grid grid-cols-2 gap-2 mb-5 border-b border-b-gray-700 pb-5">
          <Button
            onClick={() => setIsLogin(false)}
            variant={!isLogin ? "contained" : "outlined"}
            color="info"
          >
            ورود
          </Button>
          <Button
            onClick={() => setIsLogin(true)}
            variant={isLogin ? "contained" : "outlined"}
            color="info"
          >
            ثبت نام
          </Button>
        </div>
        <form
          onSubmit={handleSubmit((data) => loginHandler(data))}
          className="flex w-full flex-col gap-5"
        >
          <h1 className="text-center">ورود به پنل ادمین</h1>
          {isLogin && (
            <TextField
              type="text"
              label={"نام خود را وارد کنید"}
              {...register("name", { required: isLogin })}
            />
          )}
          <TextField
            type="text"
            label={"ایمیل خود را وارد کنید"}
            {...register("email", { required: true })}
          />
          {isLogin && (
            <TextField
              type="text"
              label={"شماره تلفن خود را وارد کنید"}
              {...register("phone", { required: isLogin })}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length > 11) {
                  e.target.value = value.slice(0, 11);
                } else {
                  e.target.value = value;
                }
              }}
            />
          )}
          <div className="w-full">
            <TextField
              fullWidth
              type="password"
              label={"پسورد خود را وارد کنید"}
              {...register("password", { required: true })}
            />
            {err > 2 ? (
              <Link
                to={"forget-password"}
                className="text-sm mt-2 mr-2 block text-blue-500"
              >
                رمز خود را فراموش کرده اید ؟
              </Link>
            ) : null}
          </div>
          <Button
            type="submit"
            variant="contained"
            color="success"
            disabled={isPending}
          >
            {!isPending ? (isLogin ? "ثبت نام" : "ورود") : "صبر کنید..."}
          </Button>
        </form>
      </div>
    </div>
  );
}
