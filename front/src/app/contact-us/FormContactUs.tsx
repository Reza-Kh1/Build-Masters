"use client";
import actionContactUs from "@/action/actionContactUs";
import CustomButton from "@/components/CustomButton/CustomButton";
import InputForm from "@/components/InputForm/InputForm";
import React from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { TbMessage2Check } from "react-icons/tb";
const initialize = {
  msg: "",
  err: ""
}
export default function FormContactUs() {
  const [state, formAction] = useFormState(actionContactUs, initialize);
  if (state?.msg) {
    toast.dismiss("toast")
    toast.success("پیام با موفقیت ارسال شد", { id: "toast" })
  }
  if (state?.err) {
    toast.dismiss("toast")
    toast.error("با خطا مواجه شدیم")
  }
  return (
    <form action={formAction} onSubmit={() => { toast.loading("...صبرکنید", { id: "toast" }) }}
      className="flex flex-col gap-3 justify-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <InputForm
          name="name"
          lable="نام کامل خود را بنویسید"
          id="name"
          placeholder="نام کامل خود را بنویسید"
          type="text"
          required
        />
        <InputForm
          name="phone"
          id="phone"
          lable="شماره تلفن"
          onChange={(e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, "");
          }}
          placeholder="********0912"
          type="text"
          required
        />
      </div>
      <InputForm
        name="subject"
        id="subject"
        lable="موضوع"
        placeholder="موضوع خود را بنویسید."
        type="text"
        required
      />
      <div className="flex flex-col gap-2">
        <label htmlFor="text" className="text-sm">
          متن خود را بنویسید:
        </label>
        <textarea
          rows={6}
          id="text"
          wrap="6"
          required
          className="p-3 focus-visible:outline-blue-300 bg-slate-100 dark:bg-input-dark dark:text-p-dark dark:shadow-low-dark rounded text-gray-900 w-full shadow-md resize-none"
          name="text"
          placeholder="کامنت خود را ثبت کنید"
        />
      </div>
      <div className="w-1/3 md:w-1/4">
        <CustomButton name="ارسال" color="primary" className="w-full" type="submit" iconEnd={<TbMessage2Check />} />
      </div>
    </form>
  );
}
