'use server'
import { fetchApi } from "./fetchApi";
const actionContactUs = async (prevState: any, formData: FormData) => {
    const body = {
        name: formData.get("name"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        text: formData.get("text"),
    };
    try {
        const data = await fetchApi({ url: "message", method: "POST", body })
        if (data?.error) throw new Error()
        if (data.success) {
            return {
                msg: "ok",
                err: "",
            }
        };
    } catch (err) {
        return {
            msg: "",
            err: "err",
        };
    }
}
export default actionContactUs