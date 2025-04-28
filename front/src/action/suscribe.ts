'use server'

import { fetchApi } from "./fetchApi";

const subscribeAction = async (prevState: any, formData: FormData) => {
    const body = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        text: formData.get("text"),
    }
    await fetchApi({ method: "POST", url: "message", body })
    return {
        message: "پیام با موفقیت ارسال شد!",
        error: "",
    };
    const email = formData.get("email")
    return {
        message: "",
        error: "bad",

    }
}
export default subscribeAction