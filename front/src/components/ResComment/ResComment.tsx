"use client";
import { Dialog, DialogActions, DialogContent, Slide } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React, { useState } from "react";
import { IoArrowRedoSharp } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { TbMessage2Plus, TbMessageReply } from "react-icons/tb";
import InputForm from "../InputForm/InputForm";
import ImgTag from "../ImgTag/ImgTag";
import { CommentsType } from "@/app/type";
import { fetchApi } from "@/action/fetchApi";
import CustomButton from "../CustomButton/CustomButton";
import toast from "react-hot-toast";
import { useFormState } from "react-dom";
import actionComments from "@/action/actionComments";
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const initialize = {
  msg: "",
  err: "",
};
export default function ResComment({
  postId,
  comment,
}: {
  postId?: number;
  comment: CommentsType;
}) {
  const [state, formAction] = useFormState(actionComments, initialize);
  const [open, setOpen] = useState(false);
  if (state?.msg) {
    toast.dismiss("toast");
    toast.success("پس از تایید نمایش داده میشود", { id: "toast" });
  }
  if (state?.err) {
    toast.dismiss("toast");
    toast.error("با خطا مواجه شدیم");
  }
  return (
    <>
      <button type="button" aria-label="open dialog"
        className="cursor-pointer hover:text-gray-950 text-gray-500 dark:text-h-dark dark:hover:text-blue-500"
        onClick={() => setOpen(true)}
      >
        <IoArrowRedoSharp />
      </button>
      <Dialog
        open={open}
        fullScreen
        onClose={() => setOpen(false)}
        TransitionComponent={Transition}
        PaperProps={{
          component: "form",
          action: (form: FormData) => {
            if (!comment.id) return;
            form.append("replies", JSON.stringify(comment.id));
            if (postId) {
              form.append("postId", JSON.stringify(postId));
            }
            formAction(form);
          },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            if (!comment.id) return;
            toast.loading("...صبر کنید", { id: "toast" });
          },
        }}
      >
        <DialogContent className="dark:!bg-custom-dark">
          <div className="flex gap-3 md:gap-5 flex-col md:flex-row">
            <div className="w-full order-2 md:order-1 flex flex-col md:w-2/3 justify-evenly items-center gap-3">
              <div className="flex w-full flex-col md:flex-wrap gap-3">
                <div>
                  <span className="text-sm mb-1 inline-block">نام :*</span>
                  <InputForm
                    type="text"
                    name="name"
                    placeholder="نام"
                    required
                  />
                </div>
                <div>
                  <span className="text-sm mb-1 inline-block">
                    شماره تلفن :*
                  </span>
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
                <div>
                  <span className="text-sm mb-1 inline-block">ایمیل :</span>
                  <InputForm type="email" name="email" placeholder="ایمیل" />
                </div>
              </div>
              <div className="w-full">
                <span className="text-sm mb-1 inline-block">
                  کامنت خود را ثبت کنید :*
                </span>
                <textarea
                  name="text"
                  rows={6}
                  wrap="6"
                  required
                  className="bg-slate-100 w-full shadow-md focus-visible:outline-blue-300 dark:shadow-low-dark dark:bg-input-dark resize-none p-2 rounded-md"
                  id=""
                  placeholder="نظر خودتان را بنویسید"
                />
              </div>
            </div>
            <div className="w-full md:w-1/3 md:order-2 pr-7 order-1">
              <span>کامنت شخص :</span>
              <div className="relative w-full">
                <div className="w-12 lg:w-14 absolute right-0 transform translate-x-1/2 top-1 lg:top-3 p-1 dark:border-bg-dark dark:bg-[#393939] bg-white border rounded-full">
                  <ImgTag
                    width={40}
                    height={40}
                    className="rounded-full w-full h-auto shadow-md"
                    src={comment.position === "USER" ? "/comments/semicolon-image.png" : "/comments/image-admin.png"}
                    alt={comment?.name}
                  />
                </div>
                <div className=" dark:border-bg-dark border my-2 rounded-sm shadow-sm pr-7 lg:pr-10 pl-2 lg:pl-3 py-2 lg:py-5">
                  <div className="flex w-full justify-between mb-3">
                    <div className="flex flex-col">
                      <span className="text-sm lg:text-base text-gray-700 dark:text-h-dark">
                        {comment?.name}
                      </span>
                      <span className="text-[0.60rem] lg:text-xs text-gray-400 italic dark:text-s-dark">
                        {new Date(comment?.createdAt).toLocaleDateString("fa")}
                      </span>
                    </div>
                  </div>
                  <div className="text-justify text-sm text-gray-700 pl-5 dark:text-p-dark">
                    <p>{comment?.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="dark:!bg-custom-dark">
          <div className="w-full flex justify-between">
            <div className="w-1/3 md:w-2/12">
              <CustomButton
                color="blue"
                name="ارسال"
                type="submit"
                iconEnd={<TbMessage2Plus />}
              />
            </div>
            <div className="w-1/3 md:w-2/12">
              <CustomButton
                onClick={() => setOpen(false)}
                name="بستن"
                iconEnd={<MdClose />}
                color="warning"
                type="button"
              />
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
