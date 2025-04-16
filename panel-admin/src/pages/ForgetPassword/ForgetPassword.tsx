import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PendingApi from "../../components/PendingApi/PendingApi";
import { TransitionProps } from "@mui/material/transitions";
import { useNavigate } from "react-router-dom";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ForgetPassword() {
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [errPhone, setErrPhone] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      const body = {
        email,
        phone,
      };
      return axios.post("/user/forget-password", body);
    },
    onSuccess: () => {
      setOpen(true);
    },
    onError: ({ response }: any) => {
      toast.warning(response?.data?.message);
    },
  });
  return (
    <>
      {isPending && <PendingApi />}
      <div className="w-full h-screen flex justify-center items-center">
        <div className="p-5 w-1/3 rounded-md bg-gray-200 shadow-md">
          <div className="flex justify-center mb-5">
            <p>ایمیل یا شماره تلفن که با آن ثبت نام کرده بودید را وارد کنید.</p>
          </div>
          <div className="w-full flex flex-col gap-5">
            <TextField
              autoSave="false"
              autoComplete="off"
              type="text"
              label={"ایمیل خود را وارد کنید"}
              value={email}
              onChange={({ target }) => setEmail(target.value)}
            />
            <TextField
              autoSave="false"
              autoComplete="off"
              type="text"
              label={"شماره تلفن خود را وارد کنید"}
              value={phone}
              onChange={({ target }) => {
                const value = target.value.replace(/[^0-9]/g, "");
                if (value.length > 11) {
                  target.value = value.slice(0, 11);
                  setErrPhone(false);
                  setPhone(target.value);
                } else {
                  target.value = value;
                  setPhone(target.value);
                  setErrPhone(true);
                }
              }}
              helperText={
                errPhone && "شماره تلفن صحیح وارد کنید مثل : 09121234567"
              }
            />
            <Button
              type="submit"
              onClick={() => mutate()}
              variant="contained"
              color="success"
              disabled={isPending}
            >
              {isPending ? "صبر کنید ..." : "بازیابی رمز عبور"}
            </Button>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpen(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"رمز جدید ارسال شد"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <p>
              رمز جدید به ایمیل یا شماره تلفن شما{" "}
              <span className="text-blue-300 mx-2">{email}</span>
              ارسال شد.
            </p>
            <p>لطفا پس از وارد شدن به حساب کاربری رمز خود را تغییر دهید.</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="!justify-start">
          <Button
            color="success"
            variant="contained"
            onClick={() => {
              setOpen(false);
              navigate("/");
            }}
          >
            فهمیدم
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
