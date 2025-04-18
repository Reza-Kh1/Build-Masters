import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { IoMdTrash } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
import { toast } from 'react-toastify'
import PendingApi from '../PendingApi/PendingApi'
import deleteCache from '../../services/revalidate'

type DeleteButtonType = {
    btnText?: string
    endIcon?: React.ReactNode
    urlAction: string
    id: string
    toastText?: string
    headerText?: string
    keyQuery: string
    keyCacheNext?: { tag?: string, path?: string }
}

export default function DeleteButton({ urlAction, keyCacheNext, id, toastText, btnText, endIcon, keyQuery, headerText }: DeleteButtonType) {
    const local = localStorage.getItem(import.meta.env.VITE_PUBLIC_COOKIE_KEY)
    const [open, setOpen] = useState<boolean>(false)
    const query = useQueryClient();
    const { isPending, mutate } = useMutation({
        mutationFn: async () => {
            if (keyCacheNext) {
                await deleteCache(keyCacheNext);
            }
            return axios.delete(`${urlAction}/${id}`);
        },
        onSuccess: () => {
            setOpen(false)
            toast.success(toastText || "درخواست با موفقیت انجام شد.");
            query.invalidateQueries({ queryKey: [keyQuery] });
        },
        onError: (err) => {
            toast.success("خطا در اجرای عملیات");
            console.log(err);
        },
    });

    return (
        <>
            <Button
                disabled={local ? id === (JSON.parse(local)?.id || "") : false}
                onClick={() => setOpen(true)}
                color="error"
                loading={isPending}
                endIcon={endIcon ? endIcon : <IoMdTrash />}
                variant="contained"
            >
                {btnText || "حذف"}
            </Button>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>{headerText}</DialogTitle>
                <DialogContent>
                    آیا از حذف آیتم مورد نظر اطمینان دارید ؟
                    {isPending && <PendingApi />}
                </DialogContent>
                <DialogActions>
                    <div className="flex justify-between items-center w-full">
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            loading={isPending}
                            onClick={() => {
                                mutate()
                            }}
                            endIcon={<FaCheck />}
                        >
                            بله
                        </Button>
                        <Button
                            color="error"
                            variant="contained"
                            endIcon={<MdClose />}
                            onClick={() => setOpen(false)}
                        >
                            خیر
                        </Button>
                    </div>
                </DialogActions>
            </Dialog>
        </>
    )
}
