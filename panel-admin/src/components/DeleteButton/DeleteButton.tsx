import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { IoMdTrash } from 'react-icons/io'
import { MdClose } from 'react-icons/md'
type DeleteButtonType = {
    pendingDelete: boolean
    text: string
    deletePost: () => void
    endIcon?: React.ReactNode
}
export default function DeleteButton({ deletePost, pendingDelete, text ,endIcon}: DeleteButtonType) {
    const [open, setOpen] = useState<boolean>(false)
    return (
        <>
            <Button
                size='small'
                disabled={pendingDelete}
                onClick={() => setOpen(true)}
                color="error"
                endIcon={endIcon ? endIcon: <IoMdTrash />}
                variant="contained"
            >
                {text}
            </Button>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>{text}</DialogTitle>
                <DialogContent>
                    آیا از حذف آیتم مورد نظر اطمینان دارید ؟
                </DialogContent>
                <DialogActions>
                    <div className="flex justify-between items-center w-full">
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            onClick={() => {
                                setOpen(false)
                                deletePost()
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
