"use client";
import React from "react";
import InputForm from "../InputForm/InputForm";
import toast from "react-hot-toast";
import actionComments from "@/action/actionComments";
import CustomButton from "../CustomButton/CustomButton";
import { TbMessage2Plus } from "react-icons/tb";
import { Rating } from "@mui/material";
const initialize = {
  msg: "",
  err: "",
};
type FormCommentsType = {
  id: number
  isContractor?: boolean
  isPost?: boolean
}
export default function FormComments({ id, isContractor, isPost }: FormCommentsType) {
  const [state, formAction] = React.useActionState(actionComments, initialize);
  if (state?.msg) {
    toast.dismiss("toast");
    toast.success("پس از تایید نمایش داده میشود", { id: "toast" });
  }
  if (state?.err) {
    toast.dismiss("toast");
    toast.error("با خطا مواجه شدیم");
  }
  const commentsHandler = async (form: FormData) => {
    if (isPost) {
      form.append("postId", JSON.stringify(id));
    }
    if (isContractor) {
      form.append("contractorId", JSON.stringify(id));
    }
    formAction(form);
  };
  return (
    <div className="form-comments" id="form-comments">
      <h3 id="create-comments" className="font-bold lg:text-xl mb-3 dark:text-p-dark">
        کامنت خود را ثبت کنید.
      </h3>
      <form aria-labelledby="create-comments"
        action={commentsHandler}
        onSubmit={() => {
          toast.loading("...صبر کنید", { id: "toast" });
        }}
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col lg:flex-row justify-between items-center gap-2 lg:gap-3">
          <div className="w-full">
            <span className="text-sm mb-1 inline-block">نام :*</span>
            <InputForm type="text" name="name" placeholder="نام" required />
          </div>
          <div className="w-full">
            <span className="text-sm mb-1 inline-block">شماره تلفن :*</span>
            <InputForm
              type="text"
              name="phone"
              placeholder="شماره تلفن"
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, "");
              }}
              required
            />
          </div>
          <Rating
            name="rating"
            precision={0.5}
          />
        </div>
        <div>
          <span className="text-sm mb-1 inline-block">
            متن نظر خود را بنویسید :*
          </span>
          <textarea
            name="content"
            rows={8}
            required
            className="bg-slate-100 w-full shadow-md focus-visible:outline-blue-300 resize-none p-2 rounded-md dark:shadow-low-dark dark:bg-input-dark"
            id=""
            placeholder="نظر خودتان را بنویسید"
          />
        </div>
        <div className="w-1/3 sm:w-1/4">
          <CustomButton
            name="ارسال"
            type="submit"
            color="primary"
            iconEnd={<TbMessage2Plus />}
          />
        </div>
      </form>
    </div>
  );
}
